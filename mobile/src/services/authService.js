import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from './provider/api';
import { tryMockLogin } from '../mocks/mockCredentials';

export const authService = {
    login: async (credentials) => {
        try {
            // Try real backend first
            const response = await api
                .post('/auths/login', credentials)
                .then(res => res.data);

            if (response.token) {
                await AsyncStorage.setItem('authToken', response.token);
                await AsyncStorage.setItem('userId', String(response.id));
                await AsyncStorage.setItem('userRole', response.role);
                await AsyncStorage.setItem('userEmail', response.email);
            }

            return response;
        } catch (backendError) {
            // If backend fails, try mock credentials as fallback
            console.log('Backend unavailable, trying mock login...');
            const mockResponse = tryMockLogin(credentials.email, credentials.password);
            if (mockResponse) {
                await AsyncStorage.setItem('authToken', mockResponse.token);
                await AsyncStorage.setItem('userId', String(mockResponse.id));
                await AsyncStorage.setItem('userRole', mockResponse.role);
                await AsyncStorage.setItem('userEmail', mockResponse.email);
                return mockResponse;
            }
            // If mock also doesn't match, throw original error
            throw backendError;
        }
    },

    logout: async () => {
        await AsyncStorage.multiRemove(['authToken', 'userId', 'userRole', 'userEmail']);
    },

    getToken: () => AsyncStorage.getItem('authToken'),
    getUserId: () => AsyncStorage.getItem('userId'),
    getUserRole: () => AsyncStorage.getItem('userRole'),
    getUserEmail: () => AsyncStorage.getItem('userEmail'),

    forgotPassword: (data) => api.post('/auths/forgot-password', data),
    verifyCode: (data) => api.post('/auths/verify-code', data),

    resetPassword: async ({ email, newPassword }) => {
        return api.patch('/students/reset-password', { email, newPassword });
    }
};
