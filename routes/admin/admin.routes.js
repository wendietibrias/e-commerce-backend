import express from 'express';
import AuthorizeAdminMiddleware from "../../middlewares/authorizeAdmin.middleware.js";
import { RoleGuard } from '../../guards/role.guard.js';
import { body,param } from 'express-validator';
import { createAdminController, getAllAdminController } from '../../controllers/admin/admin.controller.js';

const router = express.Router();

router.get(`/all-admin`,AuthorizeAdminMiddleware,RoleGuard,getAllAdminController);
router.post(`/create`,AuthorizeAdminMiddleware,RoleGuard,body('email').notEmpty(),body('name').notEmpty(),body('password').notEmpty(),createAdminController);
router.delete(`/delete/:id`, param('id').notEmpty());

export default router;