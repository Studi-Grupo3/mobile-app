import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AgendarAulaButton from "../components/AgendarAulaButton";
import SaibaMaisButton from "../components/SaibaMaisButton";

const Home = () => {
    const navigation = useNavigation();

    const handleSaibaMais = () => {
        navigation.navigate("Register");
    };

    const handleAgendar = () => {
        navigation.navigate("Login");
    };

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>
                    O seu caminho para o sucesso começa aqui!
                </Text>

                <Text style={styles.description}>
                    Na Studi, sabemos que cada aluno tem o seu próprio ritmo de aprendizado e desafios únicos.
                </Text>

                <View style={styles.buttonContainer}>
                    <SaibaMaisButton onPress={handleSaibaMais} />
                    <AgendarAulaButton onPress={handleAgendar} />
                </View>
            </View>

            {/* Image placeholder */}
            <View style={styles.imagePlaceholder}>
                <Text style={styles.imageText}>Imagem Home Placeholder</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: '#3970B7', // Primary blue
        paddingTop: 48,
        paddingBottom: 80,
        paddingHorizontal: 24,
        alignItems: 'center',
    },
    content: {
        maxWidth: 576, // max-w-xl
        alignItems: 'center',
        marginBottom: 32,
    },
    title: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 30, // text-3xl approx
        marginBottom: 16,
        textAlign: 'center',
    },
    description: {
        color: '#FFFFFF',
        fontSize: 16,
        marginBottom: 32,
        textAlign: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 16,
        justifyContent: 'center',
    },
    imagePlaceholder: {
        width: '100%',
        height: 192, // h-48
        backgroundColor: 'rgba(96, 165, 250, 0.3)', // blue-400/30
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageText: {
        color: 'rgba(255, 255, 255, 0.5)',
    },
});

export default Home;
