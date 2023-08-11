import express from "express";
import { getAllCategoryController,createCategoryController, deleteCategoryController, updateCategoryController } from "../../controllers/admin/category.controller.js";
import AuthorizeAdminMiddleware from "../../middlewares/authorizeAdmin.middleware.js";
import { body, param } from "express-validator";

const router = express.Router();

router.get(`/all-category`,AuthorizeAdminMiddleware , getAllCategoryController);
router.post(`/create`,AuthorizeAdminMiddleware , body('title').notEmpty(),body('slug').notEmpty() , createCategoryController);
router.delete(`/delete/:id` ,AuthorizeAdminMiddleware,param('id').notEmpty(),deleteCategoryController);
router.put(`/update/:id`,AuthorizeAdminMiddleware,param('id').notEmpty(),body('title').notEmpty(),body('slug').notEmpty(),updateCategoryController);

export default router;