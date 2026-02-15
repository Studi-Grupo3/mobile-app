import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Mail } from "lucide-react-native";
import LoadingButton from "../ui/LoadingButton";
import { useEmailVerificationContext } from "../../context/EmailVerificationContext";

const CodeVerificationStep = ({ email, code, setCode, handleVerifyCode, handleSendCode, setStep }) => {
    const { loading } = useEmailVerificationContext();

    const handleChangeEmail = () => {
        setStep('email');
    };

    return (
        <View style={styles.container}>
            <View style={styles.iconContainer}>
                <Mail size={32} color="#3970B7" />
            </View>

            <Text style={styles.title}>Verifique seu e-mail</Text>

            <Text style={styles.subtitle}>
                Enviamos um código de verificação para <Text style={styles.boldText}>{email}</Text>
            </Text>

            <View style={styles.inputContainer}>
                <TextInput
                    maxLength={6}
                    style={styles.input}
                    placeholder="Digite o código de 6 dígitos"
                    placeholderTextColor="#64748B"
                    value={code}
                    onChangeText={setCode}
                    keyboardType="number-pad"
                />
            </View>

            <LoadingButton
                isLoading={loading.verifyCode}
                onPress={handleVerifyCode}
                style={styles.button}
                textStyle={styles.buttonText}
            >
                Verificar e-mail
            </LoadingButton>

            <View style={styles.resendContainer}>
                <Text style={styles.infoText}>Não recebeu o código?</Text>
                <TouchableOpacity onPress={handleSendCode} disabled={loading.sendCode}>
                    <Text style={styles.linkText}>
                        {loading.sendCode ? "Reenviando..." : "Reenviar"}
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={styles.changeEmailContainer}>
                <Text style={styles.infoText}>Trocar o e-mail?</Text>
                <TouchableOpacity onPress={handleChangeEmail}>
                    <Text style={styles.linkText}>Enviar para outro e-mail</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 24,
    },
    iconContainer: {
        width: 64,
        height: 64,
        backgroundColor: '#FECB0A',
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    title: {
        fontSize: 20, // text-xl
        fontWeight: 'bold',
        textAlign: 'center',
        color: 'white',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14, // text-sm
        color: 'white',
        textAlign: 'center',
        marginBottom: 24,
    },
    boldText: {
        fontWeight: 'bold',
    },
    inputContainer: {
        width: '100%',
    },
    input: {
        borderRadius: 6,
        backgroundColor: 'white',
        color: 'black',
        height: 48,
        paddingHorizontal: 16,
        textAlign: 'center',
        fontSize: 16, // text-base
    },
    button: {
        marginTop: 24,
        width: '100%',
    },
    buttonText: {
        color: 'black',
        fontWeight: '600',
    },
    resendContainer: {
        marginTop: 24,
        width: '100%',
        alignItems: 'center',
    },
    infoText: {
        fontSize: 14, // text-sm
        color: 'white',
    },
    linkText: {
        color: '#FECB0A',
        fontWeight: 'bold',
        marginTop: 4,
    },
    changeEmailContainer: {
        marginTop: 16,
        width: '100%',
        alignItems: 'center',
    },
});

export default CodeVerificationStep;
