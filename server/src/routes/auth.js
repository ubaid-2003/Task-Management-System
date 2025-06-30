    import express from 'express';
    import { signup, login } from '../controllers/authController.js';

    const router = express.Router();

    router.post('/register', signup); // Use `/register` instead of `/signup` for API clarity
    router.post('/login', login);

    export default router;
