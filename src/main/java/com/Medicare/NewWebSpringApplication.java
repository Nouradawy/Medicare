package com.Medicare;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;

import static java.sql.DriverManager.println;

@SpringBootApplication
@ComponentScan(basePackages = "com.Medicare")
public class NewWebSpringApplication {

	public static void main(String[] args) {
		SpringApplication.run(NewWebSpringApplication.class, args);}


}


