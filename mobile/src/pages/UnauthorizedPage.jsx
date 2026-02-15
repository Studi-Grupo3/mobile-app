import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ShieldAlert } from 'lucide-react-native';

export default function UnauthorizedPage() {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <ShieldAlert size={64} color="#f59e0b" />
            <Text style={styles.title}>Acesso Negado</Text>
            <Text style={styles.subtitle}>
                Você não tem permissão para acessar esta página.
            </Text>
            <TouchableOpacity
                onPress={() => navigation.navigate('Login')}
                style={styles.button}
            >
                <Text style={styles.buttonText}>Ir para Login</Text>
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
