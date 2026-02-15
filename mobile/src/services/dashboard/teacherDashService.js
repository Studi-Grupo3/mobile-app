import { api } from '../provider/api';
import { translateSubject, translateTeacherStatus } from '../../utils/tradutionUtils';

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
            totalHoursWorked: data.stats.totalHorasTrabalhadas,
            averageHourlyRate: data.stats.valorHoraMedio,
            averageMonthlyHours: data.stats.mediaHorasMes
        };
    },

    async getCharts() {
        const data = await this.fetchDashboard();
        const subjectCounts = {};
        const teachers = data.teacherTableValues || [];

        teachers.forEach(teacher => {
            let subjects = [];
            let rawSubject = teacher.subjects || teacher.subject;

            if (Array.isArray(rawSubject)) {
                subjects = rawSubject;
            } else if (typeof rawSubject === 'string') {
                subjects = rawSubject.split(',').map(s => s.trim());
            }

            subjects.forEach(sub => {
                const translated = translateSubject(sub);
                subjectCounts[translated] = (subjectCounts[translated] || 0) + 1;
            });
        });

        const totalSubjects = Object.values(subjectCounts).reduce((a, b) => a + b, 0);
        const subjectChartData = Object.entries(subjectCounts).map(([label, count]) => ({
            label,
            value: totalSubjects > 0 ? (count / totalSubjects) * 100 : 0
        }));

        return [
            {
                type: 'bar',
                title: 'Top 5 Professores (Horas Trabalhadas)',
                data: (data.topTeachers || []).map(p => ({
                    label: p.label,
                    value: p.value
                }))
            },
            {
                type: 'pie',
                title: 'Distribuição por Disciplina',
                data: subjectChartData
            }
        ];
    },

    async getPayments() {
        const data = await this.fetchDashboard();
        return (data.teacherTableValues || []).map(item => {
            let rawSubject = item.subjects || item.subject;

            return {
                name: item.name,
                subject: rawSubject,
                hours: item.hoursWorked,
                value: item.hourlyRate,
                status: translateTeacherStatus(item.status),
                actions: '…'
            };
        });
    }
};
