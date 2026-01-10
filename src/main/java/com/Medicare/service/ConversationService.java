package com.Medicare.service;

import com.Medicare.model.ChatMessageEntity;
import com.Medicare.model.ConversationEntity;
import com.Medicare.model.User;
import com.Medicare.repository.ConversationRepository;
import com.Medicare.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ConversationService {
    private final ConversationRepository conversationRepository;
    private final UserRepository userRepository;

    public ConversationService(ConversationRepository conversationRepository, UserRepository userRepository) {
        this.conversationRepository = conversationRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public ConversationEntity ensure(Integer u1, Integer u2) {
        Integer a = Math.min(u1, u2);
        Integer b = Math.max(u1, u2);
        return conversationRepository.findByPair(a, b).orElseGet(() -> {
            User ua = userRepository.findByUserId(a).orElseThrow();
            User ub = userRepository.findByUserId(b).orElseThrow();
            ConversationEntity c = new ConversationEntity();
            c.setUserA(ua);
            c.setUserB(ub);
            c.setUnreadA(0);
            c.setUnreadB(0);
            return conversationRepository.save(c);
        });
    }

    @Transactional
    public void touch(Integer fromId, Integer toId, ChatMessageEntity lastMessage) {
        Integer a = Math.min(fromId, toId);
        Integer b = Math.max(fromId, toId);

        ConversationEntity convo = conversationRepository.findByPair(a, b)
                .orElseGet(() -> {
                    ConversationEntity c = new ConversationEntity();
                    User ua = userRepository.findByUserId(a).orElseThrow();
                    User ub = userRepository.findByUserId(b).orElseThrow();
                    c.setUserA(ua);
                    c.setUserB(ub);
                    c.setUnreadA(0);
                    c.setUnreadB(0);
                    return c;
                });

        convo.setLastMessage(lastMessage);
        // increment unread for the actual receiver
        convo.incrementUnreadForReceiver(toId);

        conversationRepository.save(convo);
    }

    @Transactional
    public void markRead(Integer viewerId, Integer otherId) {
        Integer a = Math.min(viewerId, otherId);
        Integer b = Math.max(viewerId, otherId);
        conversationRepository.findByPair(a, b).ifPresent(c -> {
            c.resetUnreadFor(viewerId);
            conversationRepository.save(c);
        });
    }
}
