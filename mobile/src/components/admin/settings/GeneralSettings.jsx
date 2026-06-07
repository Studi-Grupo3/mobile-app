import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Modal, StyleSheet } from 'react-native';
import { SaveButton } from './SaveButton';
import { AlertModal } from '../../ui/AlertModal';
import { useAlert } from '../../../hooks/useAlert';
import * as ImagePicker from 'expo-image-picker';
import { Upload, Camera } from 'lucide-react-native';

export function GeneralSettings() {
    const [form, setForm] = useState({
        companyName: '',
        cnpj: '',
        email: '',
        phone: '',
        address: '',
        logo: null
    });
    const { alertConfig, showAlert, hideAlert } = useAlert();
    const [showPhotoModal, setShowPhotoModal] = useState(false);

    const handleChange = (name, value) => {
        setForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePickLogo = async () => {
        setShowPhotoModal(true);
    };

    const pickFromGallery = async () => {
        setShowPhotoModal(false);
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });
        if (!result.canceled) {
            setForm(prev => ({ ...prev, logo: result.assets[0] }));
        }
    };

    const pickFromCamera = async () => {
        setShowPhotoModal(false);
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
        if (!permissionResult.granted) {
            showAlert('error', 'Permissão necessária', 'É necessário permitir o acesso à câmera.');
            return;
        }
        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });
        if (!result.canceled) {
            setForm(prev => ({ ...prev, logo: result.assets[0] }));
        }
    };

    const salvar = () => {
        console.log('Dados da empresa:', form);
        showAlert('success', 'Sucesso', 'Informações salvas com sucesso.');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Informações da Empresa</Text>
            <Text style={styles.subtitle}>Estas informações serão exibidas em relatórios e documentos.</Text>

            <View style={styles.formContainer}>
                <View>
                    <Text style={styles.label}>Nome da Empresa</Text>
                    <TextInput
                        value={form.companyName}
                        onChangeText={t => handleChange('companyName', t)}
                        placeholder="LessonPay Educação Ltda."
                        style={styles.input}
                    />
                </View>

                <View>
                    <Text style={styles.label}>CNPJ</Text>
                    <TextInput
                        value={form.cnpj}
                        onChangeText={t => handleChange('cnpj', t)}
                        placeholder="12.345.678/0001-90"
                        style={styles.input}
                        keyboardType="numeric"
                    />
                </View>

                <View>
                    <Text style={styles.label}>Email de Contato</Text>
                    <TextInput
                        value={form.email}
                        onChangeText={t => handleChange('email', t)}
                        placeholder="contato@lessonpay.com.br"
                        style={styles.input}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                </View>

                <View>
                    <Text style={styles.label}>Telefone</Text>
                    <TextInput
                        value={form.phone}
                        onChangeText={t => handleChange('phone', t)}
                        placeholder="(11) 3456-7890"
                        style={styles.input}
                        keyboardType="phone-pad"
                    />
                </View>

                <View>
                    <Text style={styles.label}>Endereço</Text>
                    <TextInput
                        value={form.address}
                        onChangeText={t => handleChange('address', t)}
                        placeholder="Av. Paulista, 1000, São Paulo, SP"
                        style={styles.input}
                    />
                </View>

                <View>
                    <Text style={styles.label}>Logo da Empresa</Text>
                    <TouchableOpacity
                        onPress={handlePickLogo}
                        style={styles.logoPicker}
                    >
                        {form.logo ? (
                            <Image source={{ uri: form.logo.uri }} style={styles.logoImage} />
                        ) : (
                            <Text style={styles.logoPlaceholderText}>Toque para escolher logo</Text>
                        )}
                    </TouchableOpacity>

                    <Modal visible={showPhotoModal} transparent animationType="fade" onRequestClose={() => setShowPhotoModal(false)}>
                        <TouchableOpacity style={styles.photoModalOverlay} activeOpacity={1} onPress={() => setShowPhotoModal(false)}>
                            <View style={styles.photoModalContent}>
                                <Text style={styles.photoModalTitle}>Escolher imagem</Text>
                                <TouchableOpacity style={styles.photoModalOption} onPress={pickFromCamera}>
                                    <Camera size={22} color="#3970B7" />
                                    <Text style={styles.photoModalOptionText}>Tirar foto</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.photoModalOption} onPress={pickFromGallery}>
                                    <Upload size={22} color="#3970B7" />
                                    <Text style={styles.photoModalOptionText}>Escolher da galeria</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.photoModalCancel} onPress={() => setShowPhotoModal(false)}>
                                    <Text style={styles.photoModalCancelText}>Cancelar</Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>
                    </Modal>
                </View>
            </View>

            <View style={styles.buttonContainer}>
                <SaveButton onClick={salvar} label="Salvar Alterações" />
            </View>

            <AlertModal visible={alertConfig.visible} type={alertConfig.type} title={alertConfig.title} message={alertConfig.message} onClose={hideAlert} buttons={alertConfig.buttons} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 1,
        elevation: 1,
    },
    title: {
        fontSize: 18, // text-lg
        fontWeight: 'bold',
        color: '#111827', // gray-900
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 12, // text-xs
        color: '#6B7280', // gray-500
        marginBottom: 24,
    },
    formContainer: {
        gap: 16,
    },
    label: {
        fontSize: 14, // text-sm
        color: '#374151', // gray-700
        marginBottom: 4,
        fontWeight: '500',
    },
    input: {
        backgroundColor: '#F9FAFB', // gray-50
        borderWidth: 1,
        borderColor: '#E5E7EB', // gray-200
        borderRadius: 8,
        padding: 12,
        fontSize: 14, // text-sm
    },
    logoPicker: {
        backgroundColor: '#F9FAFB', // gray-50
        borderWidth: 1,
        borderColor: '#E5E7EB', // gray-200
        borderRadius: 8,
        padding: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderStyle: 'dashed',
    },
    logoImage: {
        width: 100,
        height: 100,
        borderRadius: 8,
    },
    logoPlaceholderText: {
        color: '#6B7280', // gray-500
        fontSize: 14, // text-sm
    },
    buttonContainer: {
        marginTop: 32,
        marginBottom: 16,
    },
    photoModalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    photoModalContent: {
        backgroundColor: 'white',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        padding: 24,
        paddingBottom: 32,
    },
    photoModalTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 16,
        textAlign: 'center',
    },
    photoModalOption: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    photoModalOptionText: {
        fontSize: 16,
        color: '#374151',
    },
    photoModalCancel: {
        marginTop: 12,
        alignItems: 'center',
        paddingVertical: 12,
    },
    photoModalCancelText: {
        fontSize: 16,
        color: '#6B7280',
        fontWeight: '600',
    },
});
