import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Eye, EyeOff } from 'lucide-react-native';
import { studentService } from '../../services/studentService';
import Toast from 'react-native-toast-message';

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

    const handleRegister = async () => {
        if (formData.password !== formData.confirmPassword) {
            Toast.show({ type: 'error', text1: 'Erro', text2: 'As senhas não coincidem' });
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

            setTimeout(() => {
                navigation.navigate('Login');
            }, 2000);
        } catch (err) {
            console.error(err);
            Toast.show({
                type: 'error',
                text1: 'Erro ao cadastrar',
                text2: 'Tente novamente.',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.container}>
                <View style={[StyleSheet.absoluteFill, styles.background]} />

                <View style={styles.card}>
                    <Text style={styles.title}>Crie uma conta</Text>

                    <View style={styles.form}>
                        <View style={styles.fieldContainer}>
                            <Text style={styles.label}>Nome Completo</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Digite seu nome completo"
                                placeholderTextColor="#64748B"
                                value={formData.name}
                                onChangeText={t => setFormData({ ...formData, name: t })}
                            />
                        </View>

                        <View style={styles.fieldContainer}>
                            <Text style={styles.label}>E-mail</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="seu@email.com"
                                placeholderTextColor="#64748B"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                value={formData.email}
                                onChangeText={t => setFormData({ ...formData, email: t })}
                            />
                        </View>

                        <View style={styles.fieldContainer}>
                            <Text style={styles.label}>Senha</Text>
                            <View style={styles.passwordContainer}>
                                <TextInput
                                    style={[styles.input, styles.passwordInput]}
                                    placeholder="Crie uma senha"
                                    placeholderTextColor="#64748B"
                                    secureTextEntry={!showPassword}
                                    value={formData.password}
                                    onChangeText={t => setFormData({ ...formData, password: t })}
                                    maxLength={20}
                                />
                                <TouchableOpacity
                                    onPress={() => setShowPassword(!showPassword)}
                                    style={styles.eyeIcon}
                                >
                                    {showPassword ? <EyeOff size={20} color="#6B7280" /> : <Eye size={20} color="#6B7280" />}
                                </TouchableOpacity>
                            </View>
                            <Text style={styles.helperText}>A senha deve ter pelo menos 6 caracteres.</Text>
                        </View>

                        <View style={styles.fieldContainer}>
                            <Text style={styles.label}>Confirmar Senha</Text>
                            <View style={styles.passwordContainer}>
                                <TextInput
                                    style={[styles.input, styles.passwordInput]}
                                    placeholder="Confirme sua senha"
                                    placeholderTextColor="#64748B"
                                    secureTextEntry={!showConfirmPassword}
                                    value={formData.confirmPassword}
                                    onChangeText={t => setFormData({ ...formData, confirmPassword: t })}
                                    maxLength={20}
                                />
                                <TouchableOpacity
                                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                    style={styles.eyeIcon}
                                >
                                    {showConfirmPassword ? <EyeOff size={20} color="#6B7280" /> : <Eye size={20} color="#6B7280" />}
                                </TouchableOpacity>
                            </View>
                        </View>

                        <TouchableOpacity
                            onPress={handleRegister}
                            disabled={loading}
                            style={[styles.button, loading && styles.buttonDisabled]}
                        >
                            <Text style={styles.buttonText}>
                                {loading ? 'Cadastrando...' : 'Cadastrar'}
                            </Text>
                        </TouchableOpacity>

                        <View style={styles.footer}>
                            <Text style={styles.footerText}>Já tem uma conta? </Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                                <Text style={styles.footerLink}>Clique aqui</Text>
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
        backgroundColor: '#F3F4F6', // gray-100
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
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 24,
    },
    form: {
        gap: 16,
    },
    fieldContainer: {
        marginBottom: 4,
    },
    label: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    input: {
        backgroundColor: '#FFFFFF',
        borderRadius: 6,
        height: 40,
        paddingHorizontal: 12,
        fontSize: 14,
        color: '#000000',
    },
    passwordContainer: {
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
    helperText: {
        color: '#FFFFFF',
        fontSize: 10,
        marginTop: 4,
    },
    button: {
        height: 40,
        borderRadius: 8,
        backgroundColor: '#FECB0A',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 8,
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    buttonText: {
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
        fontSize: 14,
        fontWeight: 'bold',
    },
    footerLink: {
        color: '#FECB0A',
        fontSize: 14,
        fontWeight: 'bold',
        textDecorationLine: 'underline',
    },
});
