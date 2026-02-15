import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { X, Upload } from 'lucide-react-native';
import * as DocumentPicker from 'expo-document-picker';

const AddMaterialModal = ({ isOpen, onClose, onAddMaterial }) => {
    const [materialName, setMaterialName] = useState('');
    const [file, setFile] = useState(null);

    const handleSubmit = () => {
        if (!materialName) return; // simple validation
        onAddMaterial({ name: materialName, file });
        setMaterialName('');
        setFile(null);
        onClose();
    };

    const handleFilePick = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({});
            if (!result.canceled) {
                setFile(result.assets[0]);
            }
        } catch (err) {
            console.log("Error picking document", err);
        }
    };

    return (
        <Modal
            visible={isOpen}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Adicionar Material de Aula</Text>
                        <TouchableOpacity onPress={onClose}>
                            <X size={24} color="#9ca3af" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.form}>
                        <View>
                            <Text style={styles.label}>Nome do Material</Text>
                            <TextInput
                                value={materialName}
                                onChangeText={setMaterialName}
                                placeholder="Ex: Lista de Matemática 4° Ano"
                                style={styles.input}
                            />
                        </View>

                        <View>
                            <Text style={styles.label}>Arquivo do Material</Text>
                            <View style={styles.fileContainer}>
                                <Text style={styles.fileName}>{file ? file.name : 'Nenhum arquivo selecionado'}</Text>
                                <TouchableOpacity onPress={handleFilePick}>
                                    <Text style={styles.chooseText}>Escolher</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <Text style={styles.helperText}>
                            Adicione PDFs, imagens ou links para o material que está sendo utilizado na aula.
                        </Text>

                        <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
                            <Upload size={20} color="white" style={{ marginRight: 8 }} />
                            <Text style={styles.submitText}>Adicionar Material</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        padding: 20,
    },
    container: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#3970B7',
    },
    form: {
        gap: 15,
    },
    label: {
        fontSize: 14,
        color: '#4b5563',
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 5,
        padding: 10,
        fontSize: 14,
    },
    fileContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 5,
        padding: 10,
    },
    fileName: {
        fontSize: 14,
        color: '#6b7280',
        flex: 1,
    },
    chooseText: {
        color: '#3970B7',
        fontWeight: 'bold',
        fontSize: 14,
    },
    helperText: {
        fontSize: 12,
        color: '#6b7280',
    },
    submitButton: {
        backgroundColor: '#3970B7',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 12,
        borderRadius: 5,
        marginTop: 10,
    },
    submitText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14,
    },
});

export default AddMaterialModal;
