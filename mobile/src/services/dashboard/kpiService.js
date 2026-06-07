import { overviewDashService } from './overviewDashService';

export const KPI_INSUFFICIENT_DATA_MESSAGE = 'Dados insuficientes para calcular este indicador.';
export const KPI_GENERIC_ERROR_MESSAGE = 'Não foi possível carregar esta KPI.';

export function getKpiErrorStatus(error) {
    return error?.response?.status ?? error?.status;
}

export function getKpiErrorMessage(error) {
    return getKpiErrorStatus(error) === 404
        ? KPI_INSUFFICIENT_DATA_MESSAGE
        : KPI_GENERIC_ERROR_MESSAGE;
}

async function withKpiErrorHandling(request) {
    try {
        return await request();
    } catch (error) {
        const status = getKpiErrorStatus(error);
        const normalizedError = new Error(getKpiErrorMessage(error));
        normalizedError.status = status;
        normalizedError.originalError = error;
        throw normalizedError;
    }
}

export const kpiService = {
    fetchOverview() {
        return withKpiErrorHandling(() => overviewDashService.fetchOverview());
    },

    getAll() {
        return withKpiErrorHandling(() => overviewDashService.getAll());
    },

    getStats() {
        return withKpiErrorHandling(() => overviewDashService.getStats());
    },

    getMonthlyRevenueChart() {
        return withKpiErrorHandling(() => overviewDashService.getMonthlyRevenueChart());
    },

    getLessonsPerDayChart() {
        return withKpiErrorHandling(() => overviewDashService.getLessonsPerDayChart());
    },

    getRecentPaymentsTable() {
        return withKpiErrorHandling(() => overviewDashService.getRecentPaymentsTable());
    }
};
