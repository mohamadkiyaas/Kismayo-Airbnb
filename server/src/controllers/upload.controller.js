import { isCloudinaryConfigured, uploadBufferToCloudinary } from '../config/cloudinary.js';
import { ApiError } from '../utils/ApiError.js';

export const uploadImages = async (req, res) => {
  if (!req.files || req.files.length === 0) throw ApiError.badRequest('No files uploaded');

  if (!isCloudinaryConfigured()) {
    // Fallback: return base64 data URLs so the app still works in local dev without Cloudinary.
    const data = req.files.map((f) => ({
      url: `data:${f.mimetype};base64,${f.buffer.toString('base64')}`,
      publicId: '',
    }));
    return res.json({ success: true, data, source: 'local-base64' });
  }

  const uploads = await Promise.all(
    req.files.map((f) => uploadBufferToCloudinary(f.buffer, 'kismayo-airbnb/listings'))
  );
  const data = uploads.map((u) => ({ url: u.secure_url, publicId: u.public_id }));
  res.json({ success: true, data, source: 'cloudinary' });
};
