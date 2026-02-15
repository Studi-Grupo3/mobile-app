import axios from 'axios';

export async function buscarEnderecoPorCep(cep) {
    try {
        const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);

        if (response.data.erro) {
            throw new Error('CEP não encontrado.');
        }

        return response.data;
    } catch (error) {
        console.error('Erro ao buscar CEP:', error.message);
        throw error;
    }
}
