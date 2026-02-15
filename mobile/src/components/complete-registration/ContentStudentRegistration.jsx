import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, Alert, StyleSheet } from "react-native";
import { ArrowDown, Upload, User as UserIcon } from "lucide-react-native";
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ActionButtons from "./ActionButtons";
import { mascararCpf, mascararDataNascimento, mascararCelular } from "../../utils/formUtils";
import { Picker } from '@react-native-picker/picker';
import { showAlert } from "../ShowAlert";

export default function ContentStudentRegistration({ current, formData, onChange, onSave, onProgressChange }) {
    const [previewUrl, setPreviewUrl] = useState(null);

    useEffect(() => {
        AsyncStorage.getItem("fotoPerfilAluno").then(foto => {
            if (foto) setPreviewUrl(foto);
        });
    }, []);

    const pickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
            Alert.alert("Permissão necessária", "É necessário permitir o acesso à galeria.");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
            base64: true,
        });

        if (!result.canceled) {
            const asset = result.assets[0];
            const base64Img = `data:image/jpeg;base64,${asset.base64}`;
            setPreviewUrl(base64Img);

            try {
                const studentId = await AsyncStorage.getItem('userId');
                if (studentId) {
                    await AsyncStorage.setItem("fotoPerfilAluno", base64Img);
                    await AsyncStorage.setItem("fotoPerfilProfessor", base64Img);
                    showAlert({ title: "Foto atualizada!", text: "Sua foto foi selecionada.", icon: "success" });
                }
            } catch (error) {
                console.error(error);
            }
        }
    };

    useEffect(() => {
        const totalFields = 5;
        let filled = 0;
        if (formData.name) filled++;
        if (formData.email) filled++;
        if (formData.cellphoneNumber) filled++;
        if (formData.responsibleCpf) filled++;
        if (formData.dateBirth) filled++;
        const percent = Math.round((filled / totalFields) * 100);
        onProgressChange(percent);
    }, [formData, onProgressChange]);

    const renderInput = ({ label, type, placeholder, field, mask, options }) => (
        <View key={label} style={styles.inputContainer}>
            <Text style={styles.label}>{label}</Text>
            {type === 'select' ? (
                <View style={styles.pickerWrapper}>
                    <Picker
                        selectedValue={formData[field]}
                        onValueChange={(val) => onChange(field, val)}
                    >
                        <Picker.Item label="Selecione" value="" />
                        {options.map(opt => <Picker.Item key={opt} label={opt} value={opt} />)}
                    </Picker>
                </View>
            ) : (
                <TextInput
                    style={styles.input}
                    placeholder={placeholder}
                    value={formData[field] || (field.includes('.') ? formData.responsible?.[field.split('.')[1]] : '')}
                    onChangeText={(txt) => onChange(field, mask ? mask(txt) : txt)}
                    keyboardType={type === 'email' ? 'email-address' : type === 'number' ? 'numeric' : 'default'}
                />
            )}
        </View>
    );

    switch (current) {
        case "Dados do Aluno":
            return (
                <ScrollView style={styles.container}>
                    <View style={styles.gap}>
                        {renderInput({ label: "Nome Completo do Aluno", type: "text", placeholder: "Nome completo", field: "name" })}
                        {renderInput({ label: "Email do Aluno (opcional)", type: "email", placeholder: "seu.email@exemplo.com", field: "email" })}
                        {renderInput({ label: "Data de Nascimento", type: "text", placeholder: "DD/MM/AAAA", field: "dateBirth", mask: mascararDataNascimento })}
                        {renderInput({ label: "Série/Ano", type: "select", options: ["1ºEF", "2ºEF", "3ºEF", "4ºEF", "5ºEF", "6ºEF", "7ºEF", "8ºEF", "9ºEF", "1ºEM", "2ºEM", "3ºEM"], field: "schoolGrade" })}
                        {renderInput({ label: "Telefone do Aluno (opcional)", type: "text", placeholder: "(00) 00000-0000", field: "cellphoneNumber", mask: mascararCelular })}
                        {renderInput({ label: "Escola", type: "text", placeholder: "Nome da Escola", field: "schoolName" })}
                    </View>
                    <View style={styles.actionContainer}>
                        <ActionButtons onSave={onSave} />
                    </View>
                </ScrollView>
            );

        case "Responsavel":
            return (
                <ScrollView style={styles.container}>
                    <View style={styles.alertBox}>
                        <ArrowDown color="#854d0e" size={24} />
                        <View style={styles.alertContent}>
                            <Text style={styles.alertTitle}>Dados do responsável</Text>
                            <Text style={styles.alertText}>Preencha as informações do responsável para contato e gerenciamento da conta</Text>
                        </View>
                    </View>

                    <View style={styles.gap}>
                        <View>
                            <Text style={styles.label}>Nome Completo do Responsável</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Nome completo do responsável"
                                value={formData.responsible?.responsibleName || ""}
                                onChangeText={t => onChange("responsibleName", t)}
                            />
                        </View>

                        <View style={styles.marginTop}>
                            <Text style={styles.label}>Grau de Parentesco</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Grau de parentesco"
                                value={formData.responsible?.kinship || ""}
                                onChangeText={t => onChange("kinship", t)}
                            />
                        </View>

                        <View style={styles.marginTop}>
                            <Text style={styles.label}>CPF do Responsável</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="000.000.000-00"
                                value={formData.responsible?.responsibleCpf || ""}
                                onChangeText={t => onChange("responsibleCpf", mascararCpf(t))}
                                keyboardType="numeric"
                            />
                        </View>

                        <View style={styles.marginTop}>
                            <Text style={styles.label}>Telefone do Responsável</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="(00) 00000-0000"
                                value={formData.responsible?.responsibleCellphoneNumber || ""}
                                onChangeText={t => onChange("responsibleCellphoneNumber", mascararCelular(t))}
                                keyboardType="phone-pad"
                            />
                        </View>
                    </View>
                    <View style={[styles.actionContainer, styles.marginTopLarge]}>
                        <ActionButtons onSave={onSave} />
                    </View>
                </ScrollView>
            );

        case "Foto do Aluno":
            return (
                <ScrollView style={styles.container}>
                    <View style={styles.photoSection}>
                        <View style={styles.photoContainer}>
                            {previewUrl ? (
                                <Image source={{ uri: previewUrl }} style={styles.photo} resizeMode="cover" />
                            ) : (
                                <UserIcon size={64} color="#9ca3af" />
                            )}
                        </View>
                        <Text style={styles.photoTitle}>Foto do Aluno</Text>
                        <Text style={styles.photoInstruction}>Adicione uma foto do aluno para personalizar o perfil.</Text>

                        <TouchableOpacity
                            onPress={pickImage}
                            style={styles.uploadButton}
                        >
                            <Upload size={20} color="white" />
                            <Text style={styles.uploadButtonText}>Selecionar Foto</Text>
                        </TouchableOpacity>
                    </View>
                    <ActionButtons onSave={onSave} />
                </ScrollView>
            );

        default:
            return null;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    gap: {
        gap: 8,
    },
    inputContainer: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14, // text-sm
        fontWeight: '600',
        color: '#374151', // gray-700
        marginBottom: 4,
    },
    input: {
        padding: 12, // p-3
        borderWidth: 1,
        borderColor: '#D1D5DB', // gray-300
        borderRadius: 6,
        backgroundColor: 'white',
    },
    pickerWrapper: {
        borderWidth: 1,
        borderColor: '#D1D5DB', // gray-300
        borderRadius: 6,
        overflow: 'hidden',
        backgroundColor: 'white',
    },
    actionContainer: {
        marginBottom: 32,
    },
    alertBox: {
        backgroundColor: '#FEF9C3', // yellow-100
        borderWidth: 1,
        borderColor: '#FDE047', // yellow-300
        padding: 12,
        borderRadius: 4,
        marginBottom: 24,
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 8,
    },
    alertContent: {
        flex: 1,
    },
    alertTitle: {
        fontSize: 14, // text-sm
        fontWeight: '600',
        color: '#854D0E', // yellow-800
    },
    alertText: {
        fontSize: 12, // text-xs
        color: '#854D0E', // yellow-800
    },
    marginTop: {
        marginTop: 16,
    },
    marginTopLarge: {
        marginTop: 24, // mt-4 in original was 16px, using 24 for separation
    },
    photoSection: {
        alignItems: 'center',
        gap: 16,
        marginBottom: 24,
    },
    photoContainer: {
        width: 144, // w-36
        height: 144, // h-36
        borderRadius: 72, // rounded-full
        borderWidth: 2,
        borderColor: '#D1D5DB', // gray-300
        borderStyle: 'dashed',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        backgroundColor: 'white',
    },
    photo: {
        width: 144,
        height: 144,
        borderRadius: 72,
    },
    photoTitle: {
        fontSize: 20, // text-xl
        fontWeight: '600',
    },
    photoInstruction: {
        fontSize: 14, // text-sm
        textAlign: 'center',
        color: '#4B5563', // gray-600
        paddingHorizontal: 16,
    },
    uploadButton: {
        backgroundColor: '#3970B7',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    uploadButtonText: {
        color: 'white',
        fontWeight: '600',
    },
});
