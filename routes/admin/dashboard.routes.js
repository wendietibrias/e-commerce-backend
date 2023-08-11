import express from 'express';
import AuthorizeAdminMiddleware from "../../middlewares/authorizeAdmin.middleware.js";
import { dashboardController } from '../../controllers/admin/dashboard.controller.js';

const router = express.Router();

router.get(`/statistic` ,AuthorizeAdminMiddleware, dashboardController)

export default router;