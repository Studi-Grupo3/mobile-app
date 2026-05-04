import { api } from './provider/api';

const create = (amount, payerEmail) => {
    return api
        .post('/preferences', { amount, payer_email: payerEmail })
        .then((res) => res.data);
};

export const preferenceService = {
    create,
    createPreference: create,
};
