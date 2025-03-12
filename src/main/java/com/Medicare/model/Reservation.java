package com.Medicare.model;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Reservation {

    private int id;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }
    // Getters and Setters
}