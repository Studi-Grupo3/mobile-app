import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { CalendarDays, Clock, MapPin, Download, ExternalLink } from 'lucide-react-native';
import { teacherService } from "../services/teacherService";

export default function ProximasAulas() {
    const [aulas, setAulas] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        teacherService.getPendingLessons()
            .then(data => {
                if (isMounted) setAulas(Array.isArray(data) ? data : []);
            })
            .catch(() => {
                if (isMounted) setAulas([]);
            })
            .finally(() => {
                if (isMounted) setLoading(false);
            });
        return () => { isMounted = false; };
    }, []);

    if (loading) {
        return <View style={styles.container}><Text>Carregando aulas...</Text></View>;
    }

    return (
        <View style={styles.card}>
            <Text style={styles.title}>Próximas Aulas</Text>
            <Text style={styles.subtitle}>
                Veja suas aulas agendadas para os próximos dias
            </Text>

            {aulas.length === 0 ? (
                <Text style={styles.emptyText}>Nenhuma aula agendada.</Text>
            ) : (
                aulas.map((aula) => (
                    <View key={aula.id} style={styles.aulaCard}>
                        <View style={[styles.statusBadge, getStatusStyle(aula.statusCor)]}>
                            <Text style={styles.statusText}>{aula.status}</Text>
                        </View>

                        <Text style={styles.aulaTitle}>{aula.disciplina || aula.titulo}</Text>
                        <Text style={styles.aulaStudent}>Aluno: {aula.studentName || aula.aluno}</Text>

                        <View style={styles.infoContainer}>
                            <View style={styles.infoRow}>
                                <CalendarDays size={16} color="gray" />
                                <Text style={styles.infoText}>{aula.date ? aula.date.split('-').reverse().join('/') : '---'}</Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Clock size={16} color="gray" />
                                <Text style={styles.infoText}>{aula.time ? aula.time.slice(0, 5) : '---'}</Text>
                            </View>
                            <View style={styles.infoRow}>
                                <MapPin size={16} color="gray" />
                                <Text style={styles.infoText}>{aula.location || aula.local}</Text>
                            </View>
                        </View>

                        <View style={styles.actionsContainer}>
                            <TouchableOpacity style={styles.actionButton}>
                                <Download size={16} color="#374151" />
                                <Text style={styles.actionButtonText}>Material</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.actionButton}>
                                <ExternalLink size={16} color="#374151" />
                                <Text style={styles.actionButtonText}>Detalhes</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ))
            )}
        </View>
    );
}

function getStatusStyle(statusClass) {
    if (!statusClass) return { backgroundColor: '#F3F4F6' }; // gray-100
    if (statusClass.includes('green')) return { backgroundColor: '#DCFCE7' }; // green-100
    if (statusClass.includes('yellow')) return { backgroundColor: '#FEF9C3' }; // yellow-100
    if (statusClass.includes('red')) return { backgroundColor: '#FEE2E2' }; // red-100
    return { backgroundColor: '#F3F4F6' };
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 1,
        width: '100%',
        marginBottom: 24,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#111827', // gray-900
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        color: '#6B7280', // gray-500
        marginBottom: 16,
    },
    emptyText: {
        color: '#6B7280',
        fontStyle: 'italic',
    },
    aulaCard: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#E5E7EB', // gray-200
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 1,
        position: 'relative',
    },
    statusBadge: {
        position: 'absolute',
        top: 16,
        right: 16,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 9999,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#1F2937', // gray-800 usually, could customize per status color
    },
    aulaTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
        paddingRight: 64, // pr-16
        marginBottom: 4,
    },
    aulaStudent: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 12,
    },
    infoContainer: {
        gap: 8,
        marginBottom: 16,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    infoText: {
        fontSize: 14,
        color: '#374151', // gray-700
    },
    actionsContainer: {
        flexDirection: 'row',
        gap: 8,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        borderColor: '#D1D5DB', // gray-300
        borderWidth: 1,
        borderRadius: 6,
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: '#F9FAFB', // gray-50
    },
    actionButtonText: {
        fontSize: 14,
        color: '#374151',
    },
});
