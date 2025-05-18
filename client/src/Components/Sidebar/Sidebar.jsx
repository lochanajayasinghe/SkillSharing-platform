import React, { useState, useRef } from "react";
import { useDisclosure } from "@chakra-ui/hooks";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { FiLogOut } from "react-icons/fi";
import { mainu } from "./SidebarConfig";
import CreatePostModal from "../Post/Create/CreatePostModal";
import CreateReelModal from "../Create/CreateReel";
import "./Sidebar.css";

const Sidebar = () => {
  const navigate = useNavigate();
  const { user } = useSelector((store) => store);
  const [activeTab, setActiveTab] = useState("Home");
  const [showDropdown, setShowDropdown] = useState(false);
  const excludedBoxRef = useRef(null);
  const sidebarRef = useRef(null);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isCreateReelModalOpen, setIsCreateReelModalOpen] = useState(false);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    switch (tab) {
      case "Profile":
        navigate(`/${user.reqUser?.username}`);
        break;
      case "Home":
        navigate("/");
        break;
      case "Create Post":
        onOpen();
        break;
      case "About Us":
        navigate("/about");
        break;
      case "Reels":
        navigate("/reels");
        break;
      case "Create Reels":
        setIsCreateReelModalOpen(true);
        break;
      case "Notifications":
        navigate("/notifications");
        break;
      case "Create Story":
        navigate("/create-story");
        break;
      case "Learning Plan":
        navigate("/learning_plan");
        break;
      case "Learning Progress":
        navigate("/learning-progress");
        break;
      case "Logout":
        handleLogout();
        break;
      default:
        break;
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="sidebar-container">
      <div className="sidebar-content" ref={sidebarRef}>
        <img
          className="sidebar-logo"
          src="https://scorebeyond.com/wp-content/uploads/2023/05/Skillshare-Logo.jpg"
          alt="Skillshare Logo"
        />

        <div className="sidebar-menu">
          {mainu.map((item, index) => (
            <div
              key={index}
              onClick={() => handleTabClick(item.title)}
              className={`menu-item ${activeTab === item.title ? "active" : ""}`}
            >
              {activeTab === item.title ? item.activeIcon : item.icon}
              <p className="menu-text">{item.title}</p>
            </div>
          ))}
        </div>

        <div className="sidebar-footer">
          <div
            onClick={handleLogout}
            className="logout-button"
            style={{ display: "flex", alignItems: "center", cursor: "pointer", marginTop: "1rem" }}
          >
            <FiLogOut size={20} style={{ marginRight: "8px" }} />
            <p>Logout</p>
          </div>
        </div>
      </div>

      <CreatePostModal onClose={onClose} isOpen={isOpen} />
      <CreateReelModal
        onClose={() => setIsCreateReelModalOpen(false)}
        isOpen={isCreateReelModalOpen}
      />
    </div>
  );
};

export default Sidebar;
