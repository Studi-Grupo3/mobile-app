import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Eye, Download, FileText } from 'lucide-react-native';
import { teacherService } from "../services/teacherService";

export default function MateriaisAlunos() {
    const [materiais, setMateriais] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        teacherService.getMateriaisAlunos?.()
            .then(setMateriais)
            .catch(() => setMateriais([]))
            .finally(() => setLoading(false));
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Materiais dos Alunos</Text>
            <Text style={styles.subtitle}>
                Visualize e baixe os materiais compartilhados pelos alunos
            </Text>

            {loading && <Text>Carregando...</Text>}

            <View style={styles.listContainer}>
                {materiais.map((item) => (
                    <View
                        key={item.id}
                        style={styles.card}
                    >
                        <View style={styles.cardContent}>
                            <View style={styles.iconContainer}>
                                <FileText size={24} color="#374151" />
                            </View>
                            <View style={styles.infoContainer}>
                                <Text style={styles.itemTitle}>{item.titulo}</Text>
                                <View style={styles.metaRow}>
                                    <Text style={styles.metaText}>{item.autor}</Text>
                                    <Text style={styles.metaSeparator}>•</Text>
                                    <Text style={styles.metaText}>{item.data}</Text>
                                </View>
                                <View style={styles.tagRow}>
                                    <View style={styles.tagContainer}>
                                        <Text style={styles.tagText}>{item.categoria}</Text>
                                    </View>
                                    <Text style={styles.metaText}>{item.tamanho}</Text>
                                </View>
                            </View>
                        </View>

                        <View style={styles.actionsContainer}>
                            <TouchableOpacity>
                                <Eye size={20} color="#4b5563" />
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <Download size={20} color="#4b5563" />
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        padding: 24,
        marginBottom: 24,
    },
    title: {
        fontSize: 24, // text-2xl
        fontWeight: 'bold',
        color: '#1F2937', // gray-800
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14, // text-sm
        color: '#6B7280', // gray-500
        marginBottom: 16,
    },
    listContainer: {
        gap: 16,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB', // gray-200
        borderRadius: 12, // rounded-xl
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
        flex: 1,
    },
    iconContainer: {
        padding: 12,
        borderRadius: 8,
        backgroundColor: '#F3F4F6', // gray-100
    },
    infoContainer: {
        flex: 1,
    },
    itemTitle: {
        fontWeight: '600',
        color: '#1F2937', // gray-800
        fontSize: 16, // text-base
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 4,
    },
    metaText: {
        fontSize: 14, // text-sm
        color: '#6B7280', // gray-500
    },
    metaSeparator: {
        fontSize: 12, // text-xs
        color: '#9CA3AF', // gray-400
    },
    tagRow: {
        marginTop: 8,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    tagContainer: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 9999,
        backgroundColor: '#DBEAFE', // blue-100
    },
    tagText: {
        fontSize: 12, // text-xs
        fontWeight: '600',
        color: '#1E40AF', // blue-800
    },
    actionsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        marginLeft: 8,
    },
});
