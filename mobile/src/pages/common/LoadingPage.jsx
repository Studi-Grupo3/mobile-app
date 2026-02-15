import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';

export default function LoadingPage() {
    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color="#3970B7" />
            <Text style={styles.text}>Carregando...</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F9FAFB', // gray-50
    },
    text: {
        color: '#4B5563', // gray-600
        marginTop: 16,
    },
});
