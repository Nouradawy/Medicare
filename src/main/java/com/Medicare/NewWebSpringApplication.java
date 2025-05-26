package com.Medicare;

import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;

import java.security.Security;

import static java.sql.DriverManager.println;

@SpringBootApplication
@ComponentScan(basePackages = "com.Medicare")
public class NewWebSpringApplication {

	public static void main(String[] args) {
		Security.addProvider(new BouncyCastleProvider());
		SpringApplication.run(NewWebSpringApplication.class, args);}


}


