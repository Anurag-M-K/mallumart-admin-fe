import Compressor from 'compressorjs';
import { imageAllowedTypes, maxImageSize } from '../constants/images';
import Swal, { SweetAlertIcon } from 'sweetalert2';

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

export const showAlert = async (icon: SweetAlertIcon, title: string) => {
    const toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
    });
    toast.fire({
        icon,
        title,
        padding: '10px 20px',
    });
};