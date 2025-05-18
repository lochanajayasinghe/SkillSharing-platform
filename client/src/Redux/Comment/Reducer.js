import {
  CREATE_COMMENT,
  DELETE_COMMENT,
  EDIT_COMMENT,
  GET_ALL_COMMENT,
  GET_POST_COMMENT,
  LIKE_COMMENT,
} from "./ActionType";

// ✅ Initial state of the comment reducer
const initialState = {
  createdComment: null,   // Holds the most recently created comment
  postComments: null,     // Holds comments of a specific post
  likedComment: null,     // Holds the liked comment data
  updatedComment: null,   // Holds the updated comment data
  deletedComment: null,   // Holds the deleted comment response
  comments: null,         // Holds all comments of a post (used in GET_ALL_COMMENT)
};

// ✅ Comment reducer function
export const commentReducer = (store = initialState, { type, payload }) => {
  switch (type) {
    case CREATE_COMMENT:
      // Handle creating a comment
      return { ...store, createdComment: payload };

    case GET_POST_COMMENT:
      // Handle fetching comments for a specific post (used in post detail page)
      return { ...store, postComments: payload };

    case LIKE_COMMENT:
      // Handle liking a comment
      return { ...store, likedComment: payload };

    case EDIT_COMMENT:
      // Handle editing a comment
      return { ...store, updatedComment: payload };

    case DELETE_COMMENT:
      // Handle deleting a comment
      return { ...store, deletedComment: payload };

    case GET_ALL_COMMENT:
      // Handle fetching all comments of a post (usually when listing)
      return { ...store, comments: payload };

    default:
      // Return current state for any unknown action
      return store;
  }
};
