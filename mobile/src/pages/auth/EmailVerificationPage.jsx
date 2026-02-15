import React, { useState } from 'react';
import { View, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft } from 'lucide-react-native';
import { EmailVerificationProvider, useEmailVerificationContext } from '../../context/EmailVerificationContext';
import { authService } from '../../services/authService';
import Toast from 'react-native-toast-message';

import EmailStep from '../../components/auth/EmailStep';
import CodeVerificationStep from '../../components/auth/CodeVerificationStep';
import NewPasswordStep from '../../components/auth/NewPasswordStep';

const EmailVerificationPageContent = () => {
    const navigation = useNavigation();
    const { loading, setLoading } = useEmailVerificationContext();
    const [step, setStep] = useState('email');
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSendCode = async () => {
        setLoading(prev => ({ ...prev, sendCode: true }));
        try {
            await authService.forgotPassword({ email });
            Toast.show({ type: 'success', text1: 'Código Enviado!', text2: 'Verifique seu e-mail.' });
            setStep('code');
        } catch (error) {
            Toast.show({ type: 'error', text1: 'Erro', text2: error.message || "Erro ao enviar código" });
        } finally {
            setLoading(prev => ({ ...prev, sendCode: false }));
        }
    };

    const handleVerifyCode = async () => {
        setLoading(prev => ({ ...prev, verifyCode: true }));
        try {
            await authService.verifyCode({ email, code });
            Toast.show({ type: 'success', text1: 'Sucesso!', text2: 'Confirme sua nova senha.' });
            setStep('new-password');
        } catch (error) {
            Toast.show({ type: 'error', text1: 'Erro', text2: error.message || "Código inválido" });
        } finally {
            setLoading(prev => ({ ...prev, verifyCode: false }));
        }
    };

    const handleResetPassword = async () => {
        if (newPassword !== confirmPassword) {
            Toast.show({ type: 'error', text1: 'Erro', text2: 'As senhas não coincidem' });
            return;
        }
        setLoading(prev => ({ ...prev, resetPassword: true }));
        try {
            await authService.resetPassword({ email, code, newPassword });
            Toast.show({ type: 'success', text1: 'Senha Redefinida!', text2: 'Faça login novamente.' });
            setTimeout(() => {
                navigation.navigate('Login');
            }, 2000);
        } catch (error) {
            Toast.show({ type: 'error', text1: 'Erro', text2: error.message || "Erro ao redefinir senha" });
        } finally {
            setLoading(prev => ({ ...prev, resetPassword: false }));
        }
    };

    const goBack = () => {
        if (step === 'email') navigation.navigate('Login');
        else if (step === 'new-password') setStep('code');
        else setStep('email');
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.container}>
                <View style={[StyleSheet.absoluteFill, styles.background]} />

                <View style={styles.card}>
                    <TouchableOpacity
                        onPress={goBack}
                        style={styles.backButton}
                    >
                        <ArrowLeft size={24} color="white" />
                    </TouchableOpacity>

                    {step === 'email' && (
                        <EmailStep
                            email={email}
                            setEmail={setEmail}
                            handleSendCode={handleSendCode}
                            loading={loading.sendCode}
                        />
                    )}
                    {step === 'code' && (
                        <CodeVerificationStep
                            email={email}
                            code={code}
                            setCode={setCode}
                            handleVerifyCode={handleVerifyCode}
                            handleSendCode={handleSendCode}
                            loading={loading.verifyCode}
                            resendLoading={loading.sendCode}
                        />
                    )}
                    {step === 'new-password' && (
                        <NewPasswordStep
                            newPassword={newPassword}
                            confirmPassword={confirmPassword}
                            setNewPassword={setNewPassword}
                            setConfirmPassword={setConfirmPassword}
                            handleResetPassword={handleResetPassword}
                            loading={loading.resetPassword}
                        />
                    )}
                </View>
            </View>
        </ScrollView>
    );
};

export default function EmailVerificationPage() {
    return (
        <EmailVerificationProvider>
            <EmailVerificationPageContent />
        </EmailVerificationProvider>
    );
}

const styles = StyleSheet.create({
    scrollContent: {
        flexGrow: 1,
    },
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 4,
    },
    background: {
        backgroundColor: '#F3F4F6',
        zIndex: -10,
    },
    card: {
        width: '100%',
        maxWidth: 384, // max-w-sm
        backgroundColor: '#3970B7',
        padding: 24,
        paddingTop: 48,
        borderRadius: 24,
        borderWidth: 4,
        borderColor: '#FECB0A',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        position: 'relative',
        minHeight: 400,
    },
    backButton: {
        position: 'absolute',
        top: 16,
        left: 16,
        padding: 8,
        zIndex: 10,
    },
});
