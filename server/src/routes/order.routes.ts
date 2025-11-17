import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth.js';
import { createOrder, listOrders, updatePaymentStatus } from '../controllers/order.controller.js';

export const orderRouter = Router();

orderRouter.use(authenticate);
orderRouter.get('/', listOrders);
orderRouter.post('/', authorize(['CUSTOMER', 'ADMIN', 'CASHIER', 'OWNER']), createOrder);
orderRouter.patch('/:orderId/payment', authorize(['ADMIN', 'CASHIER', 'OWNER']), updatePaymentStatus);
