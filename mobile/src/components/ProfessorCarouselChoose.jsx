import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image, ScrollView, Dimensions, StyleSheet } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { teacherService } from "../services/teacherService";

// Using a placeholder for images to avoid crashes if assets missing
const PlaceholderBtn = ({ text }) => (
    <View style={styles.placeholderBtn}>
        <Text>{text}</Text>
    </View>
);

const subjectMap = {
    PORTUGUESE: "Português",
    MATHEMATICS: "Matemática",
    GEOGRAPHY: "Geografia",
    HISTORY: "História",
    SCIENCE: "Ciências",
    CHEMISTRY: "Química",
    PHYSICS: "Física",
};

const ProfessorCarouselChoose = () => {
    const navigation = useNavigation();
    const [currentPage, setCurrentPage] = useState(0);
    const [professors, setProfessors] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfessors = async () => {
            try {
                setLoading(true);
                const response = await teacherService.listPublic(currentPage, 3);
                const data = response.content || response;
                setProfessors(Array.isArray(data) ? data : []);
                setTotalPages(response.totalPages || 1);
            } catch (err) {
                console.error("Erro ao carregar professores:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfessors();
    }, [currentPage]);

    const handlePrev = () => {
        if (currentPage > 0) setCurrentPage((prev) => prev - 1);
    };

    const handleNext = () => {
        if (currentPage + 1 < totalPages) setCurrentPage((prev) => prev + 1);
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Carregando professores...</Text>
            </View>
        );
    }

    if (professors.length === 0) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Nenhum professor disponível no momento.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.cardContainer}>
                <Text style={styles.title}>
                    Escolha um professor
                </Text>

                {/* Navigation Buttons */}
                <View style={styles.navButtonsContainer}>
                    <TouchableOpacity
                        onPress={handlePrev}
                        disabled={currentPage === 0}
                        style={currentPage === 0 ? styles.opacity40 : null}
                    >
                        <PlaceholderBtn text="<" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={handleNext}
                        disabled={currentPage + 1 >= totalPages}
                        style={currentPage + 1 >= totalPages ? styles.opacity40 : null}
                    >
                        <PlaceholderBtn text=">" />
                    </TouchableOpacity>
                </View>

                {/* Cards Container - Horizontal ScrollView or Flex Wrap */}
                <View style={styles.professorsContainer}>
                    {professors.map((prof) => (
                        <View
                            key={prof.id}
                            style={styles.profCard}
                        >
                            {prof.profileImage ? (
                                <Image
                                    source={{ uri: `data:${prof.profileImageContentType};base64,${prof.profileImage}` }}
                                    style={styles.profImage}
                                    resizeMode="cover"
                                />
                            ) : (
                                <View style={styles.profImagePlaceholder}>
                                    <Text style={styles.noPhotoText}>Sem foto</Text>
                                </View>
                            )}

                            <View style={styles.profInfo}>
                                <Text style={styles.profName}>{prof.name}</Text>
                                <View style={styles.statusContainer}>
                                    <View style={styles.statusDot} />
                                    <Text style={styles.statusText}>São Paulo (online)</Text>
                                </View>
                                <Text style={styles.subjectsText}>
                                    {prof.subjects?.map((s) => subjectMap[s]).filter(Boolean).join(", ") || "Matéria não informada"}
                                </Text>
                                <Text style={styles.resumeText} numberOfLines={3}>
                                    {prof.resumeTeacher || "Professor ainda não adicionou um resumo."}
                                </Text>
                            </View>

                            <View style={styles.actionContainer}>
                                <TouchableOpacity
                                    onPress={async () => {
                                        navigation.navigate("StudentSchedule", { selectedProfessorId: prof.id });
                                    }}
                                    style={styles.scheduleButton}
                                >
                                    <Text style={styles.scheduleButtonText}>📅 Agendar aula →</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                </View>

                {/* Pagination Indicators */}
                <View style={styles.paginationContainer}>
                    {Array.from({ length: totalPages }).map((_, idx) => (
                        <TouchableOpacity
                            key={idx}
                            onPress={() => setCurrentPage(idx)}
                            style={[
                                styles.paginationDot,
                                currentPage === idx ? styles.activeDot : styles.inactiveDot
                            ]}
                        />
                    ))}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: 24,
        paddingHorizontal: 16,
        backgroundColor: '#F9FAFB', // gray-50
        flexDirection: 'column',
        alignItems: 'center',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
        backgroundColor: '#F9FAFB', // gray-50
    },
    loadingText: {
        color: '#6B7280', // gray-500
    },
    cardContainer: {
        width: '100%',
        maxWidth: 896, // max-w-4xl
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#3970B7',
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 1,
        elevation: 1,
    },
    title: {
        fontSize: 20, // text-xl
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 24,
        color: '#3970B7',
    },
    navButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 32, // gap-8
        marginBottom: 24,
    },
    opacity40: {
        opacity: 0.4,
    },
    placeholderBtn: {
        width: 40,
        height: 40,
        backgroundColor: '#D1D5DB', // gray-300
        borderRadius: 9999,
        alignItems: 'center',
        justifyContent: 'center',
    },
    professorsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 24, // gap-6
    },
    profCard: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#E5E7EB', // gray-200
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 1,
        elevation: 1,
        width: 256, // w-64
        overflow: 'hidden',
        marginBottom: 16,
    },
    profImage: {
        width: '100%',
        height: 160, // h-40
    },
    profImagePlaceholder: {
        width: '100%',
        height: 160, // h-40
        backgroundColor: '#E5E7EB', // gray-200
        alignItems: 'center',
        justifyContent: 'center',
    },
    noPhotoText: {
        color: '#6B7280', // gray-500
        fontSize: 14, // text-sm
    },
    profInfo: {
        padding: 16,
        flexDirection: 'column',
        gap: 8,
    },
    profName: {
        fontSize: 18, // text-lg
        fontWeight: 'bold',
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusDot: {
        width: 8,
        height: 8,
        backgroundColor: '#22C55E', // green-500
        borderRadius: 9999,
        marginRight: 8,
    },
    statusText: {
        color: '#6B7280', // gray-500
        fontSize: 14, // text-sm
    },
    subjectsText: {
        fontWeight: '600',
        color: '#3970B7',
    },
    resumeText: {
        color: '#4B5563', // gray-600
        fontSize: 14, // text-sm
    },
    actionContainer: {
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6', // gray-100
    },
    scheduleButton: {
        width: '100%',
        paddingVertical: 8,
        backgroundColor: '#3970B7',
        borderRadius: 8,
        alignItems: 'center',
    },
    scheduleButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 24,
        gap: 4,
    },
    paginationDot: {
        width: 12,
        height: 12,
        borderRadius: 9999,
    },
    activeDot: {
        backgroundColor: '#FACC15', // yellow-400
    },
    inactiveDot: {
        backgroundColor: '#D1D5DB', // gray-300
    },
});

export default ProfessorCarouselChoose;
