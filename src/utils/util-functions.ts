import Compressor from 'compressorjs';
import { imageAllowedTypes, maxImageSize } from '../constants/images';

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
