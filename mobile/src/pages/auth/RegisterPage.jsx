import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet,
    KeyboardAvoidingView, Platform, Dimensions, ScrollView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { studentService } from '../../services/studentService';
import Toast from 'react-native-toast-message';
import BackgroundImage from '../../../assets/imagem-fundo.svg';

const { width, height } = Dimensions.get('window');

export default function RegisterPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();

    const handleRegister = async () => {
        if (!formData.name || !formData.email || !formData.password) {
            Toast.show({ type: 'error', text1: 'Campos obrigatórios', text2: 'Preencha todos os campos.' });
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            Toast.show({ type: 'error', text1: 'Erro', text2: 'As senhas não coincidem.' });
            return;
        }
        if (formData.password.length < 6) {
            Toast.show({ type: 'error', text1: 'Erro', text2: 'A senha deve ter pelo menos 6 caracteres.' });
            return;
        }

        setLoading(true);
        try {
            const { name, email, password } = formData;
            const response = await studentService.create({ name, email, password });
            Toast.show({
                type: 'success',
                text1: 'Conta criada!',
                text2: `Bem-vindo, ${response.username || response.name || 'usuário'}!`,
            });
            setTimeout(() => navigation.navigate('Login'), 2000);
        } catch (err) {
            console.error(err);
            Toast.show({ type: 'error', text1: 'Erro ao cadastrar', text2: 'Tente novamente.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.root}>
            {/* SVG Background */}
            <View style={StyleSheet.absoluteFill}>
                <BackgroundImage width={width} height={height} preserveAspectRatio="xMidYMid slice" />
            </View>
            <View style={[StyleSheet.absoluteFill, styles.overlay]} />

            {/* Back button */}
            <TouchableOpacity
                onPress={() => navigation.goBack()}
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
                    {/* Card */}
                    <View style={styles.card}>
                        <Text style={styles.title}>Criar Conta</Text>
                        <Text style={styles.subtitle}>Preencha seus dados para começar</Text>

                        {/* Name */}
                        <View style={styles.fieldContainer}>
                            <Text style={styles.fieldLabel}>Nome Completo</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Digite seu nome completo"
                                placeholderTextColor="#94A3B8"
                                value={formData.name}
                                onChangeText={t => setFormData(p => ({ ...p, name: t }))}
                            />
                        </View>

                        {/* Email */}
                        <View style={styles.fieldContainer}>
                            <Text style={styles.fieldLabel}>E-mail</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="seu@email.com"
                                placeholderTextColor="#94A3B8"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                value={formData.email}
                                onChangeText={t => setFormData(p => ({ ...p, email: t }))}
                            />
                        </View>

                        {/* Password */}
                        <View style={styles.fieldContainer}>
                            <Text style={styles.fieldLabel}>Senha</Text>
                            <View style={styles.passwordInputContainer}>
                                <TextInput
                                    style={[styles.input, { paddingRight: 44 }]}
                                    placeholder="Crie uma senha"
                                    placeholderTextColor="#94A3B8"
                                    secureTextEntry={!showPassword}
                                    value={formData.password}
                                    onChangeText={t => setFormData(p => ({ ...p, password: t }))}
                                    maxLength={20}
                                />
                                <TouchableOpacity
                                    onPress={() => setShowPassword(!showPassword)}
                                    style={styles.eyeIcon}
                                >
                                    {showPassword ? <EyeOff size={20} color="#94A3B8" /> : <Eye size={20} color="#94A3B8" />}
                                </TouchableOpacity>
                            </View>
                            <Text style={styles.helperText}>Mínimo de 6 caracteres</Text>
                        </View>

                        {/* Confirm Password */}
                        <View style={styles.fieldContainer}>
                            <Text style={styles.fieldLabel}>Confirmar Senha</Text>
                            <View style={styles.passwordInputContainer}>
                                <TextInput
                                    style={[styles.input, { paddingRight: 44 }]}
                                    placeholder="Confirme sua senha"
                                    placeholderTextColor="#94A3B8"
                                    secureTextEntry={!showConfirmPassword}
                                    value={formData.confirmPassword}
                                    onChangeText={t => setFormData(p => ({ ...p, confirmPassword: t }))}
                                    maxLength={20}
                                />
                                <TouchableOpacity
                                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                    style={styles.eyeIcon}
                                >
                                    {showConfirmPassword ? <EyeOff size={20} color="#94A3B8" /> : <Eye size={20} color="#94A3B8" />}
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Register Button */}
                        <TouchableOpacity
                            onPress={handleRegister}
                            disabled={loading}
                            style={[styles.button, loading && styles.buttonDisabled]}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.buttonText}>
                                {loading ? 'Cadastrando...' : 'Cadastrar'}
                            </Text>
                        </TouchableOpacity>

                        {/* Login Link */}
                        <View style={styles.footer}>
                            <Text style={styles.footerText}>Já tem uma conta? </Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                                <Text style={styles.footerLink}>Entrar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        minHeight: '100%',
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
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.7)',
        textAlign: 'center',
        marginBottom: 20,
        marginTop: 4,
    },
    fieldContainer: {
        marginBottom: 14,
    },
    fieldLabel: {
        color: '#FFFFFF',
        fontSize: 13,
        fontWeight: '600',
        marginBottom: 6,
    },
    input: {
        backgroundColor: 'rgba(255,255,255,0.95)',
        borderRadius: 12,
        height: 48,
        paddingHorizontal: 16,
        fontSize: 15,
        color: '#1E293B',
    },
    passwordInputContainer: {
        position: 'relative',
        justifyContent: 'center',
    },
    eyeIcon: {
        position: 'absolute',
        right: 14,
    },
    helperText: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 11,
        marginTop: 4,
    },
    button: {
        height: 50,
        borderRadius: 14,
        backgroundColor: '#FECB0A',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 8,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    buttonText: {
        color: '#1E293B',
        fontSize: 16,
        fontWeight: '700',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 16,
    },
    footerText: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 14,
    },
    footerLink: {
        color: '#FECB0A',
        fontSize: 14,
        fontWeight: '700',
        textDecorationLine: 'underline',
    },
});
