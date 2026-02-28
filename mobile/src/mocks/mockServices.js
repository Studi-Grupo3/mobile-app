/**
 * Mock-aware service wrappers.
 * Each function tries the real API first, then falls back to mock data.
 */
import {
    mockStudentProfile,
    mockStudentAppointments,
    mockTeacherProfile,
    mockTeacherStats,
    mockTeacherUpcomingLessons,
    mockTeacherLessonsHistory,
    mockTeacherDashboard,
    mockTeacherRequests,
    mockTeacherChartData,
    mockAdminOverview,
    mockAdminAppointmentsDashboard,
    mockAdminTeachersDashboard,
    mockAdminPaymentsDashboard,
    mockTeachersList,
    mockAdminSettings,
} from './mockData';

/**
 * Helper: try an async fn, on error return fallback value
 */
async function tryOrFallback(asyncFn, fallback) {
    try {
        const result = await asyncFn();
        return result;
    } catch (err) {
        console.log('API unavailable, using mock data:', err.message);
        return typeof fallback === 'function' ? fallback() : fallback;
    }
}

// ─── Student Mocks ────────────────────────────────────────
export const mockStudentService = {
    getById: (id) => tryOrFallback(
        () => require('../services/studentService').studentService.getById(id),
        mockStudentProfile
    ),
    getAppointments: (studentId) => tryOrFallback(
        () => require('../services/appointmentService').appointmentService.getByStudentId(studentId),
        mockStudentAppointments
    ),
    getAllAppointments: () => tryOrFallback(
        () => require('../services/appointmentService').appointmentService.list(),
        mockStudentAppointments
    ),
};

// ─── Teacher Mocks ────────────────────────────────────────
export const mockTeacherService = {
    getById: (id) => tryOrFallback(
        () => require('../services/teacherService').teacherService.getById(id),
        mockTeacherProfile
    ),
    getStats: () => tryOrFallback(
        () => require('../services/teacherService').teacherService.getStats(),
        mockTeacherStats
    ),
    getDashboard: () => tryOrFallback(
        () => require('../services/teacherService').teacherService.getDashboard(),
        mockTeacherDashboard
    ),
    getProximasAulas: () => tryOrFallback(
        () => require('../services/teacherService').teacherService.getProximasAulas(),
        mockTeacherUpcomingLessons
    ),
    getLessonsHistory: () => tryOrFallback(
        () => require('../services/teacherService').teacherService.getLessonsHistory(),
        mockTeacherLessonsHistory
    ),
    getPendingLessons: () => tryOrFallback(
        () => require('../services/teacherService').teacherService.getPendingLessons(),
        mockTeacherUpcomingLessons.filter(l => l.status === 'SCHEDULED')
    ),
    getRequests: () => Promise.resolve(mockTeacherRequests),
    getChartData: () => Promise.resolve(mockTeacherChartData),
    listPublic: (page, size) => tryOrFallback(
        () => require('../services/teacherService').teacherService.listPublic(page, size),
        {
            content: mockTeachersList.slice(page * size, (page + 1) * size),
            totalPages: Math.ceil(mockTeachersList.length / size),
        }
    ),
};

// ─── Admin Mocks ──────────────────────────────────────────
export const mockOverviewDashService = {
    fetchOverview: () => tryOrFallback(
        () => require('../services/dashboard/overviewDashService').overviewDashService.fetchOverview(),
        mockAdminOverview
    ),
    getStats: async () => {
        const data = await mockOverviewDashService.fetchOverview();
        return {
            totalRevenue: data.stats?.totalRevenue ?? 0,
            totalTeachers: data.stats?.totalTeachers ?? 0,
            pendingAmount: data.stats?.pendingAmount ?? 0,
            totalAppointments: data.stats?.totalAppointments ?? 0,
        };
    },
    getMonthlyRevenueChart: async () => {
        const data = await mockOverviewDashService.fetchOverview();
        return {
            type: 'bar',
            title: 'Receita Mensal',
            data: (data.monthlyRevenue || []).map(item => ({
                label: item.month?.substring(0, 3) || item.label || '?',
                value: item.revenue || item.value || 0,
            })),
        };
    },
    getLessonsPerDayChart: async () => {
        const data = await mockOverviewDashService.fetchOverview();
        return {
            type: 'bar',
            title: 'Aulas por Dia da Semana',
            data: (data.lessonsPerDay || []).map(item => ({
                label: item.label?.substring(0, 3) || '?',
                value: item.value || 0,
            })),
        };
    },
    getRecentPaymentsTable: async () => {
        const data = await mockOverviewDashService.fetchOverview();
        return (data.recentPayments || []).map(item => ({
            teacherName: item.teacher,
            subject: item.subject,
            hourlyRate: `R$ ${Number(item.hourlyRate || 0).toFixed(2)}`,
            duration: item.durationClass,
            totalValue: `R$ ${(Number(item.hourlyRate || 0) * Number(item.durationClass || 0)).toFixed(2)}`,
            paymentStatus: item.status,
        }));
    },
};

