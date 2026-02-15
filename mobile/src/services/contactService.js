import { api } from './provider/api';

export const contactService = {
    send: async (data) => {
        const errors = {};
        if (!data.nome || !data.nome.trim()) {
            errors.nome = 'Nome é obrigatório';
        }
        if (!data.email || !data.email.trim()) {
            errors.email = 'E-mail é obrigatório';
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                errors.email = 'E-mail inválido';
            }
        }
        if (!data.mensagem || !data.mensagem.trim()) {
            errors.mensagem = 'Mensagem é obrigatória';
        }

        if (data.celular) {
            const digits = data.celular.replace(/\D/g, '');
            if (digits.length < 10) {
                errors.celular = 'Telefone incompleto';
            }
        }
        if (Object.keys(errors).length > 0) {
            const error = new Error('Validação local falhou');
            error.validation = errors;
            throw error;
        }

        const payload = {
            nome: data.nome.trim(),
            email: data.email.trim(),
            mensagem: data.mensagem.trim(),
        };
        if (data.celular) {
            payload.celular = data.celular;
        }

        try {
            const response = await api.post('/contact', payload, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        } catch (err) {
            if (err.response && err.response.status === 400 && err.response.data) {
                const backendErrors = err.response.data;
                const error = new Error('Validação do servidor falhou');
                error.validation = backendErrors;
                throw error;
            }
            throw err;
        }
    },
};
