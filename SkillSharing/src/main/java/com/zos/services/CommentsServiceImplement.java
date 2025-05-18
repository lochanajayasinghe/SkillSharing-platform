package com.zos.services;

import com.zos.dto.UserDto;
import com.zos.exception.CommentException;
import com.zos.model.Notification;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.zos.exception.PostException;
import com.zos.exception.UserException;
import com.zos.model.Comments;
import com.zos.model.Post;
import com.zos.model.User;
import com.zos.repository.CommentRepository;
import com.zos.repository.PostRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Implementation of CommentService interface.
 * Handles business logic related to comments.
 */
@Service
public class CommentsServiceImplement implements CommentService {

    @Autowired
    private CommentRepository repo;

    @Autowired
    private UserService userService;

    @Autowired
    private PostService postService;

    @Autowired
    private PostRepository postRepo;

    @Autowired
    private NotificationService notificationService;

    /**
     * Creates a new comment for a post by a user.
     * Also creates a notification to the post owner if the commenter is not the owner.
     */
    @Override
    public Comments createComment(Comments comment, Integer postId, Integer userId) throws PostException, UserException {
        User user = userService.findUserById(userId);
        Post post = postService.findePostById(postId);

        // Build UserDto from User entity
        UserDto userDto = new UserDto();
        userDto.setEmail(user.getEmail());
        userDto.setId(user.getId());
        userDto.setUsername(user.getUsername());
        userDto.setName(user.getName());
        userDto.setUserImage(user.getImage());

        // Set comment properties
        comment.setUserDto(userDto);
        comment.setCreatedAt(LocalDateTime.now());
        comment.setPost(post);

        // Save comment
        Comments newComment = repo.save(comment);

        // Add comment to post's comments list and update post
        post.getComments().add(newComment);
        postRepo.save(post);

        // Notify post owner if not the same user
        if (!post.getUser().getId().equals(userId)) {
            Notification notification = new Notification();
            notification.setMessage(user.getUsername() + " commented on your post");
            notification.setType("COMMENT");
            notification.setPostId(postId);
            notification.setCommentId(comment.getId());
            notificationService.createNotification(notification, post.getUser().getId());
        }

        return newComment;
    }

    /**
     * Finds a comment by its ID.
     * Throws CommentException if not found.
     */
    @Override
    public Comments findCommentById(Integer commentId) throws CommentException {
        Optional<Comments> opt = repo.findById(commentId);

        if (opt.isPresent()) {
            return opt.get();
        }
        throw new CommentException("comment not exist with id : " + commentId);
    }

    /**
     * Likes a comment by adding user info to likedByUsers set.
     */
    @Override
    public Comments likeComment(Integer commentId, Integer userId) throws UserException, CommentException {
        User user = userService.findUserById(userId);
        Comments comment = findCommentById(commentId);

        // Build UserDto from User entity
        UserDto userDto = new UserDto();
        userDto.setEmail(user.getEmail());
        userDto.setId(user.getId());
        userDto.setUsername(user.getUsername());
        userDto.setName(user.getName());
        userDto.setUserImage(user.getImage());

        // Add user to likes
        comment.getLikedByUsers().add(userDto);
        System.out.println(("like ------- " + " ------ " + comment));
        return repo.save(comment);
    }

    /**
     * Unlikes a comment by removing user from likedByUsers.
     * (Note: May cause issues since you're trying to remove User from Set<UserDto>.)
     */
    @Override
    public Comments unlikeComment(Integer commentId, Integer userId) throws UserException, CommentException {
        User user = userService.findUserById(userId);
        Comments comment = findCommentById(commentId);

        comment.getLikedByUsers().remove(user);

        return repo.save(comment);
    }

    /**
     * Deletes a comment by its ID.
     */
    @Override
    public String deleteCommentById(Integer commentId) throws CommentException {
        Comments comment = findCommentById(commentId);

        System.out.println("find by id delete-------- " + comment.getContent());

        repo.deleteById(comment.getId());

        return "Comment Deleted Successfully";
    }

    /**
     *
     * Edits the content of an existing comment.
     */
    @Override
    public String editComment(Comments comment, Integer commentId) throws CommentException {
        Comments isComment = findCommentById(commentId);

        if (comment.getContent() != null) {
            isComment.setContent(comment.getContent());
        }
        repo.save(isComment);
        return "Comment Updated Successfully";
    }

    /**
     * Retrieves all comments for a specific post.
     */
    @Override
    public List<Comments> findCommentByPostId(Integer postId) throws PostException {
        List<Comments> comments = repo.findCommentsByPostId(postId);
        return comments;
    }
}
