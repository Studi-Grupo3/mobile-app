import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import { teacherService } from '../../services/teacherService';
import { mockTeacherService } from '../../mocks/mockServices';
import { translateSubject } from '../../utils/tradutionUtils';
import { TeacherAppointmentCard } from '../../components/teacher/TeacherAppointmentCard';
import { AppointmentModal } from '../../components/common/AppointmentModal';
import { InfoCard } from '../../components/common/InfoCard';
import { DollarSign, Users, Clock } from 'lucide-react-native';

export default function TeacherClassesPage() {
    const [stats, setStats] = useState(null);
    const [loadingStats, setLoadingStats] = useState(true);
    const [lessons, setLessons] = useState([]);
    const [loadingLessons, setLoadingLessons] = useState(true);
    const [errorLessons, setErrorLessons] = useState(null);
    const [selectedLesson, setSelectedLesson] = useState(null);
    const [openModal, setOpenModal] = useState(false);

    const fetchLessons = () => {
        setLoadingLessons(true);
        mockTeacherService.getProximasAulas()
            .then(data => {
                const safeData = Array.isArray(data) ? data : [];
                setLessons(safeData);
                setErrorLessons(null);
            })
            .catch(err => {
                console.error("Erro fetchLessons:", err);
                setErrorLessons("Não foi possível carregar as aulas.");
            })
            .finally(() => setLoadingLessons(false));
    };

    useEffect(() => {
        mockTeacherService.getStats()
            .then(setStats)
            .catch(() => setStats(null))
            .finally(() => setLoadingStats(false));

        fetchLessons();
    }, []);

    const handleDetails = (l) => {
        const adapted = {
            ...l,
            professorName: l.studentName,
            professorTitle: "Aluno",
            professorImageUrl: null,
            subject: l.subject,
            dateTime: `${l.date}T${l.time}`,
            duration: l.duration
        };
        setSelectedLesson(adapted);
        setOpenModal(true);
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Minhas Aulas</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.pageTitle}>Bem-vindo, Professor!</Text>

                {/* Stats Cards */}
                <View style={styles.statsContainer}>
                    <View style={styles.halfWidth}>
                        <InfoCard
                            title="Aulas Hoje"
                            value={loadingStats ? "..." : (stats?.aulasHoje ?? 0)}
                            icon={<DollarSign size={20} color="gray" />}
                            subtitle={loadingStats ? "" : stats?.aulasHojeSubtitle}
                        />
                    </View>
                    <View style={styles.halfWidth}>
                        <InfoCard
                            title="Semana"
                            value={loadingStats ? "..." : (stats?.aulasSemana ?? 0)}
                            icon={<Users size={20} color="gray" />}
                            subtitle={loadingStats ? "" : stats?.aulasSemanaSubtitle}
                        />
                    </View>
                    <View style={styles.fullWidth}>
                        <InfoCard
                            title="Horas Ministradas"
                            value={loadingStats ? "..." : (stats?.horasMinistradas ?? "0h")}
                            icon={<Clock size={20} color="gray" />}
                            subtitle={loadingStats ? "" : stats?.horasMinistradasSubtitle}
                        />
                    </View>
                </View>

                {/* Lessons List */}
                <Text style={styles.sectionTitle}>Próximas Aulas</Text>

                {loadingLessons && <ActivityIndicator size="large" color="#3970B7" />}
                {errorLessons && <Text style={styles.errorText}>{errorLessons}</Text>}

                {!loadingLessons && !errorLessons && lessons.length === 0 && (
                    <Text style={styles.emptyText}>Nenhuma aula agendada.</Text>
                )}

                {!loadingLessons && !errorLessons && lessons.map(l => (
                    <View key={l.id} style={styles.lessonItem}>
                        <TeacherAppointmentCard
                            subject={translateSubject(l.subject)}
                            studentName={l.studentName}
                            studentPhone={null}
                            studentImageUrl={null}
                            date={new Date(l.date + "T" + l.time).toLocaleDateString("pt-BR")}
                            time={l.time}
                            duration={`${l.duration}min`}
                            location={l.modality === "ONLINE" ? "Online" : "Presencial"}
                            status={l.status}
                            online={l.modality === "ONLINE"}
                            onDetailsClick={() => handleDetails(l)}
                        />
                    </View>
                ))}
            </ScrollView>

            <AppointmentModal
                isOpen={openModal}
                onClose={() => setOpenModal(false)}
                appointment={selectedLesson}
                onUpdate={fetchLessons}
                isTeacherView={true}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9fbfc',
    },
    header: {
        backgroundColor: 'white',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB', // gray-200
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1F2937', // gray-800
    },
    scrollContent: {
        padding: 16,
    },
    pageTitle: {
        fontSize: 24, // text-2xl
        fontWeight: 'bold',
        color: '#1F2937', // gray-800
        marginBottom: 24,
    },
    statsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 16,
        marginBottom: 32,
    },
    halfWidth: {
        width: '47%', // approx 48% with gap
        marginBottom: 8,
    },
    fullWidth: {
        width: '100%',
    },
    sectionTitle: {
        fontSize: 20, // text-xl
        fontWeight: 'bold',
        marginBottom: 16,
    },
    errorText: {
        color: '#EF4444', // red-500
    },
    emptyText: {
        color: '#6B7280', // gray-500
        textAlign: 'center',
        paddingVertical: 16,
    },
    lessonItem: {
        marginBottom: 16,
    },
});
