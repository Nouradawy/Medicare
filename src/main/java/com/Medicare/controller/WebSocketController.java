package com.Medicare.controller;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;


import java.util.Map;

@Controller
public class WebSocketController {



    @MessageMapping("/send")
    @SendTo("/topic/updates")
    public String sendMessage(String message) {
        return "Live Update: " + message;
    }




}
