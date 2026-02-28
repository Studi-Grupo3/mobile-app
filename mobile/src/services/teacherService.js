import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from './provider/api';

async function getTeacherIdFromSession() {
    const idStr = await AsyncStorage.getItem('userId');
    if (!idStr) return null;
    const id = Number(idStr);
    if (isNaN(id)) return null;
    return id;
}

async function authHeader() {
    const token = await AsyncStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
}

async function buildTeacherUrl(pathSuffix) {
    const teacherId = await getTeacherIdFromSession();
    if (teacherId == null) {
        throw new Error('Usuário não autenticado ou teacherId indisponível');
    }
    return `/teachers/${teacherId}/${pathSuffix}`;
}

export const teacherService = {
    create: async (data) => {
        const headers = await authHeader();
        return api.post('/teachers', data, { headers }).then(res => res.data);
    },

    getById: async (id) => {
        const headers = await authHeader();
        return api.get(`/teachers/${id}`, { headers }).then(res => res.data);
    },

    update: async (id, data) => {
        const headers = await authHeader();
        return api.put(`/teachers/${id}`, data, { headers }).then(res => res.data);
    },

    remove: async (id) => {
        const headers = await authHeader();
        return api.delete(`/teachers/${id}`, { headers }).then(res => res.data);
    },

    list: async () => {
        const headers = await authHeader();
        return api.get('/teachers', { headers }).then(res => res.data);
    },

    listPublic: async (page = 0, size = 3) => {
        const token = await AsyncStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const res = await api.get('/teachers', {
            params: { page, size },
            headers
        });

        return res.data;
    },

    getStats: async () => {
        const url = await buildTeacherUrl('stats');
        const headers = await authHeader();
        return api.get(url, { headers }).then(res => res.data);
    },

    getDashboard: async () => {
        const url = await buildTeacherUrl('dashboard');
        const headers = await authHeader();
        return api.get(url, { headers }).then(res => res.data);
    },

    getProximasAulas: async () => {
        const url = await buildTeacherUrl('lessons/upcoming');
        const headers = await authHeader();
        return api.get(url, { headers }).then(res => res.data);
    },

    getPendingLessons: async () => {
        try {
            const [upcoming, history] = await Promise.all([
                teacherService.getProximasAulas(),
                teacherService.getLessonsHistory()
            ]);

            const allLessons = [...(history || []), ...(upcoming || [])];
            const uniqueLessons = Array.from(new Map(allLessons.map(item => [item.id, item])).values());
            const pending = uniqueLessons.filter(l => l.status === 'SCHEDULED');

            return pending.sort((a, b) => {
                const dateA = new Date(`${a.date}T${a.time}`);
                const dateB = new Date(`${b.date}T${b.time}`);
                return dateA - dateB;
            });
        } catch (error) {
            console.error('Erro ao buscar aulas pendentes:', error);
            throw error;
        }
    },

    getMateriaisAlunos: async () => {
        const url = await buildTeacherUrl('materiais-alunos');
        const headers = await authHeader();
        return api.get(url, { headers }).then(res => res.data);
    },

    getLessonsHistory: async ({ search = '' } = {}) => {
        const url = await buildTeacherUrl('lessons-history');
        const headers = await authHeader();
        const config = { headers };
        if (search && search.trim() !== '') {
            config.params = { search: search.trim() };
        }
        return api.get(url, config).then(res => res.data);
    },

    uploadFoto: (id, fileUri, fileName) => {
        const formData = new FormData();
        formData.append('file', {
            uri: fileUri,
            name: fileName || 'photo.jpg',
            type: 'image/jpeg',
        });
        return api.post('/profile-photos', formData, {
            params: { id: Number(id), role: 'teacher' },
            headers: { 'Content-Type': 'multipart/form-data' }
        }).then(res => res.data);
    },

    getProfilePhoto: async (id) => {
        const token = await AsyncStorage.getItem('authToken') || await AsyncStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        return api.get('/profile-photos', {
            params: { id: Number(id), role: 'teacher' },
            headers,
            responseType: 'arraybuffer'
        }).then(res => res.data);
    },

    getAvailability: async (teacherId) => {
        const headers = await authHeader();
        return api.get(`/teachers/${teacherId}/availability`, { headers }).then(res => res.data);
    },

    saveAvailability: async (teacherId, availability) => {
        const headers = await authHeader();
        return api.put(`/teachers/${teacherId}/availability`, availability, { headers }).then(res => res.data);
    },
};
