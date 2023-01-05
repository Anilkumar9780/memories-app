// component actiontype
import {
  FETCH_ALL,
  USER_PROFILE,
  CREATE,
  UPDATE,
  DELETE,
  LIKE,
  FETCH_BY_SEARCH,
  START_LOADING,
  END_LOADING,
  FETCH_POST_DETAIL,
  POST_COMMENT,
  USER_PROFILE_POST,
  SERACH_USER,
  RESET_PASSWORD
} from '../constants/actionTypes';

export default (state = { isLoading: true, posts: [] }, action) => {
  switch (action.type) {
    case START_LOADING:
      return { ...state, isLoading: true };

    case END_LOADING:
      return { ...state, isLoading: false };

    // fetch all data
    case FETCH_ALL:
      return {
        ...state,
        posts: action.payload.data,
        currentPage: action.payload.currentPage,
        numberOfPages: action.payload.numberOfPages
      };

    //search posts get
    case FETCH_BY_SEARCH:
      return { ...state, posts: action.payload };

    //user profile posts get
    case USER_PROFILE:
      return { ...state, user: action.payload };
    case USER_PROFILE_POST:
      return { ...state, userPosts: action.payload };

    //resetPassword
    case RESET_PASSWORD:
      return { ...state, resetPassword: action.payload.user }

    // get single post detail
    case FETCH_POST_DETAIL:
      return { ...state, post: action.payload };

    // user comment at post
    case POST_COMMENT:
      //change the post tht just received a comment
      return {
        ...state, posts: state.posts.map((post) => {
          if (post._id === action.payload._id) return action.payload;
          // return all the other post normally 
          return post;
        })
      }

    // search User
    case SERACH_USER:
      return { ...state, users: action.payload };

    //like uers by id
    case LIKE:
      return { ...state, posts: state.posts.map((post) => (post._id === action.payload._id ? action.payload : post)) };

    // create post
    case CREATE:
      return { ...state, posts: [...state.posts, action.payload] };

    // update post 
    case UPDATE:
      return { ...state, posts: state.posts.map((post) => (post._id === action.payload._id ? action.payload : post)) };

    // delete post
    case DELETE:
      return { ...state, posts: state.posts.filter((post) => post._id !== action.payload) };
    default:
      return state;
  }
};

