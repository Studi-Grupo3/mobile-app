import { api } from '../provider/api';

export const adminSettingsService = {
    get: () => api.get('/settings/admin').then(r => r.data),
    put: payload => api.put('/settings/admin', payload).then(r => r.data),
    patch: payload => api.patch('/settings/admin', payload).then(r => r.data),
    confirmPassword: payload => api.post('/settings/admin/confirm-password', payload)
        .then(r => r.data)
};
