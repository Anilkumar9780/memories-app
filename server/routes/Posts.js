import express from 'express';

//component controllers
import {
    getPostsBySearch,
    getPosts,
    createPost,
    updatePost,
    likePost,
    deletePost,
    getPostDetail
} from '../controllers/Posts.js';

// middleware component
import auth from '../middleware/Auth.js';

const router = express.Router();

router.get('/', getPosts);
router.get('/:id', getPostDetail);
router.get('/search', getPostsBySearch);
router.post('/', auth, createPost);
router.patch('/:id', auth, updatePost);
router.delete('/:id', auth, deletePost);
router.patch('/:id/likePost', auth, likePost);

export default router;