import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react-native';

const ITEMS_PER_PAGE = 5;

export function TableSection({ title, columns, data, action }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');

    const safeData = Array.isArray(data) ? data : [];
    const filteredData = safeData.filter(row =>
        columns.some(col => {
            if (col.accessor) {
                return String(row[col.accessor] || '')
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase());
            }
            return false;
        })
    );

    const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
    const paginatedData = filteredData.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const renderCard = ({ item }) => (
        <View style={styles.card}>
            {columns.map((col, i) => {
                const content = col.render ? col.render(item) : item[col.accessor];
                let displayContent = content;

                if (!col.render && col.accessor === 'status') {
                    const statusVal = item[col.accessor];
                    const isGreen = statusVal === 'Ativo';
                    const isRed = statusVal === 'Inativo';
                    const bg = isGreen ? '#dcfce7' : isRed ? '#fee2e2' : '#f3f4f6';
                    const txt = isGreen ? '#166534' : isRed ? '#991b1b' : '#1f2937';

                    displayContent = (
                        <View style={[styles.statusBadge, { backgroundColor: bg }]}>
                            <Text style={[styles.statusText, { color: txt }]}>{statusVal}</Text>
                        </View>
                    );
                } else if (typeof displayContent === 'string' || typeof displayContent === 'number') {
                    displayContent = <Text style={styles.cellText}>{displayContent}</Text>;
                }

                return (
                    <View key={i} style={styles.cardRow}>
                        <Text style={styles.cardLabel}>{col.label}</Text>
                        <View style={styles.cardValueContainer}>
                            {displayContent}
                        </View>
                    </View>
                );
            })}
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>{title}</Text>

                <View style={styles.searchRow}>
                    <View style={styles.searchContainer}>
                        <Search size={16} color="#9ca3af" />
                        <TextInput
                            placeholder="Buscar..."
                            value={searchQuery}
                            onChangeText={t => { setSearchQuery(t); setCurrentPage(1); }}
                            style={styles.searchInput}
                        />
                    </View>
                    {action && <View>{action}</View>}
                </View>
            </View>

            <FlatList
                data={paginatedData}
                keyExtractor={(_, index) => String(index)}
                renderItem={renderCard}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>Nenhum registro encontrado.</Text>
                }
            />

            {totalPages > 1 && (
                <View style={styles.pagination}>
                    <TouchableOpacity
                        disabled={currentPage === 1}
                        onPress={() => setCurrentPage(p => Math.max(p - 1, 1))}
                        style={[styles.pageButton, currentPage === 1 ? styles.pageButtonDisabled : styles.pageButtonActive]}
                    >
                        <ChevronLeft size={20} color={currentPage === 1 ? '#d1d5db' : '#3970B7'} />
                    </TouchableOpacity>

                    <Text style={styles.pageInfo}>
                        Página {currentPage} de {totalPages}
                    </Text>

                    <TouchableOpacity
                        disabled={currentPage === totalPages}
                        onPress={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                        style={[styles.pageButton, currentPage === totalPages ? styles.pageButtonDisabled : styles.pageButtonActive]}
                    >
                        <ChevronRight size={20} color={currentPage === totalPages ? '#d1d5db' : '#3970B7'} />
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 1,
        elevation: 1,
        marginBottom: 24,
        flex: 1,
        overflow: 'hidden',
    },
    header: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6', // gray-100
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1F2937', // gray-800
        marginBottom: 16,
    },
    searchRow: {
        flexDirection: 'row',
        gap: 8,
    },
    searchContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#D1D5DB', // gray-300
        borderRadius: 6,
        paddingHorizontal: 12,
        backgroundColor: 'white',
    },
    searchInput: {
        flex: 1,
        paddingVertical: 8,
        paddingHorizontal: 8,
        fontSize: 14,
    },
    listContent: {
        padding: 16,
    },
    emptyText: {
        textAlign: 'center',
        color: '#6B7280', // gray-500
        paddingVertical: 16,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB', // gray-200
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 1,
        elevation: 1,
    },
    cardRow: {
        marginBottom: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    cardLabel: {
        color: '#6B7280', // gray-500
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'uppercase',
        width: '33%',
        marginRight: 8,
    },
    cardValueContainer: {
        flex: 1,
        alignItems: 'flex-end',
    },
    cellText: {
        color: '#1F2937', // gray-800
        fontSize: 14,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
        alignSelf: 'flex-start',
    },
    statusText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    pagination: {
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6', // gray-100
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 16,
    },
    pageButton: {
        padding: 8,
        borderRadius: 6,
        borderWidth: 1,
    },
    pageButtonDisabled: {
        borderColor: '#E5E7EB', // gray-200
        backgroundColor: '#F9FAFB', // gray-50
    },
    pageButtonActive: {
        borderColor: '#3970B7',
    },
    pageInfo: {
        color: '#4B5563', // gray-600
        fontSize: 14,
    },
});
