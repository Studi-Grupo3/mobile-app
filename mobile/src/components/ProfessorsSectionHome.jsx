import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { teacherService } from "../services/teacherService";
import { useNavigation } from "@react-navigation/native";

const PlaceholderBtn = ({ text }) => (
    <View style={styles.placeholderBtn}>
        <Text style={styles.placeholderBtnText}>{text}</Text>
    </View>
);

const subjectTranslations = {
    PORTUGUESE: "Português",
    MATHEMATICS: "Matemática",
    GEOGRAPHY: "Geografia",
    HISTORY: "História",
    SCIENCE: "Ciências",
    CHEMISTRY: "Química",
    PHYSICS: "Física",
};

export default function ProfessorsSectionHome() {
    const [professors, setProfessors] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const navigation = useNavigation();

    const pageSize = 3;

    useEffect(() => {
        let alive = true;
        (async () => {
            try {
                const resp = await teacherService.listPublic(page, pageSize);
                if (!alive) return;
                const data = Array.isArray(resp) ? resp : resp.content || [];
                setProfessors(data);
                setTotalPages(resp.totalPages ?? 1);
            } catch (e) {
                setProfessors([]);
                setTotalPages(1);
            }
        })();
        return () => { alive = false; };
    }, [page]);

    const prev = () => setPage((p) => (p > 0 ? p - 1 : 0));
    const next = () => setPage((p) => (p + 1 < totalPages ? p + 1 : p));

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.subTitle}>Encontre seu professor ideal</Text>
                <Text style={styles.mainTitle}>Conheça Nossos Professores</Text>
                <Text style={styles.description}>
                    Profissionais qualificados, apaixonados pelo ensino e prontos para ajudar você.
                </Text>
            </View>

            <View style={styles.content}>
                <View style={styles.carouselContainer}>
                    <TouchableOpacity onPress={prev} style={styles.navButton}>
                        <PlaceholderBtn text="<" />
                    </TouchableOpacity>

                    <View style={styles.cardsWrapper}>
                        <View style={styles.cardsContainer}>
                            {professors.length > 0 ? (
                                professors.map((prof) => (
                                    <View
                                        key={prof.id}
                                        style={styles.card}
                                    >
                                        {prof.profileImage ? (
                                            <Image
                                                source={{ uri: `data:${prof.profileImageContentType};base64,${prof.profileImage}` }}
                                                style={styles.cardImage}
                                                resizeMode="cover"
                                            />
                                        ) : (
                                            <View style={styles.imagePlaceholder}>
                                                <Text style={styles.placeholderText}>Sem foto</Text>
                                            </View>
                                        )}

                                        <View style={styles.cardBody}>
                                            <Text style={styles.cardName}>{prof.name}</Text>
                                            <View style={styles.statusRow}>
                                                <View style={styles.statusDot} />
                                                <Text style={styles.statusText}>São Paulo (online)</Text>
                                            </View>
                                            <Text style={styles.subjectText}>
                                                🎓 Professor(a) de {prof.subjects?.length ? subjectTranslations[prof.subjects[0]] || "Matéria não informada" : "Matéria não informada"}
                                            </Text>
                                            <Text style={styles.resumeText} numberOfLines={3}>
                                                {prof.resumeTeacher || "Professor ainda não adicionou um resumo."}
                                            </Text>

                                            <TouchableOpacity
                                                onPress={() => navigation.navigate("Register")}
                                                style={styles.scheduleButton}
                                            >
                                                <Text style={styles.scheduleButtonText}>📅 Agendar aula →</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                ))
                            ) : (
                                <Text style={styles.noDataText}>Nenhum professor disponível</Text>
                            )}
                        </View>
                    </View>

                    <TouchableOpacity onPress={next} style={styles.navButton}>
                        <PlaceholderBtn text=">" />
                    </TouchableOpacity>
                </View>

                {/* Pagination */}
                <View style={styles.pagination}>
                    {Array.from({ length: totalPages }).map((_, idx) => (
                        <TouchableOpacity
                            key={idx}
                            onPress={() => setPage(idx)}
                            style={[styles.paginationDot, page === idx ? styles.activeDot : styles.inactiveDot]}
                        />
                    ))}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#3970B7',
        paddingVertical: 48, // py-12
        paddingHorizontal: 16, // px-4
        alignItems: 'center',
    },
    header: {
        marginBottom: 32, // mb-8
        alignItems: 'center',
        maxWidth: 672, // max-w-2xl
    },
    subTitle: {
        color: '#FACC15', // yellow-400
        fontWeight: '600',
        marginBottom: 4,
    },
    mainTitle: {
        color: 'white',
        fontSize: 30, // text-3xl
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 8,
    },
    description: {
        color: '#E5E7EB', // gray-200
        fontWeight: '300', // font-light
        textAlign: 'center',
    },
    content: {
        width: '100%',
        alignItems: 'center',
    },
    carouselContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
    },
    navButton: {
        paddingHorizontal: 8,
    },
    placeholderBtn: {
        width: 32, // w-8
        height: 32, // h-8
        backgroundColor: '#D1D5DB', // gray-300
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    placeholderBtnText: {
        fontWeight: 'bold',
    },
    cardsWrapper: {
        flex: 1,
        alignItems: 'center',
    },
    cardsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 24, // gap-6
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 16, // rounded-2xl
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 8,
        borderWidth: 1,
        borderColor: '#E5E7EB', // gray-200
        overflow: 'hidden',
        width: '100%',
        maxWidth: 300,
        marginBottom: 16,
    },
    cardImage: {
        width: '100%',
        height: 208, // h-52
    },
    imagePlaceholder: {
        width: '100%',
        height: 208, // h-52
        backgroundColor: '#E5E7EB', // gray-200
        alignItems: 'center',
        justifyContent: 'center',
    },
    placeholderText: {
        color: '#6B7280', // gray-500
    },
    cardBody: {
        padding: 16, // p-4
        flexDirection: 'column',
    },
    cardName: {
        fontSize: 18, // text-lg
        fontWeight: 'bold',
        color: '#1F2937', // gray-800
    },
    statusRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    statusDot: {
        width: 8,
        height: 8,
        backgroundColor: '#22C55E', // green-500
        borderRadius: 4,
        marginRight: 8,
    },
    statusText: {
        color: '#6B7280', // gray-500
        fontSize: 14, // text-sm
    },
    subjectText: {
        color: '#3970B7',
        fontWeight: '600',
        marginTop: 8,
    },
    resumeText: {
        color: '#4B5563', // gray-600
        fontSize: 14, // text-sm
        marginTop: 8,
        marginBottom: 16,
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
    noDataText: {
        color: 'white',
        padding: 24,
    },
    pagination: {
        flexDirection: 'row',
        marginTop: 24,
        gap: 8,
    },
    paginationDot: {
        width: 12, // w-3
        height: 12, // h-3
        borderRadius: 6,
    },
    activeDot: {
        backgroundColor: '#FACC15', // yellow-400
    },
    inactiveDot: {
        backgroundColor: '#D1D5DB', // gray-300
    },
});
