import React from 'react';
import { Modal as RNModal, View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';

export function Modal({ title, isOpen, onClose, children }) {
    if (!isOpen) return null;

    return (
        <RNModal
            transparent
            animationType="fade"
            visible={isOpen}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <TouchableOpacity
                    style={styles.backdrop}
                    activeOpacity={1}
                    onPress={onClose}
                />

                <View style={styles.modalContent}>
                    <View style={styles.header}>
                        {title && <Text style={styles.title}>{title}</Text>}
                        <TouchableOpacity onPress={onClose} hitSlop={10}>
                            <Text style={styles.closeButton}>✕</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View onStartShouldSetResponder={() => true}>
                            {children}
                        </View>
                    </ScrollView>
                </View>
            </View>
        </RNModal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    backdrop: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 16,
        width: '100%',
        maxWidth: 448, // max-w-md
        padding: 24,
        position: 'relative',
        maxHeight: '80%',
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
        flex: 1,
    },
    closeButton: {
        color: '#9CA3AF', // gray-400
        fontSize: 24,
        fontWeight: 'bold',
    },
});
