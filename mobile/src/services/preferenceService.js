import Constants from 'expo-constants';
import { api } from './provider/api';

const isMock = Constants.expoConfig?.extra?.PAYMENT_MOCK === 'true';
const createPreferenceMock = (amount, payerEmail) => {
    console.log('[MOCK] Preferência simulada:', { amount, payerEmail });
    return Promise.resolve({
        id: 'mock_preference_' + Date.now(),
        init_point: 'https://mock.mercadopago.com/checkout',
        sandbox_init_point: 'https://mock.mercadopago.com/sandbox',
    });
};
const create = (amount, payerEmail) => {
    if (isMock) return createPreferenceMock(amount, payerEmail);

    return api
        .post('/preferences', { amount, payer_email: payerEmail })
        .then((res) => res.data);
};

export const preferenceService = {
    create,
    createPreference: create,
};
