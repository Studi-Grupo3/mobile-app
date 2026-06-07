import { api } from '../provider/api';

function pickValue(item) {
    return item?.value ?? item?.metric_value ?? item?.metricValue ?? item?.count ?? null;
}

function pickTitle(item, fallback) {
    return item?.title ?? item?.metric_name ?? item?.metricName ?? item?.name ?? item?.label ?? fallback;
}

function pickSubtitle(item, fallback) {
    return item?.subtitle ?? item?.description ?? item?.metric_description ?? item?.metricDescription ?? fallback;
}

function formatValue(value, unit) {
    if (value === null || value === undefined || value === '') return null;

    if (typeof value === 'number') {
        if (unit === '%' || unit === 'percent') {
            return `${value.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}%`;
        }

        return value.toLocaleString('pt-BR', { maximumFractionDigits: 2 });
    }

    return String(value);
}

function normalizeKpi(item, index) {
    const unit = item?.unit ?? item?.metric_unit ?? item?.metricUnit;
    const value = pickValue(item);

    return {
        id: item?.id ?? item?.key ?? item?.metric_name ?? item?.metricName ?? `overview-kpi-${index + 1}`,
        title: formatValue(value, unit),
        subtitle: pickSubtitle(item, pickTitle(item, `KPI ${index + 1}`)),
        percentage: item?.percentage ?? item?.variation ?? item?.trend ?? null,
        percentageColor: item?.percentageColor ?? item?.trendColor ?? null,
    };
}

export const overviewKpiService = {
    async fetchKpis() {
        const response = await api.get('/dashboards/overview/kpis');
        return response.data;
    },

    async getAll() {
        const data = await this.fetchKpis();
        const items = Array.isArray(data) ? data : data?.kpis ?? data?.items ?? [];
        return items.slice(0, 2).map(normalizeKpi);
    },
};
