package com.Medicare.controller;

import com.Medicare.dto.ChatMessageResponse;
import com.Medicare.service.ChatMessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.web.bind.annotation.*;

import java.util.List;



@RestController
@RequestMapping("/api/public/chat")
public class ChatMessageController {

    @Autowired
    ChatMessageService chatMessageService;



    // History: GET /api/chat/direct?u1=1&u2=2&page=0&size=50
    @GetMapping("/direct")
    public ResponseEntity<List<ChatMessageResponse>> getDirect(
            @RequestParam("u1") Integer u1,
            @RequestParam("u2") Integer u2,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size
    ) {
        return ResponseEntity.ok(chatMessageService.getDirectMessages(u1, u2, page, size));
    }
}
