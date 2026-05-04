import { api } from "../provider/api";
import { translateAppointmentStatus, translateSubject } from '../../utils/tradutionUtils';
import { parseUtcDateTime } from '../../utils/date';

export const appointmentDashService = {
    async fetchDashboard() {
        const response = await api.get("dashboard/appointments");
        return response.data;
    },

    async getStats() {
        const data = await this.fetchDashboard();
        return {
            totalAppointments: data.stats.totalAppointments,
            confirmedCount: data.stats.confirmedCount,
            activeStudents: data.stats.activeStudents,
            averageDuration: data.stats.averageDuration
        };
    },

    async getCharts() {
        const data = await this.fetchDashboard();
        return [
            {
                id: "subjects",
                type: "bar",
                title: "Aulas por Matéria",
                data: (data.weeklyChart || []).map(item => ({
                    label: translateSubject(item.label),
                    value: item.value
                }))
            },
            {
                id: "status",
                type: "pie",
                title: "Status de Agendamentos",
                data: (data.statusPie || []).map(item => ({
                    label: item.label,
                    value: item.percentage
                }))
            }
        ];
    },

    async getTable() {
        const data = await this.fetchDashboard();
        return (data.table || []).map(item => {
            const dateStr = item.date || '';
            const timeStr = item.time || '';
            const dateTimeValue = item.dateTime || (dateStr && timeStr ? `${dateStr}T${timeStr}` : null);
            const dt = parseUtcDateTime(dateTimeValue);
            let formattedDate = dateStr;
            let formattedTime = timeStr;

            if (dt) {
                formattedDate = dt.toLocaleDateString('pt-BR');
                formattedTime = dt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
            } else if (dateStr.includes('-')) {
                const [y, m, d] = dateStr.split('-');
                formattedDate = `${d}/${m}/${y}`;
            }

            return {
                studentName: item.studentName,
                teacherName: item.teacherName,
                subject: item.subject || '',
                date: formattedDate,
                time: formattedTime,
                dateTime: dt ? dt.toISOString() : dateTimeValue,
                duration: item.duration,
                location: item.location,
                status: item.status,
                actions: '…'
            };
        });
    }
};
