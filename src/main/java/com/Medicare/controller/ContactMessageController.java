package com.Medicare.controller;

import com.Medicare.model.ContactMessage;
import com.Medicare.repository.ContactMessageRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contact")
@CrossOrigin

public class ContactMessageController {

    private final ContactMessageRepository repository;

    public ContactMessageController(ContactMessageRepository repository) {
        this.repository = repository;
    }

    @PostMapping
    public ContactMessage submitMessage(@RequestBody ContactMessage message) {
        return repository.save(message);
    }

    @GetMapping
    public List<ContactMessage> getMessages() {
        return repository.findAll();
    }
}