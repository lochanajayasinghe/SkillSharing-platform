package com.zos.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.zos.exception.CommentException;
import com.zos.exception.PostException;
import com.zos.exception.UserException;
import com.zos.model.Comments;
import com.zos.model.User;
import com.zos.response.MessageResponse;
import com.zos.services.CommentService;
import com.zos.services.UserService;

@RestController
@RequestMapping("/api/comments")
public class CommentController {

    @Autowired
    private CommentService commentService;

    @Autowired
    private UserService userService;

    /**
     * Create a comment on a specific post.
     */
    @PostMapping("/create/{postId}")
    public ResponseEntity<Comments> createCommentHandler(
            @RequestBody Comments comment,
            @PathVariable("postId") Integer postId,
            @RequestHeader("Authorization") String token
    ) throws PostException, UserException {
        // Find the authenticated user using the token
        User user = userService.findUserProfile(token);

        // Create the comment using service layer
        Comments createdComment = commentService.createComment(comment, postId, user.getId());

        System.out.println("Created comment content: " + createdComment.getContent());

        // Return the created comment with HTTP 201 status
        return new ResponseEntity<>(createdComment, HttpStatus.CREATED);
    }

    /**
     * Like a specific comment.
     */
    @PutMapping("/like/{commentId}")
    public ResponseEntity<Comments> likeCommentHandler(
            @PathVariable Integer commentId,
            @RequestHeader("Authorization") String token
    ) throws UserException, CommentException {
        System.out.println("Attempting to like comment id: " + commentId);

        // Find the user from token
        User user = userService.findUserProfile(token);

        // Like the comment
        Comments likedComment = commentService.likeComment(commentId, user.getId());

        System.out.println("Liked comment details: " + likedComment);

        return new ResponseEntity<>(likedComment, HttpStatus.OK);
    }

    /**
     * Unlike a specific comment.
     */
    @PutMapping("/unlike/{commentId}")
    public ResponseEntity<Comments> unlikeCommentHandler(
            @RequestHeader("Authorization") String token,
            @PathVariable Integer commentId
    ) throws UserException, CommentException {
        // Find the user
        User user = userService.findUserProfile(token);

        // Unlike the comment
        Comments unlikedComment = commentService.unlikeComment(commentId, user.getId());

        return new ResponseEntity<>(unlikedComment, HttpStatus.OK);
    }

    /**
     * Edit an existing comment.
     */
    @PutMapping("/edit")
    public ResponseEntity<MessageResponse> editCommentHandler(
            @RequestBody Comments comment
    ) throws CommentException {
        // Edit comment by its ID
        commentService.editComment(comment, comment.getId());

        // Return success message
        MessageResponse res = new MessageResponse("Comment Updated Successfully");

        return new ResponseEntity<>(res, HttpStatus.ACCEPTED);
    }

    /**
     * Delete a specific comment.
     */
    @DeleteMapping("/delete/{commentId}")
    public ResponseEntity<MessageResponse> deleteCommentHandler(
            @PathVariable Integer commentId
    ) throws CommentException {
        // Delete the comment
        commentService.deleteCommentById(commentId);

        // Return success message
        MessageResponse res = new MessageResponse("Comment Deleted Successfully");

        return new ResponseEntity<>(res, HttpStatus.ACCEPTED);
    }

    /**
     * Get all comments for a specific post.
     */
    @GetMapping("/post/{postId}")
    public ResponseEntity<List<Comments>> getCommentHandler(
            @PathVariable Integer postId
    ) throws CommentException, PostException {
        // Find comments by post ID
        List<Comments> comments = commentService.findCommentByPostId(postId);

        // Return the list of comments with HTTP 202 status (accepted)
        return new ResponseEntity<>(comments, HttpStatus.ACCEPTED);
    }
}
