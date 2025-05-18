import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { debounce } from "../../Config/Debounce";
import { searchUserAction } from "../../Redux/User/Action";
import SearchUserCard from "./SearchUserCard";
import "./SearchComponent.css";

const SearchComponent = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const token = localStorage.getItem("token");
  const { user } = useSelector(store => store);
  const dispatch = useDispatch();

  const handleSearchUser = (query) => {
    const data = {
      jwt: token,
      query,
    };
    dispatch(searchUserAction(data));
  };

  const debouncedHandleSearchUser = debounce(handleSearchUser, 500);

  const handleChange = (e) => {
    setSearchQuery(e.target.value);
    debouncedHandleSearchUser(e.target.value);
  };

  return (
    <div className="header-search-container">
      <div className="search-input-container">
        <input
          onChange={handleChange}
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
          className="search-input"
          type="text"
          placeholder="Search users..."
          value={searchQuery}
        />
        <span className="search-icon">🔍</span>
      </div>

      {isSearchFocused && searchQuery && (
        <div className="search-results-dropdown">
          {!user?.searchResult?.isError ? (
            user?.searchResult?.map((item) => (
              <SearchUserCard 
                key={item.id} 
                username={item.username} 
                image={item?.image}
              />
            ))
          ) : (
            <div className="no-results">No users found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchComponent;