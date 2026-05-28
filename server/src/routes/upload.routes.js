import { Router } from 'express';
import multer from 'multer';
import { asyncHandler } from '../utils/asyncHandler.js';
import { protect } from '../middleware/auth.js';
import { uploadImages } from '../controllers/upload.controller.js';
import { ApiError } from '../utils/ApiError.js';

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024, files: 12 },
  fileFilter: (_req, file, cb) => {
    if (/^image\/(jpeg|png|webp|gif|avif)$/.test(file.mimetype)) cb(null, true);
    else cb(ApiError.badRequest('Only image files are allowed'));
  },
});

router.post('/', protect, upload.array('files', 12), asyncHandler(uploadImages));

export default router;
