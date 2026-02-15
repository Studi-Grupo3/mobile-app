import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import TabelaAulas from '../components/TabelaAulas';
import { teacherService } from '../services/teacherService';

export default function TeacherLessonsHistoryPage() {
    const [historico, setHistorico] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        teacherService.getLessonsHistory()
            .then(data => setHistorico(Array.isArray(data) ? data : []))
            .catch(() => setHistorico([]))
            .finally(() => setLoading(false));
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>Aulas ministradas</Text>
                <Text style={styles.subtitle}>
                    Histórico de aulas concluídas e canceladas.
                </Text>
                {loading ? (
                    <ActivityIndicator size="large" color="#3970B7" />
                ) : (
                    <TabelaAulas aulas={historico} />
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB', // gray-50
        padding: 16,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 16,
        elevation: 1, // shadow-sm
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 1,
        flex: 1, // h-full
    },
    title: {
        fontSize: 20, // text-xl
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#1F2937', // gray-800
    },
    subtitle: {
        fontSize: 14, // text-sm
        color: '#6B7280', // gray-500
        marginBottom: 16,
    },
});
