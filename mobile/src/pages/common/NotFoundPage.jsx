import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AlertCircle } from 'lucide-react-native';

export default function NotFoundPage() {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <AlertCircle size={64} color="#ef4444" />
            <Text style={styles.title}>Página não encontrada</Text>
            <Text style={styles.subtitle}>
                A página que você está procurando não existe ou foi movida.
            </Text>
            <TouchableOpacity
                onPress={() => navigation.navigate('Dashboard')} // Or 'Home'
                style={styles.button}
            >
                <Text style={styles.buttonText}>Voltar ao Início</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F9FAFB', // gray-50
        padding: 16,
    },
    title: {
        fontSize: 24, // text-2xl
        fontWeight: 'bold',
        color: '#1F2937', // gray-800
        marginTop: 16,
    },
    subtitle: {
        color: '#4B5563', // gray-600
        marginTop: 8,
        textAlign: 'center',
        marginBottom: 32,
    },
    button: {
        backgroundColor: '#3970B7',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});
