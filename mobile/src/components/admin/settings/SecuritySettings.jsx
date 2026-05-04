import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { SaveButton } from './SaveButton';
import { AlertModal } from '../../ui/AlertModal';
import { useAlert } from '../../../hooks/useAlert';
import { adminSettingsService } from '../../../services/dashboard/adminSettingsService';

export function SecuritySettings() {
    const [security, setSecurity] = useState({
        email: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(true);
    const { alertConfig, showAlert, hideAlert } = useAlert();

    useEffect(() => {
        adminSettingsService.get()
            .then(data => {
                setSecurity(prev => ({
                    ...prev,
                    email: data.email || ''
                }));
            })
            .catch(err => console.log('Erro ao carregar segurança:', err))
            .finally(() => setLoading(false));
    }, []);

    const handleChange = (field, value) =>
        setSecurity(prev => ({ ...prev, [field]: value }));

    const salvar = async () => {
        if (security.newPassword && security.newPassword !== security.confirmPassword) {
            showAlert('error', 'Erro', 'Nova senha e confirmação não conferem.');
            return;
        }
        if (!security.currentPassword) {
            showAlert('error', 'Erro', 'Informe a senha atual para salvar alterações.');
            return;
        }
        try {
            const payload = { currentPassword: security.currentPassword };
            if (security.email) payload.email = security.email;
            if (security.newPassword) {
                payload.newPassword = security.newPassword;
                payload.confirmPassword = security.confirmPassword;
            }
            await adminSettingsService.patch(payload);
            showAlert('success', 'Sucesso', 'Alterações salvas com sucesso!');
            setSecurity(prev => ({
                ...prev,
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            }));
        } catch (err) {
            console.error('Erro ao atualizar segurança:', err);
            showAlert('error', 'Erro', err.message || 'Falha ao salvar alterações.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Segurança</Text>
            <Text style={styles.subtitle}>
                Gerencie as configurações de segurança da sua conta.
            </Text>

            <View style={styles.formContainer}>
                <View>
                    <Text style={styles.label}>E-mail</Text>
                    <TextInput
                        value={security.email}
                        onChangeText={t => handleChange('email', t)}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        style={styles.input}
                    />
                </View>

                <View>
                    <Text style={styles.label}>Senha Atual</Text>
                    <TextInput
                        secureTextEntry
                        placeholder="Senha Atual"
                        value={security.currentPassword}
                        onChangeText={t => handleChange('currentPassword', t)}
                        style={styles.input}
                    />
                </View>

                <View>
                    <Text style={styles.label}>Nova Senha</Text>
                    <TextInput
                        secureTextEntry
                        placeholder="Nova Senha"
                        value={security.newPassword}
                        onChangeText={t => handleChange('newPassword', t)}
                        style={styles.input}
                    />
                </View>

                <View>
                    <Text style={styles.label}>Confirmar Nova Senha</Text>
                    <TextInput
                        secureTextEntry
                        placeholder="Confirmar Nova Senha"
                        value={security.confirmPassword}
                        onChangeText={t => handleChange('confirmPassword', t)}
                        style={styles.input}
                    />
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
        color: '#1A1A1A',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 12, // text-xs
        color: '#4B5563', // gray-600
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
    disabledInput: {
        backgroundColor: '#F3F4F6', // gray-100
        color: '#6B7280', // gray-500
    },
    buttonContainer: {
        marginTop: 32,
        marginBottom: 16,
    },
});
