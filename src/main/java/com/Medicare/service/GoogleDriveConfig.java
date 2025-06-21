package com.Medicare.service;

import com.google.api.client.googleapis.auth.oauth2.GoogleCredential;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.google.api.services.drive.Drive;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import java.io.InputStream;
import java.util.Collections;

@Configuration
public class GoogleDriveConfig {
    @Bean
    public Drive driveService() throws Exception {
        InputStream in = getClass().getResourceAsStream("/credentials.json");
        GoogleCredential credential = GoogleCredential.fromStream(in)
                .createScoped(Collections.singleton("https://www.googleapis.com/auth/drive"));
        return new Drive.Builder(
                GoogleNetHttpTransport.newTrustedTransport(),
                JacksonFactory.getDefaultInstance(),
                credential
        ).setApplicationName("Your App Name").build();
    }
}