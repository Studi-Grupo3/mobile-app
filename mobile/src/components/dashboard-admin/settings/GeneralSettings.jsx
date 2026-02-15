import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert, StyleSheet } from 'react-native';
import { SaveButton } from './SaveButton';
import * as ImagePicker from 'expo-image-picker';

export function GeneralSettings() {
    const [form, setForm] = useState({
        companyName: '',
        cnpj: '',
        email: '',
        phone: '',
        address: '',
        logo: null
    });

    const handleChange = (name, value) => {
        setForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePickLogo = async () => {
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

    const salvar = () => {
        console.log('Dados da empresa:', form);
        Alert.alert("Sucesso", "Informações salvas com sucesso (Simulação)");
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
                </View>
            </View>

            <View style={styles.buttonContainer}>
                <SaveButton onClick={salvar} label="Salvar Alterações" />
            </View>
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
});
