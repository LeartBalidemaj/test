import { BadRequestException, Injectable } from '@nestjs/common';
import {
  cloudinary,
  ensureCloudinaryConfigured,
} from '../config/cloudinary.config';

@Injectable()
export class CloudinaryService {
  uploadImage(file: Express.Multer.File): Promise<string> {
    ensureCloudinaryConfigured();

    if (!file?.buffer?.length) {
      return Promise.reject(
        new BadRequestException('Image file is required'),
      );
    }

    if (!file.mimetype.startsWith('image/')) {
      return Promise.reject(
        new BadRequestException('Only image files are allowed'),
      );
    }

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'ecommerce/products',
          resource_type: 'image',
        },
        (error, result) => {
          if (error) {
            reject(error);
            return;
          }
          if (!result?.secure_url) {
            reject(new Error('Cloudinary upload did not return a URL'));
            return;
          }
          resolve(result.secure_url);
        },
      );

      uploadStream.end(file.buffer);
    });
  }
}
