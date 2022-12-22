import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000' });

// auth jwt token add headers part user auth
API.interceptors.request.use((req) => {
    if (localStorage.getItem('profile')) {
        req.headers.authorization = `Bearer ${JSON.parse(localStorage.getItem('profile')).token}`;
    }
    return req;
});

// get all posts
export const fetchPosts = (page) => API.get(`/posts?page=${page}`);

// create post 
export const createPost = (newPost) => API.post('/posts', newPost);

//like post 
export const likePost = (id) => API.patch(`/posts/${id}/likePost`);

// update post 
export const updatePost = (id, updatedPost) => API.patch(`/posts'/ ${id}`, updatedPost);

// delete post 
export const deletePost = (id) => API.delete(`/posts/${id}`);

//sign in user
export const signIn = (formData) => API.post('/user/signin', formData);

// sign up user 
export const signUp = (formData) => API.post('/user/signup', formData);

// fetch Posts By Search
export const fetchPostsBySearch = (searchQuery) => API.get(`/posts/search?searchQuery=${searchQuery.search || 'none'}&tags=${searchQuery.tags}`);

// post Detail
export const fetchPostDetail = (id) => API.get(`/posts/${id}`);