import React, { useEffect, useState, useMemo } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, Modal, StyleSheet, Switch } from "react-native";
import { ArrowDown, Upload, User as UserIcon, Camera, ChevronDown, MapPin, Navigation } from "lucide-react-native";
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ActionButtons from "../../common/ActionButtons";
import { mascararCpf, mascararDataNascimento, mascararCelular } from "../../../utils/formUtils";
import { showAlert } from "../../common/ShowAlert";

export default function ContentStudentRegistration({ current, formData, onChange, onSave, onProgressChange }) {
    const [previewUrl, setPreviewUrl] = useState(null);
    const [showPhotoModal, setShowPhotoModal] = useState(false);
    const [selectModal, setSelectModal] = useState({ visible: false, field: '', options: [] });

    useEffect(() => {
        AsyncStorage.getItem("fotoPerfilAluno").then(foto => {
            if (foto) setPreviewUrl(foto);
        });
    }, []);

    const handleImageResult = async (result) => {
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

    const pickFromGallery = async () => {
        setShowPhotoModal(false);
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
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
        await handleImageResult(result);
    };

    const pickFromCamera = async () => {
        setShowPhotoModal(false);
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
        if (!permissionResult.granted) {
            showAlert({ title: "Permissão necessária", text: "É necessário permitir o acesso à câmera.", icon: "error" });
            return;
        }
        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
            base64: true,
        });
        await handleImageResult(result);
    };

    useEffect(() => {
        const isAdult = formData.isAdult || false;
        const fields = [
            formData.name,
            formData.email,
            formData.dateBirth,
            formData.schoolGrade,
            formData.cellphoneNumber,
            formData.schoolName,
            formData.cep,
            formData.rua,
            formData.cidade,
            formData.estado,
            ...(isAdult ? [] : [
                formData.responsible?.responsibleName,
                formData.responsible?.kinship,
                formData.responsible?.responsibleCpf,
                formData.responsible?.responsibleCellphoneNumber,
            ]),
        ];
        const totalFields = fields.length;
        const filled = fields.filter(Boolean).length;
        const percent = Math.round((filled / totalFields) * 100);
        onProgressChange(percent);
    }, [formData, onProgressChange]);

    const calculatedAge = useMemo(() => {
        if (!formData.dateBirth || formData.dateBirth.length < 10) return null;
        const parts = formData.dateBirth.split('/');
        if (parts.length !== 3) return null;
        const [day, month, year] = parts.map(Number);
        if (!day || !month || !year || year < 1900) return null;
        const birth = new Date(year, month - 1, day);
        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
        return age;
    }, [formData.dateBirth]);

    useEffect(() => {
        if (calculatedAge !== null && calculatedAge >= 18 && !formData.isAdult) {
            onChange("isAdult", true);
        }
    }, [calculatedAge]);

    const renderInput = ({ label, type, placeholder, field, mask, options }) => (
        <View key={label} style={styles.inputContainer}>
            <Text style={styles.label}>{label}</Text>
            {type === 'select' ? (
                <TouchableOpacity
                    onPress={() => setSelectModal({ visible: true, field, options })}
                    style={styles.selectButton}
                >
                    <Text style={formData[field] ? styles.selectValue : styles.placeholderText}>
                        {formData[field] || 'Selecione...'}
                    </Text>
                    <ChevronDown size={18} color="#6B7280" />
                </TouchableOpacity>
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

                        <View style={styles.adultToggleContainer}>
                            <View style={styles.adultToggleInfo}>
                                <Text style={styles.adultToggleLabel}>Sou maior de 18 anos</Text>
                                <Text style={styles.adultToggleHint}>
                                    {formData.isAdult
                                        ? 'Dados de responsável não serão exigidos'
                                        : 'Se menor, preencha os dados do responsável'}
                                </Text>
                            </View>
                            <Switch
                                value={formData.isAdult || false}
                                onValueChange={(val) => onChange("isAdult", val)}
                                trackColor={{ false: '#D1D5DB', true: '#93C5FD' }}
                                thumbColor={formData.isAdult ? '#3970B7' : '#9CA3AF'}
                            />
                        </View>

                        {renderInput({ label: "Série/Ano", type: "select", options: ["1ºEF", "2ºEF", "3ºEF", "4ºEF", "5ºEF", "6ºEF", "7ºEF", "8ºEF", "9ºEF", "1ºEM", "2ºEM", "3ºEM"], field: "schoolGrade" })}
                        {renderInput({ label: "Telefone do Aluno (opcional)", type: "text", placeholder: "(00) 00000-0000", field: "cellphoneNumber", mask: mascararCelular })}
                        {renderInput({ label: "Escola", type: "text", placeholder: "Nome da Escola", field: "schoolName" })}
                    </View>
                    <View style={styles.actionContainer}>
                        <ActionButtons onSave={onSave} />
                    </View>
                    <Modal visible={selectModal.visible} transparent animationType="fade" onRequestClose={() => setSelectModal(prev => ({ ...prev, visible: false }))}>
                        <TouchableOpacity style={styles.selectModalOverlay} activeOpacity={1} onPress={() => setSelectModal(prev => ({ ...prev, visible: false }))}>
                            <View style={styles.selectModalContent}>
                                {selectModal.options.map(opt => (
                                    <TouchableOpacity
                                        key={opt}
                                        onPress={() => { onChange(selectModal.field, opt); setSelectModal(prev => ({ ...prev, visible: false })); }}
                                        style={[styles.selectOption, formData[selectModal.field] === opt && styles.selectOptionActive]}
                                    >
                                        <Text style={[styles.selectOptionText, formData[selectModal.field] === opt && styles.selectOptionTextActive]}>{opt}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </TouchableOpacity>
                    </Modal>
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

        case "Endereco":
            return (
                <ScrollView style={styles.container}>
                    <View style={styles.addressInfoBox}>
                        <MapPin size={20} color="#3970B7" />
                        <View style={{ flex: 1 }}>
                            <Text style={styles.addressInfoTitle}>Endereço para aulas presenciais</Text>
                            <Text style={styles.addressInfoText}>Esse endereço será usado como sugestão ao agendar aulas presenciais.</Text>
                        </View>
                    </View>

                    <View style={styles.gap}>
                        <View>
                            <Text style={styles.label}>CEP</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="00000-000"
                                value={formData.cep || ""}
                                onChangeText={async (text) => {
                                    const digits = text.replace(/\D/g, "");
                                    onChange("cep", digits);
                                    if (digits.length === 8) {
                                        try {
                                            const resp = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
                                            const json = await resp.json();
                                            if (!json.erro) {
                                                onChange("rua", json.logradouro || "");
                                                onChange("bairro", json.bairro || "");
                                                onChange("cidade", json.localidade || "");
                                                onChange("estado", json.uf || "");
                                            }
                                        } catch (e) { /* ignore */ }
                                    }
                                }}
                                keyboardType="numeric"
                                maxLength={8}
                            />
                        </View>

                        <View>
                            <Text style={styles.label}>Rua</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Nome da rua"
                                value={formData.rua || ""}
                                onChangeText={t => onChange("rua", t)}
                            />
                        </View>

                        <View style={{ flexDirection: 'row', gap: 12 }}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.label}>Número</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Nº"
                                    value={formData.numero || ""}
                                    onChangeText={t => onChange("numero", t)}
                                    keyboardType="numeric"
                                />
                            </View>
                            <View style={{ flex: 2 }}>
                                <Text style={styles.label}>Complemento</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Apto, bloco..."
                                    value={formData.complemento || ""}
                                    onChangeText={t => onChange("complemento", t)}
                                />
                            </View>
                        </View>

                        <View>
                            <Text style={styles.label}>Bairro</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Bairro"
                                value={formData.bairro || ""}
                                onChangeText={t => onChange("bairro", t)}
                            />
                        </View>

                        <View style={{ flexDirection: 'row', gap: 12 }}>
                            <View style={{ flex: 3 }}>
                                <Text style={styles.label}>Cidade</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Cidade"
                                    value={formData.cidade || ""}
                                    onChangeText={t => onChange("cidade", t)}
                                />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.label}>UF</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="UF"
                                    value={formData.estado || ""}
                                    onChangeText={t => onChange("estado", t)}
                                    maxLength={2}
                                    autoCapitalize="characters"
                                />
                            </View>
                        </View>
                    </View>

                    <TouchableOpacity
                        style={styles.locationButton}
                        onPress={async () => {
                            try {
                                const { status } = await Location.requestForegroundPermissionsAsync();
                                if (status !== 'granted') return;
                                const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
                                const resp = await fetch(
                                    `https://nominatim.openstreetmap.org/reverse?lat=${loc.coords.latitude}&lon=${loc.coords.longitude}&format=json&addressdetails=1`,
                                    { headers: { 'User-Agent': 'StudiApp/1.0' } }
                                );
                                const geo = await resp.json();
                                if (geo.address) {
                                    const a = geo.address;
                                    if ((a.country_code || '').toLowerCase() !== 'br') return;
                                    onChange("rua", a.road || "");
                                    onChange("bairro", a.suburb || a.neighbourhood || "");
                                    onChange("cidade", a.city || a.town || a.village || "");
                                    onChange("estado", a['ISO3166-2-lvl4']?.split('-')?.[1]?.toUpperCase() || "");
                                    if (a.postcode) onChange("cep", a.postcode.replace(/\D/g, ""));
                                }
                            } catch (e) {
                                console.log("Erro ao obter localização:", e);
                            }
                        }}
                    >
                        <Navigation size={18} color="white" />
                        <Text style={styles.locationButtonText}>Usar minha localização</Text>
                    </TouchableOpacity>

                    <View style={styles.actionContainer}>
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
                            onPress={() => setShowPhotoModal(true)}
                            style={styles.uploadButton}
                        >
                            <Upload size={20} color="white" />
                            <Text style={styles.uploadButtonText}>Selecionar Foto</Text>
                        </TouchableOpacity>

                        <Modal visible={showPhotoModal} transparent animationType="fade" onRequestClose={() => setShowPhotoModal(false)}>
                            <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowPhotoModal(false)}>
                                <View style={styles.modalContent}>
                                    <Text style={styles.modalTitle}>Escolher foto</Text>
                                    <TouchableOpacity style={styles.modalOption} onPress={pickFromCamera}>
                                        <Camera size={22} color="#3970B7" />
                                        <Text style={styles.modalOptionText}>Tirar foto</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.modalOption} onPress={pickFromGallery}>
                                        <Upload size={22} color="#3970B7" />
                                        <Text style={styles.modalOptionText}>Escolher da galeria</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.modalCancel} onPress={() => setShowPhotoModal(false)}>
                                        <Text style={styles.modalCancelText}>Cancelar</Text>
                                    </TouchableOpacity>
                                </View>
                            </TouchableOpacity>
                        </Modal>
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
        borderColor: '#D1D5DB',
        borderRadius: 6,
        overflow: 'hidden',
        backgroundColor: 'white',
        paddingHorizontal: 4,
    },
    selectButton: {
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 6,
        padding: 12,
        backgroundColor: 'white',
        minHeight: 44,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    selectValue: {
        fontSize: 14,
        color: '#111827',
    },
    placeholderText: {
        color: '#9CA3AF',
        fontSize: 14,
    },
    selectModalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 16,
    },
    selectModalContent: {
        backgroundColor: 'white',
        borderRadius: 10,
        width: '90%',
        maxWidth: 360,
        padding: 16,
        gap: 4,
    },
    selectOption: {
        paddingVertical: 12,
        paddingHorizontal: 12,
        borderRadius: 6,
    },
    selectOptionActive: {
        backgroundColor: '#DBEAFE',
    },
    selectOptionText: {
        fontSize: 14,
        color: '#374151',
    },
    selectOptionTextActive: {
        color: '#1E40AF',
        fontWeight: '600',
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
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: 'white',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        padding: 24,
        paddingBottom: 32,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 16,
        textAlign: 'center',
    },
    modalOption: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    modalOptionText: {
        fontSize: 16,
        color: '#374151',
    },
    modalCancel: {
        marginTop: 12,
        alignItems: 'center',
        paddingVertical: 12,
    },
    modalCancelText: {
        fontSize: 16,
        color: '#6B7280',
        fontWeight: '600',
    },
    addressInfoBox: {
        backgroundColor: '#EFF6FF',
        borderWidth: 1,
        borderColor: '#BFDBFE',
        padding: 12,
        borderRadius: 8,
        flexDirection: 'row',
        gap: 10,
        marginBottom: 20,
    },
    addressInfoTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1E40AF',
    },
    addressInfoText: {
        fontSize: 12,
        color: '#3B82F6',
        marginTop: 2,
    },
    locationButton: {
        backgroundColor: '#3970B7',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginTop: 20,
    },
    locationButtonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 14,
    },
    adultToggleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#F0F9FF',
        borderWidth: 1,
        borderColor: '#BAE6FD',
        borderRadius: 10,
        padding: 14,
        marginVertical: 8,
    },
    adultToggleInfo: {
        flex: 1,
        marginRight: 12,
    },
    adultToggleLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1E40AF',
    },
    adultToggleHint: {
        fontSize: 11,
        color: '#3B82F6',
        marginTop: 2,
    },
});
