import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  Avatar,
  Flex,
  Text,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Box,
  useToast,
  Button
} from "@chakra-ui/react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { BsBookmark, BsBookmarkFill } from "react-icons/bs";
import { FaRegComment } from "react-icons/fa";
import { RiSendPlaneLine } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { timeDifference } from "../../Config/Logic";
import { createComment, getAllComments } from "../../Redux/Comment/Action";
import { findPostByIdAction } from "../../Redux/Post/Action";
import CommentCard from "./CommentCard";

// Constant fallback user image
const DEFAULT_USER_IMAGE = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";

const CommentModal = ({
  isOpen,
  onClose,
  postData,
  handleLikePost,
  handleUnLikePost,
  handleSavePost,
  handleUnSavePost,
  isPostLiked,
  isSaved,
}) => {
  const dispatch = useDispatch();
  const jwt = localStorage.getItem("token");
  const { post, comments, user } = useSelector((store) => store);

  const [commentContent, setCommentContent] = useState("");
  const { postId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    if (postId) {
      // Fetch post data and comments once when modal opens or postId changes
      dispatch(findPostByIdAction({ jwt, postId }));
      dispatch(getAllComments({ jwt, postId }));
    }
  }, [postId, dispatch, jwt]); // Cleaned dependencies for stable effect

  // Handle comment submission
  const handleAddComment = () => {
    if (commentContent.trim() === "") {
      // Show warning toast if comment is empty
      toast({
        title: "Comment cannot be empty",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Dispatch create comment action
    dispatch(createComment({
      jwt,
      postId,
      data: { content: commentContent },
    }));

    setCommentContent(""); // Clear input after submission
  };

  // Submit on Enter key (prevent Shift+Enter so users can write multiline if needed)
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAddComment();
    }
  };

  // Close modal and navigate home
  const handleClose = () => {
    onClose();
    navigate("/");
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="4xl"
      isCentered
      motionPreset="slideInBottom"
    >
      <ModalOverlay />
      <ModalContent maxH="90vh">
        <ModalBody p={0}>
          <Flex>
            {/* Left side: Post Image */}
            <Box flex={1} bg="black" display="flex" alignItems="center" justifyContent="center">
              <img
                src={post.singlePost?.image || "https://via.placeholder.com/500"}
                alt="Post"
                style={{ maxHeight: "90vh", maxWidth: "100%", objectFit: "contain" }}
              />
            </Box>

            {/* Right side: Comments & interactions */}
            <Box flex={1} display="flex" flexDirection="column" maxH="90vh">
              
              {/* Header with user info */}
              <Flex align="center" p={4} borderBottom="1px solid" borderColor="gray.200">
                <Avatar
                  size="sm"
                  src={user.reqUser?.image || DEFAULT_USER_IMAGE}
                  name={post?.singlePost?.user?.username || "User"}
                  mr={3}
                />
                <Box>
                  <Text fontWeight="semibold">{post?.singlePost?.user?.username}</Text>
                  <Text fontSize="sm" color="gray.500">{post?.singlePost?.location}</Text>
                </Box>
              </Flex>

              {/* Comments list with scrollbar */}
              <Box
                flex={1}
                overflowY="auto"
                px={4}
                css={{
                  "&::-webkit-scrollbar": { width: "4px" },
                  "&::-webkit-scrollbar-thumb": { background: "#888", borderRadius: "2px" },
                }}
              >
                {comments.comments?.length > 0 ? (
                  comments.comments.map((comment) => (
                    <CommentCard key={comment.id} comment={comment} /> // Use stable key
                  ))
                ) : (
                  <Flex justify="center" align="center" h="100%" color="gray.500">
                    <Text>No comments yet</Text>
                  </Flex>
                )}
              </Box>

              {/* Post actions and comment input */}
              <Box borderTop="1px solid" borderColor="gray.200" p={4}>
                {/* Post actions: like, comment, share, save */}
                <Flex justify="space-between" mb={3}>
                  <Flex>
                    {isPostLiked ? (
                      <IconButton
                        icon={<AiFillHeart />}
                        colorScheme="red"
                        variant="ghost"
                        size="sm"
                        onClick={handleUnLikePost}
                        aria-label="Unlike post"
                      />
                    ) : (
                      <IconButton
                        icon={<AiOutlineHeart />}
                        variant="ghost"
                        size="sm"
                        onClick={handleLikePost}
                        aria-label="Like post"
                      />
                    )}

                    <IconButton
                      icon={<FaRegComment />}
                      variant="ghost"
                      size="sm"
                      ml={1}
                      aria-label="Comment on post"
                    />
                    <IconButton
                      icon={<RiSendPlaneLine />}
                      variant="ghost"
                      size="sm"
                      ml={1}
                      aria-label="Share post"
                    />
                  </Flex>

                  {/* Save/unsave button */}
                  {isSaved ? (
                    <IconButton
                      icon={<BsBookmarkFill />}
                      variant="ghost"
                      size="sm"
                      onClick={() => handleUnSavePost(post.singlePost?.id)}
                      aria-label="Unsave post"
                    />
                  ) : (
                    <IconButton
                      icon={<BsBookmark />}
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSavePost(post.singlePost?.id)}
                      aria-label="Save post"
                    />
                  )}
                </Flex>

                {/* Post likes count */}
                {post.singlePost?.likedByUsers?.length > 0 && (
                  <Text fontSize="sm" fontWeight="semibold" mb={2}>
                    {post.singlePost?.likedByUsers?.length} like{post.singlePost?.likedByUsers?.length !== 1 ? "s" : ""}
                  </Text>
                )}

                {/* Post time */}
                <Text fontSize="xs" color="gray.500" mb={3}>
                  {timeDifference(post?.singlePost?.createdAt)}
                </Text>

                {/* Comment input with Post button */}
                <InputGroup>
                  <Input
                    placeholder="Add a comment..."
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                    onKeyPress={handleKeyPress}
                    fontSize="sm"
                    variant="flushed"
                    pr="4.5rem"
                  />
                  <InputRightElement width="4.5rem">
                    <Button
                      h="1.75rem"
                      size="sm"
                      colorScheme="blue"
                      variant="ghost"
                      isDisabled={!commentContent.trim()} // Disable when empty
                      onClick={handleAddComment}
                    >
                      Post
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </Box>
            </Box>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default CommentModal;
