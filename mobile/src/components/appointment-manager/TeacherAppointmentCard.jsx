import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import {
    Calendar,
    Clock,
    MapPin,
    User,
    Phone,
} from "lucide-react-native";
import { StatusBadge, statusStyles } from "./StatusBadge";
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
}) => {
    const locationDisplay = online ? "Online" : location;
    const borderColor = statusStyles[status]?.rawColor || "#22c55e";

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
                            source={{ uri: studentImageUrl }}
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
                {studentPhone && (
                    <View style={styles.detailRow}>
                        <Phone size={16} color="#3970B7" style={{ marginRight: 8 }} />
                        <Text style={styles.detailText}>{formatPhoneNumber(studentPhone)}</Text>
                    </View>
                )}
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
        color: '#4B5563', // gray-600
        fontSize: 14, // text-sm
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
