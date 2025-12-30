package com.Medicare.dto;

import lombok.Getter;
import lombok.Setter;

import java.sql.Timestamp;

@Getter
@Setter
public class ReviewsDTO {
    private Integer doctorId;
    private Integer patientId;
    private Integer rating;
    private String comment;
    private String Username;
    private String imageUrl;
    private Timestamp createdAt;

    public ReviewsDTO(Integer doctorId, Integer patientId, Integer rating, String comment, String userName, String imageUrl, Timestamp createdAt) {
        this.doctorId = doctorId;
        this.patientId = patientId;
        this.rating = rating;
        this.comment = comment;
        this.Username = userName;
        this.imageUrl = imageUrl;
        this.createdAt = createdAt;
    }
}
