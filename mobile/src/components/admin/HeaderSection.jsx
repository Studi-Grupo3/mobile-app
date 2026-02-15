import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export function HeaderSection({ title }) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        paddingVertical: 16,
        paddingHorizontal: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 1,
        elevation: 1,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6', // gray-100
    },
    title: {
        fontSize: 18, // text-lg
        fontWeight: '600',
        color: '#1F2937', // gray-800
    },
});
