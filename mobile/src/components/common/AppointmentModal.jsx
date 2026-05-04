import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Modal, StyleSheet, Image } from "react-native";
import { X, Calendar, Clock, MapPin, DollarSign, Phone } from "lucide-react-native";
import { StatusBadge } from "./StatusBadge";
import { ConfirmationModal } from "../ui/ConfirmationModal";
import { AlertModal } from "../ui/AlertModal";
import { appointmentService } from "../../services/appointmentService";
import { getProfessorImage } from "../../mocks/mockImages";
import {
    translateSubject,
    translateProfessorTitle,
    translateWeekday,
    translateMonth
} from "../../utils/tradutionUtils";
import { formatPhoneNumber } from "../../utils/phoneUtils";

export const AppointmentModal = ({
    isOpen,
    onClose,
    appointment,
    onUpdate,
    isTeacherView = false
}) => {
    const [confirmCancelOpen, setConfirmCancelOpen] = useState(false);
    const [confirmCompleteOpen, setConfirmCompleteOpen] = useState(false);
    const [loadingAction, setLoadingAction] = useState(false);
    const [errorAlert, setErrorAlert] = useState({ visible: false, message: '' });

    const handleCancelClick = () => setConfirmCancelOpen(true);
    const handleCompleteClick = () => setConfirmCompleteOpen(true);

    const performUpdateStatus = async (newStatus) => {
        setLoadingAction(true);
        try {
            await appointmentService.patch(appointment.id, { status: newStatus });
            if (onUpdate) await onUpdate();
            onClose();
        } catch (error) {
            console.error(`Erro ao atualizar status para ${newStatus}:`, error);
            setErrorAlert({ visible: true, message: 'Não foi possível atualizar o status. Tente novamente.' });
        } finally {
            setLoadingAction(false);
        }
    };

    const handleConfirmCancel = async () => {
        setConfirmCancelOpen(false);
        await performUpdateStatus("CANCELLED");
    };

    const handleConfirmComplete = async () => {
        setConfirmCompleteOpen(false);
        await performUpdateStatus("COMPLETED");
    };

    if (!appointment) return null;

    const dt = new Date(appointment.dateTime);
    const weekdayPt = translateWeekday(dt.toLocaleDateString("en-US", { weekday: "long" }));
    const monthPt = translateMonth(dt.toLocaleDateString("en-US", { month: "long" }));
    const formattedDate = `${weekdayPt}, ${dt.getDate()} de ${monthPt}`;
    const formattedTime = dt.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

    const subjectPt = translateSubject(appointment.subject);
    const professorTitlePt = translateProfessorTitle(appointment.professorTitle);

    const rawImageUrl = appointment.professorImageUrl;
    let resolvedProfessorImage;
    if (rawImageUrl && typeof rawImageUrl === 'string' && rawImageUrl.startsWith('http')) {
        resolvedProfessorImage = { uri: rawImageUrl };
    } else if (rawImageUrl && typeof rawImageUrl === 'object') {
        // Already a resolved require() image object
        resolvedProfessorImage = rawImageUrl;
    } else {
        resolvedProfessorImage = getProfessorImage(appointment.professorName);
    }

    const cancelMessage = `Tem certeza de que deseja CANCELAR esta aula?\n\nAo cancelar, você não poderá marcar essa aula como concluída posteriormente. Se tiver qualquer dúvida, entre em contato com o professor correspondente ou envie um email para studi@gmail.com antes de prosseguir.`;
    const completeMessage = `Tenha certeza de marcar a aula como CONCLUÍDA apenas se você realmente realizou a aula com o professor correspondente.\n\nCaso tenha qualquer dúvida sobre o que registrar, consulte o professor correspondente ou envie um email para studi@gmail.com antes de confirmar a conclusão.`;

    return (
        <>
            <Modal
                visible={isOpen}
                transparent
                animationType="slide"
                onRequestClose={onClose}
            >
                <View style={styles.overlay}>
                    <View style={styles.modalContainer}>
                        {/* Header */}
                        <View style={styles.header}>
                            <Text style={styles.subjectTitle}>{subjectPt}</Text>
                            <View style={styles.headerActions}>
                                <StatusBadge status={appointment.status} />
                                <TouchableOpacity onPress={onClose}>
                                    <X size={24} color="#9ca3af" />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            {/* Professor Info */}
                            <View style={styles.professorInfo}>
                                {resolvedProfessorImage ? (
                                    <Image
                                        source={typeof resolvedProfessorImage === 'string' ? { uri: resolvedProfessorImage } : resolvedProfessorImage}
                                        style={styles.professorImage}
                                        resizeMode="cover"
                                    />
                                ) : null}
                                <View style={styles.professorDetails}>
                                    <Text style={styles.professorName}>{appointment.professorName}</Text>
                                    <Text style={styles.professorTitle}>{professorTitlePt}</Text>
                                </View>
                            </View>

                            {/* Details */}
                            <View style={styles.detailsContainer}>
                                <View style={styles.detailRow}>
                                    <Calendar size={20} color="#3970B7" style={styles.detailIcon} />
                                    <Text style={styles.detailText}>{formattedDate}</Text>
                                </View>
                                <View style={styles.detailRow}>
                                    <Clock size={20} color="#3970B7" style={styles.detailIcon} />
                                    <Text style={styles.detailText}>{formattedTime} • Duração: {appointment.duration} min</Text>
                                </View>
                                <View style={styles.detailRow}>
                                    <MapPin size={20} color="#3970B7" style={styles.detailIcon} />
                                    <Text style={styles.detailText}>{appointment.online ? "Online" : appointment.location}</Text>
                                </View>
                                {(appointment.professorPhone || appointment.studentPhone) && (
                                    <View style={styles.detailRow}>
                                        <Phone size={20} color="#3970B7" style={styles.detailIcon} />
                                        <Text style={styles.detailText}>
                                            {formatPhoneNumber(appointment.professorPhone || appointment.studentPhone)}
                                        </Text>
                                    </View>
                                )}
                                {!isTeacherView && (
                                    <View style={styles.detailRow}>
                                        <DollarSign size={20} color="#3970B7" style={styles.detailIcon} />
                                        <Text style={styles.detailText}>
                                            Valor da aula: R$ {appointment.totalValue ? appointment.totalValue.toFixed(2) : "0.00"}
                                        </Text>
                                    </View>
                                )}
                            </View>
                        </ScrollView>

                        {/* Actions */}
                        <View style={styles.actionsContainer}>
                            {appointment.status !== "CANCELLED" && appointment.status !== "COMPLETED" && (
                                <View style={styles.actionButtons}>
                                    <TouchableOpacity
                                        onPress={handleCancelClick}
                                        disabled={loadingAction}
                                        style={[styles.button, loadingAction ? styles.bgRed300 : styles.bgRed500]}
                                    >
                                        <Text style={styles.buttonText}>Cancelar</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={handleCompleteClick}
                                        disabled={loadingAction}
                                        style={[styles.button, loadingAction ? styles.bgGreen300 : styles.bgGreen600]}
                                    >
                                        <Text style={styles.buttonText}>Concluir</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                            {appointment.status === "COMPLETED" && (
                                <View style={styles.completedBadge}>
                                    <Text style={styles.buttonText}>Aula Concluída</Text>
                                </View>
                            )}
                        </View>
                    </View>
                </View>
            </Modal>

            <ConfirmationModal
                isOpen={confirmCancelOpen}
                title="Confirmação de Cancelamento"
                message={cancelMessage}
                checkboxLabel="Estou ciente que ao cancelar esta aula, ela não poderá ser marcada como concluída posteriormente."
                confirmLabel="Cancelar Aula"
                confirmColor="red"
                onConfirm={handleConfirmCancel}
                onCancel={() => setConfirmCancelOpen(false)}
            />

            <ConfirmationModal
                isOpen={confirmCompleteOpen}
                title="Confirmação de Conclusão"
                message={completeMessage}
                checkboxLabel="Estou certo de que a aula foi realizada e desejo marcá-la como concluída."
                confirmLabel="Marcar Como Concluída"
                confirmColor="green"
                onConfirm={handleConfirmComplete}
                onCancel={() => setConfirmCompleteOpen(false)}
            />

            <AlertModal visible={errorAlert.visible} type="error" title="Erro" message={errorAlert.message} onClose={() => setErrorAlert({ visible: false, message: '' })} />
        </>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        padding: 20,
    },
    modalContainer: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 20,
        maxHeight: '90%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB', // gray-200
        paddingBottom: 16,
    },
    subjectTitle: {
        fontSize: 20, // text-xl
        fontWeight: 'bold',
        color: '#3970B7',
        flex: 1,
        marginRight: 8,
    },
    headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    professorInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 16,
    },
    professorImage: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#e5e7eb',
    },
    professorDetails: {
        marginLeft: 12,
        flex: 1,
    },
    professorName: {
        color: '#1F2937', // gray-800
        fontWeight: '500',
        fontSize: 18, // text-lg
    },
    professorTitle: {
        color: '#4B5563', // gray-600
        fontSize: 14, // text-sm
    },
    detailsContainer: {
        marginTop: 24,
        gap: 12,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    detailIcon: {
        marginRight: 8,
    },
    detailText: {
        color: '#4B5563', // gray-600
        fontSize: 16, // text-base
    },
    actionsContainer: {
        marginTop: 24,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 8,
    },
    button: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 8,
        flex: 1,
        alignItems: 'center',
    },
    bgRed300: { backgroundColor: '#FCA5A5' },
    bgRed500: { backgroundColor: '#EF4444' },
    bgGreen300: { backgroundColor: '#86EFAC' },
    bgGreen600: { backgroundColor: '#16A34A' },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    completedBadge: {
        backgroundColor: '#22c55e', // green-500
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
});
