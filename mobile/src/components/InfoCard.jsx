import React from "react";
import { View, Text, StyleSheet } from 'react-native';

export default function InfoCard({ title, value, icon, subtitle }) {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>{title}</Text>
                {icon}
            </View>
            <Text style={styles.value}>{value}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 1,
        elevation: 1,
        borderWidth: 1,
        borderColor: '#E5E7EB', // gray-200
        marginBottom: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    title: {
        fontSize: 14, // text-sm
        color: '#6B7280', // gray-500
    },
    value: {
        fontSize: 20, // text-xl
        fontWeight: 'bold',
        color: '#111827', // gray-900
    },
    subtitle: {
        fontSize: 14, // text-sm
        color: '#3970B7',
        marginTop: 4,
    },
});
