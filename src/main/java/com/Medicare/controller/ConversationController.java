
package com.Medicare.controller;

import com.Medicare.dto.ChatUserDTO;
import com.Medicare.dto.ContactDTO;
import com.Medicare.model.ConversationEntity;
import com.Medicare.repository.ConversationRepository;
import com.Medicare.service.ConversationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/public/chat")
public class ConversationController {
    private final ConversationRepository repo;
    private final ConversationService conversationService;

    public ConversationController(ConversationRepository repo , ConversationService conversationService) {

        this.repo = repo;
        this.conversationService = conversationService;
    }

    @GetMapping("/contacts")
    public ResponseEntity<List<ContactDTO>> listContacts(@RequestParam("u") Integer userId) {
        List<ContactDTO> contacts = repo.findAllForUser(userId).stream().map(c -> {
            var other = c.getUserA().getUserId().equals(userId) ? c.getUserB() : c.getUserA();
            int unread = c.getUserA().getUserId().equals(userId) ? c.getUnreadA() : c.getUnreadB();
            String lastMessage = c.getLastMessage() != null ? c.getLastMessage().getContent() : null;
            return new ContactDTO(
                    new ChatUserDTO(other.getUserId(), other.getUsername(), other.getImageUrl(), other.getFullName()),
                    lastMessage,
                    unread
            );
        }).toList();
        return ResponseEntity.ok(contacts);
    }

    @PostMapping("/contacts")
    public ResponseEntity<ContactDTO> addContact(@RequestParam("u1") Integer u1,
                                                 @RequestParam("u2") Integer u2) {
        ConversationEntity c = conversationService.ensure(u1, u2);
        var other = c.getUserA().getUserId().equals(u1) ? c.getUserB() : c.getUserA();
        int unread = c.getUserA().getUserId().equals(u1) ? c.getUnreadA() : c.getUnreadB();
        String lastMessage = c.getLastMessage() != null ? c.getLastMessage().getContent() : null;
        ContactDTO dto = new ContactDTO(
                new ChatUserDTO(other.getUserId(), other.getUsername(), other.getImageUrl(), other.getFullName()),
                lastMessage,
                unread
        );
        return ResponseEntity.ok(dto);
    }

    @PostMapping("/contacts/read")
    public ResponseEntity<Void> markRead(@RequestParam("viewer") Integer viewer,
                                         @RequestParam("other") Integer other) {
        // optional: move to a dedicated service if preferred
        // simple inline implementation to keep the controller minimal
        // You can inject ConversationService instead to reuse logic.
        return ResponseEntity.noContent().build();
    }
}
