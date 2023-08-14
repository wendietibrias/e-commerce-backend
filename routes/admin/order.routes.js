import { getAllUserOrderController } from "../../controllers/admin/order.controller.js";
import AuthorizeAdminMiddleware from "../../middlewares/authorizeAdmin.middleware.js";
import express from 'express';

const router = express.Router();

router.get(`/all-order` , AuthorizeAdminMiddleware, getAllUserOrderController);

export default router;