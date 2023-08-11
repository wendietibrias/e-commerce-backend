import express from 'express';
import multer from "multer";
import AuthorizeAdminMiddleware from '../../middlewares/authorizeAdmin.middleware.js';
import { check,body } from 'express-validator';
import { getAllProductController,createProductController, updateProductController, deleteProductController, getProductController } from '../../controllers/admin/product.controller.js';

//multer upload file configuration
const storage = multer.diskStorage({
     filename:(req,file,cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix)
     }
});

const upload = multer({ storage });

const router = express.Router();

router.get(`/all-product`,AuthorizeAdminMiddleware , getAllProductController);
router.get(`/detail/:id` , AuthorizeAdminMiddleware , getProductController);
router.delete(`/delete/:id`,AuthorizeAdminMiddleware,deleteProductController);
router.post(
    `/create`,
    AuthorizeAdminMiddleware,
    upload.single('productImage'),
    createProductController
);
router.post(
    `/update/:id`,
    AuthorizeAdminMiddleware,
    upload.single('productImage'),
    updateProductController
)

export default router;