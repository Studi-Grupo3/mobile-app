import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, StyleSheet, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { InfoCard } from '../../components/common/InfoCard';
import { mockTeacherService } from '../../mocks/mockServices';
import { translateSubject } from '../../utils/tradutionUtils';
import { BookOpen, AlertCircle, Clock, TrendingUp, Users, DollarSign } from 'lucide-react-native';
import { BarChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

const mapWeekdayToLabel = {
    1: "Dom", 2: "Seg", 3: "Ter", 4: "Qua", 5: "Qui", 6: "Sex", 7: "Sáb",
};

/** Simple horizontal bar row for discipline/weekday breakdowns */
const HorizontalBarItem = ({ label, value, maxValue, color }) => {
    const pct = maxValue > 0 ? (value / maxValue) * 100 : 0;
    return (
        <View style={barStyles.row}>
            <Text style={barStyles.label} numberOfLines={1}>{label}</Text>
            <View style={barStyles.trackOuter}>
                <View style={[barStyles.trackInner, { width: `${pct}%`, backgroundColor: color }]} />
            </View>
            <Text style={barStyles.value}>{value}</Text>
        </View>
    );
};

const barStyles = StyleSheet.create({
    row: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    label: { width: 80, fontSize: 13, color: '#374151', fontWeight: '500' },
    trackOuter: { flex: 1, height: 20, backgroundColor: '#F3F4F6', borderRadius: 10, overflow: 'hidden', marginHorizontal: 8 },
    trackInner: { height: '100%', borderRadius: 10 },
    value: { width: 36, textAlign: 'right', fontSize: 13, fontWeight: '600', color: '#111827' },
});

export default function TeacherGraph() {
    const insets = useSafeAreaInsets();
    const [metrics, setMetrics] = useState([]);
    const [chartData, setChartData] = useState(null);
    const [disciplineData, setDisciplineData] = useState([]);
    const [weekdayData, setWeekdayData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        Promise.all([
            mockTeacherService.getDashboard(),
            mockTeacherService.getChartData(),
        ])
            .then(([dashboard, charts]) => {
                const stats = dashboard.stats || dashboard;
                const totalLessons = stats.totalLessons ?? 0;
                const cancelledLessons = stats.cancelledLessons ?? 0;
                const cancellationPct = totalLessons > 0
                    ? (cancelledLessons / totalLessons * 100)
                    : 0;
                const totalHoursWorked = stats.totalHoursWorked ?? 0;
                const totalStudents = stats.totalStudents ?? 0;
                const completedLessons = stats.completedLessons ?? 0;
                const upcomingLessons = stats.upcomingLessons ?? 0;
                const monthlyEarnings = stats.monthlyEarnings ?? 0;

                setMetrics([
                    {
                        title: "Total de Aulas",
                        value: totalLessons,
                        subtitle: `${completedLessons} concluídas`,
                        icon: <BookOpen size={20} color="#3970B7" />,
                    },
                    {
                        title: "Próximas Aulas",
                        value: upcomingLessons,
                        subtitle: "Agendadas",
                        icon: <TrendingUp size={20} color="#16A34A" />,
                    },
                    {
                        title: "Cancelamentos",
                        value: `${cancellationPct.toFixed(1)}%`,
                        subtitle: `${cancelledLessons} aulas`,
                        icon: <AlertCircle size={20} color="#EF4444" />,
                    },
                    {
                        title: "Horas Trabalhadas",
                        value: `${totalHoursWorked}h`,
                        subtitle: "Total acumulado",
                        icon: <Clock size={20} color="#F59E0B" />,
                    },
                    {
                        title: "Alunos Atendidos",
                        value: totalStudents,
                        subtitle: "Total de alunos",
                        icon: <Users size={20} color="#8B5CF6" />,
                    },
                    {
                        title: "Faturamento Mensal",
                        value: `R$ ${monthlyEarnings.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
                        subtitle: "Mês atual",
                        icon: <DollarSign size={20} color="#16A34A" />,
                    },
                ]);

                // Chart data for monthly lessons
                if (charts?.monthlyLessons) {
                    setChartData({
                        labels: charts.monthlyLessons.map(d => d.label),
                        datasets: [{ data: charts.monthlyLessons.map(d => d.value) }],
                    });
                }

                // Discipline breakdown
                const byDiscipline = dashboard.lessonsByDiscipline || [
                    { subject: 'MATHEMATICS', count: 80 },
                    { subject: 'PHYSICS', count: 62 },
                    { subject: 'PORTUGUESE', count: 45 },
                    { subject: 'CHEMISTRY', count: 30 },
                ];
                setDisciplineData(byDiscipline);

                // Weekday breakdown
                const byWeekday = dashboard.lessonsByWeekday || [
                    { weekday: 2, count: 25 },
                    { weekday: 3, count: 30 },
                    { weekday: 4, count: 28 },
                    { weekday: 5, count: 35 },
                    { weekday: 6, count: 20 },
                ];
                setWeekdayData(byWeekday);
            })
            .catch(err => console.error("Erro dashboard:", err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#3970B7" />
            </View>
        );
    }

    const maxDiscipline = Math.max(...disciplineData.map(d => d.count), 1);
    const maxWeekday = Math.max(...weekdayData.map(d => d.count), 1);
    const chartWidth = screenWidth - 64;

    return (
        <ScrollView style={styles.container}>
            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
                <Text style={styles.headerTitle}>Métricas</Text>
            </View>

            <View style={styles.content}>
                <Text style={styles.pageTitle}>Métricas e Desempenho</Text>

                {/* Stat cards - single column */}
                {metrics.map((item, idx) => (
                    <InfoCard key={idx} {...item} />
                ))}

                {/* Monthly Lessons Chart */}
                {chartData && (
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Aulas por Mês</Text>
                        <BarChart
                            data={chartData}
                            width={chartWidth}
                            height={200}
                            yAxisLabel=""
                            yAxisSuffix=""
                            chartConfig={{
                                backgroundColor: '#ffffff',
                                backgroundGradientFrom: '#ffffff',
                                backgroundGradientTo: '#ffffff',
                                decimalPlaces: 0,
                                color: (opacity = 1) => `rgba(57, 112, 183, ${opacity})`,
                                labelColor: () => '#6B7280',
                                barPercentage: 0.6,
                                style: { borderRadius: 8 },
                            }}
                            fromZero
                            showValuesOnTopOfBars
                            style={{ borderRadius: 8 }}
                        />
                    </View>
                )}

                {/* Discipline breakdown - horizontal bars */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Aulas por Disciplina</Text>
                    {disciplineData.map((d, i) => (
                        <HorizontalBarItem
                            key={i}
                            label={translateSubject(d.subject)}
                            value={d.count}
                            maxValue={maxDiscipline}
                            color="#3B82F6"
                        />
                    ))}
                </View>

                {/* Weekday breakdown - horizontal bars */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Aulas por Dia da Semana</Text>
                    {weekdayData.map((d, i) => (
                        <HorizontalBarItem
                            key={i}
                            label={mapWeekdayToLabel[d.weekday] || String(d.weekday)}
                            value={d.count}
                            maxValue={maxWeekday}
                            color="#8B5CF6"
                        />
                    ))}
                </View>

                <View style={{ height: 40 }} />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        backgroundColor: '#3970B7',
        padding: 16,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    content: {
        padding: 16,
    },
    pageTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 20,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 16,
    },
});
