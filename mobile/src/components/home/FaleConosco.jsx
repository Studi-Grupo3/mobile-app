import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import { contactService } from "../../services/contactService";
import { showAlert } from "../common/ShowAlert";

export function FaleConosco() {
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [celular, setCelular] = useState("");
    const [mensagem, setMensagem] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!nome || !email || !mensagem) {
            showAlert({ title: "Erro", text: "Preencha os campos obrigatórios", icon: "error" });
            return;
        }

        setLoading(true);
        try {
            await contactService.send({ nome, email, mensagem, celular });
            showAlert({ title: "Sucesso", text: "Mensagem enviada!", icon: "success" });
            setNome(""); setEmail(""); setCelular(""); setMensagem("");
        } catch (err) {
            showAlert({ title: "Erro", text: "Falha ao enviar mensagem", icon: "error" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Fale Conosco</Text>
            <Text style={styles.subtitle}>Tem dúvidas? Entre em contato!</Text>

            <View style={styles.formCard}>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Nome</Text>
                    <TextInput
                        value={nome}
                        onChangeText={setNome}
                        style={styles.input}
                        placeholder="Seu nome"
                        placeholderTextColor="#9ca3af"
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Email</Text>
                    <TextInput
                        value={email}
                        onChangeText={setEmail}
                        style={styles.input}
                        placeholder="seu@email.com"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        placeholderTextColor="#9ca3af"
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Celular</Text>
                    <TextInput
                        value={celular}
                        onChangeText={setCelular}
                        style={styles.input}
                        placeholder="(00) 00000-0000"
                        keyboardType="phone-pad"
                        placeholderTextColor="#9ca3af"
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Mensagem</Text>
                    <TextInput
                        value={mensagem}
                        onChangeText={setMensagem}
                        style={[styles.input, styles.textArea]}
                        placeholder="Sua mensagem"
                        multiline
                        textAlignVertical="top"
                        placeholderTextColor="#9ca3af"
                    />
                </View>

                <TouchableOpacity
                    onPress={handleSubmit}
                    disabled={loading}
                    style={[styles.button, loading && styles.buttonDisabled]}
                >
                    {loading ? <ActivityIndicator color="black" /> : <Text style={styles.buttonText}>Enviar</Text>}
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F8F8F8',
        padding: 24,
        paddingBottom: 80,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#3970B7',
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        color: '#4B5563', // gray-600
        textAlign: 'center',
        marginBottom: 32,
        fontSize: 16,
    },
    formCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        padding: 16,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        gap: 16,
    },
    inputGroup: {
        gap: 4,
    },
    label: {
        color: '#374151', // gray-700
        marginBottom: 4,
    },
    input: {
        borderWidth: 1,
        borderColor: '#D1D5DB', // gray-300
        borderRadius: 8,
        padding: 12,
        backgroundColor: '#FFFFFF',
        fontSize: 16,
        color: '#000000',
    },
    textArea: {
        height: 112, // h-28
    },
    button: {
        backgroundColor: '#FACC15', // yellow-400
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonDisabled: {
        opacity: 0.5,
    },
    buttonText: {
        fontWeight: 'bold',
        color: '#000000',
        fontSize: 16,
    },
});

export default FaleConosco;
