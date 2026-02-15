import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { GraduationCap, BookOpen, Star, Sparkles } from "lucide-react-native";
import AgendarAulaButton from "../common/AgendarAulaButton";
import SaibaMaisButton from "./SaibaMaisButton";

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

            {/* Visual illustration with icons */}
            <View style={styles.illustrationContainer}>
                <View style={styles.illustrationCircle}>
                    <GraduationCap size={48} color="#3970B7" />
                </View>
                <View style={[styles.floatingIcon, styles.floatingIcon1]}>
                    <BookOpen size={20} color="#FECB0A" />
                </View>
                <View style={[styles.floatingIcon, styles.floatingIcon2]}>
                    <Star size={18} color="#FECB0A" />
                </View>
                <View style={[styles.floatingIcon, styles.floatingIcon3]}>
                    <Sparkles size={16} color="#FFF" />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: '#3970B7',
        paddingTop: 48,
        paddingBottom: 80,
        paddingHorizontal: 24,
        alignItems: 'center',
    },
    content: {
        maxWidth: 576,
        alignItems: 'center',
        marginBottom: 32,
    },
    title: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 30,
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
    illustrationContainer: {
        width: '100%',
        height: 192,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    illustrationCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#FECB0A',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    floatingIcon: {
        position: 'absolute',
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    floatingIcon1: {
        top: 20,
        right: 40,
    },
    floatingIcon2: {
        bottom: 30,
        left: 30,
    },
    floatingIcon3: {
        top: 40,
        left: 50,
    },
});

export default Home;
