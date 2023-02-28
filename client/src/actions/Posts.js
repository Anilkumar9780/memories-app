// action component
import {
  FETCH_ALL,
  CREATE,
  UPDATE,
  DELETE,
  LIKE,
  FETCH_BY_SEARCH,
  START_LOADING,
  END_LOADING,
  FETCH_POST_DETAIL,
  USER_PROFILE,
  POST_COMMENT,
  USER_PROFILE_POST,
  USER_FOLLOW,
  SERACH_USER,
  USER_UNFOLLOW,
} from '../constants/actionTypes';

// packages
import { toast } from 'react-toastify';

// api 
import * as api from '../api/Index.js';

/**
 * get the all user post 
 * @param {number} page 
 * @returns node
 */
export const getPosts = (page) => async (dispatch) => {
  try {
    dispatch({ type: START_LOADING });
    const { data } = await api.fetchPosts(page);
    dispatch({ type: FETCH_ALL, payload: data });
    dispatch({ type: END_LOADING });
  } catch (err) {
    toast.error(err?.response?.data?.message, {
      position: "bottom-right"
    });
  }
};

/**
 * get single post detail
 * @param {string} id 
 * @returns node
 */
export const getPostDetail = (id) => async (dispatch) => {
  try {
    dispatch({ type: START_LOADING });
    const { data } = await api.fetchPostDetail(id);
    dispatch({ type: FETCH_POST_DETAIL, payload: data });
    dispatch({ type: END_LOADING });
  } catch (err) {
    toast.error(err?.response?.data?.message, {
      position: "bottom-right"
    });
  }
};


/**
 * search posts
 * @param {object} searchQuery 
 * @returns node 
 */
export const getPostBySearch = (searchQuery) => async (dispatch) => {
  try {
    dispatch({ type: START_LOADING });
    const { data: { data } } = await api.fetchPostsBySearch(searchQuery);
    dispatch({ type: FETCH_BY_SEARCH, payload: data });
    dispatch({ type: END_LOADING });
  } catch (err) {
    toast.error(err?.response?.data?.message, {
      position: "bottom-right"
    });
  }
};


/**
 * create post 
 * @param {object} post 
 */
export const createPost = (formData, navigate) => async (dispatch) => {
  // console.log(Object.entries(formData))
  try {
    dispatch({ type: START_LOADING });
    const { data } = await api.createPost(formData);
    navigate(`/posts/${data?._id}`)
    dispatch({ type: CREATE, payload: data });
    toast.success(data.message, {
      position: "bottom-right"
    });
    dispatch({ type: END_LOADING });
  } catch (err) {
    toast.error(err?.response?.data?.message, {
      position: "bottom-right"
    });
  }
};

/**
 *  update post 
 * @param {string} id 
 * @param {object} post 
 */
export const updatePost = (id, post) => async (dispatch) => {
  try {
    const { data } = await api.updatePost(id, post);
    dispatch({ type: UPDATE, payload: data });
    toast.success(data.message, {
      position: "bottom-right"
    });
  } catch (err) {
    toast.error(err?.response?.data?.message, {
      position: "bottom-right"
    });
  }
};

/**
 * user like post 
 * @param {string} id 
 */
export const likePost = (id) => async (dispatch) => {
  try {
    const { data } = await api.likePost(id);
    dispatch({ type: LIKE, payload: data });
    toast.success(data.message, {
      position: "bottom-right"
    });
  } catch (err) {
    toast.error(err?.response?.data?.message, {
      position: "bottom-right"
    });
  }
};

/**
 * Delete post 
 * @param {string} id 
 */
export const deletePost = (id) => async (dispatch) => {
  try {
    const { data } = await api.deletePost(id);
    dispatch({ type: DELETE, payload: id });
    toast.success(data.message, {
      position: "bottom-right"
    });
  } catch (err) {
    toast.error(err?.response?.data?.message, {
      position: "bottom-right"
    });
  }
};

/**
 *  comment post action
 * @param {string} value 
 * @param {string} id 
 * @returns node
 */
export const commentPost = (value, id) => async (dispatch) => {
  try {
    const { data } = await api.comment(value, id);
    dispatch({ type: POST_COMMENT, payload: data });
    return data?.comments;
  } catch (err) {
    toast.error(err?.response?.data?.message, {
      position: "bottom-right"
    });
  }
}

/**
 *get user profile 
 * @param {string} id 
 * @returns 
 */
export const userProfile = (id) => async (dispatch) => {
  try {
    dispatch({ type: START_LOADING });
    const { data } = await api.fetchUserProfile(id);
    dispatch({ type: USER_PROFILE, payload: data.user });
    dispatch({ type: USER_PROFILE_POST, payload: data.post });
    dispatch({ type: END_LOADING });
  } catch (err) {
    toast.error(err?.response?.data?.message, {
      position: "bottom-right"
    });
  }
};

/**
 * search user profile
 * @param {string} searchUserProfile 
 * @returns 
 */
export const searchUsers = (searchUserProfile) => async (dispatch) => {
  try {
    dispatch({ type: START_LOADING });
    const { data } = await api.searchUser(searchUserProfile);
    dispatch({ type: SERACH_USER, payload: data?.user });
    dispatch({ type: END_LOADING });
  } catch (err) {
    toast.error(err?.response?.data?.message, {
      position: "bottom-right"
    });
  }
};

/**
 * follow user by user id
 * @param {string} userId 
 */
export const follow = (followId, user, setFollowing) => async (dispatch) => {
  try {
    const { data } = await api.followUser(followId, user);
    setFollowing(data.users.following)
    dispatch({ type: USER_FOLLOW, data });
    toast.success(data.message, {
      position: "bottom-right"
    });
  } catch (err) {
    toast.error(err?.response?.data?.message, {
      position: "bottom-right"
    });
  }
};

/**
 * unfollow user by user id
 * @param {string} unFollowId 
 * @param {object} user 
 */
export const unFollow = (unFollowId, user, setFollowing) => async (dispatch) => {
  try {
    const { data } = await api.unFollowUser(unFollowId, user);
    setFollowing(data.userLogged.following)
    dispatch({ type: USER_UNFOLLOW, data });
    toast.success(data.message, {
      position: "bottom-right"
    });
  } catch (err) {
    toast.error(err?.response?.data?.message, {
      position: "bottom-right"
    });
  }
};

