import React from 'react';
import { View, ScrollView, Text, StyleSheet } from 'react-native';
import { SecuritySettings } from '../../components/admin/settings/SecuritySettings';

export default function ConfiguracoesPage() {
    return (
        <ScrollView style={styles.container}>
            <Text style={styles.pageTitle}>Configurações</Text>
            <View style={styles.card}>
                <Text style={styles.sectionTitle}>Segurança</Text>
                <SecuritySettings />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6', // gray-100
        padding: 16,
    },
    pageTitle: {
        fontSize: 24, // text-2xl
        fontWeight: 'bold',
        color: '#1F2937', // gray-800
        marginBottom: 24,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 16,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 1,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18, // text-lg
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#1F2937', // gray-800
    },
});
