import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from './provider/api';
import { tryMockLogin } from '../mocks/mockCredentials';

export const authService = {
    login: async (credentials) => {
        let response;
        try {
            response = await api
                .post('/auths/login', credentials)
                .then(res => res.data);
        } catch (err) {
            // Backend unavailable — try mock credentials
            const mock = tryMockLogin(credentials.email, credentials.password);
            if (!mock) throw new Error('Invalid credentials');
            response = mock;
        }

        if (response.token) {
            await AsyncStorage.setItem('authToken', response.token);
            await AsyncStorage.setItem('userId', String(response.id));
            await AsyncStorage.setItem('userRole', response.role);
            await AsyncStorage.setItem('userEmail', response.email);
            await AsyncStorage.setItem('userName', response.name || '');
        }

        return response;
    },

    logout: async () => {
        await AsyncStorage.removeMany(['authToken', 'userId', 'userRole', 'userEmail']);
    },

    getToken: () => AsyncStorage.getItem('authToken'),
    getUserId: () => AsyncStorage.getItem('userId'),
    getUserRole: () => AsyncStorage.getItem('userRole'),
    getUserEmail: () => AsyncStorage.getItem('userEmail'),

    forgotPassword: async (data) => {
        return await api.post('/auths/forgot-password', data);
    },
    verifyCode: async (data) => {
        return await api.post('/auths/verify-code', data);
    },
    resetPassword: async ({ email, newPassword }) => {
        return await api.patch('/students/reset-password', { email, newPassword });
    }
};
