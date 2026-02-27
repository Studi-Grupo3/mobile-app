import React, { useState, useContext } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet,
    KeyboardAvoidingView, Platform, Dimensions, ScrollView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Eye, EyeOff } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { authService } from '../../services/authService';
import { AuthContext } from '../../context/authContext';
import Toast from 'react-native-toast-message';
import BackgroundImage from '../../../assets/imagem-fundo.svg';

const { width, height } = Dimensions.get('window');

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();
    const { login } = useContext(AuthContext);
    const insets = useSafeAreaInsets();

    const handleLogin = async () => {
        if (!credentials.email || !credentials.password) {
            Toast.show({
                type: 'error',
                text1: 'Campos obrigatórios',
                text2: 'Preencha email e senha.',
            });
            return;
        }
        setLoading(true);
        try {
            const response = await authService.login(credentials);
            Toast.show({
                type: 'success',
                text1: 'Login realizado!',
                text2: `Bem-vindo, ${response.username || response.email || 'usuário'}!`,
            });
            await login({
                token: response.token,
                userId: response.id || response.userId,
                role: response.role,
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

    const quickLogin = (email) => {
        setCredentials({ email, password: '123456' });
    };

    return (
        <View style={styles.root}>
            {/* SVG Background */}
            <View style={StyleSheet.absoluteFill}>
                <BackgroundImage width={width} height={height} preserveAspectRatio="xMidYMid slice" />
            </View>

            {/* Dark overlay for readability */}
            <View style={[StyleSheet.absoluteFill, styles.overlay]} />

            <KeyboardAvoidingView
                style={styles.flex}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView
                    contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 }]}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    {/* Card */}
                    <View style={styles.card}>
                        <Text style={styles.title}>Entrar</Text>
                        <Text style={styles.subtitle}>Acesse sua conta</Text>

                        {/* Email */}
                        <View style={styles.fieldContainer}>
                            <Text style={styles.fieldLabel}>E-mail</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="seu@email.com"
                                placeholderTextColor="#94A3B8"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                value={credentials.email}
                                onChangeText={(t) => setCredentials(p => ({ ...p, email: t }))}
                            />
                        </View>

                        {/* Password */}
                        <View style={styles.fieldContainer}>
                            <View style={styles.passwordHeader}>
                                <Text style={styles.fieldLabel}>Senha</Text>
                                <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                                    <Text style={styles.forgotPassword}>Esqueceu a Senha?</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.passwordInputContainer}>
                                <TextInput
                                    style={[styles.input, { paddingRight: 44 }]}
                                    placeholder="Digite sua senha"
                                    placeholderTextColor="#94A3B8"
                                    secureTextEntry={!showPassword}
                                    value={credentials.password}
                                    onChangeText={(t) => setCredentials(p => ({ ...p, password: t }))}
                                />
                                <TouchableOpacity
                                    onPress={() => setShowPassword(!showPassword)}
                                    style={styles.eyeIcon}
                                >
                                    {showPassword ? <EyeOff size={20} color="#94A3B8" /> : <Eye size={20} color="#94A3B8" />}
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Login Button */}
                        <TouchableOpacity
                            onPress={handleLogin}
                            disabled={loading}
                            style={[styles.loginButton, loading && styles.loginButtonDisabled]}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.loginButtonText}>
                                {loading ? 'Entrando...' : 'Entrar'}
                            </Text>
                        </TouchableOpacity>

                        {/* Register Link */}
                        <View style={styles.footer}>
                            <Text style={styles.footerText}>Não possui conta? </Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                                <Text style={styles.footerLink}>Cadastre-se</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Quick mock access */}
                        <View style={styles.mockSection}>
                            <Text style={styles.mockTitle}>Acesso rápido (teste)</Text>
                            <View style={styles.mockRow}>
                                <TouchableOpacity style={styles.mockBtn} onPress={() => quickLogin('aluno@studi.com')}>
                                    <Text style={styles.mockBtnText}>Aluno</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.mockBtn} onPress={() => quickLogin('professor@studi.com')}>
                                    <Text style={styles.mockBtnText}>Professor</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.mockBtn} onPress={() => quickLogin('admin@studi.com')}>
                                    <Text style={styles.mockBtnText}>Admin</Text>
                                </TouchableOpacity>
                            </View>
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
        backgroundColor: '#3970B7',
    },
    flex: {
        flex: 1,
    },
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.35)',
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
        // Shadow
        elevation: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.7)',
        textAlign: 'center',
        marginBottom: 24,
        marginTop: 4,
    },
    fieldContainer: {
        marginBottom: 16,
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
    passwordHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
    },
    forgotPassword: {
        color: '#FECB0A',
        fontSize: 12,
        fontWeight: '600',
    },
    passwordInputContainer: {
        position: 'relative',
        justifyContent: 'center',
    },
    eyeIcon: {
        position: 'absolute',
        right: 14,
    },
    loginButton: {
        height: 50,
        borderRadius: 14,
        backgroundColor: '#FECB0A',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 8,
    },
    loginButtonDisabled: {
        opacity: 0.6,
    },
    loginButtonText: {
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
    mockSection: {
        marginTop: 20,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.15)',
        alignItems: 'center',
    },
    mockTitle: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 11,
        fontWeight: '600',
        marginBottom: 10,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    mockRow: {
        flexDirection: 'row',
        gap: 8,
    },
    mockBtn: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.12)',
        borderRadius: 10,
        paddingVertical: 10,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    mockBtnText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: '600',
    },
});
