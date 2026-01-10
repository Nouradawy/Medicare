package com.Medicare.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "conversations",
        uniqueConstraints = @UniqueConstraint(name = "uq_convo_pair", columnNames = {"user_a_id","user_b_id"}),
        indexes = {
                @Index(name = "idx_convo_user_a", columnList = "user_a_id"),
                @Index(name = "idx_convo_user_b", columnList = "user_b_id"),
                @Index(name = "idx_convo_updated_at", columnList = "updated_at")
        })
public class ConversationEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // normalized pair (smaller id in userA)
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_a_id", nullable = false)
    private User userA;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_b_id", nullable = false)
    private User userB;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "last_message_id")
    private ChatMessageEntity lastMessage;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    // unread counters per participant
    @Column(name = "unread_a", nullable = false)
    private int unreadA;

    @Column(name = "unread_b", nullable = false)
    private int unreadB;

    @PrePersist
    void onCreate() {
        if (updatedAt == null) updatedAt = Instant.now();
    }

    @PreUpdate
    void onUpdate() {
        updatedAt = Instant.now();
    }

    public void incrementUnreadForReceiver(Integer receiverUserId) {
        if (userA.getUserId().equals(receiverUserId)) {
            unreadA++;
        } else if (userB.getUserId().equals(receiverUserId)) {
            unreadB++;
        }
    }

    public void resetUnreadFor(Integer userId) {
        if (userA.getUserId().equals(userId)) {
            unreadA = 0;
        } else if (userB.getUserId().equals(userId)) {
            unreadB = 0;
        }
    }
}