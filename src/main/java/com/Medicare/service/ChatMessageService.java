package com.Medicare.service;

import com.Medicare.dto.ChatMessageResponse;

import java.util.List;

public interface ChatMessageService {
    List<ChatMessageResponse> getDirectMessages(Integer u1, Integer u2, Integer page, Integer size);
    ChatMessageResponse saveDirectMessage(Integer fromId, Integer toId, String content);
}
