import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Dimensions, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { EmailVerificationProvider, useEmailVerificationContext } from '../../context/EmailVerificationContext';
import { authService } from '../../services/authService';
import Toast from 'react-native-toast-message';
import BackgroundImage from '../../../assets/imagem-fundo.svg';

import EmailStep from '../../components/auth/EmailStep';
import CodeVerificationStep from '../../components/auth/CodeVerificationStep';
import NewPasswordStep from '../../components/auth/NewPasswordStep';

const { width, height } = Dimensions.get('window');

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

    const insets = useSafeAreaInsets();

    return (
        <View style={styles.root}>
            {/* SVG Background */}
            <View style={StyleSheet.absoluteFill}>
                <BackgroundImage width={width} height={height} preserveAspectRatio="xMidYMid slice" />
            </View>
            <View style={[StyleSheet.absoluteFill, styles.overlay]} />

            {/* Back button */}
            <TouchableOpacity
                onPress={goBack}
                style={[styles.backButton, { top: insets.top + 12 }]}
                activeOpacity={0.7}
            >
                <ArrowLeft size={22} color="#FFF" />
            </TouchableOpacity>

            <KeyboardAvoidingView
                style={styles.flex}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView
                    contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 60, paddingBottom: insets.bottom + 20 }]}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.card}>
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
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
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
    root: {
        flex: 1,
        backgroundColor: '#3970B7',
    },
    flex: {
        flex: 1,
    },
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.35)',
    },
    backButton: {
        position: 'absolute',
        left: 16,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.15)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    card: {
        width: '100%',
        maxWidth: 400,
        backgroundColor: 'rgba(57, 112, 183, 0.92)',
        borderRadius: 24,
        padding: 28,
        borderWidth: 2,
        borderColor: 'rgba(254, 203, 10, 0.5)',
        elevation: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
    },
});
