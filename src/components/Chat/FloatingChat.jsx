// javascript
// File: 'src/components/Chat/FloatingChat.jsx'
import { useMemo, useRef, useState, useEffect } from 'react';
import { ChatList, MessageList, Input } from 'react-chat-elements';
import 'react-chat-elements/dist/main.css';
import SockJS from 'sockjs-client';
import { Client as StompClient } from '@stomp/stompjs';
import { API_URL } from '../../Constants/constant.jsx';

export default function FloatingChat() {
    const myUserId = 3; // TODO: set from auth user

    const [open, setOpen] = useState(false);
    const chats = useMemo(
        () => [
            { id: '1', avatar: 'https://ui-avatars.com/api/?name=Dr+Ahmed', alt: 'Dr Ahmed', title: 'Dr. Ahmed', subtitle: 'How can I help you?', date: new Date(), unread: 1 },
            { id: '2', avatar: 'https://ui-avatars.com/api/?name=Clinic', alt: 'Clinic', title: 'Clinic Reception', subtitle: 'Your reservation is confirmed.', date: new Date(Date.now() - 3600_000), unread: 0 },
        ],
        []
    );

    const [activeChatId, setActiveChatId] = useState(null);
    const [messagesByChat, setMessagesByChat] = useState({});
    const seenKeysByChatRef = useRef({});   // Set of ids and clientIds per chat
    const loadedHistoryRef = useRef({});    // prevent re-loading history per chat

    const [inputValue, setInputValue] = useState('');

    const stompRef = useRef(null);
    const subscriptionRef = useRef(null);
    const localMsgId = useRef(1);

    // scrollable wrapper for the message list
    const listWrapRef = useRef(null);

    const convoKey = (a, b) => (String(a) < String(b) ? `${a}-${b}` : `${b}-${a}`);
    const ensureSeenSet = (chatId) => {
        if (!seenKeysByChatRef.current[chatId]) {
            seenKeysByChatRef.current[chatId] = new Set();
        }
        return seenKeysByChatRef.current[chatId];
    };

    const subscribeForChat = (chatId) => {
        if (!stompRef.current || !stompRef.current.connected || !chatId) return;
        try { subscriptionRef.current?.unsubscribe(); } catch (err) { console.warn('unsubscribe error', err); }
        const topic = `/topic/chat/${convoKey(myUserId, chatId)}`;
        subscriptionRef.current = stompRef.current.subscribe(topic, (msg) => {
            try {
                const payload = JSON.parse(msg.body);
                const incoming = {
                    id: payload.id ?? `srv-${payload.timestamp ?? Date.now()}`,
                    clientId: payload.clientId,
                    position: (payload.fromId === myUserId || payload.from?.id === myUserId) ? 'right' : 'left',
                    type: 'text',
                    text: payload.content,
                    date: new Date(payload.timestamp ?? Date.now()),
                };

                setMessagesByChat((prev) => {
                    const curr = prev[chatId] || [];
                    const seen = ensureSeenSet(chatId);

                    // Upsert if we already have a message with same id/clientId
                    const idx = curr.findIndex(
                        (m) =>
                            (incoming.id && (m.id === incoming.id)) ||
                            (incoming.clientId && (m.clientId === incoming.clientId || m.id === incoming.clientId))
                    );
                    if (idx !== -1) {
                        const next = curr.slice();
                        next[idx] = { ...next[idx], ...incoming };
                        if (incoming.id) seen.add(incoming.id);
                        if (incoming.clientId) seen.add(incoming.clientId);
                        return { ...prev, [chatId]: next };
                    }

                    // Dedupe by id/clientId if a duplicate frame arrives
                    if ((incoming.id && seen.has(incoming.id)) || (incoming.clientId && seen.has(incoming.clientId))) {
                        return prev;
                    }

                    if (incoming.id) seen.add(incoming.id);
                    if (incoming.clientId) seen.add(incoming.clientId);
                    return { ...prev, [chatId]: [...curr, incoming] };
                });
            } catch (e) {
                console.error('Invalid frame', e);
            }
        });
    };

    // Connect once when popup opens
    useEffect(() => {
        if (!open || stompRef.current) return;

        const client = new StompClient({
            webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
            reconnectDelay: 3000,
            onConnect: () => {
                if (activeChatId) subscribeForChat(activeChatId);
            },
            onStompError: (frame) => console.error('Broker error:', frame.headers?.message, frame.body),
        });

        client.activate();
        stompRef.current = client;

        return () => {
            try { subscriptionRef.current?.unsubscribe(); } catch (err) { console.warn('unsubscribe error', err); }
            client.deactivate();
            stompRef.current = null;
            subscriptionRef.current = null;
        };
    }, [open, activeChatId]);

    // Load history once per active chat and manage subscription
    useEffect(() => {
        if (!activeChatId) return;

        let cancelled = false;

        const loadHistory = async () => {
            if (loadedHistoryRef.current[activeChatId]) {
                // ensure subscription when switching chats
                if (stompRef.current?.connected) subscribeForChat(activeChatId);
                return;
            }
            try {
                const res = await fetch(
                    `${API_URL}public/chat/direct?u1=${encodeURIComponent(myUserId)}&u2=${encodeURIComponent(activeChatId)}&page=0&size=50`,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`,
                        },
                    }
                );
                if (!res.ok) throw new Error((await res.text()) || 'Failed to load chat history');

                const data = await res.json();
                if (cancelled) return;

                const seen = ensureSeenSet(activeChatId);
                const mapped = (data || []).map((m) => ({
                    id: m.id ?? `srv-${m.timestamp}`,
                    clientId: m.clientId,
                    position: m.from?.id === myUserId ? 'right' : 'left',
                    type: 'text',
                    text: m.content,
                    date: new Date(m.timestamp),
                }));
                mapped.forEach((m) => {
                    if (m.id) seen.add(m.id);
                    if (m.clientId) seen.add(m.clientId);
                });
                setMessagesByChat((prev) => ({ ...prev, [activeChatId]: mapped }));
                loadedHistoryRef.current[activeChatId] = true;

                if (stompRef.current?.connected) subscribeForChat(activeChatId);
            } catch (e) {
                console.error('Load history failed', e);
            }
        };

        loadHistory();

        return () => {
            cancelled = true;
            try { subscriptionRef.current?.unsubscribe(); } catch (err) { console.warn('unsubscribe error', err); }
            subscriptionRef.current = null;
        };
    }, [activeChatId, myUserId]);

    const activeMessages = messagesByChat[activeChatId] || [];

    // Auto-scroll: stick to bottom when near bottom, and when opening/switching chats
    useEffect(() => {
        const el = listWrapRef.current;
        if (!el) return;
        el.scrollTop = el.scrollHeight;
    }, [open, activeChatId]);
    useEffect(() => {
        const el = listWrapRef.current;
        if (!el) return;
        const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 60;
        if (nearBottom) el.scrollTop = el.scrollHeight;
    }, [activeMessages]);

    const handleOpenChat = (item) => setActiveChatId(item?.id);
    const handleBack = () => setActiveChatId(null);

    const handleSend = () => {
        if (!activeChatId || !inputValue.trim()) return;
        const text = inputValue.trim();

        // No optimistic append: only send and wait for server echo
        const clientId = `local-${myUserId}-${Date.now()}-${localMsgId.current++}`;
        setInputValue('');

        const client = stompRef.current;
        if (client && client.connected) {
            try {
                client.publish({
                    destination: '/app/chat.direct',
                    body: JSON.stringify({ fromId: myUserId, toId: activeChatId, content: text, clientId }),
                });
            } catch (err) {
                console.error('publish error', err);
            }
        } else {
            console.warn('Not connected to chat server');
        }
    };

    return (
        <>
            {!open && (
                <button
                    type="button"
                    onClick={() => setOpen(true)}
                    className="fixed bottom-6 right-6 z-[1000] w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg flex items-center justify-center"
                    aria-label="Open chat"
                >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V6a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v9z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
            )}

            {open && (
                <div className="fixed bottom-24 right-6 z-[1000] w-[360px] max-w-[95vw] h-[520px] bg-white border border-gray-200 rounded-xl shadow-2xl flex flex-col">
                    <div className="h-12 px-4 flex items-center justify-between border-b">
                        <div className="font-medium text-gray-800">{activeChatId ? 'Conversation' : 'Messages'}</div>
                        <div className="flex items-center gap-2">
                            {activeChatId && (
                                <button onClick={handleBack} className="text-sm text-gray-600 hover:text-gray-800 px-2 py-1 rounded" aria-label="Back to chats">
                                    Back
                                </button>
                            )}
                            <button onClick={() => setOpen(false)} className="text-gray-500 hover:text-gray-800" aria-label="Close chat">✕</button>
                        </div>
                    </div>

                    {!activeChatId ? (
                        <div className="flex-1 min-h-0 overflow-y-auto">
                            <ChatList className="!h-full" dataSource={chats} onClick={handleOpenChat} />
                        </div>
                    ) : (
                        <div className="flex-1 min-h-0 flex flex-col">
                            <div ref={listWrapRef} className="flex-1 min-h-0 overflow-y-auto">
                                <MessageList className="p-2" dataSource={activeMessages} lockable toBottomHeight={300} />
                            </div>
                            <div className="border-t p-2">
                                <Input
                                    placeholder="Type a message..."
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    multiline
                                    rightButtons={
                                        <button
                                            type="button"
                                            onClick={handleSend}
                                            className="px-3 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-700 text-sm"
                                        >
                                            Send
                                        </button>
                                    }
                                />
                            </div>
                        </div>
                    )}
                </div>
            )}
        </>
    );
}
