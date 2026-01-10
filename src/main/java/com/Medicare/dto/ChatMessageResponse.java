package com.Medicare.dto;

import lombok.Data;

@Data
public class ChatMessageResponse {
    private Long id;
    private ChatUserDTO from;
    private ChatUserDTO to; // may be null for room messages
    private String content;
    private long timestamp;
    private String clientId;
}
