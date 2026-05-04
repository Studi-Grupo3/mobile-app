import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from './provider/api';

export const studentService = {
    create: (data) => api.post('/students', data).then(res => res.data),
    getById: (id) => api.get(`/students/${id}`).then(res => res.data),
    update: (id, data) => api.put(`/students/${Number(id)}`, data).then(res => res.data),
    remove: (id) => api.delete(`/students/${id}`).then(res => res.data),
    list: () => api.get('/students').then(res => res.data),

    uploadFoto: (id, fileUri, fileName) => {
        const formData = new FormData();
        formData.append('file', {
            uri: fileUri,
            name: fileName || 'photo.jpg',
            type: 'image/jpeg',
        });
        return api.post('/profile-photos', formData, {
            params: { id: Number(id), role: 'student' },
            headers: { 'Content-Type': 'multipart/form-data' }
        }).then(res => res.data);
    },

    getProfilePhoto: async (id) => {
        const token = await AsyncStorage.getItem('authToken');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        return api.get('/profile-photos', {
            params: { id: Number(id), role: 'student' },
            headers,
            responseType: 'arraybuffer'
        }).then(res => res.data);
    }
};
