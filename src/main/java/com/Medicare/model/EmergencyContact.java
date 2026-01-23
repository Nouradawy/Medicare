package com.Medicare.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;


@Entity
@Getter
@Setter
public class EmergencyContact {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @OneToOne()
    @JoinColumn(name = "userId", referencedColumnName = "userId")
    private User user;
    private String eContactName;
    private String eContactPhone;
    private String eContactRelation;

    public EmergencyContact() {
    }

    public EmergencyContact(String eContactName, String eContactPhone, String eContactRelation) {
        this.eContactName = eContactName;
        this.eContactPhone = eContactPhone;
        this.eContactRelation = eContactRelation;
    }
}
