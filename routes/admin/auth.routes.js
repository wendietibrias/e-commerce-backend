import express from 'express';
import { loginController, registerController } from '../../controllers/admin/auth.controller.js';
import { body } from 'express-validator';

const router = express.Router();

router.post(`/login`,body('email').notEmpty().isEmail(),body('name').notEmpty() , loginController);
router.post(`/register` , body('email').notEmpty().isEmail() , body('name').notEmpty(), body('password').notEmpty() , registerController);

export default router;