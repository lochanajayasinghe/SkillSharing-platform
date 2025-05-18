package com.zos.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.zos.model.Comments;

/**
 * Repository interface for managing Comments entity.
 * Extends JpaRepository to provide CRUD operations.
 */
public interface CommentRepository extends JpaRepository<Comments, Integer> {

    /**
     * Custom query to retrieve all comments belonging to a specific post by its ID.
     *
     * @param postId the ID of the post
     * @return list of comments associated with the post
     */
    @Query("SELECT c FROM Comments c WHERE c.post.id = :postId")
    List<Comments> findCommentsByPostId(@Param("postId") Integer postId);

}
