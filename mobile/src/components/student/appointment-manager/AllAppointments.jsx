import React, { useState, useEffect, useCallback } from "react";
import { View, Text, FlatList, RefreshControl, StyleSheet } from "react-native";
import { appointmentService } from "../../../services/appointmentService";
import { authService } from "../../../services/authService";
import { mockStudentAppointments } from "../../../mocks/mockData";
import { getProfessorImage } from "../../../mocks/mockImages";
import { AppointmentCard } from "./AppointmentCard";
import { AppointmentModal } from "../../common/AppointmentModal";
import { SkeletonAppointmentCard } from "../../common/SkeletonAppointmentCard";
import {
    translateSubject,
    translateProfessorTitle
} from "../../../utils/tradutionUtils";
import { parseUtcDateTime } from "../../../utils/date";

export const AllAppointments = ({ filter = "ALL", sortBy }) => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);
    const [selected, setSelected] = useState(null);
    const [openModal, setOpenModal] = useState(false);

    const fetchAppointments = useCallback(async () => {
        try {
            const studentId = await authService.getUserId();
            if (!studentId) throw new Error("User not found");
            const data = await appointmentService.getByStudentId(studentId);
            setAppointments(data);
            setError(null);
        } catch (err) {
            console.log('Using mock appointments data');
            const mockData = mockStudentAppointments.map(a => ({
                ...a,
                dateTime: `${a.date}T${a.time}`,
                professorName: a.teacherName,
                professorTitle: 'Professor(a)',
                professorImageUrl: null,
                location: a.location || (a.modality === 'ONLINE' ? 'Online' : 'Presencial'),
                online: a.modality === 'ONLINE',
                totalValue: a.price,
            }));
            setAppointments(mockData);
            setError(null);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchAppointments();
    }, [fetchAppointments]);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchAppointments();
    }, [fetchAppointments]);

    const getFilteredAppointments = () => {
        const IMAGE_SOURCE_CONFIG = { useMock: true };

        return appointments.map(appt => {
            const dateTimeValue = appt.dateTime || (appt.date && appt.time ? `${appt.date}T${appt.time}` : null);
            const dt = parseUtcDateTime(dateTimeValue);
            let finalProfessorImage = appt.professorImageUrl;

            // Only use backend URL if it's a valid http(s) URL
            if (!finalProfessorImage || !finalProfessorImage.startsWith('http')) {
                finalProfessorImage = null;
            }

            if (!finalProfessorImage && IMAGE_SOURCE_CONFIG.useMock) {
                finalProfessorImage = getProfessorImage(appt.professorName);
            }

            return {
                ...appt,
                professorImageUrl: finalProfessorImage,
                displayDate: dt ? dt.toLocaleDateString("pt-BR", {
                    weekday: "long", day: "numeric", month: "long"
                }) : '-',
                displayTime: dt ? dt.toLocaleTimeString("pt-BR", {
                    hour: "2-digit", minute: "2-digit"
                }) : '-',
                displaySubject: translateSubject(appt.subject),
                displayProfTitle: translateProfessorTitle(appt.professorTitle)
            };
        }).filter(app => {
            const f = typeof filter === 'object' ? filter : { status: filter, subject: 'ALL', modality: 'ALL' };
            // Status filter
            if (f.status && f.status !== 'ALL') {
                if (f.status === 'COMPLETED' && app.status !== 'COMPLETED') return false;
                if (f.status === 'CANCELLED' && app.status !== 'CANCELLED') return false;
                if (f.status === 'CONFIRMED' && app.status !== 'SCHEDULED') return false;
                if (f.status === 'PENDING' && app.status !== 'PENDING') return false;
            }
            // Subject filter
            if (f.subject && f.subject !== 'ALL' && app.subject !== f.subject) return false;
            // Modality filter
            if (f.modality && f.modality !== 'ALL') {
                if (f.modality === 'ONLINE' && !app.online) return false;
                if (f.modality === 'OFFLINE' && app.online) return false;
            }
            return true;
        });
    };

    const sortItems = (items) => {
        const sorted = [...items];
        switch (sortBy) {
            case 'dateDesc':
                sorted.sort((a, b) => new Date(b.dateTime || 0) - new Date(a.dateTime || 0));
                break;
            case 'createdAtDesc':
                sorted.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
                break;
            case 'subjectAz':
                sorted.sort((a, b) => (a.displaySubject || '').localeCompare(b.displaySubject || ''));
                break;
            case 'dateAsc':
            default:
                sorted.sort((a, b) => new Date(a.dateTime || 0) - new Date(b.dateTime || 0));
                break;
        }
        return sorted;
    };

    const filteredData = sortItems(getFilteredAppointments());

    if (loading && !refreshing) {
        return (
            <View style={styles.loadingContainer}>
                {[1, 2, 3].map(i => <SkeletonAppointmentCard key={i} />)}
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={filteredData}
                keyExtractor={item => String(item.id)}
                contentContainerStyle={styles.listContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>Nenhum agendamento encontrado.</Text>
                    </View>
                }
                renderItem={({ item }) => (
                    <AppointmentCard
                        subject={item.displaySubject}
                        professorName={item.professorName}
                        professorTitle={item.displayProfTitle}
                        professorImageUrl={item.professorImageUrl}
                        professorPhone={item.professorPhone}
                        date={item.displayDate}
                        time={item.displayTime}
                        duration={`${item.duration} min`}
                        location={item.location}
                        status={item.status}
                        online={item.online}
                        createdAt={item.createdAt}
                        onDetailsClick={() => {
                            setSelected(item);
                            setOpenModal(true);
                        }}
                    />
                )}
            />

            <AppointmentModal
                isOpen={openModal}
                onClose={() => setOpenModal(false)}
                appointment={selected}
                onUpdate={onRefresh}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loadingContainer: {
        padding: 16,
    },
    errorContainer: {
        padding: 16,
        alignItems: 'center',
    },
    errorText: {
        color: '#EF4444', // red-500
    },
    listContent: {
        padding: 16,
    },
    emptyContainer: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    emptyText: {
        color: '#6B7280', // gray-500
    },
});
