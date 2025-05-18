package com.zos.services;

import java.util.List;

import com.zos.exception.CommentException;
import com.zos.exception.PostException;
import com.zos.exception.UserException;
import com.zos.model.Comments;

/**
 * Service interface for handling comment-related operations.
 * Defines the contract that the service implementation must fulfill.
 */
public interface CommentService {

	/**
	 * Creates a new comment for a specific post by a user.
	 *
	 * @param comment the comment to be created
	 * @param postId the ID of the post to which the comment is added
	 * @param userId the ID of the user who is creating the comment
	 * @return the created comment
	 * @throws PostException if the post does not exist
	 * @throws UserException if the user is not found or unauthorized
	 */
	public Comments createComment(Comments comment, Integer postId, Integer userId) throws PostException, UserException;

	/**
	 * Finds a comment by its ID.
	 *
	 * @param commentId the ID of the comment
	 * @return the found comment
	 * @throws CommentException if the comment does not exist
	 */
	public Comments findCommentById(Integer commentId) throws CommentException;

	/**
	 * Likes a comment by a user.
	 *
	 * @param commentId the ID of the comment to like
	 * @param userId the ID of the user who likes the comment
	 * @return the updated comment with the like added
	 * @throws UserException if the user is not found or unauthorized
	 * @throws CommentException if the comment does not exist
	 */
	public Comments likeComment(Integer commentId, Integer userId) throws UserException, CommentException;

	/**
	 * Removes the like from a comment by a user.
	 *
	 * @param commentId the ID of the comment to unlike
	 * @param userId the ID of the user who unlikes the comment
	 * @return the updated comment with the like removed
	 * @throws UserException if the user is not found or unauthorized
	 * @throws CommentException if the comment does not exist
	 */
	public Comments unlikeComment(Integer commentId, Integer userId) throws UserException, CommentException;

	/**
	 * Deletes a comment by its ID.
	 *
	 * @param commentId the ID of the comment to delete
	 * @return a success message upon deletion
	 * @throws CommentException if the comment does not exist
	 */
	public String deleteCommentById(Integer commentId) throws CommentException;

	/**
	 * Edits the content of a comment.
	 *
	 * @param comment the comment object containing updated content
	 * @param commentId the ID of the comment to update
	 * @return a success message upon update
	 * @throws CommentException if the comment does not exist
	 */
	public String editComment(Comments comment, Integer commentId) throws CommentException;

	/**
	 * Finds all comments for a specific post.
	 *
	 * @param postId the ID of the post
	 * @return list of comments for the post
	 * @throws PostException if the post does not exist
	 */
	public List<Comments> findCommentByPostId(Integer postId) throws PostException;
}
