import Constants from 'expo-constants';
import { api } from './provider/api';

const isMock = Constants.expoConfig?.extra?.PAYMENT_MOCK === 'true';

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
