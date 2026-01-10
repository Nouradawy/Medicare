
package com.Medicare.repository;

import com.Medicare.model.ConversationEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;
import java.util.List;

public interface ConversationRepository extends JpaRepository<ConversationEntity, Long> {

    @Query("""
        select c from ConversationEntity c
        where (c.userA.userId = :u and c.userB.userId = :v)
           or (c.userA.userId = :v and c.userB.userId = :u)
    """)
    Optional<ConversationEntity> findByPair(Integer u, Integer v);

    @Query("""
        select c from ConversationEntity c
        where c.userA.userId = :u or c.userB.userId = :u
        order by c.updatedAt desc
    """)
    List<ConversationEntity> findAllForUser(Integer u);
}