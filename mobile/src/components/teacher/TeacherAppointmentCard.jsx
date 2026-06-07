import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import {
    Calendar,
    Clock,
    MapPin,
    User,
    Phone,
    BookOpen,
    ShieldCheck,
} from "lucide-react-native";
import { StatusBadge, statusStyles } from "../common/StatusBadge";
import { formatPhoneNumber } from "../../utils/phoneUtils";

export const TeacherAppointmentCard = ({
    subject,
    studentName,
    date,
    time,
    duration,
    location,
    status,
    online,
    onDetailsClick = () => { },
    studentImageUrl = "",
    studentPhone = null,
    studentAddress = null,
    responsibleName = null,
    responsiblePhone = null,
    studentAge = null,
    isAdult = null,
    phase = null,
    schoolGrade = null,
}) => {
    const locationDisplay = online ? "Online" : (location || "Presencial");
    const borderColor = statusStyles[status]?.rawColor || "#22c55e";
    const showResponsible = !isAdult && responsibleName;
    const showAddress = !online && studentAddress;

    const phaseLabel = [phase, schoolGrade].filter(Boolean).join(' • ');

    return (
        <View style={[styles.card, { borderTopColor: borderColor }]}>
            <View style={styles.header}>
                <Text style={styles.subjectText}>
                    {subject}
                </Text>
                <StatusBadge status={status} />
            </View>

            <View style={styles.userInfo}>
                <View style={styles.avatarContainer}>
                    {studentImageUrl ? (
                        <Image
                            source={typeof studentImageUrl === 'string' ? { uri: studentImageUrl } : studentImageUrl}
                            style={styles.avatar}
                            resizeMode="cover"
                        />
                    ) : (
                        <User size={24} color="#9ca3af" />
                    )}
                </View>
                <View style={styles.userDetails}>
                    <Text style={styles.userName}>
                        {studentName}
                    </Text>
                    <Text style={styles.userRole}>Aluno</Text>
                </View>
            </View>

            {phaseLabel ? (
                <View style={styles.phaseBadge}>
                    <BookOpen size={12} color="#6D28D9" />
                    <Text style={styles.phaseBadgeText}>{phaseLabel}</Text>
                </View>
            ) : null}

            <View style={styles.detailsContainer}>
                <View style={styles.detailRow}>
                    <Calendar size={16} color="#3970B7" style={{ marginRight: 8 }} />
                    <Text style={styles.detailText}>{date}</Text>
                </View>
                <View style={styles.detailRow}>
                    <Clock size={16} color="#3970B7" style={{ marginRight: 8 }} />
                    <Text style={styles.detailText}>
                        {time} • Duração: {duration}
                    </Text>
                </View>
                <View style={styles.detailRow}>
                    <MapPin size={16} color="#3970B7" style={{ marginRight: 8 }} />
                    <Text style={styles.detailText}>{locationDisplay}</Text>
                </View>
                {showAddress && (
                    <View style={styles.addressRow}>
                        <MapPin size={14} color="#059669" style={{ marginRight: 8, marginTop: 2 }} />
                        <Text style={styles.addressText}>{studentAddress}</Text>
                    </View>
                )}
                {showResponsible ? (
                    <View style={styles.responsibleSection}>
                        <ShieldCheck size={14} color="#B45309" style={{ marginRight: 6 }} />
                        <View style={{ flex: 1 }}>
                            <Text style={styles.responsibleLabel}>Responsável: {responsibleName}</Text>
                            {responsiblePhone && (
                                <Text style={styles.responsiblePhone}>{formatPhoneNumber(responsiblePhone)}</Text>
                            )}
                        </View>
                    </View>
                ) : studentPhone ? (
                    <View style={styles.detailRow}>
                        <Phone size={16} color="#3970B7" style={{ marginRight: 8 }} />
                        <Text style={styles.detailText}>{formatPhoneNumber(studentPhone)}</Text>
                    </View>
                ) : null}
            </View>

            <TouchableOpacity
                onPress={onDetailsClick}
                style={styles.button}
            >
                <Text style={styles.buttonText}>Ver Detalhes</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        borderTopWidth: 4,
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 1,
        elevation: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    subjectText: {
        color: '#3970B7',
        fontSize: 18, // text-lg
        fontWeight: 'bold',
        flex: 1,
        marginRight: 8,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    avatarContainer: {
        width: 48, // w-12
        height: 48, // h-12
        borderRadius: 24, // rounded-full
        overflow: 'hidden',
        backgroundColor: '#F3F4F6', // gray-100
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatar: {
        width: '100%',
        height: '100%',
    },
    userDetails: {
        marginLeft: 12,
        flex: 1,
    },
    userName: {
        color: '#1F2937', // gray-800
        fontSize: 16, // text-base
        fontWeight: '500',
    },
    userRole: {
        color: '#6B7280', // gray-500
        fontSize: 12, // text-xs
    },
    detailsContainer: {
        gap: 8,
        marginBottom: 16,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    detailText: {
        color: '#4B5563',
        fontSize: 14,
    },
    addressRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: '#ECFDF5',
        borderRadius: 6,
        padding: 8,
        marginTop: 4,
    },
    addressText: {
        color: '#065F46',
        fontSize: 13,
        flex: 1,
    },
    responsibleSection: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: '#FFFBEB',
        borderRadius: 6,
        padding: 8,
        marginTop: 4,
        borderWidth: 1,
        borderColor: '#FDE68A',
    },
    responsibleLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: '#92400E',
    },
    responsiblePhone: {
        fontSize: 12,
        color: '#B45309',
        marginTop: 2,
    },
    phaseBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: '#F5F3FF',
        borderRadius: 6,
        paddingHorizontal: 10,
        paddingVertical: 5,
        alignSelf: 'flex-start',
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#DDD6FE',
    },
    phaseBadgeText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#6D28D9',
    },
    button: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#D1D5DB', // gray-300
        borderRadius: 8,
        paddingVertical: 12,
        backgroundColor: '#EFF6FF', // blue-50
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: '#3970B7',
        fontWeight: 'bold',
    },
});
