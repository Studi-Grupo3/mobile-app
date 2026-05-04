import { api } from '../provider/api';
import { translateMonth, translateWeekdayShort, translatePaymentStatus } from '../../utils/tradutionUtils';

export const overviewDashService = {
    async fetchOverview() {
        const response = await api.get('/dashboards/overview');
        return response.data;
    },

    async getStats() {
        const data = await this.fetchOverview();
        return {
            totalRevenue: data.stats.totalRevenue,
            totalTeachers: data.stats.totalTeachers,
            pendingAmount: data.stats.pendingAmount,
            totalAppointments: data.stats.totalAppointments
        };
    },

    async getMonthlyRevenueChart() {
        const data = await this.fetchOverview();
        return {
            type: 'bar',
            title: 'Receita Mensal',
            data: data.monthlyRevenue.map(item => ({
                label: translateMonth(item.month),
                value: item.revenue
            }))
        };
    },

    async getLessonsPerDayChart() {
        const data = await this.fetchOverview();
        return {
            type: 'bar',
            title: 'Aulas por Dia da Semana',
            data: data.lessonsPerDay.map(item => ({
                label: translateWeekdayShort(item.label),
                value: item.value
            }))
        };
    },

    async getRecentPaymentsTable() {
        const data = await this.fetchOverview();
        const formatCurrency = (value) => {
            return `R$ ${Number(value).toFixed(2).replace('.', ',')}`;
        };

        return data.recentPayments
            .filter(item => item.teacher !== 'Admin')
            .map(item => {
            const hourlyRate = item.hourlyRate;
            const duration = item.durationClass;
            const totalValue = hourlyRate * duration;
            return {
                teacherName: item.teacher,
                subject: item.subject,
                hourlyRate: formatCurrency(hourlyRate),
                duration,
                totalValue: formatCurrency(totalValue),
                paymentStatus: translatePaymentStatus(item.status),
                actions: ''
            };
        });
    }
};
