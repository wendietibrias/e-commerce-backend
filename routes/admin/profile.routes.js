import express from 'express';
import AuthorizeAdminMiddleware from "../../middlewares/authorizeAdmin.middleware.js";
import { body } from 'express-validator';
import { getAdminProfileController, updateProfileController } from '../../controllers/admin/profile.controller.js';

const router = express.Router();

router.get(`/get-profile` ,AuthorizeAdminMiddleware,getAdminProfileController);
router.put(`/update`,AuthorizeAdminMiddleware,body('name').notEmpty(),body('email').notEmpty().isEmail(),updateProfileController);

export default router;