import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { ArrowRight } from 'lucide-react-native';
import { studentService } from '../../services/studentService';
import { authService } from '../../services/authService';

const CardPanelItem = ({ title, description, buttonLink, colorStyles, route }) => {
    const navigation = useNavigation();
    return (
        <TouchableOpacity
            onPress={() => {
                if (route === 'CompleteStudentRegistration') {
                    navigation.navigate('Profile', { screen: 'CompleteStudentRegistration' });
                } else {
                    navigation.navigate(route);
                }
            }}
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

export default function StudentInitialPage() {
    const insets = useSafeAreaInsets();
    const [isCadastroCompleto, setIsCadastroCompleto] = useState(false);

    useFocusEffect(
        useCallback(() => {
            (async () => {
                try {
                    const studentId = await authService.getUserId();
                    if (!studentId) return;
                    const data = await studentService.getById(studentId);
                    const fields = [
                        data.name,
                        data.email,
                        data.dateBirth,
                        data.schoolGrade,
                        data.cellphoneNumber,
                        data.schoolName,
                        data.cep,
                        data.rua,
                        data.cidade,
                        data.estado,
                        data.responsible?.responsibleName,
                        data.responsible?.kinship,
                        data.responsible?.responsibleCpf,
                        data.responsible?.responsibleCellphoneNumber,
                    ];
                    const filled = fields.filter(Boolean).length;
                    setIsCadastroCompleto(filled === fields.length);
                } catch {
                    setIsCadastroCompleto(false);
                }
            })();
        }, [])
    );

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
            route: "CompleteStudentRegistration",
        },
        {
            title: "Agendamentos",
            description: "Visualize e gerencie suas aulas agendadas.",
            buttonLink: "Ver agendamentos →",
            colorStyles: { bg: "#EFF6FF", textTitle: "#1E40AF", buttonText: "#2563EB", arrowColor: "#2563EB" }, // blue-50, blue-800, blue-600
            route: "Appointments",
        },
        {
            title: "Agendar Aula",
            description: "Agende uma nova aula com um professor.",
            buttonLink: "Agendar agora →",
            colorStyles: { bg: "#FEFCE8", textTitle: "#A16207", buttonText: "#A16207", arrowColor: "#A16207" },
            route: "AgendarTab",
        },
    ];

    return (
        <ScrollView style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Painel do Aluno</Text>
                <Text style={styles.headerSubtitle}>Gerencie suas aulas</Text>
            </View>

            <View style={styles.content}>
                <View style={styles.welcomeCard}>
                    <Text style={styles.welcomeTitle}>
                        Bem-vindo(a) ao Painel do Aluno
                    </Text>
                    <Text style={styles.welcomeText}>
                        Aqui você pode gerenciar suas aulas, verificar agendamentos e realizar pagamentos.
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
        backgroundColor: '#F1F5F9',
    },
    header: {
        backgroundColor: '#3970B7',
        paddingHorizontal: 20,
        paddingVertical: 20,
        paddingBottom: 24,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    headerSubtitle: {
        fontSize: 13,
        color: '#FECB0A',
        marginTop: 2,
        fontWeight: '500',
    },
    content: {
        padding: 16,
    },
    welcomeCard: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        elevation: 3,
        shadowColor: '#3970B7',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        borderLeftWidth: 4,
        borderLeftColor: '#FECB0A',
    },
    welcomeTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1E293B',
        marginBottom: 6,
    },
    welcomeText: {
        fontSize: 13,
        color: '#64748B',
        lineHeight: 19,
    },
    cardItem: {
        width: '100%',
        borderRadius: 14,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
        padding: 20,
        marginBottom: 14,
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
