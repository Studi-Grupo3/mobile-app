import React from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { X } from 'lucide-react-native';

// Simple Checkbox Component
function SimpleCheckbox({ checked, onChange, label }) {
    return (
        <TouchableOpacity
            style={styles.checkboxContainer}
            activeOpacity={0.8}
            onPress={() => onChange(!checked)}
        >
            <View style={[styles.checkbox, checked ? styles.checkedBox : styles.uncheckedBox]}>
                {checked && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.checkboxLabel}>{label}</Text>
        </TouchableOpacity>
    );
}

export function ConfirmationModal({
    isOpen,
    title,
    message,
    checkboxLabel = 'Li e concordo com a ação',
    confirmLabel = 'Confirmar',
    confirmColor = 'red',
    onCancel,
    onConfirm
}) {
    const [checked, setChecked] = React.useState(false);

    React.useEffect(() => {
        if (isOpen) {
            setChecked(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const getConfirmButtonStyle = () => {
        const base = styles.confirmButton;
        let bg = {};
        if (confirmColor === 'green') {
            bg = checked ? { backgroundColor: '#16A34A' } : { backgroundColor: '#86EFAC' }; // green-600 : green-300
        } else if (confirmColor === 'red') {
            bg = checked ? { backgroundColor: '#DC2626' } : { backgroundColor: '#FCA5A5' }; // red-600 : red-300
        } else {
            bg = checked ? { backgroundColor: confirmColor } : { opacity: 0.5 };
        }
        return [base, bg];
    };

    return (
        <Modal
            transparent
            animationType="fade"
            visible={isOpen}
            onRequestClose={onCancel}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <View style={styles.header}>
                        <Text style={styles.title}>{title}</Text>
                        <TouchableOpacity onPress={onCancel}>
                            <X color="#374151" size={24} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.messageScroll}>
                        {message.split("\n\n").map((par, idx) => (
                            <Text key={idx} style={styles.messageText}>{par}</Text>
                        ))}
                    </ScrollView>

                    <SimpleCheckbox
                        checked={checked}
                        onChange={setChecked}
                        label={checkboxLabel}
                    />

                    <View style={styles.footer}>
                        <TouchableOpacity
                            onPress={onCancel}
                            style={styles.cancelButton}
                        >
                            <Text style={styles.cancelButtonText}>Voltar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={onConfirm}
                            disabled={!checked}
                            style={getConfirmButtonStyle()}
                        >
                            <Text style={styles.confirmButtonText}>{confirmLabel}</Text>
                        </TouchableOpacity>
                    </View>
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
        padding: 16,
    },
    modalContainer: {
        backgroundColor: 'white',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        width: '100%',
        maxWidth: 448, // max-w-md
        padding: 24,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 20, // text-xl
        fontWeight: '600',
        color: '#111827', // gray-900
    },
    messageScroll: {
        maxHeight: 240, // max-h-60
        marginBottom: 16,
    },
    messageText: {
        fontSize: 16, // text-base
        color: '#374151', // gray-700
        marginBottom: 8,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 4,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,
    },
    checkedBox: {
        backgroundColor: '#4F46E5', // indigo-600
        borderColor: '#4F46E5',
    },
    uncheckedBox: {
        backgroundColor: 'white',
        borderColor: '#D1D5DB', // gray-300
    },
    checkmark: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
    checkboxLabel: {
        color: '#1F2937', // gray-800
        fontSize: 14,
        flex: 1,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 16,
    },
    cancelButton: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#D1D5DB', // gray-300
        marginRight: 12,
    },
    cancelButtonText: {
        color: '#374151', // gray-700
    },
    confirmButton: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 6,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    confirmButtonText: {
        color: 'white',
        fontWeight: '500',
    },
});
