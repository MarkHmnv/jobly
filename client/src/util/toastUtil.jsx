import {toast} from 'react-toastify';

export const toastError = (error) => {
    let messages = [];
    if (error.data) {
        extractMessages(error.data, messages);
    } else {
        messages.push(error.message || "An unknown error occurred");
    }

    messages.forEach(msg => toast.error(msg));
};

const extractMessages = (obj, messages = []) => {
    if (typeof obj === 'string') {
        messages.push(obj);
    } else if (Array.isArray(obj)) {
        obj.forEach(item => extractMessages(item, messages));
    } else if (typeof obj === 'object' && obj !== null) {
        Object.values(obj).forEach(value => extractMessages(value, messages));
    }
};