import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth.js';
import { createProduct, deleteProduct, listProducts, updateProduct } from '../controllers/product.controller.js';

export const productRouter = Router();

productRouter.use(authenticate);
productRouter.get('/', listProducts);
productRouter.post('/', authorize(['ADMIN', 'OWNER']), createProduct);
productRouter.put('/:productId', authorize(['ADMIN', 'OWNER']), updateProduct);
productRouter.delete('/:productId', authorize(['OWNER']), deleteProduct);
