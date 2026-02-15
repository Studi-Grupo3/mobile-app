import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { User, Calendar, Clock } from 'lucide-react-native';
import { teacherService } from '../../services/teacherService';
import { mockTeacherService } from '../../mocks/mockServices';

const Tag = ({ children, colorStyles }) => (
    <View style={[styles.tag, colorStyles]}>
        <Text style={styles.tagText}>{children}</Text>
    </View>
);

export default function TeacherRequests() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    // const [page, setPage] = useState(1); // Unused in RN simple list

    useEffect(() => {
        setLoading(true);
        mockTeacherService.getRequests()
            .then(data => setRequests(Array.isArray(data) ? data : []))
            .catch(() => setRequests([]))
            .finally(() => setLoading(false));
    }, []);

    const renderItem = ({ item: req }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <View>
                    <Text style={styles.subject}>{req.disciplina}</Text>
                    <View style={styles.studentRow}>
                        <User size={12} color="gray" />
                        <Text style={styles.studentName}>{req.professor}</Text>
                    </View>
                </View>
                <View style={styles.tagsContainer}>
                    <Tag colorStyles={styles.tagYellow}>{req.status}</Tag>
                </View>
            </View>

            <View style={styles.cardBody}>
                <View style={styles.infoColumn}>
                    <View style={styles.infoRow}>
                        <Calendar size={12} color="gray" />
                        <Text style={styles.infoText}>{req.dataOriginal}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Clock size={12} color="gray" />
                        <Text style={styles.infoText}>{req.horaOriginal}</Text>
                    </View>
                    <Text style={styles.motifText}>
                        <Text style={styles.bold}>Motivo:</Text> {req.motivo}
                    </Text>
                </View>

                {req.tipo === 'Reagendamento' && (
                    <View style={styles.rescheduleColumn}>
                        <Text style={styles.rescheduleTitle}>Nova Data:</Text>
                        <View style={styles.infoRow}>
                            <Calendar size={12} color="gray" />
                            <Text style={styles.infoText}>{req.novaData}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Clock size={12} color="gray" />
                            <Text style={styles.infoText}>{req.novaHora}</Text>
                        </View>
                    </View>
                )}
            </View>

            <View style={styles.cardFooter}>
                <Text style={styles.dateText}>Solicitada em {req.dataSolicitacao}</Text>
                <TouchableOpacity style={styles.detailsButton}>
                    <Text style={styles.detailsButtonText}>Detalhes</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Solicitações</Text>
            </View>

            {loading ? (
                <View style={styles.centered}>
                    <ActivityIndicator size="large" color="#3970B7" />
                </View>
            ) : (
                <FlatList
                    data={requests}
                    keyExtractor={(item) => String(item.id)}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyText}>Nenhuma solicitação encontrada.</Text>
                        </View>
                    }
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB', // gray-50
    },
    header: {
        backgroundColor: 'white',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB', // gray-200
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1F2937', // gray-800
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        padding: 16,
    },
    card: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#E5E7EB', // gray-200
        borderRadius: 8,
        marginBottom: 12, // mb-3
        padding: 12, // p-3
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 1,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    subject: {
        fontWeight: '600',
        color: '#111827', // gray-900
        fontSize: 14,
    },
    studentRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    studentName: {
        fontSize: 12,
        color: '#374151', // gray-700
        marginLeft: 4,
    },
    tagsContainer: {
        flexDirection: 'row',
        gap: 4,
    },
    tag: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        alignSelf: 'flex-start',
    },
    tagText: {
        fontSize: 10,
        fontWeight: '600',
    },
    tagYellow: {
        backgroundColor: '#FEF9C3', // yellow-100
    },
    cardBody: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 8,
    },
    infoColumn: {
        flex: 1,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    infoText: {
        fontSize: 12,
        color: '#374151', // gray-700
        marginLeft: 4,
    },
    motifText: {
        fontSize: 12,
        color: '#374151', // gray-700
        marginTop: 4,
    },
    bold: {
        fontWeight: 'bold',
    },
    rescheduleColumn: {
        flex: 1,
        borderLeftWidth: 1,
        borderLeftColor: '#F3F4F6', // gray-100
        paddingLeft: 8,
    },
    rescheduleTitle: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#374151', // gray-700
        marginBottom: 4,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: '#F9FAFB', // gray-50
    },
    dateText: {
        fontSize: 10,
        color: '#9CA3AF', // gray-400
    },
    detailsButton: {
        borderWidth: 1,
        borderColor: '#D1D5DB', // gray-300
        borderRadius: 4,
        paddingHorizontal: 12,
        paddingVertical: 4,
    },
    detailsButtonText: {
        fontSize: 12,
        color: '#374151', // gray-700
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    emptyText: {
        color: '#6B7280', // gray-500
    },
});
