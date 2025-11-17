import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth.js';
import { createCategory, deleteCategory, listCategories, updateCategory } from '../controllers/category.controller.js';

export const categoryRouter = Router();

categoryRouter.use(authenticate);
categoryRouter.get('/', listCategories);
categoryRouter.post('/', authorize(['ADMIN', 'OWNER']), createCategory);
categoryRouter.put('/:categoryId', authorize(['ADMIN', 'OWNER']), updateCategory);
categoryRouter.delete('/:categoryId', authorize(['OWNER']), deleteCategory);
