package com.Medicare.repository;

import com.Medicare.Enums.ECity;
import com.Medicare.Enums.ERole;
import com.Medicare.model.City;
import com.Medicare.model.Doctor;
import com.Medicare.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository

public interface CityRepository extends JpaRepository<City, Integer> {
    Optional<City> findByName(ECity name);
}