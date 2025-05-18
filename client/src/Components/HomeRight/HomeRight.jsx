import React from "react";
import { BsDot } from "react-icons/bs";
import { useSelector } from "react-redux";
import SuggestionsUserCard from "./SuggestionsUserCard";
import SearchComponent from "../SearchComponent/SearchComponent"; // ✅ Fixed path

const HomeRight = ({ suggestedUser }) => {
  const { user } = useSelector((store) => store);

  return (
    <div className="p-4 max-w-sm">
      {/* User info */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <img
            className="w-12 h-12 rounded-full"
            src={
              user.reqUser?.image ||
              "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
            }
            alt="Profile"
          />
          <div className="ml-3">
            <p className="font-semibold">{user.reqUser?.username}</p>
            <p className="text-sm text-gray-500">{user.reqUser?.username}</p>
          </div>
        </div>
        <button className="text-blue-600 font-semibold text-sm">Switch</button>
      </div>

      {/* Search Component */}
      <div className="mb-4">
        <SearchComponent />
      </div>

      {/* Suggestions Header */}
      <div className="flex justify-between items-center mb-2 mt-4">
        <p className="text-sm font-semibold text-gray-600">Suggestions for you</p>
        <p className="text-xs font-semibold text-blue-600 cursor-pointer">View All</p>
      </div>

      {/* Suggestions List */}
      <div className="space-y-4">
        {suggestedUser?.length > 0 ? (
          suggestedUser.map((item, index) => (
            <SuggestionsUserCard
              key={index}
              image={
                item.userImage ||
                "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
              }
              username={item.username}
              description={"Follows you"}
            />
          ))
        ) : (
          <p className="text-sm text-gray-500">No suggestions available.</p>
        )}
      </div>

      {/* Footer Links */}
      <div className="opacity-60 text-xs flex flex-wrap items-center mt-10 space-x-1 leading-relaxed">
        {[
          "About",
          "Help",
          "Press",
          "API",
          "Jobs",
          "Privacy",
          "Terms",
          "Locations",
          "Language",
          "English",
          "Meta",
          "Verified",
        ].map((item, index) => (
          <React.Fragment key={index}>
            <span>{item}</span>
            {index < 11 && <BsDot />}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default HomeRight;
