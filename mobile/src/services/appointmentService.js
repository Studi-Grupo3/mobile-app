import { api } from './provider/api';

export const appointmentService = {
    create: (data) =>
        api.post('/appointments', data).then(res => res.data),
    getById: (id) =>
        api.get(`/appointments/${id}`).then(res => res.data),
    getByStudentId: (studentId) =>
        api.get(`/appointments/student/${studentId}`).then(res => res.data),
    list: () =>
        api.get('/appointments').then(res => res.data),
    update: (id, data) =>
        api.put(`/appointments/${id}`, data).then(res => res.data),
    remove: (id) =>
        api.delete(`/appointments/${id}`).then(res => res.data),
    patch: (id, data) =>
        api.patch(`/appointments/${id}`, data).then(res => res.data),
};
