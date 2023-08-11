import { getAllBanner } from "../../controllers/user/banner.controller.js";
import express from 'express';

const router = express.Router();

router.get(`/all-banner` , getAllBanner);

export default router;