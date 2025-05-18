package com.zos.exception;

/**
 * Custom exception class for handling comment-related errors.
 */
public class CommentException extends Exception {

    // Default no-argument constructor
    public CommentException() {
        // Calls the superclass (Exception) constructor
        super();
    }

    // Constructor that accepts a custom error message
    public CommentException(String message) {
        // Calls the superclass constructor with the custom message
        super(message);
    }
}
