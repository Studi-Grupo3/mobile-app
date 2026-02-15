import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Mail } from "lucide-react-native";
import LoadingButton from "../ui/LoadingButton";
import { useEmailVerificationContext } from "../../context/EmailVerificationContext";

const EmailStep = ({ email, setEmail, handleSendCode }) => {
    const { loading } = useEmailVerificationContext();

    return (
        <View style={styles.container}>
            <View style={styles.iconContainer}>
                <Mail size={32} color="#3970B7" />
            </View>

            <Text style={styles.title}>Redefinir sua senha</Text>
            <Text style={styles.subtitle}>
                Insira seu endereço de e-mail e enviaremos um link para redefinir sua senha.
            </Text>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Endereço de e-mail</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Digite seu e-mail"
                    placeholderTextColor="#64748B"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
            </View>

            <LoadingButton
                isLoading={loading.sendCode}
                onPress={handleSendCode}
                style={styles.button}
                textStyle={styles.buttonText}
            >
                Enviar link de redefinição
            </LoadingButton>
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
        textAlign: 'center',
        fontSize: 14, // text-sm
        color: 'white',
        marginBottom: 24,
    },
    inputContainer: {
        width: '100%',
    },
    label: {
        textAlign: 'left',
        fontSize: 14, // text-sm
        fontWeight: '500',
        color: 'white',
        marginBottom: 4,
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
});

export default EmailStep;
