import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import { InfoCard } from '../../components/common/InfoCard';
import { GraphCard } from '../../components/admin/GraphCard';
import { teacherService } from '../../services/teacherService';
import { translateSubject } from '../../utils/tradutionUtils';
import { BookOpen, AlertCircle, Clock } from 'lucide-react-native';

const mapWeekdayToLabel = {
    1: "Domingo", 2: "Segunda", 3: "Terça", 4: "Quarta", 5: "Quinta", 6: "Sexta", 7: "Sábado",
};

export default function TeacherGraph() {
    const [metrics, setMetrics] = useState([]);
    const [chartsTop, setChartsTop] = useState([]);
    const [chartsBottom, setChartsBottom] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        teacherService.getDashboard()
            .then(data => {
                const totalMinutes = data.totalHours;
                const hours = Math.floor(totalMinutes / 60);
                const minutes = totalMinutes % 60;

                setMetrics([
                    {
                        title: "Total de Aulas",
                        value: data.totalLessons,
                        subtitle: "Aulas registradas",
                        icon: <BookOpen size={20} color="gray" />
                    },
                    {
                        title: "Cancelamentos",
                        value: `${data.cancellationPercentage.toFixed(1)}%`,
                        subtitle: "Taxa de cancelamento",
                        icon: <AlertCircle size={20} color="gray" />
                    },
                    {
                        title: "Tempo Total",
                        value: `${hours}h ${minutes}m`,
                        subtitle: "Tempo ministrado",
                        icon: <Clock size={20} color="gray" />
                    },
                ]);

                setChartsTop([{
                    title: "Por Disciplinas",
                    type: "bar",
                    data: {
                        labels: data.lessonsByDiscipline.map(d => translateSubject(d.subject).substring(0, 3)),
                        datasets: [{
                            data: data.lessonsByDiscipline.map(d => d.count)
                        }]
                    },
                    color: "rgba(59, 130, 246, 0.5)"
                }]);

                setChartsBottom([{
                    title: "Por Dia",
                    type: "bar",
                    data: {
                        labels: data.lessonsByWeekday.map(w => (mapWeekdayToLabel[w.weekday] || String(w.weekday)).substring(0, 3)),
                        datasets: [{
                            data: data.lessonsByWeekday.map(w => w.count)
                        }]
                    },
                    color: "rgba(59, 78, 246, 0.7)"
                }]);
            })
            .catch(err => console.error("Erro dashboard:", err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <View style={styles.centered}><ActivityIndicator size="large" color="#3970B7" /></View>;

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.pageTitle}>Métricas e Desempenho</Text>

            <View style={styles.metricsContainer}>
                {metrics.map((item, idx) => (
                    <View key={idx} style={styles.metricItem}>
                        <InfoCard {...item} />
                    </View>
                ))}
            </View>

            <View style={styles.chartsContainer}>
                {chartsTop.map((cfg, i) => (
                    <GraphCard key={`top-${i}`} title={cfg.title} data={cfg.data} />
                ))}
                {chartsBottom.map((cfg, i) => (
                    <GraphCard key={`btm-${i}`} title={cfg.title} data={cfg.data} />
                ))}
            </View>
            <View style={{ height: 40 }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB', // gray-50
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
        color: '#111827', // gray-900
        marginBottom: 24,
    },
    metricsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 24,
        gap: 16,
    },
    metricItem: {
        width: '30%',
        minWidth: 100,
        flex: 1,
    },
    chartsContainer: {
        gap: 24,
    },
});
