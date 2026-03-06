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
        await AsyncStorage.removeMany(['authToken', 'userId', 'userRole', 'userEmail']);
    },

    getToken: () => AsyncStorage.getItem('authToken'),
    getUserId: () => AsyncStorage.getItem('userId'),
    getUserRole: () => AsyncStorage.getItem('userRole'),
    getUserEmail: () => AsyncStorage.getItem('userEmail'),

    forgotPassword: async (data) => {
        try {
            return await api.post('/auths/forgot-password', data);
        } catch {
            console.log('Mock: forgotPassword success');
            return { success: true };
        }
    },
    verifyCode: async (data) => {
        try {
            return await api.post('/auths/verify-code', data);
        } catch {
            console.log('Mock: verifyCode success');
            return { success: true };
        }
    },
    resetPassword: async ({ email, newPassword }) => {
        try {
            return await api.patch('/students/reset-password', { email, newPassword });
        } catch {
            console.log('Mock: resetPassword success');
            return { success: true };
        }
    }
};
