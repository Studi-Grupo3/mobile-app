import { api } from '../provider/api';
import { translateMonth, translateWeekdayShort, translatePaymentStatus } from '../../utils/tradutionUtils';

export const overviewDashService = {
    async fetchOverview() {
        const response = await api.get('/dashboards/overview');
        return response.data;
    },

    async getAll() {
        const data = await this.fetchOverview();

        const stats = {
            totalRevenue: data.stats?.totalRevenue ?? 0,
            totalTeachers: data.stats?.totalTeachers ?? 0,
            pendingAmount: data.stats?.pendingAmount ?? 0,
            totalAppointments: data.stats?.totalAppointments ?? 0
        };

        const revenueChart = {
            type: 'bar',
            title: 'Receita Mensal',
            data: (data.monthlyRevenue || []).map(item => ({
                label: translateMonth(item.month),
                value: item.revenue
            }))
        };

        const lessonsChart = {
            type: 'bar',
            title: 'Aulas por Dia da Semana',
            data: (data.lessonsPerDay || []).map(item => ({
                label: translateWeekdayShort(item.label),
                value: item.value
            }))
        };

        const formatCurrency = (value) => `R$ ${Number(value).toFixed(2).replace('.', ',')}`;
        const payments = (data.recentPayments || [])
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

        return { stats, revenueChart, lessonsChart, payments };
    },

    async getStats() {
        const { stats } = await this.getAll();
        return stats;
    },

    async getMonthlyRevenueChart() {
        const data = await this.fetchOverview();
        return {
            type: 'bar',
            title: 'Receita Mensal',
            data: (data.monthlyRevenue || []).map(item => ({
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
            data: (data.lessonsPerDay || []).map(item => ({
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

        return (data.recentPayments || [])
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
