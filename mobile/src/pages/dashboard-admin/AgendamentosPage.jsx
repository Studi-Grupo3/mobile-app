import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { StatCard } from '../../components/dashboard-admin/StatCard';
import { ChartSection } from '../../components/dashboard-admin/ChartSection';
import { TableSection } from '../../components/dashboard-admin/TableSection';
import { appointmentDashService } from '../../services/dashboard/appointmentDashService';
import { Calendar, Clock, Timer, Hourglass } from 'lucide-react-native';

export default function AgendamentosPage() {
    const [stats, setStats] = useState(null);
    const [charts, setCharts] = useState([]);
    const [tableData, setTableData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const [statsData, chartConfigs, tableValues] = await Promise.all([
                    appointmentDashService.getStats(),
                    appointmentDashService.getCharts(),
                    appointmentDashService.getTable()
                ]);
                setStats(statsData);
                setCharts(chartConfigs);
                setTableData(tableValues);
            } catch (error) {
                console.error("Error fetching appointments dash:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    if (loading) return <View style={styles.centered}><ActivityIndicator size="large" color="#3970B7" /></View>;

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.pageTitle}>Agendamentos</Text>

            {stats && (
                <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                        <StatCard
                            title={stats.totalAppointments}
                            subtitle="Total"
                            icon={<Calendar size={20} color="#3970B7" />}
                        />
                    </View>
                    <View style={styles.statItem}>
                        <StatCard
                            title={stats.confirmedCount}
                            subtitle="Confirmados"
                            icon={<Clock size={20} color="#3970B7" />}
                        />
                    </View>
                    <View style={styles.statItem}>
                        <StatCard
                            title={stats.activeStudents}
                            subtitle="Alunos Ativos"
                            icon={<Timer size={20} color="#3970B7" />}
                        />
                    </View>
                    <View style={styles.statItem}>
                        <StatCard
                            title={stats.averageDuration ? `${stats.averageDuration.toFixed(0)} min` : '-'}
                            subtitle="Duração Média"
                            icon={<Hourglass size={20} color="#3970B7" />}
                        />
                    </View>
                </View>
            )}

            <ChartSection charts={charts} />

            <TableSection
                title="Agendamentos Recentes"
                data={tableData}
                columns={[
                    { label: 'Aluno', accessor: 'studentName' },
                    { label: 'Data', accessor: 'date' },
                    { label: 'Status', accessor: 'status' },
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
        gap: 16,
        marginBottom: 24,
    },
    statItem: {
        width: '47%',
    },
});
