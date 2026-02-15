import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FileDown, Mail } from 'lucide-react-native';

export const ReportCard = ({ title, description, onDownload, onEmail }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.description}>{description}</Text>

            <View style={styles.actions}>
                <TouchableOpacity
                    onPress={onDownload}
                    style={styles.button}
                >
                    <FileDown size={14} color="#374151" />
                    <Text style={styles.buttonText}>PDF</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={onEmail}
                    style={styles.button}
                >
                    <Mail size={14} color="#374151" />
                    <Text style={styles.buttonText}>Email</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E5E7EB', // gray-200
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 1,
        elevation: 1,
    },
    title: {
        fontSize: 16, // text-base
        fontWeight: '600',
        color: '#111827', // gray-900
        marginBottom: 4,
    },
    description: {
        fontSize: 12, // text-xs
        color: '#6B7280', // gray-500
        marginBottom: 12,
    },
    actions: {
        flexDirection: 'row',
        gap: 8,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: '#E5E7EB', // gray-200
        borderRadius: 6,
        backgroundColor: '#F9FAFB', // gray-50
    },
    buttonText: {
        fontSize: 12, // text-xs
        fontWeight: '500',
        color: '#374151', // gray-700
    },
});
