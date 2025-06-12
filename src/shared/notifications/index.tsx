// utils/notifications.ts
import Swal from 'sweetalert2';

export function notifySuccess(text: string) {
    return Swal.fire({ icon: 'success', text, timer: 3000, });
}

export function notifyError(text: string) {
    return Swal.fire({ icon: 'error', text, timer: 5000 });
}

export function notifyAlert(text: string) {
    return Swal.fire({ icon: 'warning', text, timer: 5000 });
}


type ToastType = 'success' | 'warning' | 'error' | 'info';

const TEXT_COLOR: Record<ToastType, string> = {
    success: 'text-green-500',
    warning: 'text-yellow-500',
    error: 'text-red-500',
    info: 'text-gray-800',
};

export function notify(
    text: string,
    type: ToastType = 'info',
) {
    const colorClass = TEXT_COLOR[type];
    return Swal.fire({
        toast: true,
        position: 'top',
        html: `<span class="${colorClass}">${text}</span>`,
        showConfirmButton: false,
        timer: 4000,
        timerProgressBar: true,
        customClass: {
            htmlContainer: TEXT_COLOR[type],
        },
    });
}
