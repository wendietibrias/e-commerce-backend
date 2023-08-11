import express from 'express';
import AuthorizeUser from "../../middlewares/authorize.middleware.js";
import { addCartController } from '../../controllers/user/cart.controller.js';

const router = express.Router();

router.post(`/add-to-cart` , AuthorizeUser,addCartController);

export default router;