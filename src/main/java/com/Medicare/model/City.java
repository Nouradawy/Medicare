package com.Medicare.model;

import com.Medicare.Enums.ECity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class City {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer cityId;

    @Enumerated(EnumType.STRING)
    private ECity name;

    public City() {
    }
    public City(ECity name){
        this.name = name;
    }
}
