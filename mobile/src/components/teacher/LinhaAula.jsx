import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { translateSubject, translateAppointmentStatus } from '../../utils/tradutionUtils';
import { formatPhoneNumber } from '../../utils/phoneUtils';

const LinhaAula = ({
    studentName,
    studentPhone,
    subject,
    disciplina,
    date,
    time,
    duration,
    lessonDuration,
    status,
    semAcao = false
}) => {
    const [year, month, day] = date?.split('-') || [];
    const dataFormatada = day && month && year ? `${day}/${month}/${year}` : '---';
    const horario = time ? time.slice(0, 5) : '---';

    const rawSubject = subject ?? disciplina ?? '';
    const disciplinaTraduzida = rawSubject ? translateSubject(rawSubject) : '---';

    const duracao = duration ?? lessonDuration;
    const duracaoTexto = duracao ? `${duracao} min` : '---';

    const statusStyle = getStatusStyle(status);
    const statusTraduzido = translateAppointmentStatus
        ? translateAppointmentStatus(status)
        : status;

    // Render as a Card/Row for Mobile
    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <Text style={styles.studentName}>{studentName}</Text>
                <View style={[styles.statusBadge, statusStyle]}>
                    <Text style={styles.statusText}>{statusTraduzido}</Text>
                </View>
            </View>

            <View style={styles.detailsContainer}>
                <Text style={styles.detailText}>Disciplina: {disciplinaTraduzida}</Text>
                <Text style={styles.detailText}>Data: {dataFormatada} às {horario}</Text>
                <Text style={styles.detailText}>Duração: {duracaoTexto}</Text>
                <Text style={styles.detailText}>Tel: {formatPhoneNumber(studentPhone) || '---'}</Text>
            </View>
        </View>
    );
};

function getStatusStyle(status) {
    switch (status) {
        case 'SCHEDULED':
            return { backgroundColor: '#FEF3C7' }; // yellow-100
        case 'COMPLETED':
            return { backgroundColor: '#DCFCE7' }; // green-100
        case 'CANCELLED':
            return { backgroundColor: '#FEE2E2' }; // red-100
        default:
            return { backgroundColor: '#F3F4F6' }; // gray-100
    }
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6', // gray-100
        padding: 16,
        marginBottom: 8,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 1,
        elevation: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    studentName: {
        fontWeight: 'bold',
        color: '#1F2937', // gray-800
        fontSize: 16, // text-base
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    statusText: {
        fontSize: 12, // text-xs
        fontWeight: 'bold',
        color: '#1F2937', // gray-800 mostly but can check contrast
    },
    detailsContainer: {
        gap: 4,
    },
    detailText: {
        color: '#4B5563', // gray-600
    },
});

export default LinhaAula;
