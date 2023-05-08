import express from 'express';
import { Router } from 'express';
import { signup, signin } from '../controller/auth.js';

const router = Router();
router.post('/signup', signup);
router.post('/signin', signin);

export default router;
