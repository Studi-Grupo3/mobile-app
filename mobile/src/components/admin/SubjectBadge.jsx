import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, Pressable, StyleSheet, Platform } from 'react-native';
import { translateSubject } from '../../utils/tradutionUtils';

export function SubjectBadge({ subjects }) {
    const [showModal, setShowModal] = useState(false);
    let normalizedSubjects = subjects;

    if (typeof subjects === 'string') {
        if (subjects.startsWith('[')) {
            try {
                const cleaned = subjects.replace(/^\[|\]$/g, '').trim();
                normalizedSubjects = cleaned.split(',').map(s => s.trim()).filter(s => s);
            } catch (e) {
                console.error('Error parsing subjects:', e);
                normalizedSubjects = [subjects];
            }
        } else if (subjects.includes(',')) {
            normalizedSubjects = subjects.split(',').map(s => s.trim()).filter(s => s);
        }
    }

    const list = Array.isArray(normalizedSubjects) ? normalizedSubjects : [normalizedSubjects];
    const validList = list.filter(s => s && typeof s === 'string');

    if (validList.length === 0) return <Text style={styles.emptyText}>-</Text>;

    const first = validList[0];
    const others = validList.slice(1);

    return (
        <View style={styles.container}>
            <Text style={styles.text}>
                {translateSubject(first)}
            </Text>
            {others.length > 0 && (
                <>
                    <TouchableOpacity
                        onPress={() => setShowModal(true)}
                        style={styles.moreBadge}
                    >
                        <Text style={styles.moreText}>
                            +{others.length}
                        </Text>
                    </TouchableOpacity>
                    <Modal
                        visible={showModal}
                        transparent
                        animationType="fade"
                        onRequestClose={() => setShowModal(false)}
                    >
                        <Pressable style={styles.overlay} onPress={() => setShowModal(false)}>
                            <View style={styles.modal}>
                                <Text style={styles.modalTitle}>{translateSubject(first)} e mais {others.length}</Text>
                                {others.map((s, i) => (
                                    <Text key={i} style={styles.modalItem}>• {translateSubject(s)}</Text>
                                ))}
                            </View>
                        </Pressable>
                    </Modal>
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 6,
    },
    emptyText: {
        color: '#9CA3AF',
    },
    text: {
        color: '#1F2937',
        fontSize: 12,
    },
    moreBadge: {
        backgroundColor: '#DBEAFE',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 10,
    },
    moreText: {
        color: '#1E40AF',
        fontSize: 12,
        fontWeight: '600',
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modal: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 20,
        minWidth: 200,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 10,
    },
    modalItem: {
        fontSize: 13,
        color: '#4B5563',
        marginBottom: 4,
    },
});
