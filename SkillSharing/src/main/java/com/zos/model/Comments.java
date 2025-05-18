package com.zos.model;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import com.zos.dto.UserDto;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.NotNull;

/**
 * Entity representing a Comment in the system.
 */
@Entity
public class Comments {

    // Primary key for the comment
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    // Embedded user information (snapshot at the time of commenting)
    @Embedded
    @NotNull
    @AttributeOverride(name = "id", column = @Column(name = "user_id"))
    private UserDto userDto;

    // The content of the comment
    @NotNull
    private String content;

    // Set of users who liked the comment (snapshot as UserDto)
    @Embedded
    @ElementCollection
    private Set<UserDto> likedByUsers = new HashSet<>();

    // Many comments belong to one post
    @ManyToOne
    @JoinColumn(name = "post_id")
    private Post post;

    // Timestamp of when the comment was created
    private LocalDateTime createdAt;

    // Default constructor
    public Comments() {
    }

    // All-arguments constructor
    public Comments(Integer id, @NotNull UserDto userDto, @NotNull String content, Set<UserDto> likedByUsers, Post post,
                    LocalDateTime createdAt) {
        this.id = id;
        this.userDto = userDto;
        this.content = content;
        this.likedByUsers = likedByUsers;
        this.post = post;
        this.createdAt = createdAt;
    }

    // Getters and setters

    public Set<UserDto> getLikedByUsers() {
        return likedByUsers;
    }

    public void setLikedByUsers(Set<UserDto> likedByUsers) {
        this.likedByUsers = likedByUsers;
    }

    public Post getPost() {
        return post;
    }

    public void setPost(Post post) {
        this.post = post;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public UserDto getUserDto() {
        return userDto;
    }

    public void setUserDto(UserDto userDto) {
        this.userDto = userDto;
    }

    @Override
    public String toString() {
        return "Comments [id=" + id + ", userDto=" + userDto + ", content=" + content + ", likedByUsers=" + likedByUsers + "]";
    }
}
