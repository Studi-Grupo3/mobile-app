import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Laptop, MapPin, Check } from 'lucide-react-native';

export default function ClassModelSelection({ data, onUpdate, onNext }) {
    const choice = data.classModel;
    const enabled = Boolean(choice);

    const select = model => {
        onUpdate({ classModel: model });
    };

    const ModelCard = ({ id, icon: Icon, title, desc, points }) => {
        const isSelected = choice === id;
        return (
            <TouchableOpacity
                onPress={() => select(id)}
                style={[styles.card, isSelected && styles.activeCard]}
            >
                <View style={[styles.radio, isSelected && styles.activeRadio]}>
                    {isSelected && <View style={styles.radioInner} />}
                </View>
                <Icon size={32} color="#3970B7" style={{ marginBottom: 12 }} />
                <Text style={styles.cardTitle}>{title}</Text>
                <Text style={styles.cardDesc}>{desc}</Text>
                <View style={styles.points}>
                    {points.map(t => (
                        <View key={t} style={styles.pointRow}>
                            <Check size={16} color="#22c55e" style={{ marginRight: 6 }} />
                            <Text style={styles.pointText}>{t}</Text>
                        </View>
                    ))}
                </View>
            </TouchableOpacity>
        );
    }

    return (
        <View style={{ gap: 24, paddingVertical: 10 }}>
            <View style={styles.cardsContainer}>
                <ModelCard
                    id="online"
                    icon={Laptop}
                    title="Online"
                    desc="Aulas ao vivo pela internet com nossos professores qualificados."
                    points={['Economize tempo de deslocamento', 'Flexibilidade de horários', 'Material digital incluído']}
                />
                <ModelCard
                    id="home"
                    icon={MapPin}
                    title="Domicílio"
                    desc="Aulas presenciais em casa com professores qualificados."
                    points={['Aprendizado presencial', 'Interação direta com professores', 'Material digital incluído']}
                />
            </View>

            <TouchableOpacity
                onPress={onNext}
                disabled={!enabled}
                style={[styles.nextButton, !enabled && styles.disabledButton]}
            >
                <Text style={styles.nextButtonText}>Continuar</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    cardsContainer: {
        gap: 16,
    },
    card: {
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 8,
        padding: 24,
        alignItems: 'center',
        backgroundColor: 'white',
    },
    activeCard: {
        borderColor: '#3970B7',
        borderWidth: 2,
    },
    radio: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#3970B7',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    activeRadio: {
        backgroundColor: '#3970B7',
    },
    radioInner: {
        // Only if needed, but styling above handles it mostly
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#111827',
    },
    cardDesc: {
        fontSize: 14,
        color: '#4b5563',
        textAlign: 'center',
        marginBottom: 16,
    },
    points: {
        width: '100%',
        gap: 4,
    },
    pointRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    pointText: {
        fontSize: 14,
        color: '#374151',
        flex: 1,
    },
    nextButton: {
        backgroundColor: '#3970B7',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    disabledButton: {
        backgroundColor: '#d1d5db',
    },
    nextButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    }
});
