import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Eye, EyeOff } from 'lucide-react-native';
import { authService } from '../../services/authService';
import Toast from 'react-native-toast-message';

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();

    const handleLogin = async () => {
        setLoading(true);
        try {
            const response = await authService.login(credentials);
            Toast.show({
                type: 'success',
                text1: 'Login realizado!',
                text2: `Bem-vindo, ${response.username || response.email || 'usuário'}!`,
            });
        } catch (err) {
            console.error("Erro login:", err);
            Toast.show({
                type: 'error',
                text1: 'Erro ao entrar',
                text2: 'Verifique suas credenciais.',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.container}>
                {/* Background color/image */}
                <View style={[StyleSheet.absoluteFill, styles.background]} />

                <View style={styles.card}>
                    <Text style={styles.title}>Entrar</Text>

                    <View style={styles.form}>
                        {/* Email Field */}
                        <View style={styles.fieldContainer}>
                            <Text style={styles.fieldLabel}>E-mail</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="seu@email.com"
                                placeholderTextColor="#64748B"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                value={credentials.email}
                                onChangeText={(t) => setCredentials(p => ({ ...p, email: t }))}
                            />
                        </View>

                        {/* Password Field */}
                        <View style={styles.fieldContainer}>
                            <View style={styles.passwordHeader}>
                                <Text style={styles.fieldLabel}>Senha</Text>
                                <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                                    <Text style={styles.forgotPassword}>Esqueceu a senha?</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.passwordInputContainer}>
                                <TextInput
                                    style={[styles.input, styles.passwordInput]}
                                    placeholder="Digite sua senha"
                                    placeholderTextColor="#64748B"
                                    secureTextEntry={!showPassword}
                                    value={credentials.password}
                                    onChangeText={(t) => setCredentials(p => ({ ...p, password: t }))}
                                />
                                <TouchableOpacity
                                    onPress={() => setShowPassword(!showPassword)}
                                    style={styles.eyeIcon}
                                >
                                    {showPassword ? (
                                        <EyeOff size={20} color="#6B7280" />
                                    ) : (
                                        <Eye size={20} color="#6B7280" />
                                    )}
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Login Button */}
                        <TouchableOpacity
                            onPress={handleLogin}
                            disabled={loading}
                            style={[styles.loginButton, loading && styles.loginButtonDisabled]}
                        >
                            <Text style={styles.loginButtonText}>
                                {loading ? 'Entrando...' : 'Entrar'}
                            </Text>
                        </TouchableOpacity>

                        {/* Register Link */}
                        <View style={styles.footer}>
                            <Text style={styles.footerText}>Não possui uma conta? </Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                                <Text style={styles.footerLink}>Cadastre-se</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </ScrollView>
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
        padding: 16,
    },
    background: {
        backgroundColor: '#F3F4F6', // gray-100 equivalent
        zIndex: -10,
    },
    card: {
        width: '100%',
        maxWidth: 384, // max-w-sm
        backgroundColor: '#3970B7', // Primary blue
        padding: 24,
        borderRadius: 24,
        borderWidth: 4,
        borderColor: '#FECB0A', // Secondary yellow
        elevation: 10, // shadow-xl
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
    },
    title: {
        fontSize: 24, // text-2xl
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 24,
    },
    form: {
        gap: 16, // gap-4 equivalent (RN 0.71+)
    },
    fieldContainer: {
        marginBottom: 4,
    },
    fieldLabel: {
        color: '#FFFFFF',
        fontSize: 12, // text-xs
        fontWeight: 'bold',
        marginBottom: 4,
    },
    input: {
        backgroundColor: '#FFFFFF',
        borderRadius: 6,
        height: 40, // h-10
        paddingHorizontal: 12,
        fontSize: 14, // text-sm
        color: '#000000',
    },
    passwordHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    forgotPassword: {
        color: '#FECB0A',
        fontSize: 12, // text-xs
        fontWeight: 'bold',
    },
    passwordInputContainer: {
        position: 'relative',
        justifyContent: 'center',
    },
    passwordInput: {
        paddingRight: 40,
    },
    eyeIcon: {
        position: 'absolute',
        right: 12,
    },
    loginButton: {
        height: 40,
        borderRadius: 8,
        backgroundColor: '#FECB0A',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 8,
    },
    loginButtonDisabled: {
        opacity: 0.7,
    },
    loginButtonText: {
        color: '#000000',
        fontWeight: '600',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 8,
    },
    footerText: {
        color: '#FFFFFF',
        fontSize: 14, // text-sm
        fontWeight: 'bold',
    },
    footerLink: {
        color: '#FECB0A',
        fontSize: 14,
        fontWeight: 'bold',
        textDecorationLine: 'underline',
    },
});
