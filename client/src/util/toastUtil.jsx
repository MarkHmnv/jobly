import { toast } from 'react-toastify';

export const toastError = (error) => {
    let messages = [];
    if (typeof(error.data) === 'object') {
        for (const value of Object.values(error.data)) {
            if (value instanceof Array) {
                for (const message of value) {
                    messages.push(message);
                }
            } else {
                messages.push(value);
            }
        }
    } else {
        messages.push(error.data?.message || error.error);
    }

    messages.forEach(msg => toast.error(msg));
}