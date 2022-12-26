import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000' });

// auth jwt token add headers part user auth
API.interceptors.request.use((req) => {
    if (localStorage.getItem('profile')) {
        req.headers.authorization = `Bearer ${JSON.parse(localStorage.getItem('profile')).token}`;
    }
    return req;
});

// get all posts api
export const fetchPosts = (page) => API.get(`/posts?page=${page}`);

// create post api
export const createPost = (newPost) => API.post('/posts', newPost);

//like post api
export const likePost = (id) => API.patch(`/posts/${id}/likePost`);

// update post api
export const updatePost = (id, updatedPost) => API.patch(`/posts'/ ${id}`, updatedPost);

// delete post api
export const deletePost = (id) => API.delete(`/posts/${id}`);

//sign in user api
export const signIn = (formData) => API.post('/user/signin', formData);

// sign up user api
export const signUp = (formData) => API.post('/user/signup', formData);

// fetch Posts By Search api
export const fetchPostsBySearch = (searchQuery) => API.get(`/posts/search?searchQuery=${searchQuery.search || 'none'}&tags=${searchQuery.tags}`);

// post Detail api
export const fetchPostDetail = (id) => API.get(`/posts/${id}`);

//post comment api 
export const comment = (value, id) => API.post(`/posts/${id}/commentPost`, { value });