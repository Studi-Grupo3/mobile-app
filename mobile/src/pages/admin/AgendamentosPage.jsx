import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { StatCard } from '../../components/admin/StatCard';
import { ChartSection } from '../../components/admin/ChartSection';
import { TableSection } from '../../components/admin/TableSection';
import { appointmentDashService } from '../../services/dashboard/appointmentDashService';
import { Calendar, CheckCircle, Users, Hourglass } from 'lucide-react-native';
import { translateSubject, translateAppointmentStatus } from '../../utils/tradutionUtils';

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
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            {stats && (
                <>
                    <StatCard
                        title={stats.totalAppointments}
                        subtitle="Total de Agendamentos no Mês"
                        icon={<Calendar size={20} color="#3970B7" />}
                    />
                    <StatCard
                        title={stats.confirmedCount}
                        subtitle="Aulas Confirmadas"
                        icon={<CheckCircle size={20} color="#22C55E" />}
                    />
                    <StatCard
                        title={stats.activeStudents}
                        subtitle="Alunos com Aulas Ativas"
                        icon={<Users size={20} color="#3970B7" />}
                    />
                    <StatCard
                        title={stats.averageDuration ? `${stats.averageDuration.toFixed(0)} min` : '-'}
                        subtitle="Duração Média por Aula"
                        icon={<Hourglass size={20} color="#E8A317" />}
                    />
                </>
            )}

            <ChartSection charts={charts} />

            <TableSection
                title="Agendamentos Recentes"
                data={tableData}
                columns={[
                    { label: 'Aluno', accessor: 'studentName' },
                    { label: 'Professor', accessor: 'teacherName' },
                    { label: 'Matéria', accessor: 'subject', render: (row) => <Text style={{ color: '#1F2937', fontSize: 14 }}>{translateSubject(row.subject)}</Text> },
                    { label: 'Data', accessor: 'date', render: (row) => {
                        const d = row.date ? row.date.split('-').reverse().join('/') : '-';
                        return <Text style={{ color: '#1F2937', fontSize: 14 }}>{d} {row.time || ''}</Text>;
                    }},
                    { label: 'Duração', accessor: 'duration', render: (row) => <Text style={{ color: '#1F2937', fontSize: 14 }}>{row.duration} min</Text> },
                    { label: 'Status', accessor: 'status', render: (row) => {
                        const translated = translateAppointmentStatus(row.status);
                        const isGreen = row.status === 'COMPLETED';
                        const isYellow = row.status === 'SCHEDULED';
                        const isRed = row.status === 'CANCELLED';
                        const bg = isGreen ? '#DCFCE7' : isYellow ? '#FEF9C3' : isRed ? '#FEE2E2' : '#F3F4F6';
                        const txt = isGreen ? '#166534' : isYellow ? '#92400E' : isRed ? '#991B1B' : '#1F2937';
                        return (
                            <View style={{ backgroundColor: bg, paddingHorizontal: 10, paddingVertical: 3, borderRadius: 12 }}>
                                <Text style={{ color: txt, fontSize: 11, fontWeight: '700' }}>{translated}</Text>
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
