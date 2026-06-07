import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import {
    format,
    addMonths,
    subMonths,
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    isSameMonth,
    isSameDay,
    isBefore,
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { teacherService } from '../../../services/teacherService';

export default function Scheduling({ data, onUpdate, onNext }) {
    const [currentMonth, setCurrentMonth] = useState(startOfMonth(new Date()));
    const [timeSlots, setTimeSlots] = useState([]);
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [noAvailability, setNoAvailability] = useState(false);
    const days = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];

    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
    const startDay = monthStart.getDay();
    const endDay = 6 - monthEnd.getDay();

    const prevDays = startDay
        ? eachDayOfInterval({
            start: new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1),
            end: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 0),
        }).slice(-startDay)
        : [];

    const nextDays = endDay
        ? eachDayOfInterval({
            start: new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1),
            end: new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, endDay),
        })
        : [];

    const allDays = [...prevDays, ...monthDays, ...nextDays];

    useEffect(() => {
        if (!data.date || !data.professorId) {
            setTimeSlots([]);
            setNoAvailability(false);
            return;
        }
        const fetchSlots = async () => {
            setLoadingSlots(true);
            setNoAvailability(false);
            try {
                const dateStr = format(data.date, 'yyyy-MM-dd');
                const slots = await teacherService.getAvailableSlots(data.professorId, dateStr);
                if (slots.length === 0) {
                    setNoAvailability(true);
                    setTimeSlots([]);
                } else {
                    setTimeSlots(slots);
                }
            } catch (err) {
                console.log("Erro ao buscar horários:", err);
                setTimeSlots([]);
                setNoAvailability(true);
            } finally {
                setLoadingSlots(false);
            }
        };
        fetchSlots();
    }, [data.date, data.professorId]);

    const selectDate = date => {
        onUpdate({ date });
        onUpdate({ time: null });
    };
    const selectTime = time => onUpdate({ time });
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    const enabled = data.date && data.time;

    return (
        <ScrollView style={styles.container}>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Selecione uma data:</Text>
                <View style={styles.calendarContainer}>
                    <View style={styles.calendarHeader}>
                        <TouchableOpacity onPress={prevMonth} style={styles.navButton}>
                            <ChevronLeft size={20} color="#4b5563" />
                        </TouchableOpacity>
                        <Text style={styles.monthTitle}>
                            {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
                        </Text>
                        <TouchableOpacity onPress={nextMonth} style={styles.navButton}>
                            <ChevronRight size={20} color="#4b5563" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.daysHeader}>
                        {days.map(d => <Text key={d} style={styles.dayLabel}>{d}</Text>)}
                    </View>

                    <View style={styles.daysGrid}>
                        {allDays.map((day, idx) => {
                            const isPast = isBefore(day, startOfMonth(new Date())) || (isBefore(day, new Date()) && isSameMonth(day, new Date()));
                            const isCurrentMonth = isSameMonth(day, currentMonth);
                            const isSelected = data.date && isSameDay(day, data.date);

                            return (
                                <TouchableOpacity
                                    key={idx}
                                    onPress={() => !isPast && selectDate(day)}
                                    disabled={isPast}
                                    style={[
                                        styles.dayCell,
                                        isSelected && styles.selectedDay
                                    ]}
                                >
                                    <Text style={[
                                        styles.dayText,
                                        !isCurrentMonth && styles.otherMonthText,
                                        isSelected && styles.selectedDayText,
                                        isPast && styles.disabledDayText
                                    ]}>
                                        {day.getDate()}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Selecione um horário:</Text>
                <View style={styles.timeSlotsContainer}>
                    {!data.date ? (
                        <Text style={styles.placeholderText}>Selecione uma data para ver os horários</Text>
                    ) : loadingSlots ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="small" color="#ca8a04" />
                            <Text style={styles.loadingText}>Carregando horários...</Text>
                        </View>
                    ) : noAvailability ? (
                        <View style={styles.noSlotsContainer}>
                            <Text style={styles.noSlotsText}>Nenhum horário disponível nesta data.</Text>
                            <Text style={styles.noSlotsHint}>O professor não tem disponibilidade configurada para este dia.</Text>
                        </View>
                    ) : (
                        <View style={styles.timeGrid}>
                            {timeSlots.map(ts => (
                                <TouchableOpacity
                                    key={ts}
                                    onPress={() => selectTime(ts)}
                                    style={[
                                        styles.timeSlot,
                                        data.time === ts && styles.selectedTime
                                    ]}
                                >
                                    <Text style={[
                                        styles.timeText,
                                        data.time === ts && styles.selectedTimeText
                                    ]}>{ts}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                </View>
            </View>

            <TouchableOpacity
                onPress={onNext}
                disabled={!enabled}
                style={[styles.nextButton, !enabled && styles.disabledButton]}
            >
                <Text style={styles.nextButtonText}>
                    {enabled
                        ? `Continuar para ${format(data.date, 'dd/MM/yyyy')} às ${data.time}`
                        : 'Selecione uma data e horário'}
                </Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 10,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: '#374151',
        marginBottom: 10,
    },
    calendarContainer: {
        borderWidth: 1,
        borderColor: '#e5e7eb',
        borderRadius: 8,
        padding: 16,
        backgroundColor: 'white',
    },
    calendarHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    navButton: {
        padding: 8,
        backgroundColor: '#f3f4f6',
        borderRadius: 20,
    },
    monthTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: '#1f2937',
        textTransform: 'capitalize',
    },
    daysHeader: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 8,
    },
    dayLabel: {
        fontSize: 12,
        color: '#6b7280',
        width: 32,
        textAlign: 'center',
    },
    daysGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
    },
    dayCell: {
        width: 36,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 18,
        marginBottom: 4,
    },
    dayText: {
        fontSize: 14,
        color: '#1f2937',
    },
    otherMonthText: {
        color: '#9ca3af',
    },
    selectedDay: {
        backgroundColor: '#3970B7',
    },
    selectedDayText: {
        color: 'white',
        fontWeight: 'bold',
    },
    disabledDayText: {
        color: '#d1d5db',
    },
    timeSlotsContainer: {
        borderWidth: 1,
        borderColor: '#e5e7eb',
        borderRadius: 8,
        padding: 16,
        backgroundColor: '#f9fafb',
        minHeight: 150,
        justifyContent: 'center',
    },
    placeholderText: {
        textAlign: 'center',
        color: '#6b7280',
    },
    timeGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        justifyContent: 'center',
    },
    timeSlot: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
        backgroundColor: '#f3f4f6',
        minWidth: 80,
        alignItems: 'center',
    },
    selectedTime: {
        backgroundColor: '#3970B7',
    },
    timeText: {
        color: '#1f2937',
        fontSize: 14,
    },
    selectedTimeText: {
        color: 'white',
        fontWeight: 'bold',
    },
    nextButton: {
        backgroundColor: '#3970B7',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 8,
        marginBottom: 40,
    },
    disabledButton: {
        backgroundColor: '#d1d5db',
    },
    nextButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    loadingContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 20,
    },
    loadingText: {
        marginTop: 8,
        color: '#6b7280',
        fontSize: 14,
    },
    noSlotsContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
    },
    noSlotsText: {
        color: '#ef4444',
        fontSize: 14,
        fontWeight: '500',
        textAlign: 'center',
    },
    noSlotsHint: {
        color: '#6b7280',
        fontSize: 12,
        textAlign: 'center',
        marginTop: 4,
    }
});
