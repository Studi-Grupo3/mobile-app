import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Filter } from 'lucide-react-native';

export const FilterButton = ({ labels, selectedFilter, onSelectFilter }) => {
    const filterKeys = Object.keys(labels);
    const sortedKeys = ['ALL', ...filterKeys.filter(k => k !== 'ALL')];

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Filter size={16} color="#6b7280" style={{ marginRight: 6 }} />
                <Text style={styles.headerText}>Filtrar por</Text>
            </View>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {sortedKeys.map(key => {
                    const isSelected = selectedFilter === key;
                    return (
                        <TouchableOpacity
                            key={key}
                            onPress={() => onSelectFilter(key)}
                            style={[
                                styles.chip,
                                isSelected ? styles.chipSelected : styles.chipUnselected
                            ]}
                        >
                            <Text
                                style={[
                                    styles.chipText,
                                    isSelected ? styles.chipTextSelected : styles.chipTextUnselected
                                ]}
                            >
                                {labels[key]}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        paddingHorizontal: 4,
    },
    headerText: {
        color: '#6B7280', // gray-500
        fontSize: 12, // text-xs
        textTransform: 'uppercase',
        fontWeight: 'bold',
    },
    scrollContent: {
        gap: 8,
        paddingHorizontal: 4,
    },
    chip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 9999, // rounded-full
        borderWidth: 1,
    },
    chipSelected: {
        backgroundColor: '#3970B7',
        borderColor: '#3970B7',
    },
    chipUnselected: {
        backgroundColor: 'white',
        borderColor: '#D1D5DB', // gray-300
    },
    chipText: {
        fontSize: 12, // text-xs
        fontWeight: 'bold',
    },
    chipTextSelected: {
        color: 'white',
    },
    chipTextUnselected: {
        color: '#4B5563', // gray-600
    },
});
