import React, { useState, useRef } from "react";
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Button, useToast } from "@chakra-ui/react";
import { FaPhotoVideo } from "react-icons/fa";
import { GoLocation } from "react-icons/go";
import { GrEmoji } from "react-icons/gr";
import { useDispatch } from "react-redux";
import { uploadMediaToCloudinary } from "../../Config/UploadVideoToCloudnary";
import { createReel } from "../../Redux/Reel/Action";
import SpinnerCard from "../Spinner/Spinner";

const CreateReel = ({ isOpen, onClose }) => {
    const finalRef = useRef(null);
    const dispatch = useDispatch();
    const toast = useToast();

    const [file, setFile] = useState(null);
    const [videoPreviewUrl, setVideoPreviewUrl] = useState(null);
    const [uploadStatus, setUploadStatus] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const [reelData, setReelData] = useState({
        video: "",
        caption: "",
        location: ""
    });

    const token = localStorage.getItem("token");

    const handleFileChange = async (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        if (!selectedFile.type.startsWith("video/")) {
            toast({
                title: "Invalid file type",
                description: "Please select a video file",
                status: "error",
                duration: 3000,
                isClosable: true
            });
            return;
        }

        if (selectedFile.size > 50 * 1024 * 1024) { // 50MB limit
            toast({
                title: "File too large",
                description: "Maximum file size is 50MB",
                status: "error",
                duration: 3000,
                isClosable: true
            });
            return;
        }

        setFile(selectedFile);
        const reader = new FileReader();
        reader.readAsDataURL(selectedFile);
        reader.onloadend = () => setVideoPreviewUrl(reader.result);

        try {
            setUploadStatus("uploading");
            const uploadedUrl = await uploadMediaToCloudinary(selectedFile);
            setReelData(prev => ({ ...prev, video: uploadedUrl }));
            setUploadStatus("uploaded");
        } catch (error) {
            toast({
                title: "Upload failed",
                description: "Failed to upload video",
                status: "error",
                duration: 3000,
                isClosable: true
            });
            setUploadStatus("");
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setReelData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        if (!token) {
            toast({
                title: "Authentication required",
                description: "Please login to create reels",
                status: "error",
                duration: 3000,
                isClosable: true
            });
            return;
        }

        if (!reelData.video) {
            toast({
                title: "Video required",
                description: "Please upload a video first",
                status: "error",
                duration: 3000,
                isClosable: true
            });
            return;
        }

        setIsLoading(true);
        try {
            await dispatch(createReel({ jwt: token, reelData }));
            toast({
                title: "Reel created",
                description: "Your reel has been posted",
                status: "success",
                duration: 3000,
                isClosable: true
            });
            onClose();
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to create reel",
                status: "error",
                duration: 3000,
                isClosable: true
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setFile(null);
        setVideoPreviewUrl(null);
        setUploadStatus("");
        setReelData({ video: "", caption: "", location: "" });
        onClose();
    };

    return (
        <Modal size="4xl" finalFocusRef={finalRef} isOpen={isOpen} onClose={handleClose}>
            <ModalOverlay />
            <ModalContent>
                <div className="flex justify-between items-center px-6 py-3 border-b">
                    <ModalHeader className="text-lg font-semibold">Create New Reel</ModalHeader>
                    <ModalCloseButton />
                    <Button
                        onClick={handleSubmit}
                        colorScheme="blue"
                        size="sm"
                        isLoading={isLoading}
                        isDisabled={!reelData.video || uploadStatus !== "uploaded"}
                    >
                        Share
                    </Button>
                </div>

                <ModalBody className="flex h-[70vh] p-4 gap-4">
                    <div className="w-1/2 flex flex-col justify-center items-center border-r">
                        {uploadStatus === "" && (
                            <div className="flex flex-col items-center justify-center h-full">
                                <FaPhotoVideo className="text-4xl text-gray-500 mb-4" />
                                <p className="text-sm text-gray-600 mb-4">Select a video file to upload</p>
                                <label htmlFor="reel-upload" className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-md">
                                    Select Video
                                </label>
                                <input
                                    type="file"
                                    id="reel-upload"
                                    accept="video/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                                <p className="text-xs text-gray-500 mt-2">MP4 or MOV, up to 50MB</p>
                            </div>
                        )}

                        {uploadStatus === "uploading" && <SpinnerCard />}

                        {uploadStatus === "uploaded" && videoPreviewUrl && (
                            <video
                                src={videoPreviewUrl}
                                width="100%"
                                height="auto"
                                controls
                                className="rounded shadow-md max-h-[400px]"
                            />
                        )}
                    </div>

                    <div className="w-1/2 px-4 flex flex-col justify-start">
                        <textarea
                            name="caption"
                            value={reelData.caption}
                            rows="5"
                            maxLength={2200}
                            placeholder="Write a caption..."
                            onChange={handleInputChange}
                            className="w-full border rounded-md p-2 text-sm mb-2 resize-none"
                        />
                        <div className="flex justify-between items-center mb-4">
                            <GrEmoji className="text-xl" />
                            <span className="text-sm text-gray-500">
                                {reelData.caption.length}/2200
                            </span>
                        </div>

                        <input
                            type="text"
                            name="location"
                            value={reelData.location}
                            placeholder="Add Location"
                            onChange={handleInputChange}
                            className="w-full border rounded-md p-2 text-sm mb-2"
                        />
                        <div className="flex items-center text-sm text-gray-600">
                            <GoLocation className="mr-2" />
                            Add location to your reel
                        </div>
                    </div>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default CreateReel;