import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from './provider/api';

export const authService = {
    login: async (credentials) => {
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
