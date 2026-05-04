import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react-native';

const ICONS = {
    success: { Component: CheckCircle, color: '#22C55E', bg: '#DCFCE7' },
    error: { Component: XCircle, color: '#EF4444', bg: '#FEE2E2' },
    warning: { Component: AlertTriangle, color: '#F59E0B', bg: '#FEF9C3' },
    info: { Component: Info, color: '#3970B7', bg: '#DBEAFE' },
};

export function AlertModal({ visible, type = 'info', title, message, onClose, buttons }) {
    if (!visible) return null;

    const icon = ICONS[type] || ICONS.info;
    const IconComponent = icon.Component;

    const renderButtons = () => {
        if (buttons && buttons.length > 0) {
            return (
                <View style={styles.buttonRow}>
                    {buttons.map((btn, i) => (
                        <TouchableOpacity
                            key={i}
                            style={[
                                styles.button,
                                btn.style === 'cancel' && styles.buttonCancel,
                                btn.style === 'destructive' && styles.buttonDestructive,
                                !btn.style && styles.buttonPrimary,
                            ]}
                            onPress={btn.onPress || onClose}
                        >
                            <Text style={[
                                styles.buttonText,
                                btn.style === 'cancel' && styles.buttonTextCancel,
                            ]}>
                                {btn.text}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            );
        }
        return (
            <TouchableOpacity style={[styles.okButton, styles.buttonPrimary]} onPress={onClose}>
                <Text style={styles.buttonText}>OK</Text>
            </TouchableOpacity>
        );
    };

    return (
        <Modal transparent animationType="fade" visible={visible} onRequestClose={onClose}>
            <View style={styles.overlay}>
                <View style={styles.card}>
                    <View style={[styles.iconContainer, { backgroundColor: icon.bg }]}>
                        <IconComponent size={32} color={icon.color} />
                    </View>
                    {title && <Text style={styles.title}>{title}</Text>}
                    {message && <Text style={styles.message}>{message}</Text>}
                    {renderButtons()}
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 28,
        width: '100%',
        maxWidth: 360,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 24,
        elevation: 8,
    },
    iconContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
        textAlign: 'center',
        marginBottom: 8,
    },
    message: {
        fontSize: 14,
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 20,
    },
    buttonRow: {
        flexDirection: 'row',
        gap: 10,
        width: '100%',
    },
    button: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
    },
    okButton: {
        paddingVertical: 12,
        paddingHorizontal: 40,
        borderRadius: 10,
        alignItems: 'center',
    },
    buttonPrimary: {
        backgroundColor: '#3970B7',
    },
    buttonCancel: {
        backgroundColor: '#F3F4F6',
    },
    buttonDestructive: {
        backgroundColor: '#EF4444',
    },
    buttonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600',
    },
    buttonTextCancel: {
        color: '#374151',
    },
});
