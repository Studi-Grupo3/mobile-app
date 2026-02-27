import React, { useState, useEffect, useCallback } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { Calendar } from "react-native-calendars";
import { LocaleConfig } from 'react-native-calendars';
import { appointmentService } from "../../../services/appointmentService";
import { authService } from "../../../services/authService";
import { mockStudentAppointments } from "../../../mocks/mockData";
import { statusStyles } from "../../common/StatusBadge";
import { AppointmentModal } from "../../common/AppointmentModal";
import { translateSubject } from "../../../utils/tradutionUtils";

// Setup Locale for Calendar
LocaleConfig.locales['pt-br'] = {
    monthNames: [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ],
    monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
    dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
    dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
    today: 'Hoje'
};
LocaleConfig.defaultLocale = 'pt-br';

export const CalendarView = ({ filter, setActiveTab, navigation }) => {
    const [markedDates, setMarkedDates] = useState({});
    const [appointments, setAppointments] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [dayApps, setDayApps] = useState([]);
    const [selectedApp, setSelectedApp] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchAppointments = useCallback(async () => {
        setLoading(true);
        try {
            const studentId = await authService.getUserId();
            const data = await appointmentService.getByStudentId(studentId);
            setAppointments(processAppointments(data));
        } catch (e) {
            console.log('CalendarView: Using mock appointments data');
            const mockData = mockStudentAppointments.map(a => ({
                ...a,
                dateTime: `${a.date}T${a.time}`,
                professorName: a.teacherName,
                professorTitle: 'Professor(a)',
                location: a.location || (a.modality === 'ONLINE' ? 'Online' : 'Presencial'),
                online: a.modality === 'ONLINE',
            }));
            setAppointments(processAppointments(mockData));
        } finally {
            setLoading(false);
        }
    }, []);

    const processAppointments = (data) => {
        return data.map(app => {
            const dt = new Date(app.dateTime);
            return {
                ...app,
                dateString: dt.toISOString().split('T')[0],
                displaySubject: translateSubject(app.subject),
                displayTime: dt.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
            };
        });
    };

    useEffect(() => {
        fetchAppointments();
    }, [fetchAppointments]);

    // Filter and Mark Dates
    useEffect(() => {
        const f = typeof filter === 'object' ? filter : { status: filter, subject: 'ALL', modality: 'ALL' };
        const filtered = appointments.filter(app => {
            // Status filter
            if (f.status && f.status !== 'ALL') {
                if (f.status === 'CONFIRMED' && app.status !== 'SCHEDULED') return false;
                if (f.status === 'CANCELLED' && app.status !== 'CANCELLED') return false;
                if (f.status === 'COMPLETED' && app.status !== 'COMPLETED') return false;
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

        const marks = {};
        filtered.forEach(app => {
            const color = statusStyles[app.status]?.rawColor || '#3970B7';
            if (!marks[app.dateString]) {
                marks[app.dateString] = { dots: [] };
            }
            if (marks[app.dateString].dots.length < 3) {
                marks[app.dateString].dots.push({ color, key: app.id });
            }
        });

        marks[selectedDate] = {
            ...(marks[selectedDate] || {}),
            selected: true,
            selectedColor: '#3970B7',
            dots: marks[selectedDate]?.dots
        };

        setMarkedDates(marks);

        const dayList = filtered.filter(a => a.dateString === selectedDate);
        setDayApps(dayList);

    }, [appointments, filter, selectedDate]);


    const onDayPress = (day) => {
        setSelectedDate(day.dateString);
    };

    return (
        <View style={styles.container}>
            <ScrollView>
                <Calendar
                    current={selectedDate}
                    markedDates={markedDates}
                    markingType={'multi-dot'}
                    onDayPress={onDayPress}
                    theme={{
                        selectedDayBackgroundColor: '#3970B7',
                        todayTextColor: '#3970B7',
                        arrowColor: '#3970B7',
                        dotColor: '#3970B7',
                    }}
                />

                <View style={styles.daySection}>
                    <Text style={styles.dayTitle}>
                        Aulas em {selectedDate.split('-').reverse().join('/')}
                    </Text>

                    {dayApps.length === 0 ? (
                        <Text style={styles.emptyText}>
                            Nenhuma aula encontrada para este dia.
                        </Text>
                    ) : (
                        dayApps.map(app => {
                            const borderColor = statusStyles[app.status]?.rawColor || '#E5E7EB';
                            return (
                                <TouchableOpacity
                                    key={app.id}
                                    onPress={() => {
                                        setSelectedApp(app);
                                        setModalOpen(true);
                                    }}
                                    style={[styles.appointmentCard, { borderLeftColor: borderColor }]}
                                >
                                    <View style={styles.cardHeader}>
                                        <Text style={styles.subjectText}>{app.displaySubject}</Text>
                                        <Text style={styles.statusText}>{app.status}</Text>
                                    </View>
                                    <Text style={styles.detailsText}>
                                        {app.displayTime} com {app.professorName}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })
                    )}
                </View>
            </ScrollView>

            <AppointmentModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                appointment={selectedApp}
                onUpdate={fetchAppointments}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    daySection: {
        padding: 16,
    },
    dayTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    emptyText: {
        color: '#6B7280', // gray-500
        textAlign: 'center',
        paddingVertical: 16,
    },
    appointmentCard: {
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 8,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 1,
        elevation: 1,
        borderLeftWidth: 4,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    subjectText: {
        fontWeight: 'bold',
        color: '#1F2937', // gray-800
    },
    statusText: {
        fontSize: 12, // text-xs
        fontWeight: 'bold',
        color: '#6B7280', // gray-500
    },
    detailsText: {
        color: '#4B5563', // gray-600
        fontSize: 14, // text-sm
        marginTop: 4,
    },
});
