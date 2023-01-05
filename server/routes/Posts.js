import express from 'express';
import multer from 'multer';

//component controllers
import {
    getPostsBySearch,
    getPosts,
    updatePost,
    likePost,
    deletePost,
    getPostDetail,
    commentPost,
    createPost,
} from '../controllers/Posts.js';

// middleware component
import auth from '../middleware/Auth.js';

// folder name
const DIR = './uploads/';

const router = express.Router();

// storage 
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, fileName)
    }
});

// folder multer
const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg" || file.mimetype == "image/jfif") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    }
});

router.get('/search', getPostsBySearch);
router.get('/', getPosts);
router.get('/:id', getPostDetail);
router.patch('/:id', auth, updatePost);
router.delete('/:id', auth, deletePost);
router.patch('/:id/likePost', auth, likePost);
router.post('/:id/commentPost', auth, commentPost);
router.post('/', upload.array('file', 6), auth, createPost);

export default router;
