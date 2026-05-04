import { api } from "../provider/api";
import { translateAppointmentStatus, translateSubject } from '../../utils/tradutionUtils';

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
            let formattedDate = dateStr;
            let formattedTime = timeStr;

            if (dateStr.includes('-')) {
                const [y, m, d] = dateStr.split('-');
                formattedDate = `${d}/${m}/${y}`;
            }

            if (timeStr && item.duration) {
                const [hour, minute] = timeStr.split(':').map(Number);
                const startDate = new Date(2026, 0, 1, hour, minute);
                const endDate = new Date(startDate.getTime() + item.duration * 60000);
                const pad = n => n.toString().padStart(2, '0');
                formattedTime = `${pad(hour)}:${pad(minute)}:${pad(0)}`;
            }

            return {
                studentName: item.studentName,
                teacherName: item.teacherName,
                subject: item.subject || '',
                date: formattedDate,
                time: formattedTime,
                duration: item.duration,
                location: item.location,
                status: item.status,
                actions: '…'
            };
        });
    }
};
