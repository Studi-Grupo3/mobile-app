import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, FlatList, StyleSheet } from 'react-native';
import LinhaAula from './LinhaAula';
import { teacherService } from '../../services/teacherService';

const ITEMS_PER_PAGE = 6;

const TabelaAulas = ({ aulas: aulasProp = null, loading: loadingProp = false }) => {
    const [aulas, setAulas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        if (aulasProp) {
            setAulas(aulasProp);
            setLoading(!!loadingProp);
        } else {
            setLoading(true);
            teacherService.getLessonsHistory()
                .then(data => setAulas(Array.isArray(data) ? data : []))
                .catch(() => setAulas([]))
                .finally(() => setLoading(false));
        }
    }, [aulasProp, loadingProp]);

    const totalPages = Math.ceil(aulas.length / ITEMS_PER_PAGE);
    const paginatedAulas = aulas.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    if (loading) {
        return <ActivityIndicator size="large" color="#3970B7" style={styles.loader} />;
    }

    if (aulas.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Nenhuma aula encontrada.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={paginatedAulas}
                keyExtractor={(item, index) => String(index + (currentPage - 1) * ITEMS_PER_PAGE)}
                renderItem={({ item }) => <LinhaAula {...item} semAcao />}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={<Text style={styles.emptyPageText}>Nenhuma aula na página.</Text>}
            />

            {/* Pagination */}
            {totalPages > 1 && (
                <View style={styles.paginationContainer}>
                    <TouchableOpacity onPress={() => setCurrentPage(1)} disabled={currentPage === 1} style={[styles.pageButton, currentPage === 1 && styles.disabledButton]}>
                        <Text>«</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} style={[styles.pageButton, currentPage === 1 && styles.disabledButton]}>
                        <Text>‹</Text>
                    </TouchableOpacity>

                    <Text style={styles.pageInfoText}>Pág {currentPage} de {totalPages}</Text>

                    <TouchableOpacity onPress={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} style={[styles.pageButton, currentPage === totalPages && styles.disabledButton]}>
                        <Text>›</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} style={[styles.pageButton, currentPage === totalPages && styles.disabledButton]}>
                        <Text>»</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loader: {
        paddingVertical: 32,
    },
    emptyContainer: {
        paddingVertical: 32,
        alignItems: 'center',
    },
    emptyText: {
        color: '#6B7280', // gray-500
    },
    listContent: {
        paddingBottom: 16,
    },
    emptyPageText: {
        textAlign: 'center',
        paddingVertical: 16,
        color: '#6B7280',
    },
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: 8,
        marginTop: 16,
        paddingBottom: 16,
    },
    pageButton: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderWidth: 1,
        borderColor: '#E5E7EB', // gray-200
        borderRadius: 4,
    },
    disabledButton: {
        opacity: 0.3,
    },
    pageInfoText: {
        fontSize: 14,
        color: '#374151',
    },
});

export default TabelaAulas;
