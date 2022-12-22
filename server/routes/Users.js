import express from 'express';

//component controllers
import { signin, signup } from '../controllers/User.js';

const router = express.Router();

router.post('/signin', signin);
router.post('/signup', signup);

export default router;