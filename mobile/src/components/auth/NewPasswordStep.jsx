import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Mail } from "lucide-react-native";
import LoadingButton from "../ui/LoadingButton";
import { useEmailVerificationContext } from "../../context/EmailVerificationContext";

const NewPasswordStep = ({ newPassword, confirmPassword, setNewPassword, setConfirmPassword, handleResetPassword }) => {
    const { loading } = useEmailVerificationContext();

    return (
        <View style={styles.container}>
            <View style={styles.iconContainer}>
                <Mail size={32} color="#3970B7" />
            </View>

            <Text style={styles.title}>Redefinir Senha</Text>

            <View style={styles.inputContainer}>
                <View>
                    <TextInput
                        secureTextEntry
                        style={styles.input}
                        placeholder="Nova senha"
                        placeholderTextColor="#64748B"
                        value={newPassword}
                        onChangeText={setNewPassword}
                    />
                </View>

                <View>
                    <TextInput
                        secureTextEntry
                        style={styles.input}
                        placeholder="Confirme sua nova senha"
                        placeholderTextColor="#64748B"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                    />
                </View>
            </View>

            <LoadingButton
                isLoading={loading.resetPassword}
                onPress={handleResetPassword}
                style={styles.button}
            >
                <Text style={styles.buttonText}>Redefinir senha</Text>
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
        width: 64, // w-16
        height: 64, // h-16
        backgroundColor: '#FECB0A',
        borderRadius: 32, // rounded-full
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24, // mb-6
    },
    title: {
        fontSize: 20, // text-xl
        fontWeight: 'bold',
        textAlign: 'center',
        color: 'white',
        marginBottom: 24, // mb-6
    },
    inputContainer: {
        width: '100%',
        gap: 16, // gap-4
    },
    input: {
        backgroundColor: 'white',
        borderRadius: 6, // rounded-md
        color: 'black',
        height: 48, // h-12
        paddingHorizontal: 16, // px-4
        textAlign: 'center',
        fontSize: 16, // text-base
    },
    button: {
        marginTop: 24, // mt-6
        width: '100%',
    },
    buttonText: {
        color: 'black',
        fontWeight: '600', // font-semibold
    },
});

export default NewPasswordStep;
