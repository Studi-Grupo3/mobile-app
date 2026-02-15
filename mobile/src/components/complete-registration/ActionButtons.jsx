import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Save } from 'lucide-react-native';

const ActionButtons = ({ onSave, onCancel }) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity
                onPress={onCancel}
                style={styles.cancelButton}
            >
                <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={onSave}
                style={styles.saveButton}
            >
                <Save size={20} color="black" />
                <Text style={styles.saveText}>Salvar Alterações</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 16,
        paddingTop: 16,
    },
    cancelButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#9CA3AF', // gray-400
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelText: {
        color: '#374151', // gray-700
        fontWeight: '600',
    },
    saveButton: {
        flex: 2,
        paddingVertical: 12,
        borderRadius: 6,
        backgroundColor: '#EAB308', // yellow-500 approx #FECB0A
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 8,
    },
    saveText: {
        color: 'black',
        fontWeight: '600',
    },
});

export default ActionButtons;
