package com.Medicare.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ContactDTO {
    private ChatUserDTO user;
    private String lastMessage;
    private int unread; // unread for the current viewer
}