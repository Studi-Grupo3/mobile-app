import { api } from '../provider/api';

export const teacherManagerService = {

    async list() {
        const resp = await api.get('/teachers', { params: { size: 100 } });
        return resp.data;
    },

    async create(payload) {
        const resp = await api.post('/teachers', payload);
        return resp.data;
    },

    async update(id, payload) {
        const resp = await api.put(`/teachers/${id}`, payload);
        return resp.data;
    },

    async softDelete(id) {
        const response = await api.delete(`/teachers/${id}`);
        return response.data;
    }
};
