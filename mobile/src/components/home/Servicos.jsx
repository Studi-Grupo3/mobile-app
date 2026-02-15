import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

const Servicos = () => {
    const navigation = useNavigation();

    const handleAgendar = () => {
        navigation.navigate("Login");
    };

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.sectionTitle}>Nosso Serviço</Text>
                <Text style={styles.mainTitle}>Por que Escolher Nosso Serviço?</Text>

                <View style={styles.listContainer}>
                    {[
                        "Professores qualificados – Seleção cuidadosa.",
                        "Flexibilidade de horários – Aulas nos melhores dias.",
                        "Seguro e transparente – Pagamentos protegidos.",
                        "Online ou presencial – Escolha como aprender.",
                        "Pais satisfeitos – Alunos evoluindo."
                    ].map((item, idx) => (
                        <View key={idx} style={styles.listItem}>
                            <View style={styles.bulletPoint}>
                                <Text style={styles.bulletText}>{idx + 1}</Text>
                            </View>
                            <Text style={styles.listText}>{item}</Text>
                        </View>
                    ))}
                </View>

                <TouchableOpacity
                    onPress={handleAgendar}
                    style={styles.button}
                >
                    <Text style={styles.buttonText}>📅 Agendar Aula →</Text>
                </TouchableOpacity>
            </View>

            {/* Image Placeholder */}
            <View style={styles.imagePlaceholder}>
                <Text style={styles.imagePlaceholderText}>Imagem Dicas Placeholder</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: 48, // py-12
        backgroundColor: '#F8F8F8',
        paddingHorizontal: 16,
    },
    content: {
        alignItems: 'center',
        marginBottom: 32,
    },
    sectionTitle: {
        color: '#3970B7',
        fontWeight: 'bold',
        fontSize: 18, // text-lg
        marginBottom: 8,
        borderBottomWidth: 2,
        borderBottomColor: '#FECB0A',
    },
    mainTitle: {
        fontSize: 24, // text-2xl
        fontWeight: 'bold',
        color: '#3970B7',
        textAlign: 'center',
        marginBottom: 24,
    },
    listContainer: {
        gap: 12,
    },
    listItem: {
        flexDirection: 'row',
        gap: 12,
        alignItems: 'flex-start',
    },
    bulletPoint: {
        backgroundColor: '#FECB0A',
        width: 24, // w-6
        height: 24, // h-6
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 2,
    },
    bulletText: {
        color: 'black',
        fontSize: 12,
        fontWeight: 'bold',
    },
    listText: {
        color: '#4B5563', // gray-600
        flex: 1,
    },
    button: {
        marginTop: 32,
        backgroundColor: '#3970B7',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
        alignSelf: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: '600',
    },
    imagePlaceholder: {
        width: '100%',
        height: 192, // h-48
        backgroundColor: '#E5E7EB', // gray-200
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    imagePlaceholderText: {
        color: '#6B7280', // gray-500
    },
});

export default Servicos;
