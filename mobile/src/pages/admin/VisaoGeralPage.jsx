import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { StatCard } from '../../components/admin/StatCard';
import { ChartSection } from '../../components/admin/ChartSection';
import { TableSection } from '../../components/admin/TableSection';
import { overviewDashService } from '../../services/dashboard/overviewDashService';
import { DollarSign, BarChart2, CheckCircle } from 'lucide-react-native';

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
        <ScrollView style={styles.container}>
            <Text style={styles.pageTitle}>Visão Geral</Text>

            <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                    <StatCard
                        title={`R$ ${stats.totalRevenue?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}`}
                        subtitle="Receita Total"
                        icon={<DollarSign size={20} color="#3970B7" />}
                        percentageColor="text-green-500"
                    />
                </View>
                <View style={styles.statItem}>
                    <StatCard
                        title={stats.totalTeachers}
                        subtitle="Professores"
                        icon={<BarChart2 size={20} color="#3970B7" />}
                        percentageColor="text-green-500"
                    />
                </View>
                <View style={styles.statItem}>
                    <StatCard
                        title={`R$ ${stats.pendingAmount?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}`}
                        subtitle="Pendentes"
                        icon={<DollarSign size={20} color="#3970B7" />}
                        percentageColor="text-red-500"
                    />
                </View>
                <View style={styles.statItem}>
                    <StatCard
                        title={stats.totalAppointments}
                        subtitle="Agendamentos"
                        icon={<CheckCircle size={20} color="#3970B7" />}
                        percentageColor="text-green-500"
                    />
                </View>
            </View>

            <ChartSection charts={charts} />

            <TableSection
                title="Pagamentos Recentes"
                data={payments}
                columns={[
                    { label: 'Prof.', accessor: 'teacherName' },
                    { label: 'Status', accessor: 'paymentStatus' }
                ]}
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6', // gray-100
        padding: 16,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    pageTitle: {
        fontSize: 24, // text-2xl
        fontWeight: 'bold',
        color: '#1F2937', // gray-800
        marginBottom: 24,
    },
    statsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 24,
        gap: 16,
    },
    statItem: {
        width: '47%',
    },
});
