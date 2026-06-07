import { api } from '../provider/api';

export const KPI_EMPTY_MESSAGE = 'Dados insuficientes para calcular este indicador.';
export const KPI_ERROR_MESSAGE = 'Não foi possível carregar esta KPI.';

async function fetchKpi(path) {
    try {
        const response = await api.get(path);
        return { data: response.data, error: null, empty: false };
    } catch (error) {
        const status = error?.status || error?.response?.status;
        return {
            data: null,
            error: status === 404 ? KPI_EMPTY_MESSAGE : KPI_ERROR_MESSAGE,
            empty: status === 404,
        };
    }
}

export const kpiService = {
    async getProficienciaMediaGeral() {
        return fetchKpi('/v1/kpi/proficiencia-media-geral');
    },

    async getAreaQueMaisPrecisaReforco() {
        return fetchKpi('/v1/kpi/area-que-mais-precisa-reforco');
    },

    async getDashboardKpis() {
        const [proficienciaMediaGeral, areaQueMaisPrecisaReforco] = await Promise.all([
            this.getProficienciaMediaGeral(),
            this.getAreaQueMaisPrecisaReforco(),
        ]);

        return { proficienciaMediaGeral, areaQueMaisPrecisaReforco };
    },
};
