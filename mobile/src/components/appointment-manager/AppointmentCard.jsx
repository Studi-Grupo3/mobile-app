import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import {
    Calendar,
    Clock,
    MapPin,
    GraduationCap,
    Phone,
} from "lucide-react-native";
import { StatusBadge, statusStyles } from "./StatusBadge";
import { formatPhoneNumber } from "../../utils/phoneUtils";

export const AppointmentCard = ({
    subject,
    professorName,
    professorTitle,
    date,
    time,
    duration,
    location,
    status,
    online,
    onDetailsClick = () => { },
    professorImageUrl = "",
    professorPhone = null,
}) => {
    const locationDisplay = online ? "Online" : location;
    const borderColor = statusStyles[status]?.rawColor || "#22c55e";

    return (
        <View style={[styles.card, { borderTopColor: borderColor }]}>
            <View style={styles.header}>
                <Text style={styles.subject}>{subject}</Text>
                <StatusBadge status={status} />
            </View>

            <View style={styles.professorContainer}>
                <View style={styles.avatarContainer}>
                    {professorImageUrl ? (
                        <Image
                            source={{ uri: professorImageUrl }}
                            style={styles.avatar}
                            resizeMode="cover"
                        />
                    ) : (
                        <View style={styles.avatarPlaceholder}>
                            <GraduationCap size={20} color="#9ca3af" />
                        </View>
                    )}
                </View>
                <View style={styles.professorInfo}>
                    <Text style={styles.professorName}>{professorName}</Text>
                    <View style={styles.titleContainer}>
                        <GraduationCap size={12} color="#4b5563" style={styles.smallIcon} />
                        <Text style={styles.professorTitle}>{professorTitle}</Text>
                    </View>
                </View>
            </View>

            <View style={styles.detailsContainer}>
                <View style={styles.detailRow}>
                    <Calendar size={16} color="#3970B7" style={styles.detailIcon} />
                    <Text style={styles.detailText}>{date}</Text>
                </View>
                <View style={styles.detailRow}>
                    <Clock size={16} color="#3970B7" style={styles.detailIcon} />
                    <Text style={styles.detailText}>
                        {time} • Duração: {duration}
                    </Text>
                </View>
                <View style={styles.detailRow}>
                    <MapPin size={16} color="#3970B7" style={styles.detailIcon} />
                    <Text style={styles.detailText}>{locationDisplay}</Text>
                </View>
                {professorPhone && (
                    <View style={styles.detailRow}>
                        <Phone size={16} color="#3970B7" style={styles.detailIcon} />
                        <Text style={styles.detailText}>{formatPhoneNumber(professorPhone)}</Text>
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
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 1,
        borderTopWidth: 4,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    subject: {
        color: '#3970B7',
        fontSize: 18, // text-lg
        fontWeight: 'bold',
        flex: 1,
        marginRight: 8,
    },
    professorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    avatarContainer: {
        width: 48, // w-12
        height: 48, // h-12
        borderRadius: 24,
        overflow: 'hidden',
        backgroundColor: '#E5E7EB', // gray-200
    },
    avatar: {
        width: '100%',
        height: '100%',
    },
    avatarPlaceholder: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    professorInfo: {
        marginLeft: 12,
        flex: 1,
    },
    professorName: {
        color: '#1F2937', // gray-800
        fontSize: 16, // text-base
        fontWeight: '500',
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    smallIcon: {
        marginRight: 4,
    },
    professorTitle: {
        color: '#4B5563', // gray-600
        fontSize: 12, // text-xs
        flex: 1,
    },
    detailsContainer: {
        gap: 8,
        marginBottom: 16,
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
