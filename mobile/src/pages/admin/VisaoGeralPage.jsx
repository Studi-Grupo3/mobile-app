import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { StatCard } from '../../components/admin/StatCard';
import { ChartSection } from '../../components/admin/ChartSection';
import { TableSection } from '../../components/admin/TableSection';
import { overviewDashService } from '../../services/dashboard/overviewDashService';
import { DollarSign, Users, Clock, CalendarCheck } from 'lucide-react-native';
import { translatePaymentStatus } from '../../utils/tradutionUtils';
import { SubjectBadge } from '../../components/admin/SubjectBadge';

export default function VisaoGeralPage() {
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalTeachers: 0,
        pendingAmount: 0,
        totalAppointments: 0
    });
    const [charts, setCharts] = useState([]);
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const [statsData, revenueChart, lessonsChart, paymentsData] = await Promise.all([
                    overviewDashService.getStats(),
                    overviewDashService.getMonthlyRevenueChart(),
                    overviewDashService.getLessonsPerDayChart(),
                    overviewDashService.getRecentPaymentsTable()
                ]);
                setStats(statsData);
                setCharts([revenueChart, lessonsChart]);
                setPayments(paymentsData);
            } catch (error) {
                console.error("Error fetching overview data:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    if (loading) return <View style={styles.centered}><ActivityIndicator size="large" color="#3970B7" /></View>;

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <StatCard
                title={`R$ ${stats.totalRevenue?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}`}
                subtitle="Receita Total do Mês"
                icon={<DollarSign size={20} color="#3970B7" />}
            />
            <StatCard
                title={stats.totalTeachers}
                subtitle="Professores Cadastrados"
                icon={<Users size={20} color="#3970B7" />}
            />
            <StatCard
                title={`R$ ${stats.pendingAmount?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}`}
                subtitle="Valor Pendente de Pagamento"
                icon={<Clock size={20} color="#E8A317" />}
            />
            <StatCard
                title={stats.totalAppointments}
                subtitle="Agendamentos no Mês"
                icon={<CalendarCheck size={20} color="#3970B7" />}
            />

            <ChartSection charts={charts} />

            <TableSection
                title="Pagamentos Recentes"
                data={payments}
                columns={[
                    { label: 'Professor', accessor: 'teacherName' },
                    { label: 'Matéria', accessor: 'subject', render: (row) => <SubjectBadge subjects={row.subject} /> },
                    { label: 'Valor/Hora', accessor: 'hourlyRate' },
                    { label: 'Total', accessor: 'totalValue' },
                    { label: 'Status', accessor: 'paymentStatus', render: (row) => {
                        const isPaid = row.paymentStatus === 'Pago';
                        return (
                            <View style={{ backgroundColor: isPaid ? '#DCFCE7' : '#FEF9C3', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 12 }}>
                                <Text style={{ color: isPaid ? '#166534' : '#92400E', fontSize: 11, fontWeight: '700' }}>{row.paymentStatus}</Text>
                            </View>
                        );
                    }},
                ]}
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6',
    },
    content: {
        padding: 16,
        paddingBottom: 32,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
