import Constants from 'expo-constants';
import { api } from './provider/api';

const isMock = Constants.expoConfig?.extra?.PAYMENT_MOCK === 'true' || Constants.expoConfig?.extra?.PAYMENT_MOCK === true;

const createPaymentMock = (data) => {
    console.log('[MOCK] Pagamento simulado:', data);
    return Promise.resolve({
        id: 'mock_payment_' + Date.now(),
        status: 'approved',
        status_detail: 'accredited',
        payment_method_id: data.paymentMethodId || 'credit_card',
        transaction_amount: data.amount || 0,
        date_approved: new Date().toISOString(),
    });
};

const create = (data) => {
    const { paymentMethodId, token } = data;
    const isBoleto = paymentMethodId === 'bolbradesco';
    const isPix = paymentMethodId === 'pix';
    if (!isBoleto && !isPix && !token) {
        throw new Error('❌ Erro: Token do cartão ausente!');
    }

    console.log('📤 Enviando pagamento ao backend...', data);

    if (isMock) return createPaymentMock(data);

    return api.post('/payments', data).then(res => res.data);
};

export const paymentService = {
    create,
    createPayment: create,
};
