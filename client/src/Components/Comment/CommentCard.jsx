// Import necessary React hooks and modules
import React, { useEffect, useState } from "react";
// Import icons for like/unlike, edit, delete, menu, and emoji
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { BsEmojiSmile, BsPencil, BsThreeDots } from "react-icons/bs";
import { MdDelete } from "react-icons/md";
// Redux hooks and actions
import { useDispatch, useSelector } from "react-redux";
import { isCommentLikedByUser, timeDifference } from "../../Config/Logic";
import { deleteComment, likeComment, editComment } from "../../Redux/Comment/Action";
// Chakra UI components for UI and toast messages
import {
  Avatar,
  Box,
  Flex,
  Text,
  IconButton,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useToast
} from "@chakra-ui/react";

// Component to display and manage a single comment
const CommentCard = ({ comment }) => {
  // Local state to handle like status, likes count, edit mode, and edited content
  const [isCommentLiked, setIsCommentLike] = useState(false);
  const [commentLikes, setCommentLikes] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment?.content);

  // Get logged-in user from Redux store
  const { user } = useSelector((store) => store);
  const dispatch = useDispatch();
  const jwt = localStorage.getItem("token"); // Get token from local storage
  const toast = useToast(); // Chakra UI toast for notifications

  // On mount or when comment/user changes, set like status and likes count
  useEffect(() => {
    setCommentLikes(comment?.likedByUsers?.length);
    setIsCommentLike(isCommentLikedByUser(comment, user.reqUser?.id));
  }, [comment, user.reqUser]);

  // Handle liking a comment
  const handleLikeComment = () => {
    dispatch(likeComment({ jwt, commentId: comment.id }));
    setIsCommentLike(true);
    setCommentLikes(commentLikes + 1);
  };

  // Handle unliking a comment (same action, backend toggles state)
  const handleUnLikeComment = () => {
    dispatch(likeComment({ jwt, commentId: comment.id }));
    setIsCommentLike(false);
    setCommentLikes(commentLikes - 1);
  };

  // Handle deleting a comment
  const handleDeleteComment = () => {
    dispatch(deleteComment({ commentId: comment.id, jwt }));
    toast({
      title: "Comment deleted",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  // Handle saving edited comment
  const handleEditComment = () => {
    if (editedContent.trim() === "") {
      toast({
        title: "Comment cannot be empty",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    dispatch(editComment({ 
      data: { id: comment?.id, content: editedContent }, 
      jwt 
    }));
    setIsEditing(false);
    toast({
      title: "Comment updated",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  // Handle pressing Enter key while editing
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleEditComment();
    }
  };

  return (
    // Comment container with hover effect
    <Box py={3} px={4} _hover={{ bg: "gray.50" }} transition="background-color 0.2s">
      <Flex justify="space-between" align="center">
        {/* Left section: Avatar and comment content */}
        <Flex align="flex-start" flex={1}>
          <Avatar
            size="sm"
            src={comment?.userDto?.userImage || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"}
            name={comment?.userDto?.username}
            mr={3}
          />
          
          <Box flex={1}>
            {/* If editing, show input box, else show text */}
            {isEditing ? (
              <Input
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                onKeyPress={handleKeyPress}
                onBlur={handleEditComment}
                autoFocus
                variant="flushed"
                size="sm"
              />
            ) : (
              <Text fontSize="sm">
                <Text as="span" fontWeight="semibold" mr={2}>
                  {comment.userDto?.username}
                </Text>
                {comment.content}
              </Text>
            )}
            
            {/* Timestamp and likes count */}
            <Flex align="center" mt={1} color="gray.500" fontSize="xs">
              <Text>{timeDifference(comment?.createdAt)}</Text>
              
              {commentLikes > 0 && (
                <Text ml={3}>{commentLikes} like{commentLikes !== 1 ? "s" : ""}</Text>
              )}
            </Flex>
          </Box>
        </Flex>
        
        {/* Right section: Like button and options menu if user owns the comment */}
        <Flex align="center">
          {isCommentLiked ? (
            <IconButton
              icon={<AiFillHeart />}
              colorScheme="red"
              variant="ghost"
              size="sm"
              onClick={handleUnLikeComment}
              aria-label="Unlike comment"
            />
          ) : (
            <IconButton
              icon={<AiOutlineHeart />}
              variant="ghost"
              size="sm"
              onClick={handleLikeComment}
              aria-label="Like comment"
            />
          )}
          
          {/* Show edit/delete options only if the comment belongs to the logged-in user */}
          {user?.reqUser?.id === comment?.userDto?.id && (
            <Menu>
              <MenuButton
                as={IconButton}
                icon={<BsThreeDots />}
                variant="ghost"
                size="sm"
                ml={1}
                aria-label="Comment options"
              />
              <MenuList minW="120px" fontSize="sm">
                <MenuItem icon={<BsPencil />} onClick={() => setIsEditing(true)}>
                  Edit
                </MenuItem>
                <MenuItem 
                  icon={<MdDelete />} 
                  color="red.500"
                  onClick={handleDeleteComment}
                >
                  Delete
                </MenuItem>
              </MenuList>
            </Menu>
          )}
        </Flex>
      </Flex>
    </Box>
  );
};

export default CommentCard;
