import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { StatCard } from '../../components/admin/StatCard';
import { ChartSection } from '../../components/admin/ChartSection';
import { TableSection } from '../../components/admin/TableSection';
import { mockTeacherDashService as teacherDashService } from '../../mocks/mockServices';
import { Users, DollarSign, Clock, BarChart2 } from 'lucide-react-native';
import { translateSubject, translateTeacherStatus } from '../../utils/tradutionUtils';

export default function ProfessoresPage() {
    const [stats, setStats] = useState(null);
    const [charts, setCharts] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const [statsData, chartsData, teachersData] = await Promise.all([
                    teacherDashService.getStats(),
                    teacherDashService.getCharts(),
                    teacherDashService.getPayments()
                ]);
                setStats(statsData);
                setCharts(chartsData);
                setTeachers(teachersData);
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
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            {stats && (
                <>
                    <StatCard
                        title={stats.totalTeachers}
                        subtitle="Total de Professores"
                        icon={<Users size={20} color="#3970B7" />}
                    />
                    <StatCard
                        title={`R$ ${stats.averageHourlyRate?.toFixed(2)}`}
                        subtitle="Valor/Hora Médio"
                        icon={<DollarSign size={20} color="#3970B7" />}
                    />
                    <StatCard
                        title={`${stats.totalHoursWorked}h`}
                        subtitle="Total de Horas Trabalhadas"
                        icon={<Clock size={20} color="#E8A317" />}
                    />
                    <StatCard
                        title={`${Number(stats.averageMonthlyHours).toFixed(0)}h`}
                        subtitle="Média de Horas/Mês"
                        icon={<BarChart2 size={20} color="#3970B7" />}
                    />
                </>
            )}

            <ChartSection charts={charts} />

            <TableSection
                title="Lista de Professores"
                data={teachers}
                columns={[
                    { label: 'Professor', accessor: 'name' },
                    { label: 'Matérias', accessor: 'subject', render: (row) => {
                        const subjects = Array.isArray(row.subject) ? row.subject : [row.subject];
                        return <Text style={{ color: '#1F2937', fontSize: 13 }}>{subjects.map(s => translateSubject(s)).join(', ')}</Text>;
                    }},
                    { label: 'Horas', accessor: 'hours', render: (row) => <Text style={{ color: '#1F2937', fontSize: 14 }}>{row.hours}h</Text> },
                    { label: 'Valor/Hora', accessor: 'value', render: (row) => <Text style={{ color: '#1F2937', fontSize: 14 }}>R$ {Number(row.value).toFixed(2)}</Text> },
                    { label: 'Status', accessor: 'status', render: (row) => {
                        const translated = translateTeacherStatus(row.status);
                        const isActive = row.status === 'ACTIVE' || row.status === 'Ativo';
                        return (
                            <View style={{ backgroundColor: isActive ? '#DCFCE7' : '#FEE2E2', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 12 }}>
                                <Text style={{ color: isActive ? '#166534' : '#991B1B', fontSize: 11, fontWeight: '700' }}>{translated}</Text>
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
