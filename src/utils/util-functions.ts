
import Swal, { SweetAlertIcon } from 'sweetalert2';

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
