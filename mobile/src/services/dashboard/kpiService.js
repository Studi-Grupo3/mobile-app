import { api } from '../provider/api';

export const kpiService = {
    async getProficienciaMediaGeral() {
        const response = await api.get('/v1/kpi/proficiencia-media-geral');
        return response.data;
    },

    async getAreaQueMaisPrecisaReforco() {
        const response = await api.get('/v1/kpi/area-que-mais-precisa-reforco');
        return response.data;
    }
};
