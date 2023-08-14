import express from 'express';
import AuthorizeUserMiddleware from '../../middlewares/authorize.middleware.js';
import { checkoutController, getUserTransactionController,getUserTransactionDetailController } from '../../controllers/user/checkout.controller.js';

const router = express.Router();

router.get(`/history/transaction`,AuthorizeUserMiddleware,getUserTransactionController);
router.get(`/history/transaction/:id`,AuthorizeUserMiddleware,getUserTransactionDetailController);
router.post(`/checkout-product`, AuthorizeUserMiddleware,checkoutController);

export default router;