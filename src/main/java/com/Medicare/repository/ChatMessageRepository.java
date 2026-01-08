package com.Medicare.repository;

import com.Medicare.model.ChatMessageEntity;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessageEntity, Long> {

    @Query("""
        select m from ChatMessageEntity m
        join fetch m.fromUser f
        left join fetch m.toUser t
        where (f.userId = :u1 and t.userId = :u2)
           or (f.userId = :u2 and t.userId = :u1)
        order by m.createdAt asc
    """)
    List<ChatMessageEntity> findDirectMessages(
            @Param("u1") Integer user1Id,
            @Param("u2") Integer user2Id,
            Pageable pageable
    );
}