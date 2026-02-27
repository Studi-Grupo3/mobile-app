import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet } from 'react-native';
import { ChevronDown, Check } from 'lucide-react-native';

const CustomSelect = ({ label, value, options, placeholder, onSelect }) => {
    const [open, setOpen] = useState(false);

    return (
        <View style={styles.field}>
            <Text style={styles.label}>{label}</Text>
            <TouchableOpacity
                style={styles.selectButton}
                onPress={() => setOpen(true)}
                activeOpacity={0.7}
            >
                <Text style={[styles.selectText, !value && styles.placeholderText]}>
                    {value || placeholder}
                </Text>
                <ChevronDown size={18} color="#64748B" />
            </TouchableOpacity>

            <Modal visible={open} transparent animationType="fade">
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setOpen(false)}
                >
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>{label}</Text>
                        <FlatList
                            data={options}
                            keyExtractor={(item) => item}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={[styles.optionItem, value === item && styles.optionItemActive]}
                                    onPress={() => { onSelect(item); setOpen(false); }}
                                >
                                    <Text style={[styles.optionText, value === item && styles.optionTextActive]}>
                                        {item}
                                    </Text>
                                    {value === item && <Check size={18} color="#3970B7" />}
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
};

export default function ClassDetailsForm({ data, onUpdate, onNext }) {
    const phaseOptions = [
        'Ensino Fundamental I',
        'Ensino Fundamental II',
        'Ensino Médio',
    ];

    const subjectOptions = [
        'Matemática',
        'Português',
        'História',
        'Geografia',
        'Ciências',
        'Física',
        'Química',
        'Sociologia',
        'Filosofia',
        'Inglês',
        'Espanhol',
        'Biologia',
        'Literatura'
    ];

    const durationOptions = [
        '1 hora',
        '1 hora e 30 minutos',
        '2 horas'
    ];

    const allFilled = data.phase && data.subject && data.duration;

    return (
        <View style={styles.container}>
            <CustomSelect
                label="Escolha a fase escolar"
                value={data.phase}
                options={phaseOptions}
                placeholder="Selecione a fase escolar"
                onSelect={(v) => onUpdate({ phase: v })}
            />

            <CustomSelect
                label="Escolha uma matéria"
                value={data.subject}
                options={subjectOptions}
                placeholder="Selecione uma matéria"
                onSelect={(v) => onUpdate({ subject: v })}
            />

            <CustomSelect
                label="Selecione a duração da aula"
                value={data.duration}
                options={durationOptions}
                placeholder="Selecione a duração"
                onSelect={(v) => onUpdate({ duration: v })}
            />

            <TouchableOpacity
                onPress={onNext}
                disabled={!allFilled}
                style={[styles.nextButton, !allFilled && styles.disabledButton]}
            >
                <Text style={styles.nextButtonText}>Continuar</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: 20,
        paddingVertical: 10,
    },
    field: {
        gap: 8,
    },
    label: {
        fontSize: 14,
        color: '#374151',
        fontWeight: '600',
    },
    selectButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 12,
        backgroundColor: 'white',
        paddingHorizontal: 16,
        paddingVertical: 14,
    },
    selectText: {
        fontSize: 15,
        color: '#1E293B',
        flex: 1,
    },
    placeholderText: {
        color: '#94A3B8',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    modalContent: {
        width: '100%',
        maxHeight: 400,
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 16,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    modalTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#3970B7',
        marginBottom: 12,
        textAlign: 'center',
    },
    optionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 14,
        paddingHorizontal: 12,
        borderRadius: 10,
        marginBottom: 2,
    },
    optionItemActive: {
        backgroundColor: '#EFF6FF',
    },
    optionText: {
        fontSize: 15,
        color: '#374151',
    },
    optionTextActive: {
        color: '#3970B7',
        fontWeight: '600',
    },
    nextButton: {
        backgroundColor: '#3970B7',
        padding: 15,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 10,
    },
    disabledButton: {
        backgroundColor: '#CBD5E1',
    },
    nextButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
