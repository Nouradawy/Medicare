package com.Medicare.controller;

import com.Medicare.dto.ChatMessageResponse;
import com.Medicare.service.ChatMessageService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class ChatMessageWsController {

    private final ChatMessageService service;
    private final SimpMessagingTemplate messaging;

    public ChatMessageWsController(ChatMessageService service, SimpMessagingTemplate messaging) {
        this.service = service;
        this.messaging = messaging;
    }

    public record SendDirectMessage(Integer fromId, Integer toId, String content) {}

    // Client sends to /app/chat.direct with body {fromId,toId,content}
    @MessageMapping("/chat.direct")
    public void sendDirect(@Payload SendDirectMessage req) {
        ChatMessageResponse saved = service.saveDirectMessage(req.fromId(), req.toId(), req.content());
        String topic = "/topic/chat/" + convoKey(req.fromId(), req.toId());
        messaging.convertAndSend(topic, saved);
    }

    private String convoKey(Integer a, Integer b) {
        return (a < b ? a + "-" + b : b + "-" + a);
    }
}