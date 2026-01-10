// javascript
// File: 'src/components/Chat/FloatingChat.jsx'
import { useRef, useState, useEffect } from 'react';
import { ChatList, MessageList, Input } from 'react-chat-elements';
import 'react-chat-elements/dist/main.css';
import SockJS from 'sockjs-client';
import { Client as StompClient } from '@stomp/stompjs';
import { API_URL } from '../../Constants/constant.jsx';

export default function FloatingChat() {
    // Read current user and normalize id to string
    const storedUser = (() => {
        try { return JSON.parse(localStorage.getItem('userData') || '{}'); } catch { return {}; }
    })();
    const myUserId = String(storedUser?.id ?? storedUser?.userId ?? '');

    const [open, setOpen] = useState(false);
    const [chats, setChats] = useState([]);
    const [activeChatId, setActiveChatId] = useState(null);
    const [messagesByChat, setMessagesByChat] = useState({});
    const [inputValue, setInputValue] = useState('');
    const seenKeysByChatRef = useRef({});
    const loadedHistoryRef = useRef({});
    const stompRef = useRef(null);
    const subscriptionRef = useRef(null);
    const localMsgId = useRef(1);
    const listWrapRef = useRef(null);

    const convoKey = (a, b) => {
        const na = Number(a), nb = Number(b);
        if (!Number.isNaN(na) && !Number.isNaN(nb)) {
            return na < nb ? `${na}-${nb}` : `${nb}-${na}`;
        }
        const sa = String(a), sb = String(b);
        return sa < sb ? `${sa}-${sb}` : `${sb}-${sa}`;
    };

    const ensureSeenSet = (chatId) => {
        if (!seenKeysByChatRef.current[chatId]) {
            seenKeysByChatRef.current[chatId] = new Set();
        }
        return seenKeysByChatRef.current[chatId];
    };

    const addUser = async (u2) => {
        if (!myUserId) return;
        try {
            await fetch(`${API_URL}public/chat/contacts?u1=${encodeURIComponent(myUserId)}&u2=${encodeURIComponent(String(u2))}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`,
                },
            });
        } catch (e) {
            console.error('Failed to add user to chat list', e);
        }
    };

    // Global "open chat" trigger
    useEffect(() => {
        const handler = (e) => {
            const toId = e?.detail?.toId;
            if (!toId) return;
            setOpen(true);
            setActiveChatId(String(toId));
            addUser(toId);
        };
        window.addEventListener('app:open-chat', handler);
        return () => window.removeEventListener('app:open-chat', handler);
    }, []);

    // Load contacts once popup opens
    useEffect(() => {
        if (!open || !myUserId) return;
        let cancelled = false;
        (async () => {
            try {
                const res = await fetch(`${API_URL}public/chat/contacts?u=${encodeURIComponent(myUserId)}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`,
                    },
                });
                if (!res.ok) throw new Error((await res.text()) || 'Failed to load contacts');
                const contacts = await res.json();
                if (cancelled) return;
                const mapped = (contacts || []).map((c) => ({
                    id: String(c?.user?.id ?? c?.id ?? c?.userId ?? c?.contactId),
                    avatar: c?.user?.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(c?.user?.username || c?.name || 'User')}`,
                    alt: c?.user?.username || c?.name || 'Contact',
                    title: c?.user?.username || c?.name || 'Contact',
                    subtitle: c?.lastMessage?.content ?? c?.lastMessage ?? '',
                    date: c?.lastMessage?.timestamp ? new Date(c.lastMessage.timestamp) : undefined,
                    unread: Number(c?.unread ?? c?.unreadCount ?? 0),
                }));
                setChats(mapped);
            } catch (e) {
                console.error('Load contacts failed', e);
            }
        })();
        return () => { cancelled = true; };
    }, [open, myUserId]);

    const subscribeForChat = (chatId) => {
        if (!stompRef.current || !stompRef.current.connected || !chatId) return;
        try { subscriptionRef.current?.unsubscribe(); } catch (err) { console.warn('unsubscribe error', err); }
        const topic = `/topic/chat/${convoKey(myUserId, chatId)}`;
        subscriptionRef.current = stompRef.current.subscribe(topic, (msg) => {
            try {
                const payload = JSON.parse(msg.body);
                const fromId = String(payload.fromId ?? payload.from?.id ?? '');
                const incoming = {
                    id: payload.id ?? `srv-${payload.timestamp ?? Date.now()}`,
                    clientId: payload.clientId,
                    position: fromId === myUserId ? 'right' : 'left',
                    type: 'text',
                    text: payload.content,
                    date: new Date(payload.timestamp ?? Date.now()),
                };
                setMessagesByChat((prev) => {
                    const curr = prev[chatId] || [];
                    const seen = ensureSeenSet(chatId);
                    const idx = curr.findIndex((m) =>
                        (incoming.clientId && m.clientId === incoming.clientId) ||
                        (incoming.id && m.id === incoming.id)
                    );
                    if (idx !== -1) {
                        const next = [...curr];
                        next[idx] = { ...next[idx], ...incoming };
                        if (incoming.id) seen.add(incoming.id);
                        if (incoming.clientId) seen.add(incoming.clientId);
                        return { ...prev, [chatId]: next };
                    }
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

    // Flush any pending send stored before WS connected
    const flushPendingSend = () => {
        if (!stompRef.current?.connected) return;
        try {
            const raw = localStorage.getItem('chat.pendingSend');
            if (!raw) return;
            const pending = JSON.parse(raw);
            if (!pending?.fromId || !pending?.toId || !pending?.content) {
                localStorage.removeItem('chat.pendingSend'); return;
            }
            stompRef.current.publish({
                destination: '/app/chat.direct',
                body: JSON.stringify(pending),
            });
            localStorage.removeItem('chat.pendingSend');
        } catch (e) {
            console.warn('flushPendingSend failed', e);
        }
    };

    // Connect WS when popup opens
    useEffect(() => {
        if (!open || stompRef.current) return;
        const client = new StompClient({
            webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
            reconnectDelay: 3000,
            onConnect: () => {
                if (activeChatId) subscribeForChat(activeChatId);
                flushPendingSend();
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

    // Load history for active chat once
    useEffect(() => {
        if (!activeChatId || !myUserId) return;
        let cancelled = false;
        (async () => {
            if (loadedHistoryRef.current[activeChatId]) {
                if (stompRef.current?.connected) subscribeForChat(activeChatId);
                return;
            }
            try {
                const url = `${API_URL}public/chat/direct?u1=${encodeURIComponent(myUserId)}&u2=${encodeURIComponent(activeChatId)}&page=0&size=50`;
                const res = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`,
                    },
                });
                if (!res.ok) throw new Error((await res.text()) || 'Failed to load chat history');
                const data = await res.json();
                if (cancelled) return;
                const seen = ensureSeenSet(activeChatId);
                const mapped = (data || []).map((m) => ({
                    id: m.id ?? `srv-${m.timestamp ?? Date.now()}`,
                    clientId: m.clientId,
                    position: String(m.from?.id ?? m.fromId ?? '') === myUserId ? 'right' : 'left',
                    type: 'text',
                    text: m.content,
                    date: new Date(m.timestamp ?? Date.now()),
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
        })();
        return () => {
            cancelled = true;
            try { subscriptionRef.current?.unsubscribe(); } catch (err) { console.warn('unsubscribe error', err); }
            subscriptionRef.current = null;
        };
    }, [activeChatId, myUserId]);

    const activeMessages = messagesByChat[activeChatId] || [];

    // Auto-scroll
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
        if (!activeChatId || !inputValue.trim() || !myUserId) return;
        const text = inputValue.trim();
        const clientId = `local-${myUserId}-${Date.now()}-${localMsgId.current++}`;
        setInputValue('');

        // Optimistic append so the message appears immediately
        const optimistic = {
            id: clientId,
            clientId,
            position: 'right',
            type: 'text',
            text,
            date: new Date(),
        };
        setMessagesByChat((prev) => ({
            ...prev,
            [activeChatId]: [...(prev[activeChatId] || []), optimistic],
        }));

        const client = stompRef.current;
        const payload = { fromId: myUserId, toId: activeChatId, content: text, clientId };
        if (client && client.connected) {
            try {
                client.publish({ destination: '/app/chat.direct', body: JSON.stringify(payload) });
            } catch (err) {
                console.error('publish error', err);
            }
        } else {
            // Store and flush once connected
            localStorage.setItem('chat.pendingSend', JSON.stringify(payload));
            console.warn('Not connected to chat server, will send when connected');
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
                                <MessageList className="!p-3" dataSource={activeMessages} lockable={true} toBottomHeight="100%" />
                            </div>
                            <div className="border-t p-2">
                                <Input
                                    placeholder="Type a message..."
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    rightButtons={<button onClick={handleSend} className="bg-blue-600 text-white px-3 py-1 rounded">Send</button>}
                                />
                            </div>
                        </div>
                    )}
                </div>
            )}
        </>
    );
}