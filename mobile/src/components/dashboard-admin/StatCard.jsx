import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export function StatCard({ title, subtitle, percentage, percentageColor, icon }) {
    return (
        <View style={styles.card}>
            <View style={styles.content}>
                <Text style={styles.subtitle}>{subtitle}</Text>
                <Text style={styles.title}>{title}</Text>
                {percentage && (
                    <Text style={[styles.percentage, getPercentageStyle(percentageColor)]}>
                        {percentage}
                    </Text>
                )}
            </View>
            <View style={styles.iconContainer}>
                {icon}
            </View>
        </View>
    );
}

function getPercentageStyle(colorClass) {
    if (!colorClass) return { color: '#6B7280' }; // gray-500
    if (colorClass.includes('green')) return { color: '#22C55E' }; // green-500
    if (colorClass.includes('red')) return { color: '#EF4444' }; // red-500
    if (colorClass.includes('yellow')) return { color: '#EAB308' }; // yellow-500
    return { color: '#6B7280' };
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: 'white',
        borderRadius: 12, // rounded-xl
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 1,
        elevation: 1,
        paddingHorizontal: 20, // px-5
        paddingVertical: 16, // py-4
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 16,
    },
    content: {
        flex: 1,
        marginRight: 16,
    },
    subtitle: {
        fontSize: 14, // text-sm
        color: '#6B7280', // gray-500
        marginBottom: 4,
    },
    title: {
        fontSize: 24, // text-2xl
        fontWeight: 'bold',
        color: '#111827', // gray-900
    },
    percentage: {
        fontSize: 14, // text-sm
        marginTop: 4,
    },
    iconContainer: {
        backgroundColor: '#EEF2FF', // indigo-50
        padding: 8,
        borderRadius: 24, // rounded-full
        alignItems: 'center',
        justifyContent: 'center',
        width: 48,
        height: 48,
    },
});
