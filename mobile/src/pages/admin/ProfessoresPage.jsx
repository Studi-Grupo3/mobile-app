import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { StatCard } from '../../components/admin/StatCard';
import { ChartSection } from '../../components/admin/ChartSection';
import { TableSection } from '../../components/admin/TableSection';
import { mockTeacherDashService as teacherDashService } from '../../mocks/mockServices';
import { Users, BookOpen, Calendar, DollarSign } from 'lucide-react-native';

export default function ProfessoresPage() {
    const [stats, setStats] = useState(null);
    const [charts, setCharts] = useState([]);
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const [statsData, chartsData, paymentsData] = await Promise.all([
                    teacherDashService.getStats(),
                    teacherDashService.getCharts(),
                    teacherDashService.getPayments()
                ]);
                setStats(statsData);
                setCharts(chartsData);
                setPayments(paymentsData);
            } catch (error) {
                console.error("Error fetching teachers dash:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    if (loading) return <View style={styles.centered}><ActivityIndicator size="large" color="#3970B7" /></View>;

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.pageTitle}>Professores</Text>

            {stats && (
                <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                        <StatCard
                            title={stats.totalTeachers}
                            subtitle="Total"
                            icon={<Users size={20} color="#3970B7" />}
                        />
                    </View>
                    <View style={styles.statItem}>
                        <StatCard
                            title={`R$ ${stats.averageHourlyRate?.toFixed(2)}`}
                            subtitle="Valor/Hora"
                            icon={<DollarSign size={20} color="#3970B7" />}
                        />
                    </View>
                    <View style={styles.statItem}>
                        <StatCard
                            title={stats.totalHoursWorked}
                            subtitle="Horas/Mês"
                            icon={<BookOpen size={20} color="#3970B7" />}
                        />
                    </View>
                    <View style={styles.statItem}>
                        <StatCard
                            title={Number(stats.averageMonthlyHours).toFixed(0)}
                            subtitle="Média Horas"
                            icon={<Calendar size={20} color="#3970B7" />}
                        />
                    </View>
                </View>
            )}

            <ChartSection charts={charts} />

            <TableSection
                title="Lista de Professores"
                data={payments}
                columns={[
                    { label: 'Professor', accessor: 'name' },
                    { label: 'Horas', accessor: 'hours' },
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
        marginBottom: 24,
        gap: 16,
    },
    statItem: {
        width: '47%',
    },
});
