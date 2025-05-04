package com.Medicare.config;


import com.Medicare.Enums.ECity;
import com.Medicare.Enums.ERole;
import com.Medicare.model.City;
import com.Medicare.model.Role;
import com.Medicare.repository.CityRepository;
import com.Medicare.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class CityInitializer implements CommandLineRunner {

    @Autowired
    private CityRepository cityRepository;

    @Override
    public void run(String... args) throws Exception {
        // Initialize roles if they don't exist
        for (ECity city : ECity.values()) {
            if (cityRepository.findByName(city).isEmpty()) {
                cityRepository.save(new City(city));
            }
        }
    }
}
