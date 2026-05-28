import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { protect } from '../middleware/auth.js';
import { requireRole } from '../middleware/requireRole.js';
import * as ctrl from '../controllers/admin.controller.js';

const router = Router();

router.use(protect, requireRole('admin'));

router.get('/users', asyncHandler(ctrl.listUsers));
router.delete('/users/:id', asyncHandler(ctrl.deleteUser));
router.get('/listings', asyncHandler(ctrl.listAllListings));
router.delete('/listings/:id', asyncHandler(ctrl.deleteListing));
router.get('/stats', asyncHandler(ctrl.getStats));

export default router;
