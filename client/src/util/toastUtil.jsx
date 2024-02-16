import { toast } from 'react-toastify';

export const toastError = (error) => {
    let messages = [];
    if (error.data && error.data.user && error.data.user.email) {
        error.data.user.email.forEach(message => {
            messages.push(message);
        });
    } else {
        messages.push(error.data?.message || error.error);
    }

    messages.forEach(msg => toast.error(msg));
}
