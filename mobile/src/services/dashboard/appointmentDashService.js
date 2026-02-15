import { api } from "../provider/api";
import { translateAppointmentStatus } from '../../utils/tradutionUtils';

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
                id: "weekly",
                type: "bar",
                title: "Agendamentos por Semana",
                data: (data.weeklyChart || []).map(item => ({
                    label: item.label,
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
            const [hour, minute] = item.time.split(":").map(Number);
            const dateParts = item.date.split("-").map(Number);
            const startDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2], hour, minute);
            const endDate = new Date(startDate.getTime() + item.duration * 60000);
            const pad = n => n.toString().padStart(2, "0");
            const formattedDate = `${pad(startDate.getDate())}/${pad(startDate.getMonth() + 1)}/${startDate.getFullYear()}`;
            const formattedTime = `${pad(startDate.getHours())}:${pad(startDate.getMinutes())} - ${pad(endDate.getHours())}:${pad(endDate.getMinutes())}`;

            return {
                studentName: item.studentName,
                teacherName: item.teacherName,
                date: formattedDate,
                time: formattedTime,
                location: item.location,
                status: translateAppointmentStatus(item.status),
                actions: "…"
            };
        });
    }
};
