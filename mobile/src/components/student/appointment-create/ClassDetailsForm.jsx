import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ChevronDown, Upload } from 'lucide-react-native';
import AddMaterialModal from './AddMaterialModal';
import { Picker } from '@react-native-picker/picker'; // Using Picker for Select replacement

export default function ClassDetailsForm({ data, onUpdate, onNext }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

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

    const handleAddMaterial = newMaterial => {
        const updated = [
            ...(data.materials || []),
            { id: Date.now(), name: newMaterial.name, file: newMaterial.file }
        ];
        onUpdate({ materials: updated });
        setIsModalOpen(false);
    };

    const allFilled =
        data.phase &&
        data.subject &&
        data.duration;

    return (
        <View style={styles.container}>
            <View style={styles.field}>
                <Text style={styles.label}>Escolha a fase escolar</Text>
                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={data.phase}
                        onValueChange={(itemValue) => onUpdate({ phase: itemValue })}
                    >
                        <Picker.Item label="Selecione a fase escolar" value="" />
                        {phaseOptions.map(phase => (
                            <Picker.Item key={phase} label={phase} value={phase} />
                        ))}
                    </Picker>
                </View>
            </View>

            <View style={styles.field}>
                <Text style={styles.label}>Escolha uma matéria</Text>
                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={data.subject}
                        onValueChange={(itemValue) => onUpdate({ subject: itemValue })}
                    >
                        <Picker.Item label="Selecione uma matéria" value="" />
                        {subjectOptions.map(subject => (
                            <Picker.Item key={subject} label={subject} value={subject} />
                        ))}
                    </Picker>
                </View>
            </View>

            <View style={styles.field}>
                <Text style={styles.label}>Selecione a duração da aula</Text>
                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={data.duration}
                        onValueChange={(itemValue) => onUpdate({ duration: itemValue })}
                    >
                        <Picker.Item label="Selecione a duração" value="" />
                        {durationOptions.map(duration => (
                            <Picker.Item key={duration} label={duration} value={duration} />
                        ))}
                    </Picker>
                </View>
            </View>

            {/* 
      <View style={styles.field}>
        <Text style={styles.label}>Material de Aula</Text>
         {data.materials && data.materials.length > 0 && (
          <View style={styles.materialsList}>
            {data.materials.map(mat => (
              <Text key={mat.id} style={styles.materialItem}>{mat.name}</Text>
            ))}
          </View>
        )}
        <TouchableOpacity 
            onPress={() => setIsModalOpen(true)}
            style={styles.addButton}
        >
            <Upload size={16} color="#3970B7" style={{marginRight: 8}}/>
            <Text style={{color: '#3970B7'}}>Adicionar Material</Text>
        </TouchableOpacity>
      </View>
      */}

            <TouchableOpacity
                onPress={onNext}
                disabled={!allFilled}
                style={[styles.nextButton, !allFilled && styles.disabledButton]}
            >
                <Text style={styles.nextButtonText}>Continuar</Text>
            </TouchableOpacity>

            {/* <AddMaterialModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddMaterial={handleAddMaterial}
      /> */}
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
        fontWeight: '500',
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 8,
        backgroundColor: 'white',
        // Android picker styling is limited, consider standard View wrapping
    },
    materialsList: {
        borderWidth: 1,
        borderColor: '#e5e7eb',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    materialItem: {
        fontSize: 14,
        color: '#4b5563',
        marginBottom: 2,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        borderRadius: 5,
    },
    nextButton: {
        backgroundColor: '#3970B7',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    disabledButton: {
        backgroundColor: '#d1d5db',
    },
    nextButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
