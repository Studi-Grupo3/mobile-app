import axios from 'axios';
import Constants from 'expo-constants';

const KPI_API_URL = Constants.expoConfig?.extra?.KPI_API_URL || 'http://localhost:8001';

const kpiApi = axios.create({
    baseURL: KPI_API_URL,
    headers: { 'Content-Type': 'application/json; charset=UTF-8' },
});

export const KPI_EMPTY_MESSAGE = 'Dados insuficientes para calcular este indicador.';
export const KPI_ERROR_MESSAGE = 'Não foi possível carregar esta KPI.';

async function fetchKpi(path) {
    try {
        const response = await kpiApi.get(path);
        return { data: response.data, error: null, empty: false };
    } catch (error) {
        const status = error?.response?.status;
        return {
            data: null,
            error: status === 404 ? KPI_EMPTY_MESSAGE : KPI_ERROR_MESSAGE,
            empty: status === 404,
        };
    }
}

export const kpiService = {
    async getProficienciaMediaGeral() {
        return fetchKpi('/api/v1/kpi/proficiencia-media-geral');
    },

    async getAreaQueMaisPrecisaReforco() {
        return fetchKpi('/api/v1/kpi/area-que-mais-precisa-reforco');
    },

    async getDashboardKpis() {
        const [proficienciaMediaGeral, areaQueMaisPrecisaReforco] = await Promise.all([
            this.getProficienciaMediaGeral(),
            this.getAreaQueMaisPrecisaReforco(),
        ]);

        return { proficienciaMediaGeral, areaQueMaisPrecisaReforco };
    },
};
