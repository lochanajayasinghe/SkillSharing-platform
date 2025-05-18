import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import HomeRight from "../../Components/HomeRight/HomeRight";
import PostCard from "../../Components/Post/PostCard/PostCard";
import StoryCircle from "../../Components/Story/StoryCircle/StoryCircle";
import { hasStory, suggetions, timeDifference } from "../../Config/Logic";
import { findUserPost } from "../../Redux/Post/Action";
import { findByUserIdsAction, getUserProfileAction } from "../../Redux/User/Action";
import "./HomePage.css";

const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [userIds, setUserIds] = useState([]);
  const [suggestedUser, setSuggestedUser] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const token = localStorage.getItem("token");
  const reqUser = useSelector(store => store.user.reqUser);
  const { user, post } = useSelector((store) => store);
  const storyUsers = hasStory(user.userByIds);

  // Fetch user profile on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(getUserProfileAction(token));
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      }
    };
    
    fetchData();
  }, [token, dispatch]);

  // Set user IDs and suggestions when reqUser changes
  useEffect(() => {
    if (reqUser) {
      const newIds = reqUser?.following?.map((user) => user.id) || [];
      setUserIds([reqUser?.id, ...newIds]);
      setSuggestedUser(suggetions(reqUser));
    }
  }, [reqUser]);

  // Fetch posts and user data when userIds change
  useEffect(() => {
    const fetchPosts = async () => {
      if (userIds.length > 0) {
        const data = {
          userIds: [userIds].join(","),
          jwt: token
        };
        
        try {
          await dispatch(findUserPost(data));
          await dispatch(findByUserIdsAction(data));
        } catch (error) {
          console.error("Failed to fetch posts:", error);
        }
      }
    };
    
    fetchPosts();
  }, [userIds, post.createdPost, post.deletedPost, post.updatedPost, dispatch, token]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div
      className="homepage-container min-h-screen"
      style={{
        backgroundImage: 'url("https://t3.ftcdn.net/jpg/02/98/77/98/360_F_298779829_ibEOUDbVsakvtZVH1vG0Mk0bt1FAoCNM.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="max-w-6xl mx-auto pt-8 px-4">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Main Content Area (Posts) */}
          <div className="flex-1 max-w-2xl mx-auto">
            {/* Stories Section */}
            {storyUsers.length > 0 && (
              <div className="bg-white p-4 rounded-lg shadow-sm mb-6 border border-gray-100 overflow-x-auto">
                <div className="flex space-x-4 pb-2">
                  {storyUsers.map((item) => (
                    <StoryCircle
                      key={item.id}
                      image={item?.image || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"}
                      username={item?.username}
                      userId={item?.id}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Posts Section */}
            <div className="space-y-6">
              {post.userPost?.length > 0 ? (
                post.userPost.map((item) => (
                  <PostCard
                    key={item.id}
                    userProfileImage={
                      item.user.userImage || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                    }
                    username={item.user.username}
                    location={item.location}
                    postImage={item.image}
                    createdAt={timeDifference(item.createdAt)}
                    postId={item.id}
                    post={item}
                  />
                ))
              ) : (
                <div className="bg-white p-8 rounded-lg shadow-sm text-center">
                  <h3 className="text-lg font-medium text-gray-700">No posts yet</h3>
                  <p className="text-gray-500 mt-2">Follow people to see their posts here</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-20">
              <HomeRight suggestedUser={suggestedUser} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
