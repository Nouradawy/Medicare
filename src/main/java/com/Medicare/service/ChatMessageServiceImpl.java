package com.Medicare.service;

import com.Medicare.dto.ChatMessageResponse;
import com.Medicare.dto.ChatUserDTO;
import com.Medicare.model.ChatMessageEntity;
import com.Medicare.model.User;
import com.Medicare.repository.ChatMessageRepository;
import com.Medicare.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ChatMessageServiceImpl implements ChatMessageService{
    @Autowired
    private ChatMessageRepository chatMessageRepository;

    @Autowired
    private UserRepository userRepository;


    public static ChatMessageResponse toResponse(ChatMessageEntity e) {
        ChatMessageResponse r = new ChatMessageResponse();
        r.setId(e.getId());
        r.setContent(e.getContent());
        r.setTimestamp(e.getCreatedAt().toEpochMilli());

        ChatUserDTO from = new ChatUserDTO(
                e.getFromUser().getUserId(),
                e.getFromUser().getUsername(),
                e.getFromUser().getImageUrl(),
                e.getFromUser().getFullName()
        );
        r.setFrom(from);

        if (e.getToUser() != null) {
            ChatUserDTO to = new ChatUserDTO(
                    e.getToUser().getUserId(),
                    e.getToUser().getUsername(),
                    e.getToUser().getImageUrl(),
                    e.getToUser().getFullName()
            );
            r.setTo(to);
        }
        return r;
    }


    @Override
    @Transactional
    public ChatMessageResponse saveDirectMessage(Integer fromId, Integer toId, String content) {
        User from = userRepository.findByUserId(fromId).orElseThrow();
        User to = userRepository.findByUserId(toId).orElseThrow();

        ChatMessageEntity e = new ChatMessageEntity();
        e.setFromUser(from);
        e.setToUser(to);
        e.setContent(content);
        ChatMessageEntity saved = chatMessageRepository.save(e);
        return toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ChatMessageResponse> getDirectMessages(Integer u1, Integer u2, Integer page, Integer size) {
        return chatMessageRepository.findDirectMessages(u1, u2, PageRequest.of(page, size))
                .stream().map(ChatMessageServiceImpl::toResponse).toList();
    }
}
