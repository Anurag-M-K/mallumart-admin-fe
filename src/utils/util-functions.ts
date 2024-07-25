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

export function convertTo12HourFormat(time24: any) {
    if (!time24) {
        return;
    }
    const [hours, minutes] = time24.split(':').map(Number);

    // Determine AM or PM suffix
    const period = hours >= 12 ? 'PM' : 'AM';

    // Convert hours to 12-hour format
    const adjustedHours = hours % 12 || 12;

    // Format minutes to always show two digits
    const formattedMinutes = minutes.toString().padStart(2, '0');

    // Format the time string
    return `${adjustedHours}:${formattedMinutes} ${period}`;
}

export function formatDate(dateString: any) {
    const date = new Date(dateString.date);

    // Get day, month, and year from the date object
    const day = date.getDate();
    const month = date.getMonth() + 1; // getMonth() returns 0-based month
    const year = date.getFullYear();

    // Format day and month to have leading zeros if necessary
    const formattedDay = day < 10 ? `0${day}` : day;
    const formattedMonth = month < 10 ? `0${month}` : month;

    // Construct the formatted date string
    const formattedDate = `${formattedDay}-${formattedMonth}-${year}`;
    return formattedDate;
}
