package com.Medicare.model;

import com.Medicare.Enums.*;
import jakarta.persistence.*; 
import lombok.NoArgsConstructor; 

@Entity
@Table(name = "roles")
@NoArgsConstructor
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) 
    private Integer id;

    @Enumerated(EnumType.STRING)
    @Column(length = 20) 
    private ERole name;

    public Role(ERole name) {
        this.name = name;
    }

    // Getters
    public Integer getId() {
        return id;
    }
    
    public ERole getName() {
        return name;
    }
    
    // Setters
    public void setId(Integer id) {
        this.id = id;
    }
    
    public void setName(ERole name) {
        this.name = name;
    }
}



