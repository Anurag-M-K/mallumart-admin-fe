import Compressor from 'compressorjs';
import { imageAllowedTypes, maxImageSize } from '../constants/images';
import { addProductImages } from '../api/product.api';

export const handleMultipleImage = async (images: any, editDefaultValues: any) => {
    const formData = new FormData();
    const imageUrlsAndNames: { url?: string; file?: string }[] = [];

    for (const image of images) {
        if (editDefaultValues && editDefaultValues.images.includes(image)) {
            imageUrlsAndNames.push({ url: image }); // Keep the existing URL
            continue;
        }

        const { file } = image;
        const compressedFile = await validateAndCompressImage(file); // Assuming this returns a File or Blob
        formData.append('files', compressedFile, file.name);

        imageUrlsAndNames.push({ file: file.name });
    }

    formData.append('imageUrlsAndNames', JSON.stringify(imageUrlsAndNames));

    const imageUploadResponse = await addProductImages(formData);
    const urls = imageUploadResponse?.data?.urls;

    return urls;
};

export async function compressImage(dataURL: File, quality?: number, maxWidth?: number, maxHeight?: number): Promise<File | Blob> {
    return new Promise((resolve, reject) => {
        new Compressor(dataURL, {
            quality,
            maxWidth,
            maxHeight,
            success: function (result) {
                return resolve(result);
            },
            error: function (err) {
                reject(err);
            },
        });
    });
}

export function isValidImage(file: any) {
    if (file.size > maxImageSize) return false;
    if (!imageAllowedTypes.includes(file.type)) return false;

    return true;
}

const validateAndCompressImage = async (file: File) => {
    // Validate image size and type
    const isValid = isValidImage(file);
    if (!isValid) throw new Error('Image not matching with criteria');

    // Compress image
    const compressedFile = await compressImage(file, 0.6, 1920, 1080);
    return compressedFile;
};
