import { api } from '../provider/api';
import { translateSubject } from '../../utils/tradutionUtils';

function minutesToHours(value) {
    return typeof value === 'number' ? value / 60 : value;
}

export const teacherDashService = {
    async fetchDashboard() {
        const response = await api.get('/dashboards');
        return response.data;
    },

    async getStats() {
        const data = await this.fetchDashboard();
        return {
            totalTeachers: data.stats.totalProfessores,
            activeTeachers: Array.isArray(data.teacherTableValues) ? data.teacherTableValues.length : 0,
            totalHoursWorked: minutesToHours(data.stats.totalHorasTrabalhadas),
            averageHourlyRate: data.stats.valorHoraMedio,
            averageMonthlyHours: minutesToHours(data.stats.mediaHorasMes)
        };
    },

    async getCharts() {
        const data = await this.fetchDashboard();

        const subjectChartData = (data.subjectChartValues || []).map(item => ({
            label: translateSubject(item.label),
            value: item.percentage
        }));

        return [
            {
                type: 'pie',
                title: 'Distribuição por Disciplina',
                data: subjectChartData
            }
        ];
    },

    async getPayments() {
        const data = await this.fetchDashboard();
        return (data.teacherTableValues || [])
            .filter(item => item.name !== 'Admin')
            .map(item => {
            const rawSubject = item.subjects || item.subject;
            const rawRate = item.hourlyRate;
            let numericRate = 0;
            if (typeof rawRate === 'number') {
                numericRate = rawRate;
            } else if (typeof rawRate === 'string') {
                numericRate = parseFloat(rawRate.replace(/[R$\s]/g, '').replace(',', '.')) || 0;
            }
            return {
                name: item.name,
                subject: rawSubject,
                hours: minutesToHours(item.hoursWorked),
                value: numericRate,
                status: item.status,
                actions: '…'
            };
        });
    }
};
