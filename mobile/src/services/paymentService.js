import { api } from './provider/api';

const create = (data) => {
    const { paymentMethodId, token } = data;
    const isBoleto = paymentMethodId === 'bolbradesco';
    const isPix = paymentMethodId === 'pix';
    if (!isBoleto && !isPix && !token) {
        throw new Error('❌ Erro: Token do cartão ausente!');
    }

    return api.post('/payments', data).then(res => res.data);
};

export const paymentService = {
    create,
    createPayment: create,
};
