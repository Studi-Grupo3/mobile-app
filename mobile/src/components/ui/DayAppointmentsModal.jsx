import React, { useState } from "react";
import { View, Text, Modal as RNModal, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { AppointmentCard } from "../appointment-manager/AppointmentCard";
import { AppointmentModal } from "../appointment-manager/AppointmentModal";

export function DayAppointmentsModal({
    isOpen,
    onClose,
    appointments = [],
    onUpdate
}) {
    const [selected, setSelected] = useState(null);

    if (!isOpen) return null;

    // No appointments case
    if (appointments.length === 0) {
        return (
            <RNModal visible={isOpen} transparent animationType="fade" onRequestClose={onClose}>
                <View style={styles.overlay}>
                    <View style={styles.smallModal}>
                        <Text style={styles.noDataText}>Nenhuma aula agendada para este dia.</Text>
                        <TouchableOpacity
                            onPress={onClose}
                            style={styles.closeButton}
                        >
                            <Text style={styles.closeButtonText}>Fechar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </RNModal>
        );
    }

    return (
        <>
            <RNModal visible={isOpen} transparent animationType="slide" onRequestClose={onClose}>
                <View style={styles.overlay}>
                    <View style={styles.largeModal}>
                        <View style={styles.header}>
                            <Text style={styles.title}>
                                Aulas de {appointments[0]?.displayDate}
                            </Text>
                        </View>

                        <ScrollView style={styles.scrollContent} contentContainerStyle={{ paddingBottom: 20 }}>
                            {appointments.map(app => (
                                <View key={app.id} style={styles.cardWrapper}>
                                    <AppointmentCard
                                        subject={app.displaySubject}
                                        professorName={app.professorName}
                                        professorTitle={app.displayProfTitle}
                                        professorImageUrl={app.professorImageUrl}
                                        date={app.displayDate}
                                        time={app.displayTime}
                                        duration={`${app.duration}min`}
                                        location={app.location}
                                        status={app.status}
                                        online={app.online}
                                        onDetailsClick={() => setSelected(app)}
                                    />
                                </View>
                            ))}
                        </ScrollView>

                        <View style={styles.footer}>
                            <TouchableOpacity
                                onPress={onClose}
                                style={styles.footerCloseButton}
                            >
                                <Text style={styles.footerCloseText}>Fechar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </RNModal>

            {selected && (
                <AppointmentModal
                    isOpen={!!selected}
                    onClose={() => setSelected(null)}
                    appointment={selected}
                    onUpdate={onUpdate}
                />
            )}
        </>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.4)',
        padding: 16,
    },
    smallModal: {
        backgroundColor: 'white',
        padding: 24,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        width: '100%',
        maxWidth: 384, // max-w-sm
    },
    noDataText: {
        textAlign: 'center',
        color: '#1F2937', // gray-800
        marginBottom: 16,
    },
    closeButton: {
        backgroundColor: '#3970B7',
        paddingVertical: 8,
        borderRadius: 8,
        alignItems: 'center',
    },
    closeButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    largeModal: {
        backgroundColor: 'white',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
        width: '100%',
        maxWidth: 672, // max-w-2xl
        maxHeight: '90%',
        flexDirection: 'column',
    },
    header: {
        padding: 24,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB', // gray-200
    },
    title: {
        fontSize: 20, // text-xl
        fontWeight: 'bold',
        color: '#111827', // gray-900
    },
    scrollContent: {
        padding: 16,
    },
    cardWrapper: {
        marginBottom: 16,
    },
    footer: {
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB', // gray-200
    },
    footerCloseButton: {
        backgroundColor: '#E5E7EB', // gray-200
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    footerCloseText: {
        color: '#1F2937', // gray-800
        fontWeight: 'bold',
    },
});
