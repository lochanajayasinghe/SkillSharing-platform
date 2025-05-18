import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Button,
  IconButton,
  useToast,
  Box,
  Flex,
  Text,
  Textarea,
  Input,
  Spinner,
  Avatar,
  Progress
} from "@chakra-ui/react";
import React, { useState, useRef, useCallback } from "react";
import { FaPhotoVideo, FaTimes, FaArrowLeft } from "react-icons/fa";
import { GoLocation } from "react-icons/go";
import { GrEmoji } from "react-icons/gr";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import { createPost } from "../../../Redux/Post/Action";
import { uploadToCloudinary } from "../../../Config/UploadToCloudinary";
import "./CreatePostModal.css";

const MAX_CAPTION_LENGTH = 2200;

const CreatePostModal = ({ onOpen, isOpen, onClose }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("idle");
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);
  
  const dispatch = useDispatch();
  const toast = useToast();
  const token = localStorage.getItem("token");
  const { user } = useSelector(store => store);

  const [postData, setPostData] = useState({ 
    mediaUrls: [], 
    caption: '', 
    location: "" 
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "caption" && value.length > MAX_CAPTION_LENGTH) return;
    setPostData(prev => ({ ...prev, [name]: value }));
  };

  const handleDrop = useCallback((event) => {
    event.preventDefault();
    const droppedFiles = Array.from(event.dataTransfer.files);
    handleFiles(droppedFiles);
    setIsDragOver(false);
  }, []);

  const handleDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const handleFileSelect = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleOnChange = useCallback(async (e) => {
    const selectedFiles = Array.from(e.target.files);
    handleFiles(selectedFiles);
  }, []);

  const handleFiles = useCallback(async (files) => {
    const validFiles = files.filter(file => 
      file.type.startsWith("image/") || file.type.startsWith("video/")
    );
    
    if (validFiles.length === 0) {
      toast({
        title: "Invalid files",
        description: "Please select image or video files only.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setUploadStatus("uploading");
    setUploadProgress(0);
    
    try {
      const uploadPromises = validFiles.map(file => 
        uploadToCloudinary(file, (progress) => {
          setUploadProgress(prev => Math.min(prev + progress / validFiles.length, 100));
        })
      );
      
      const urls = await Promise.all(uploadPromises);
      const successfulUploads = urls.filter(url => url);
      
      setPostData(prev => ({
        ...prev,
        mediaUrls: [...prev.mediaUrls, ...successfulUploads]
      }));
      
      setUploadStatus("uploaded");
      setUploadProgress(100);
      
      if (successfulUploads.length < urls.length) {
        toast({
          title: "Partial upload",
          description: "Some files failed to upload.",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Upload failed:", error);
      setUploadStatus("error");
      toast({
        title: "Upload failed",
        description: "Failed to upload files. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }, [toast]);

  const handleNextMedia = useCallback(() => {
    setCurrentMediaIndex(prev => 
      prev === postData.mediaUrls.length - 1 ? 0 : prev + 1
    );
  }, [postData.mediaUrls.length]);

  const handlePrevMedia = useCallback(() => {
    setCurrentMediaIndex(prev => 
      prev === 0 ? postData.mediaUrls.length - 1 : prev - 1
    );
  }, [postData.mediaUrls.length]);

  const handleRemoveMedia = useCallback((index) => {
    setPostData(prev => ({
      ...prev,
      mediaUrls: prev.mediaUrls.filter((_, i) => i !== index)
    }));
    setCurrentMediaIndex(prev => {
      if (prev === index) return 0;
      if (prev > index) return prev - 1;
      return prev;
    });
  }, []);

  const handleSubmit = async () => {
    if (!token) {
      toast({
        title: "Authentication required",
        description: "Please log in to create a post.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    if (postData.mediaUrls.length === 0) {
      toast({
        title: "No media selected",
        description: "Please add at least one photo or video.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    const data = {
      jwt: token,
      data: postData,
    };
    
    try {
      await dispatch(createPost(data));
      toast({
        title: "Post created",
        description: "Your post has been shared successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      handleClose();
    } catch (error) {
      toast({
        title: "Error creating post",
        description: "There was an issue sharing your post.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleBack = () => {
    if (postData.mediaUrls.length > 0) {
      setPostData({ mediaUrls: [], caption: '', location: "" });
      setUploadStatus("idle");
      setCurrentMediaIndex(0);
    } else {
      handleClose();
    }
  };

  const handleClose = () => {
    onClose();
    setIsDragOver(false);
    setPostData({ mediaUrls: [], caption: '', location: "" });
    setUploadStatus("idle");
    setCurrentMediaIndex(0);
    setUploadProgress(0);
  };

  const isVideo = (url) => {
    return url.match(/\.(mp4|webm|ogg)$/i);
  };

  return (
    <Modal
      size={"4xl"}
      isOpen={isOpen}
      onClose={handleClose}
      closeOnOverlayClick={false}
      className="create-post-modal"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader className="modal-header">
          <Flex align="center">
            <IconButton
              icon={<FaArrowLeft />}
              aria-label="Back"
              variant="ghost"
              onClick={handleBack}
              className="back-button"
            />
            <Text ml={2}>Create New Post</Text>
          </Flex>
          <Button
            onClick={handleSubmit}
            className="share-button"
            isDisabled={postData.mediaUrls.length === 0}
          >
            Share
          </Button>
        </ModalHeader>

        <ModalBody className="modal-body">
          <Flex className="modal-container">
            {/* Media Upload/Preview Section */}
            <Box 
              className={`media-section ${isDragOver ? "drag-over" : ""}`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              {uploadStatus === "idle" && (
                <Flex
                  className="upload-prompt"
                  onClick={handleFileSelect}
                >
                  <FaPhotoVideo className="upload-icon" />
                  <Text className="upload-text">Drag photos or videos here</Text>
                  <Text className="upload-subtext">Or select from your computer</Text>
                  <Button className="select-files-button">
                    Select Files
                  </Button>
                  <Input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*, video/*"
                    multiple
                    onChange={handleOnChange}
                    className="file-input"
                  />
                </Flex>
              )}

              {uploadStatus === "uploading" && (
                <Flex className="uploading-container">
                  <Spinner className="upload-spinner" />
                  <Text className="uploading-text">Uploading your files...</Text>
                  <Progress 
                    value={uploadProgress} 
                    className="upload-progress"
                  />
                  <Text className="progress-text">
                    {Math.round(uploadProgress)}% complete
                  </Text>
                </Flex>
              )}

              {uploadStatus === "uploaded" && postData.mediaUrls.length > 0 && (
                <Box className="media-preview-container">
                  {/* Current Media Display */}
                  {postData.mediaUrls.map((url, index) => (
                    <Box
                      key={index}
                      className={`media-item ${index === currentMediaIndex ? "active" : ""}`}
                    >
                      {isVideo(url) ? (
                        <video
                          src={url}
                          controls
                          className="media-content"
                        />
                      ) : (
                        <img
                          src={url}
                          alt={`Media ${index + 1}`}
                          className="media-content"
                        />
                      )}
                      
                      <IconButton
                        icon={<FaTimes />}
                        aria-label="Remove media"
                        className="remove-media-button"
                        onClick={() => handleRemoveMedia(index)}
                      />
                    </Box>
                  ))}

                  {/* Navigation Arrows */}
                  {postData.mediaUrls.length > 1 && (
                    <>
                      <IconButton
                        icon={<ChevronLeftIcon />}
                        aria-label="Previous media"
                        className="nav-button prev-button"
                        onClick={handlePrevMedia}
                      />
                      <IconButton
                        icon={<ChevronRightIcon />}
                        aria-label="Next media"
                        className="nav-button next-button"
                        onClick={handleNextMedia}
                      />
                    </>
                  )}

                  {/* Media Indicators */}
                  {postData.mediaUrls.length > 1 && (
                    <Flex className="media-indicators">
                      {postData.mediaUrls.map((_, index) => (
                        <Box
                          key={index}
                          as="button"
                          onClick={() => setCurrentMediaIndex(index)}
                          className={`indicator ${index === currentMediaIndex ? "active" : ""}`}
                        />
                      ))}
                    </Flex>
                  )}
                </Box>
              )}
            </Box>

            {/* Post Details Section */}
            <Box className="details-section">
              {/* User Info */}
              <Flex className="user-info">
                <Avatar 
                  src={user?.reqUser?.image || "https://cdn.pixabay.com/photo/2023/02/28/03/42/ibex-7819817_640.jpg"} 
                  name={user?.reqUser?.username}
                  className="user-avatar"
                />
                <Text className="username">{user?.reqUser?.username}</Text>
              </Flex>

              {/* Caption Input */}
              <Box className="caption-container">
                <Textarea
                  placeholder="Write a caption..."
                  name="caption"
                  value={postData.caption}
                  onChange={handleInputChange}
                  className="caption-input"
                />
                <Flex className="caption-footer">
                  <GrEmoji className="emoji-icon" />
                  <Text className={`character-count ${postData.caption.length >= MAX_CAPTION_LENGTH ? "limit-reached" : ""}`}>
                    {postData.caption.length}/{MAX_CAPTION_LENGTH}
                  </Text>
                </Flex>
              </Box>

              {/* Location Input */}
              <Box className="location-container">
                <Flex className="location-input-wrapper">
                  <Input
                    placeholder="Add location"
                    name="location"
                    value={postData.location}
                    onChange={handleInputChange}
                    className="location-input"
                  />
                  <GoLocation className="location-icon" />
                </Flex>
              </Box>
            </Box>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default CreatePostModal;