export const mockAppointmentDashService = {
    fetchDashboard: () => tryOrFallback(
        () => require('../services/dashboard/appointmentDashService').appointmentDashService.fetchDashboard(),
        mockAdminAppointmentsDashboard
    ),
    getStats: async () => {
        const data = await mockAppointmentDashService.fetchDashboard();
        return data.stats || {};
    },
    getCharts: async () => {
        const data = await mockAppointmentDashService.fetchDashboard();
        return [
            {
                id: 'weekly',
                type: 'bar',
                title: 'Agendamentos por Semana',
                data: data.weeklyChart || [],
            },
            {
                id: 'status',
                type: 'pie',
                title: 'Status de Agendamentos',
                data: (data.statusPie || []).map(i => ({ label: i.label, value: i.percentage })),
            },
        ];
    },
    getTable: async () => {
        const data = await mockAppointmentDashService.fetchDashboard();
        return data.table || [];
    },
};

export const mockTeacherDashService = {
    fetchDashboard: () => tryOrFallback(
        () => require('../services/dashboard/teacherDashService').teacherDashService.fetchDashboard(),
        mockAdminTeachersDashboard
    ),
    getStats: async () => {
        const data = await mockTeacherDashService.fetchDashboard();
        return {
            totalTeachers: data.stats?.totalProfessores ?? 0,
            activeTeachers: (data.teacherTableValues || []).length,
            totalHoursWorked: data.stats?.totalHorasTrabalhadas ?? 0,
            averageHourlyRate: data.stats?.valorHoraMedio ?? 0,
            averageMonthlyHours: data.stats?.mediaHorasMes ?? 0,
        };
    },
    getCharts: async () => {
        const data = await mockTeacherDashService.fetchDashboard();
        // Build discipline distribution from teacher table
        const disciplineMap = {};
        (data.teacherTableValues || []).forEach(t => {
            (t.subjects || []).forEach(s => {
                disciplineMap[s] = (disciplineMap[s] || 0) + 1;
            });
        });
        const disciplineData = Object.entries(disciplineMap).map(([label, value]) => ({ label, value }));
        return [
            {
                type: 'bar',
                title: 'Top 5 Professores (Horas)',
                data: data.topTeachers || [],
            },
            {
                type: 'pie',
                title: 'Distribuição por Disciplina',
                data: disciplineData,
            },
        ];
    },
    getPayments: async () => {
        const data = await mockTeacherDashService.fetchDashboard();
        return (data.teacherTableValues || []).map(item => ({
            name: item.name,
            subject: item.subjects,
            hours: item.hoursWorked,
            value: item.hourlyRate,
            status: item.status,
        }));
    },
};

export const mockPaymentDashService = {
    fetchDashboard: (month, year) => tryOrFallback(
        () => require('../services/dashboard/paymentDashService').paymentDashService.fetchDashboard(month, year),
        mockAdminPaymentsDashboard
    ),
    getStats: async (month, year) => {
        const data = await mockPaymentDashService.fetchDashboard(month, year);
        return data.stats || {};
    },
    getRecent: async (month, year) => {
        const data = await mockPaymentDashService.fetchDashboard(month, year);
        return (data.recent || []).map(item => ({
            id: item.id,
            name: item.name,
            subject: item.subject,
            valuePerHour: item.valuePerHour,
            hours: item.hours,
            total: item.total,
            status: item.status,
        }));
    },
};

export const mockTeacherManagerService = {
    list: () => tryOrFallback(
        () => require('../services/dashboard/teacherManagerService').teacherManagerService.list(),
        { content: mockTeachersList, totalPages: 1 }
    ),
    create: async (payload) => {
        console.log('Mock: create teacher', payload);
        return { id: Date.now(), ...payload };
    },
    update: async (id, payload) => {
        console.log('Mock: update teacher', id, payload);
        return { id, ...payload };
    },
    softDelete: async (id) => {
        console.log('Mock: softDelete teacher', id);
        return { success: true };
    },
};

export const mockAdminSettingsService = {
    get: () => tryOrFallback(
        () => require('../services/dashboard/adminSettingsService').adminSettingsService.get(),
        mockAdminSettings
    ),
};
