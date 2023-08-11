import express from 'express';
import { getAllProductController, getProductCategoriesController, getProductController } from '../../controllers/user/product.controller.js';
import { param } from 'express-validator';

const router = express.Router();

router.get(`/all-product` , getAllProductController);
router.get(`/detail/:id` , param('id').notEmpty() , getProductController);
router.get(`/all-category` , getProductCategoriesController);

export default router;