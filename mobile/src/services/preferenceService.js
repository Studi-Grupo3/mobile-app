import Constants from 'expo-constants';
import { api } from './provider/api';

const isMock = Constants.expoConfig?.extra?.PAYMENT_MOCK === 'true';

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
