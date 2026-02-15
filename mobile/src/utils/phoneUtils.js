import { Linking } from 'react-native';

export const formatPhoneNumber = (phone) => {
    if (!phone) return '';

    const cleaned = phone.toString().replace(/\D/g, '');

    const phoneNumber = cleaned.startsWith('55') && cleaned.length > 11
        ? cleaned.substring(2)
        : cleaned;

    if (phoneNumber.length < 10 || phoneNumber.length > 11) {
        return phone;
    }

    if (phoneNumber.length === 11) {
        return `(${phoneNumber.substring(0, 2)}) ${phoneNumber.substring(2, 7)}-${phoneNumber.substring(7)}`;
    }

    if (phoneNumber.length === 10) {
        return `(${phoneNumber.substring(0, 2)}) ${phoneNumber.substring(2, 6)}-${phoneNumber.substring(6)}`;
    }

    return phone;
};

export const isValidPhoneNumber = (phone) => {
    if (!phone) return false;
    const cleaned = phone.toString().replace(/\D/g, '');
    const phoneNumber = cleaned.startsWith('55') && cleaned.length > 11
        ? cleaned.substring(2)
        : cleaned;
    return phoneNumber.length === 10 || phoneNumber.length === 11;
};

export const getWhatsAppLink = (phone) => {
    if (!phone) return '';
    const cleaned = phone.toString().replace(/\D/g, '');
    const phoneNumber = cleaned.startsWith('55') ? cleaned : `55${cleaned}`;
    return `https://wa.me/${phoneNumber}`;
};

export const openWhatsApp = (phone) => {
    const link = getWhatsAppLink(phone);
    if (link) {
        Linking.openURL(link);
    }
};
