import React from 'react';
import { View, ScrollView, Text, StyleSheet } from 'react-native';
import { SecuritySettings } from '../../components/admin/settings/SecuritySettings';

export default function ConfiguracoesPage() {
    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
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
        backgroundColor: '#F3F4F6',
    },
    content: {
        padding: 16,
        paddingBottom: 32,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 3,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 16,
        color: '#1F2937', // gray-800
    },
});
