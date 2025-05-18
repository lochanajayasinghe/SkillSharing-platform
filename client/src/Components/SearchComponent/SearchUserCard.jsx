import React from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchUserCard.css';

const SearchUserCard = ({ username, image }) => {
  const navigate = useNavigate();
  
  return (
    <div 
      className="search-user-card"
      onClick={() => navigate(`/${username}`)}
    >
      <div className="user-avatar">
        <img
          src={image || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"}
          alt={username}
        />
      </div>
      <div className="user-info">
        <span className="username">{username}</span>
        <span className="user-handle">@{username}</span>
      </div>
    </div>
  );
};

export default SearchUserCard;