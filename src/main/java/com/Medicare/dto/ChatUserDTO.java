package com.Medicare.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor

public class ChatUserDTO {
    private Integer id;
    private String username;
    private String imageUrl; // avatar/profile picture
    private String fullName;
}
