import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig?.extra?.API_URL || 'http://localhost:8080/api';

export const api = axios.create({
    baseURL: API_URL,
    headers: { 'Content-Type': 'application/json; charset=UTF-8' },
});

api.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('authToken');
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            const { status, data, statusText } = error.response;
            const defaultMessages = {
                400: 'Requisição inválida',
                401: 'Autenticação necessária',
                403: 'Acesso proibido',
                404: 'Recurso não encontrado',
                409: 'Conflito de dados',
                500: 'Erro interno do servidor',
            };
            const message = (data && data.message) || defaultMessages[status] || `Erro ${status}: ${statusText}`;
            const normalizedError = new Error(message);
            normalizedError.status = status;
            normalizedError.data = data;
            normalizedError.statusText = statusText;
            normalizedError.response = error.response;
            return Promise.reject(normalizedError);
        }
        if (error.code === 'ECONNABORTED') {
            const normalizedError = new Error('Requisição cancelada por timeout');
            normalizedError.code = error.code;
            return Promise.reject(normalizedError);
        }
        const normalizedError = new Error(error.message);
        normalizedError.code = error.code;
        return Promise.reject(normalizedError);
    }
);
