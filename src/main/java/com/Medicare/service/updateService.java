package com.Medicare.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;

public class updateService {
    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public void sendUpdate(String message) {
        messagingTemplate.convertAndSend("/topic/updates", message);
    }
}
