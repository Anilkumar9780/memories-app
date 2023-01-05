import express from 'express';

//component controllers
import {
    changePassword,
    followUser,
    resetPassword,
    searchUser,
    signin,
    signup,
    unfollowUser,
    userProfile,
} from '../controllers/User.js';
import auth from '../middleware/Auth.js'

const router = express.Router();

router.post('/signin', signin);
router.post('/signup', signup);
router.get('/user-profile/:id', auth, userProfile);
router.get('/search-users', auth, searchUser)
router.patch('/follow', auth, followUser);
router.patch("/unfollow", auth, unfollowUser);
router.post('/reset-password', resetPassword)
router.post('/new-password', changePassword)

export default router;