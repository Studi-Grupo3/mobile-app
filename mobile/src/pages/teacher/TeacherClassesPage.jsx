import React, { useEffect, useState, useCallback } from 'react';
import {
    View, Text, ScrollView, ActivityIndicator, StyleSheet,
    TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { teacherService } from '../../services/teacherService';
import { translateSubject } from '../../utils/tradutionUtils';
import { getStudentImage } from '../../mocks/mockImages';
import { TeacherAppointmentCard } from '../../components/teacher/TeacherAppointmentCard';
import { AppointmentModal } from '../../components/common/AppointmentModal';
import { InfoCard } from '../../components/common/InfoCard';
import { BookOpen, Clock, Calendar } from 'lucide-react-native';

const TABS = [
    { key: 'upcoming', label: 'Próximas' },
    { key: 'history', label: 'Histórico' },
];

export default function TeacherClassesPage() {
    const insets = useSafeAreaInsets();
    const [activeTab, setActiveTab] = useState('upcoming');

    /* data */
    const [stats, setStats] = useState(null);
    const [loadingStats, setLoadingStats] = useState(true);
    const [upcoming, setUpcoming] = useState([]);
    const [loadingUpcoming, setLoadingUpcoming] = useState(true);
    const [history, setHistory] = useState([]);
    const [loadingHistory, setLoadingHistory] = useState(true);

    /* modal */
    const [selectedLesson, setSelectedLesson] = useState(null);
    const [openModal, setOpenModal] = useState(false);

    /* ---- fetch helpers ---- */
    const fetchUpcoming = useCallback(() => {
        setLoadingUpcoming(true);
        teacherService.getProximasAulas()
            .then(d => setUpcoming(Array.isArray(d) ? d : []))
            .catch(() => setUpcoming([]))
            .finally(() => setLoadingUpcoming(false));
    }, []);

    const fetchHistory = useCallback(() => {
        setLoadingHistory(true);
        teacherService.getLessonsHistory()
            .then(d => setHistory(Array.isArray(d) ? d : []))
            .catch(() => setHistory([]))
            .finally(() => setLoadingHistory(false));
    }, []);

    useEffect(() => {
        teacherService.getStats()
            .then(setStats)
            .catch(() => setStats(null))
            .finally(() => setLoadingStats(false));

        fetchUpcoming();
        fetchHistory();
    }, []);

    const IMAGE_SOURCE_CONFIG = { useMock: true };

    const resolveStudentImage = (imageUrl, studentName) => {
        if (imageUrl && imageUrl.startsWith('http')) return imageUrl;
        if (IMAGE_SOURCE_CONFIG.useMock) return getStudentImage(studentName);
        return null;
    };

    /* ---- modal ---- */
    const handleDetails = (l) => {
        setSelectedLesson({
            ...l,
            professorName: l.studentName,
            professorTitle: 'Aluno',
            professorImageUrl: resolveStudentImage(l.studentImageUrl, l.studentName),
            subject: l.subject || l.disciplina,
            dateTime: `${l.date}T${l.time}`,
            duration: l.lessonDuration ?? l.duration,
            online: l.online || l.location?.toLowerCase() === 'online',
            location: l.location,
            studentPhone: l.studentPhone,
            studentAddress: l.studentAddress,
            responsibleName: l.responsibleName,
            responsiblePhone: l.responsiblePhone,
            phase: l.phase,
            schoolGrade: l.schoolGrade,
            isAdult: l.isAdult,
        });
        setOpenModal(true);
    };

    /* ---- tab content ---- */
    const renderUpcoming = () => {
        if (loadingUpcoming) return <ActivityIndicator size="large" color="#3970B7" style={{ marginTop: 20 }} />;
        if (upcoming.length === 0) return <Text style={styles.emptyText}>Nenhuma aula agendada.</Text>;
        return upcoming.map(l => (
            <View key={l.id} style={styles.lessonItem}>
                <TeacherAppointmentCard
                    subject={translateSubject(l.subject || l.disciplina)}
                    studentName={l.studentName}
                    studentPhone={l.studentPhone}
                    studentImageUrl={resolveStudentImage(l.studentImageUrl, l.studentName)}
                    date={new Date(l.date + 'T' + l.time).toLocaleDateString('pt-BR')}
                    time={l.time?.substring(0, 5)}
                    duration={`${l.lessonDuration ?? l.duration} min`}
                    location={l.online || l.location?.toLowerCase() === 'online' ? 'Online' : 'Presencial'}
                    status={l.status}
                    online={l.online || l.location?.toLowerCase() === 'online'}
                    onDetailsClick={() => handleDetails(l)}
                    studentAddress={l.studentAddress}
                    responsibleName={l.responsibleName}
                    responsiblePhone={l.responsiblePhone}
                    studentAge={l.studentAge}
                    isAdult={l.isAdult}
                    phase={l.phase}
                    schoolGrade={l.schoolGrade}
                />
            </View>
        ));
    };

    const renderHistory = () => {
        if (loadingHistory) return <ActivityIndicator size="large" color="#3970B7" style={{ marginTop: 20 }} />;
        if (history.length === 0) return <Text style={styles.emptyText}>Nenhum registro no histórico.</Text>;
        return history.map(l => (
            <View key={l.id} style={styles.lessonItem}>
                <TeacherAppointmentCard
                    subject={translateSubject(l.subject || l.disciplina)}
                    studentName={l.studentName}
                    studentPhone={l.studentPhone}
                    studentImageUrl={resolveStudentImage(l.studentImageUrl, l.studentName)}
                    date={new Date(l.date + 'T' + l.time).toLocaleDateString('pt-BR')}
                    time={l.time?.substring(0, 5)}
                    duration={`${l.duration ?? l.lessonDuration} min`}
                    location={l.online || l.location?.toLowerCase() === 'online' ? 'Online' : 'Presencial'}
                    status={l.status}
                    online={l.online || l.location?.toLowerCase() === 'online'}
                    onDetailsClick={() => handleDetails(l)}
                    studentAddress={l.studentAddress}
                    responsibleName={l.responsibleName}
                    responsiblePhone={l.responsiblePhone}
                    studentAge={l.studentAge}
                    isAdult={l.isAdult}
                    phase={l.phase}
                    schoolGrade={l.schoolGrade}
                />
            </View>
        ));
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
                <Text style={styles.headerTitle}>Minhas Aulas</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* KPIs - single column */}
                <InfoCard
                    title="Aulas Hoje"
                    value={loadingStats ? '...' : (stats?.aulasHoje ?? 0)}
                    icon={<BookOpen size={20} color="#3970B7" />}
                    subtitle={loadingStats ? '' : stats?.aulasHojeSubtitle}
                />
                <InfoCard
                    title="Aulas na Semana"
                    value={loadingStats ? '...' : (stats?.aulasSemana ?? 0)}
                    icon={<Calendar size={20} color="#16A34A" />}
                    subtitle={loadingStats ? '' : stats?.aulasSemanaSubtitle}
                />
                <InfoCard
                    title="Horas Ministradas"
                    value={loadingStats ? '...' : (stats?.horasMinistradas ?? '0h')}
                    icon={<Clock size={20} color="#F59E0B" />}
                    subtitle={loadingStats ? '' : stats?.horasMinistradasSubtitle}
                />

                {/* Inner Tabs */}
                <View style={styles.tabBar}>
                    {TABS.map(t => {
                        const active = activeTab === t.key;
                        return (
                            <TouchableOpacity
                                key={t.key}
                                style={[styles.tab, active && styles.tabActive]}
                                onPress={() => setActiveTab(t.key)}
                            >
                                <Text style={[styles.tabText, active && styles.tabTextActive]}>{t.label}</Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {/* Tab content */}
                {activeTab === 'upcoming' && renderUpcoming()}
                {activeTab === 'history' && renderHistory()}

                <View style={{ height: 30 }} />
            </ScrollView>

            <AppointmentModal
                isOpen={openModal}
                onClose={() => setOpenModal(false)}
                appointment={selectedLesson}
                onUpdate={() => { fetchUpcoming(); fetchHistory(); }}
                isTeacherView={true}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    header: {
        backgroundColor: '#3970B7',
        padding: 16,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    scrollContent: {
        padding: 16,
    },

    /* ── Tabs ───────────────────────────── */
    tabBar: {
        flexDirection: 'row',
        backgroundColor: '#F3F4F6',
        borderRadius: 10,
        padding: 3,
        marginTop: 20,
        marginBottom: 16,
    },
    tab: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    tabActive: {
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 2,
        elevation: 2,
    },
    tabText: {
        fontSize: 13,
        fontWeight: '500',
        color: '#6B7280',
    },
    tabTextActive: {
        color: '#3970B7',
        fontWeight: '700',
    },

    /* ── Lists ──────────────────────────── */
    emptyText: {
        color: '#6B7280',
        textAlign: 'center',
        paddingVertical: 24,
        fontSize: 14,
    },
    lessonItem: {
        marginBottom: 12,
    },
});
