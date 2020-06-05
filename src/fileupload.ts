import { v2 as cloudinary } from 'cloudinary';
import { getConfig } from './config';

const {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
} = getConfig();

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

export async function upload(file: string) {
  return cloudinary.uploader.upload(file);
}
