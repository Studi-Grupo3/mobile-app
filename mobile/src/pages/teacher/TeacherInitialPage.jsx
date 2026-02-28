import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowRight } from 'lucide-react-native';

const CardPanelItem = ({ title, description, buttonLink, colorStyles, route }) => {
    const navigation = useNavigation();
    return (
        <TouchableOpacity
            onPress={() => navigation.navigate(route)}
            style={[styles.cardItem, { backgroundColor: colorStyles.bg }]}
        >
            <View>
                <Text style={[styles.cardTitle, { color: colorStyles.textTitle }]}>
                    {title}
                </Text>
                <Text style={styles.cardDescription}>{description}</Text>
            </View>
            <View style={styles.cardFooter}>
                <Text style={[styles.cardButtonText, { color: colorStyles.buttonText }]}>
                    {buttonLink.replace('→', '')}
                </Text>
                <ArrowRight size={16} color={colorStyles.arrowColor} />
            </View>
        </TouchableOpacity>
    );
};

export default function TeacherInitialPage() {
    const insets = useSafeAreaInsets();
    const [isCadastroCompleto, setIsCadastroCompleto] = useState(false);

    useEffect(() => {
        setTimeout(() => setIsCadastroCompleto(true), 500);
    }, []);

    const items = [
        {
            title: "Completar Cadastro",
            description: isCadastroCompleto
                ? "Seu cadastro está completo."
                : "Seu cadastro ainda está incompleto, finalize-o.",
            buttonLink: isCadastroCompleto
                ? "Verificar Cadastro →"
                : "Completar cadastro →",
            colorStyles: isCadastroCompleto
                ? { bg: "#F0FDF4", textTitle: "#16A34A", buttonText: "#16A34A", arrowColor: "#16A34A" } // green-50, green-600
                : { bg: "#FFF7ED", textTitle: "#F97316", buttonText: "#EA580C", arrowColor: "#EA580C" }, // orange-50, orange-500/600
            route: "CompleteTeacherRegistration",
        },
        {
            title: "Aulas",
            description: "Visualize e gerencie suas aulas agendadas.",
            buttonLink: "Ver aulas →",
            colorStyles: { bg: "#EFF6FF", textTitle: "#1E40AF", buttonText: "#2563EB", arrowColor: "#2563EB" }, // blue-50, blue-800, blue-600
            route: "Classes",
        },
        {
            title: "Histórico",
            description: "Visualize o histórico de aulas.",
            buttonLink: "Ver histórico →",
            colorStyles: { bg: "#FEFCE8", textTitle: "#A16207", buttonText: "#A16207", arrowColor: "#A16207" }, // yellow-50, yellow-700
            route: "Classes",
        },
    ];

    return (
        <ScrollView style={styles.container}>
            <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
                <Text style={styles.headerTitle}>Painel do Professor</Text>
            </View>

            <View style={styles.content}>
                <View style={styles.welcomeCard}>
                    <Text style={styles.welcomeTitle}>
                        Bem-vindo(a) ao Painel do Professor
                    </Text>
                    <Text style={styles.welcomeText}>
                        Aqui você pode completar seu cadastro, gerenciar suas aulas e consultar o histórico.
                    </Text>
                </View>

                {items.map((item, index) => (
                    <CardPanelItem
                        key={index}
                        {...item}
                    />
                ))}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB', // gray-50
    },
    header: {
        backgroundColor: '#3970B7',
        padding: 16,
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    content: {
        padding: 16,
    },
    welcomeCard: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 20,
        marginBottom: 24,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 1,
    },
    welcomeTitle: {
        fontSize: 20, // text-xl
        fontWeight: 'bold',
        color: 'black',
        marginBottom: 8,
    },
    welcomeText: {
        fontSize: 14, // text-sm
        color: '#4B5563', // gray-600
    },
    cardItem: {
        width: '100%',
        borderRadius: 8,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 1,
        padding: 20,
        marginBottom: 16,
    },
    cardTitle: {
        fontSize: 20, // text-xl
        fontWeight: '600',
        marginBottom: 8,
    },
    cardDescription: {
        fontSize: 16, // text-base
        color: 'black',
        marginBottom: 16,
    },
    cardFooter: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cardButtonText: {
        fontWeight: 'bold',
        marginRight: 8,
    },
});
