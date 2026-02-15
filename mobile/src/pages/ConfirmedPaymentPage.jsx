import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { CheckCircle } from 'lucide-react-native';
import { translateSubject } from '../utils/tradutionUtils';

const InfoRow = ({ label, value, striped }) => (
    <View style={[styles.infoRow, striped && styles.infoRowStriped]}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
    </View>
);

export default function ConfirmedPaymentPage() {
    const navigation = useNavigation();
    const route = useRoute();
    const { appointmentId } = route.params || {};
    const [loading, setLoading] = useState(true);
    const [appointment, setAppointment] = useState(null);

    useEffect(() => {
        setTimeout(() => {
            setAppointment({
                id: appointmentId,
                location: "Online",
                lessonDuration: 60,
                dateTime: new Date().toISOString(),
                teacher: { name: "Professor Teste", subject: "Mathematics" }
            });
            setLoading(false);
        }, 1000);
    }, [appointmentId]);

    if (loading) return <View style={styles.centered}><ActivityIndicator size="large" color="#3970B7" /></View>;

    const { location, lessonDuration, dateTime, teacher } = appointment || {};
    const dateFormatted = new Date(dateTime).toLocaleDateString('pt-BR');
    const timeFormatted = new Date(dateTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <CheckCircle size={64} color="#16a34a" />
                <Text style={styles.title}>Agendamento Concluído!</Text>
                <Text style={styles.subtitle}>
                    Sua aula foi agendada com sucesso.
                </Text>
            </View>

            <View style={styles.detailsContainer}>
                <InfoRow label="Matéria" value={translateSubject(teacher?.subject)} striped />
                <InfoRow label="Local" value={location} />
                <InfoRow label="Duração" value={`${Math.floor(lessonDuration / 60)}h${lessonDuration % 60}min`} striped />
                <InfoRow label="Professor" value={teacher?.name} />
                <InfoRow label="Data" value={dateFormatted} striped />
                <InfoRow label="Horário" value={timeFormatted} />
            </View>

            <TouchableOpacity
                onPress={() => navigation.navigate('Dashboard')}
                style={styles.button}
            >
                <Text style={styles.buttonText}>Voltar ao Início</Text>
            </TouchableOpacity>
            <View style={{ height: 40 }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB', // gray-50
        padding: 16,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        alignItems: 'center',
        marginTop: 32,
        marginBottom: 24,
    },
    title: {
        fontSize: 24, // text-2xl
        fontWeight: 'bold',
        color: '#1F2937', // gray-800
        marginTop: 16,
    },
    subtitle: {
        textAlign: 'center',
        color: '#4B5563', // gray-600
        marginTop: 8,
        paddingHorizontal: 32,
    },
    detailsContainer: {
        backgroundColor: 'white',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E5E7EB', // gray-200
        overflow: 'hidden',
        marginBottom: 32,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 12,
        backgroundColor: 'white',
    },
    infoRowStriped: {
        backgroundColor: '#F3F4F6', // gray-100
    },
    infoLabel: {
        fontWeight: '600',
        color: '#374151', // gray-700
    },
    infoValue: {
        color: '#111827', // gray-900
    },
    button: {
        backgroundColor: '#3970B7',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18, // text-lg
    },
});
