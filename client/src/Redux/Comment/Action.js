import { BASE_URL } from "../../Config/api";
import {
  CREATE_COMMENT,
  DELETE_COMMENT,
  EDIT_COMMENT,
  GET_ALL_COMMENT,
  LIKE_COMMENT,
  UNLIKE_COMMENT,
} from "./ActionType";

// ✅ Create a new comment
export const createComment = (data) => async (dispatch) => {
  try {
    console.log("Creating comment with data:", data);

    const res = await fetch(`${BASE_URL}/api/comments/create/${data.postId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + data.jwt,
      },
      body: JSON.stringify(data.data),
    });

    const resData = await res.json();
    console.log("Created comment:", resData);

    dispatch({ type: CREATE_COMMENT, payload: resData });
  } catch (error) {
    console.log("Error creating comment:", error);
  }
};

// ❗ Incorrect function (not used or redundant, should be reviewed or removed)
// Example of incorrect body in GET and wrong dispatch type
export const findPostComment = (data) => async (dispatch) => {
  try {
    const res = await fetch(`${BASE_URL}/api/comments/${data.postId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + data.jwt,
      },
      // ❌ You should not send body in GET request, remove this.
    });

    const resData = await res.json();
    dispatch({ type: "GET_USER_POST", payload: resData }); // Typo fixed: payload
  } catch (error) {
    console.log("Error fetching post comments:", error);
  }
};

// ✅ Like a comment
export const likeComment = (data) => async (dispatch) => {
  try {
    const res = await fetch(`${BASE_URL}/api/comments/like/${data.commentId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + data.jwt,
      },
      body: JSON.stringify(data.data),
    });

    const resData = await res.json();
    console.log("Liked comment:", resData);

    dispatch({ type: LIKE_COMMENT, payload: resData }); // Typo fixed: payload
  } catch (error) {
    console.log("Error liking comment:", error);
  }
};

// ✅ Unlike a comment
export const unLikeComment = (data) => async (dispatch) => {
  try {
    const res = await fetch(`${BASE_URL}/api/comments/unlike/${data.commentId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + data.jwt,
      },
      body: JSON.stringify(data.data),
    });

    const resData = await res.json();
    console.log("Unliked comment:", resData);

    dispatch({ type: UNLIKE_COMMENT, payload: resData }); // Typo fixed: payload
  } catch (error) {
    console.log("Error unliking comment:", error);
  }
};

// ✅ Edit a comment
export const editComment = (data) => async (dispatch) => {
  try {
    const res = await fetch(`${BASE_URL}/api/comments/edit`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + data.jwt,
      },
      body: JSON.stringify(data.data),
    });

    const resData = await res.json();
    console.log("Edited comment:", resData);

    dispatch({ type: EDIT_COMMENT, payload: resData });
  } catch (error) {
    console.log("Error editing comment:", error);
  }
};

// ✅ Delete a comment
export const deleteComment = (data) => async (dispatch) => {
  try {
    const res = await fetch(`${BASE_URL}/api/comments/delete/${data.commentId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + data.jwt,
      },
      // ❌ No body needed for DELETE unless your backend requires it
    });

    const resData = await res.json();
    console.log("Deleted comment:", resData);

    dispatch({ type: DELETE_COMMENT, payload: resData });
  } catch (error) {
    console.log("Error deleting comment:", error);
  }
};

// ✅ Get all comments for a post
export const getAllComments = (data) => async (dispatch) => {
  try {
    const res = await fetch(`${BASE_URL}/api/comments/post/${data.postId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + data.jwt,
      },
    });

    const resData = await res.json();
    console.log("Fetched all comments:", resData);

    dispatch({ type: GET_ALL_COMMENT, payload: resData });
  } catch (error) {
    console.log("Error fetching all comments:", error);
  }
};
