import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, Modal, StyleSheet } from "react-native";
import { GraduationCap, Upload, User, Trash2 } from "lucide-react-native";
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ActionButtons from "../../common/ActionButtons";
import { mascararCelular } from "../../../utils/formUtils";
import { showAlert } from "../../common/ShowAlert";
import { teacherService } from "../../../services/teacherService";
import { Picker } from '@react-native-picker/picker';

export function ContentTeacherRegistration({ current, formData, onChange, onSave, onAvailabilityChange }) {
    const [showModal, setShowModal] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [disponibilidade, setDisponibilidade] = useState({});
    const [professorId, setProfessorId] = useState(null);

    const diasSemana = [
        "Segunda-feira", "Terça-feira", "Quarta-feira",
        "Quinta-feira", "Sexta-feira", "Sábado", "Domingo"
    ];

    useEffect(() => {
        AsyncStorage.getItem("userId").then(id => setProfessorId(id));
        AsyncStorage.getItem("fotoPerfilProfessor").then(foto => {
            if (foto) setPreviewUrl(foto);
        });
    }, []);

    useEffect(() => {
        if (!professorId) return;
        async function fetchDisponibilidade() {
            try {
                const resp = await teacherService.getAvailability(professorId);
                setDisponibilidade(resp || {});
                const hasAny = Object.values(resp || {}).some(arr => Array.isArray(arr) && arr.length > 0);
                if (onAvailabilityChange) onAvailabilityChange(hasAny);
            } catch (err) {
                console.log("Erro ao carregar disponibilidade", err);
            }
        }
        fetchDisponibilidade();
    }, [professorId]);

    const pickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
            showAlert({ title: "Permissão necessária", text: "É necessário permitir o acesso à galeria.", icon: "error" });
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
                // Fallback save local
                await AsyncStorage.setItem("fotoPerfilProfessor", base64Img);
                showAlert({ title: "Foto atualizada!", text: "Sua foto foi selecionada.", icon: "success" });
            } catch (e) {
                await AsyncStorage.setItem("fotoPerfilProfessor", base64Img);
            }
        }
    };

    const handleHorarioChange = (dia, idx, campo, valor) => {
        const horarios = disponibilidade[dia] ? [...disponibilidade[dia]] : [];
        if (horarios[idx]) {
            horarios[idx][campo] = valor;
            setDisponibilidade(prev => ({ ...prev, [dia]: horarios }));
            if (onAvailabilityChange) onAvailabilityChange(true);
        }
    };

    const adicionarHorario = (dia) => {
        const horarios = disponibilidade[dia] ? [...disponibilidade[dia]] : [];
        horarios.push({ inicio: "08:00", fim: "18:00" });
        setDisponibilidade(prev => ({ ...prev, [dia]: horarios }));
        if (onAvailabilityChange) onAvailabilityChange(true);
    };

    const removerHorario = (dia, idx) => {
        const horarios = disponibilidade[dia] ? [...disponibilidade[dia]] : [];
        horarios.splice(idx, 1);
        setDisponibilidade(prev => ({ ...prev, [dia]: horarios }));
        if (onAvailabilityChange) {
            const hasAny = Object.values({ ...disponibilidade, [dia]: horarios }).some(arr => Array.isArray(arr) && arr.length > 0);
            onAvailabilityChange(hasAny);
        }
    };

    const salvarDisponibilidade = async () => {
        try {
            await teacherService.saveAvailability(professorId, disponibilidade);
            showAlert({ title: "Sucesso", text: "Disponibilidade salva!", icon: "success" });
        } catch (err) {
            showAlert({ title: "Erro", text: "Falha ao salvar disponibilidade", icon: "error" });
        }
    };

    switch (current) {
        case "Informacoes Pessoais":
            return (
                <ScrollView style={styles.container}>
                    <View style={styles.formGap}>
                        <View>
                            <Text style={styles.label}>Nome Completo</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Nome completo"
                                value={formData.name || ""}
                                onChangeText={t => onChange("name", t)}
                            />
                        </View>
                        <View>
                            <Text style={styles.label}>Email</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="seu@email.com"
                                value={formData.email || ""}
                                onChangeText={t => onChange("email", t)}
                                keyboardType="email-address"
                            />
                        </View>
                        <View>
                            <Text style={styles.label}>Telefone</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="(00) 00000-0000"
                                value={formData.cellphoneNumber || ""}
                                onChangeText={t => onChange("cellphoneNumber", mascararCelular(t))}
                                keyboardType="phone-pad"
                            />
                        </View>
                        <View>
                            <Text style={styles.label}>Data de Nascimento</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="dd/mm/aaaa"
                                value={formData.dateBirth || ""}
                                onChangeText={t => onChange("dateBirth", t)}
                            />
                        </View>
                        <View>
                            <Text style={styles.label}>Sobre Você</Text>
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                placeholder="Descreva sua experiência..."
                                value={formData.resumeTeacher || ""}
                                onChangeText={t => onChange("resumeTeacher", t)}
                                multiline
                                textAlignVertical="top"
                            />
                        </View>
                    </View>
                    <View style={styles.actionContainer}>
                        <ActionButtons onSave={onSave} />
                    </View>
                </ScrollView>
            );

        case "Qualificacoes":
            return (
                <ScrollView style={styles.container}>
                    <View style={styles.formGap}>
                        <View>
                            <Text style={styles.label}>Formação Acadêmica</Text>
                            <View style={styles.pickerContainer}>
                                <Picker
                                    selectedValue={formData.academicFormation}
                                    onValueChange={(val) => onChange("academicFormation", val)}
                                >
                                    <Picker.Item label="Selecione..." value="" />
                                    <Picker.Item label="Graduação" value="graduacao" />
                                    <Picker.Item label="Pós-graduação" value="pos" />
                                    <Picker.Item label="Mestrado" value="mestrado" />
                                    <Picker.Item label="Doutorado" value="doutorado" />
                                </Picker>
                            </View>
                        </View>

                        <View>
                            <Text style={styles.label}>Anos de Experiência</Text>
                            <View style={styles.pickerContainer}>
                                <Picker
                                    selectedValue={formData.yearsExperience}
                                    onValueChange={(val) => onChange("yearsExperience", val)}
                                >
                                    <Picker.Item label="Selecione..." value="" />
                                    <Picker.Item label="1 ano" value="1" />
                                    <Picker.Item label="2 anos" value="2" />
                                    <Picker.Item label="3 anos" value="3" />
                                    <Picker.Item label="4 anos ou mais" value="4+" />
                                </Picker>
                            </View>
                        </View>

                        <View>
                            <Text style={styles.label}>Matérias que Leciona</Text>
                            <TouchableOpacity
                                onPress={() => setShowModal(true)}
                                style={styles.selectButton}
                            >
                                {formData.subject ? (
                                    <View style={styles.selectedSubjectBadge}>
                                        <Text style={styles.selectedSubjectText}>{formData.subject}</Text>
                                    </View>
                                ) : (
                                    <Text style={styles.placeholderText}>Clique para selecionar...</Text>
                                )}
                            </TouchableOpacity>
                        </View>

                        <View style={styles.infoBox}>
                            <GraduationCap size={20} color="#3b82f6" />
                            <View style={styles.infoTextContainer}>
                                <Text style={styles.infoTitle}>Professores com perfil completo</Text>
                                <Text style={styles.infoDescription}>Preencha todas as informações para ganhar destaque.</Text>
                            </View>
                        </View>
                    </View>

                    <Modal visible={showModal} transparent animationType="fade" onRequestClose={() => setShowModal(false)}>
                        <View style={styles.modalOverlay}>
                            <View style={styles.modalContent}>
                                <Text style={styles.modalTitle}>Selecione a matéria</Text>
                                <ScrollView style={styles.modalScrollView}>
                                    <View style={styles.subjectList}>
                                        {[
                                            "Matemática", "Física", "Química", "Biologia", "História",
                                            "Geografia", "Português", "Inglês", "Sociologia", "Filosofia",
                                            "Arte", "Ciências", "Alfabetização", "Espanhol"
                                        ].map((sub) => (
                                            <TouchableOpacity
                                                key={sub}
                                                onPress={() => onChange("subject", sub)}
                                                style={[
                                                    styles.subjectChip,
                                                    formData.subject === sub ? styles.subjectChipSelected : styles.subjectChipUnselected
                                                ]}
                                            >
                                                <Text style={formData.subject === sub ? styles.subjectTextSelected : styles.subjectTextUnselected}>{sub}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </ScrollView>
                                <TouchableOpacity onPress={() => setShowModal(false)} style={styles.confirmButton}>
                                    <Text style={styles.confirmButtonText}>Confirmar</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>

                    <View style={styles.actionContainer}>
                        <ActionButtons onSave={onSave} />
                    </View>
                </ScrollView>
            );

        case "Foto e Documentos":
            return (
                <ScrollView style={styles.container}>
                    <View style={styles.photoSection}>
                        <View style={styles.photoContainer}>
                            {previewUrl ? (
                                <Image source={{ uri: previewUrl }} style={styles.photo} resizeMode="cover" />
                            ) : (
                                <User size={64} color="#9ca3af" />
                            )}
                        </View>
                        <Text style={styles.photoInstruction}>Adicione uma foto profissional.</Text>

                        <TouchableOpacity onPress={pickImage} style={styles.uploadButton}>
                            <Upload size={20} color="white" />
                            <Text style={styles.uploadButtonText}>Selecionar Foto</Text>
                        </TouchableOpacity>
                    </View>
                    <ActionButtons onSave={onSave} />
                </ScrollView>
            );

        case "Disponibilidade":
            return (
                <ScrollView style={styles.container}>
                    <Text style={styles.sectionTitle}>Disponibilidade Semanal</Text>
                    <Text style={styles.sectionSubtitle}>Informe os dias e horários em que você pode dar aulas.</Text>

                    <View style={styles.availabilityGap}>
                        {diasSemana.map(dia => (
                            <View key={dia} style={styles.dayCard}>
                                <View style={styles.dayHeader}>
                                    <Text style={styles.dayName}>{dia}</Text>
                                    <TouchableOpacity onPress={() => adicionarHorario(dia)} style={styles.addButton}>
                                        <Text style={styles.addButtonText}>+ Adicionar</Text>
                                    </TouchableOpacity>
                                </View>

                                {(!disponibilidade[dia] || disponibilidade[dia].length === 0) && (
                                    <Text style={styles.noHoursText}>Nenhum horário</Text>
                                )}

                                {(disponibilidade[dia] || []).map((horario, idx) => (
                                    <View key={idx} style={styles.timeRow}>
                                        <Text style={styles.timeLabel}>Início:</Text>
                                        <TextInput
                                            style={styles.timeInput}
                                            value={horario.inicio}
                                            onChangeText={t => handleHorarioChange(dia, idx, "inicio", t)}
                                            placeholder="08:00"
                                        />
                                        <Text style={styles.timeLabel}>Fim:</Text>
                                        <TextInput
                                            style={styles.timeInput}
                                            value={horario.fim}
                                            onChangeText={t => handleHorarioChange(dia, idx, "fim", t)}
                                            placeholder="18:00"
                                        />
                                        <TouchableOpacity onPress={() => removerHorario(dia, idx)}>
                                            <Trash2 size={16} color="red" />
                                        </TouchableOpacity>
                                    </View>
                                ))}
                            </View>
                        ))}
                    </View>

                    <View style={styles.actionContainer}>
                        <ActionButtons onSave={salvarDisponibilidade} />
                    </View>
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
    formGap: {
        gap: 16,
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
    textArea: {
        height: 128, // h-32
    },
    actionContainer: {
        marginTop: 24,
        marginBottom: 32,
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#D1D5DB', // gray-300
        borderRadius: 6,
        backgroundColor: 'white',
    },
    selectButton: {
        borderWidth: 1,
        borderColor: '#D1D5DB', // gray-300
        borderRadius: 6,
        padding: 12,
        backgroundColor: 'white',
        minHeight: 44,
        justifyContent: 'center',
    },
    selectedSubjectBadge: {
        backgroundColor: '#DBEAFE', // blue-100
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    selectedSubjectText: {
        color: '#1E40AF', // blue-800
        fontSize: 12, // text-xs
    },
    placeholderText: {
        color: '#9CA3AF', // gray-400
    },
    infoBox: {
        backgroundColor: '#EFF6FF', // blue-50
        borderWidth: 1,
        borderColor: '#BFDBFE', // blue-200
        padding: 12,
        borderRadius: 6,
        flexDirection: 'row',
        gap: 8,
        marginTop: 8,
    },
    infoTextContainer: {
        flex: 1,
    },
    infoTitle: {
        fontSize: 14, // text-sm
        fontWeight: '600',
        color: '#1D4ED8', // blue-700
    },
    infoDescription: {
        fontSize: 12, // text-xs
        color: '#2563EB', // blue-600
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 16,
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 8,
        width: '100%',
        maxWidth: 384, // max-w-sm
        padding: 24,
    },
    modalTitle: {
        fontSize: 18, // text-lg
        fontWeight: '600',
        marginBottom: 16,
    },
    modalScrollView: {
        maxHeight: 240, // max-h-60
        marginBottom: 16,
    },
    subjectList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    subjectChip: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 6,
        borderWidth: 1,
    },
    subjectChipSelected: {
        backgroundColor: '#DBEAFE', // blue-100
        borderColor: '#3B82F6', // blue-500
    },
    subjectChipUnselected: {
        backgroundColor: '#F9FAFB', // gray-50
        borderColor: '#E5E7EB', // gray-200
    },
    subjectTextSelected: {
        color: '#1E40AF', // blue-800
    },
    subjectTextUnselected: {
        color: '#374151', // gray-700
    },
    confirmButton: {
        backgroundColor: '#2563EB', // blue-600
        paddingVertical: 8,
        borderRadius: 6,
        alignItems: 'center',
    },
    confirmButtonText: {
        color: 'white',
        fontWeight: '600',
    },
    photoSection: {
        alignItems: 'center',
        gap: 16,
        marginBottom: 32,
    },
    photoContainer: {
        width: 160, // w-40
        height: 160, // h-40
        borderRadius: 80, // rounded-full
        borderWidth: 2,
        borderColor: '#D1D5DB', // gray-300
        borderStyle: 'dashed',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        backgroundColor: 'white',
    },
    photo: {
        width: 160,
        height: 160,
    },
    photoInstruction: {
        fontSize: 14, // text-sm
        color: '#4B5563', // gray-600
        textAlign: 'center',
        paddingHorizontal: 24,
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
    sectionTitle: {
        fontSize: 18, // text-lg
        fontWeight: '600',
        marginBottom: 8,
    },
    sectionSubtitle: {
        color: '#4B5563', // gray-600
        marginBottom: 16,
        fontSize: 14, // text-sm
    },
    availabilityGap: {
        gap: 16,
    },
    dayCard: {
        backgroundColor: '#F9FAFB', // gray-50
        borderWidth: 1,
        borderColor: '#E5E7EB', // gray-200
        borderRadius: 6,
        padding: 12,
    },
    dayHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    dayName: {
        fontWeight: '500',
    },
    addButton: {
        backgroundColor: '#3970B7',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    addButtonText: {
        color: 'white',
        fontSize: 12, // text-xs
    },
    noHoursText: {
        color: '#9CA3AF', // gray-400
        fontSize: 12, // text-xs
        fontStyle: 'italic',
    },
    timeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    timeLabel: {
        fontSize: 12, // text-xs
    },
    timeInput: {
        borderWidth: 1,
        borderColor: '#E5E7EB', // gray-200
        borderRadius: 4,
        paddingHorizontal: 8,
        paddingVertical: 4,
        fontSize: 12, // text-xs
        width: 64, // w-16
        backgroundColor: 'white',
        textAlign: 'center',
    },
});
