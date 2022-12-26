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

  POST_COMMENT
} from '../constants/actionTypes';

// api 
import * as api from '../api/Index.js';

/**
 *  get the all user post 
 */
export const getPosts = (page) => async (dispatch) => {
  try {
    dispatch({ type: START_LOADING });
    const { data } = await api.fetchPosts(page);
    dispatch({ type: FETCH_ALL, payload: data });
    dispatch({ type: END_LOADING });
  } catch (error) {
    console.log(error.message);
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
  } catch (error) {
    console.log(error.message);
  }
};


/**
 * search posts
 * @param {object} searchQuery 
 * @returns node 
 */
export const getPostBySearch = (searchQuery) => async (dispatch) => {
  console.log(searchQuery);
  try {
    dispatch({ type: START_LOADING });
    const { data: { data } } = await api.fetchPostsBySearch(searchQuery);
    console.log(data)
    dispatch({ type: FETCH_BY_SEARCH, payload: data });
    dispatch({ type: END_LOADING });
  } catch (error) {
    console.log(error.message);
  }
};


/**
 * create post 
 * @param {object} post 
 */
export const createPost = (post, navigate) => async (dispatch) => {
  try {
    dispatch({ type: START_LOADING })
    const { data } = await api.createPost(post);
    navigate(`/posts/${data._id}`)
    dispatch({ type: CREATE, payload: data });
    dispatch({ type: END_LOADING });
  } catch (error) {
    console.log(error.message);
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
  } catch (error) {
    console.log(error.message);
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
  } catch (error) {
    console.log(error.message);
  }
};

/**
 * Delete post 
 * @param {string} id 
 */
export const deletePost = (id) => async (dispatch) => {
  try {
    await api.deletePost(id);
    dispatch({ type: DELETE, payload: id });
  } catch (error) {
    console.log(error.message);
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
    return data.comments;
  } catch (error) {
    console.log(error.message);
  }
}
