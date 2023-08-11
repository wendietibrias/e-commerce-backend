import AuthorizeAdminMiddleware from "../../middlewares/authorizeAdmin.middleware.js";
import fs from "fs";
import multer from 'multer';
import express from 'express';
import { body,param } from 'express-validator';
import { createBannerController, deleteBannerController, getAllBannerController, updateBannerController } from '../../controllers/admin/banner.controller.js';

const router = express.Router();

const storage = multer.diskStorage({
    destination:(req,file,cb) => {
        const path = `./assets/banners/`;
        fs.mkdirSync(path, { recursive: true })
        cb(null, path);
    },
    filename:(req,file,cb) => {
        const uniqueSuffix = new Date().getTime();
        cb(null , uniqueSuffix + '-banner-' + file.originalname);
    }
});

const upload = multer({ 
    storage,
    limits: { fileSize: 10000000 },
    fileFilter: function (req, file, cb) {
      if (!file.originalname.match(/\.(jpg|JPG|webp|jpeg|JPEG|png|PNG|gif|GIF|jfif|JFIF)$/)) {
        req.fileValidationError = 'Only image files are allowed!';
        return cb(null, false);
      }
      cb(null, true);
    }
});

router.get(`/all-banner`,AuthorizeAdminMiddleware,getAllBannerController)
router.post(`/create`,AuthorizeAdminMiddleware,upload.single('bannerImage'),body('title').notEmpty(),body('subtitle').notEmpty(),body('bannerImage').notEmpty(),createBannerController)
router.delete(`/delete/:id`,param('id').notEmpty(),AuthorizeAdminMiddleware,deleteBannerController)
router.post(`/update/:id`,AuthorizeAdminMiddleware,upload.single('bannerImage') , body('title').notEmpty(),body('subtitle').notEmpty(),body('bannerImage').notEmpty(),updateBannerController)

export default router;
