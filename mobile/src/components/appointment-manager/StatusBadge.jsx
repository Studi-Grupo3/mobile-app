import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Check, X, Clock as ClockIcon } from "lucide-react-native";

export const statusStyles = {
    SCHEDULED: {
        bgColor: "#EAB308", // yellow-500 (background color hex)
        textColor: "white",
        icon: <ClockIcon color="white" size={16} />,
        text: "Agendado",
        rawColor: "#EAB308",
    },
    COMPLETED: {
        bgColor: "#22C55E", // green-500
        textColor: "white",
        icon: <Check color="white" size={16} />,
        text: "Concluído",
        rawColor: "#22C55E",
    },
    CANCELLED: {
        bgColor: "#EF4444", // red-500
        textColor: "white",
        icon: <X color="white" size={16} />,
        text: "Cancelado",
        rawColor: "#EF4444",
    },
    PENDING: { // Adding PENDING fallback
        bgColor: "#EAB308",
        textColor: "white",
        icon: <ClockIcon color="white" size={16} />,
        text: "Pendente",
        rawColor: "#EAB308",
    }
};

export const StatusBadge = ({ status }) => {
    const style = statusStyles[status] || statusStyles.SCHEDULED;

    return (
        <View style={[styles.badge, { backgroundColor: style.bgColor }]}>
            <View style={styles.iconContainer}>{style.icon}</View>
            <Text style={[styles.text, { color: style.textColor }]}>{style.text}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 9999, // rounded-full
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconContainer: {
        marginRight: 4,
    },
    text: {
        fontSize: 12, // text-xs
        fontWeight: 'bold',
    },
});
