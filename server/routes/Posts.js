import express from 'express';

//component controllers
import {
    getPostsBySearch,
    getPosts,
    createPost,
    updatePost,
    likePost,
    deletePost,
    getPostDetail,
    commentPost
} from '../controllers/Posts.js';

// middleware component
import auth from '../middleware/Auth.js';

const router = express.Router();

router.get('/search', getPostsBySearch);
router.get('/', getPosts);
router.get('/:id', getPostDetail);
router.post('/', auth, createPost);
router.patch('/:id', auth, updatePost);
router.delete('/:id', auth, deletePost);
router.patch('/:id/likePost', auth, likePost);
router.post('/:id/commentPost', auth, commentPost);

export default router;