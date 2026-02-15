import React from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { translateSubject } from '../../utils/tradutionUtils';

export function SubjectBadge({ subjects }) {
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

    const handlePressMore = () => {
        Alert.alert("Matérias", validList.map(translateSubject).join('\n'));
    };

    return (
        <View style={styles.container}>
            <Text style={styles.text}>
                {translateSubject(first)}
            </Text>
            {others.length > 0 && (
                <TouchableOpacity
                    onPress={handlePressMore}
                    style={styles.moreBadge}
                >
                    <Text style={styles.moreText}>
                        +{others.length}
                    </Text>
                </TouchableOpacity>
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
        color: '#9CA3AF', // gray-400
    },
    text: {
        color: '#1F2937', // gray-800
        fontSize: 12,
    },
    moreBadge: {
        backgroundColor: '#DBEAFE', // blue-100
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    moreText: {
        color: '#1E40AF', // blue-800
        fontSize: 12,
        fontWeight: '500',
    },
});
