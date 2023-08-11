import express from "express";
import { body, query } from 'express-validator';
import { loginController,registerController, emailVerificationController, resendEmailVerificationController } from "../../controllers/user/auth.controller.js";

const router = express.Router();

router.get(`/email-verification`,query('confirmation_token').notEmpty().isJWT(),emailVerificationController)
router.post(`/resend-email-verification`,body('email').notEmpty().isEmail() , resendEmailVerificationController);
router.post(`/login`,body('email').notEmpty().isEmail(),body('password').notEmpty(), loginController);
router.post(`/register`,registerController);

export default router;