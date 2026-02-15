import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { teacherService } from '../../services/teacherService';

const subjectMap = {
    PORTUGUESE: "Português",
    MATHEMATICS: "Matemática",
    GEOGRAPHY: "Geografia",
    HISTORY: "História",
    SCIENCE: "Ciências",
    CHEMISTRY: "Química",
    PHYSICS: "Física",
};

export default function ProfessorCarouselChoose({ data, onUpdate, onNext }) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [professors, setProfessors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        teacherService.list()
            .then((professorsData) => {
                const list = Array.isArray(professorsData)
                    ? professorsData
                    : (Array.isArray(professorsData?.content) ? professorsData.content : []);

                const allowedSubjects = [
                    "PORTUGUESE", "MATHEMATICS", "HISTORY", "GEOGRAPHY",
                    "SCIENCE", "PHYSICS", "CHEMISTRY",
                ];

                const enriched = list.map((prof) => {
                    const subjectsArray = Array.isArray(prof.subjects) ? prof.subjects : [];
                    const translatedSubjects = subjectsArray
                        .filter((s) => allowedSubjects.includes(s))
                        .map((s) => subjectMap[s]);

                    return {
                        ...prof,
                        location: "São Paulo (online)",
                        subjectsTranslated: translatedSubjects,
                        description: prof.resumeTeacher || `Professor experiente`,
                    };
                });

                const unique = enriched.filter(
                    (prof, index, self) => index === self.findIndex((p) => p.id === prof.id)
                );
                setProfessors(unique);
            })
            .catch((err) => {
                console.error("Erro ao carregar professores:", err);
                setError("Erro ao buscar professores");
            })
            .finally(() => setLoading(false));
    }, []);

    const filtered = useMemo(() => {
        if (!data.subject) return professors;
        return professors.filter((p) =>
            p.subjectsTranslated?.some(
                (s) => s.toLowerCase() === data.subject.toLowerCase()
            )
        );
    }, [data.subject, professors]);

    useEffect(() => setCurrentSlide(0), [filtered]);

    const nextSlide = () =>
        filtered.length > 0 && setCurrentSlide((i) => (i + 1) % filtered.length);

    const prevSlide = () =>
        filtered.length > 0 && setCurrentSlide((i) => (i - 1 + filtered.length) % filtered.length);

    const choose = (prof) => {
        onUpdate({ professorId: prof.id });
        onNext();
    };

    if (loading) return <View style={styles.centerContainer}><ActivityIndicator color="#3970B7" /></View>;
    if (error) return <Text style={[styles.centerText, styles.errorText]}>{error}</Text>;
    if (!data.subject) return <Text style={[styles.centerText, styles.infoText]}>Escolha primeiro uma matéria.</Text>;
    if (filtered.length === 0) return <Text style={[styles.centerText, styles.infoText]}>Não há professores cadastrados para {data.subject}.</Text>;

    const currentProf = filtered[currentSlide];

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                {/* Nav Arrows */}
                {filtered.length > 1 && (
                    <>
                        <TouchableOpacity onPress={prevSlide} style={[styles.arrow, styles.arrowLeft]}>
                            <ChevronLeft size={24} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={nextSlide} style={[styles.arrow, styles.arrowRight]}>
                            <ChevronRight size={24} color="white" />
                        </TouchableOpacity>
                    </>
                )}

                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: 'https://via.placeholder.com/400x200' }}
                        style={styles.image}
                        resizeMode="cover"
                    />
                </View>

                <View style={styles.detailsContainer}>
                    <Text style={styles.profName}>{currentProf.name}</Text>
                    <Text style={styles.profLocation}>{currentProf.location}</Text>
                    <Text style={styles.profSubjects}>
                        {currentProf.subjectsTranslated?.join(", ")}
                    </Text>
                    <Text style={styles.profDesc} numberOfLines={3}>
                        {currentProf.description}
                    </Text>

                    <TouchableOpacity
                        onPress={() => choose(currentProf)}
                        style={styles.chooseButton}
                    >
                        <Text style={styles.chooseButtonText}>Agendar aula</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {filtered.length > 1 && (
                <Text style={styles.paginationText}>
                    {currentSlide + 1} de {filtered.length}
                </Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    centerContainer: {
        padding: 16,
        alignItems: 'center',
    },
    centerText: {
        padding: 16,
        textAlign: 'center',
    },
    errorText: {
        color: '#dc2626', // red-600
    },
    infoText: {
        color: '#6b7280', // gray-500
    },
    container: {
        paddingVertical: 16,
        alignItems: 'center',
    },
    card: {
        width: Dimensions.get('window').width - 40,
        backgroundColor: 'white',
        borderRadius: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 3,
        overflow: 'hidden',
        position: 'relative',
    },
    imageContainer: {
        width: '100%',
        height: 160,
        backgroundColor: '#e5e7eb',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    arrow: {
        position: 'absolute',
        top: 60,
        zIndex: 10,
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: 20,
        padding: 4,
    },
    arrowLeft: {
        left: 10,
    },
    arrowRight: {
        right: 10,
    },
    detailsContainer: {
        padding: 16,
        borderTopWidth: 2,
        borderTopColor: '#3970B7',
    },
    profName: {
        fontSize: 18, // text-lg
        fontWeight: 'bold',
        color: '#3970B7',
    },
    profLocation: {
        color: '#6b7280', // gray-500
        fontSize: 12, // text-xs
        marginTop: 4,
    },
    profSubjects: {
        fontWeight: '600',
        marginTop: 8,
        color: '#3970B7',
    },
    profDesc: {
        color: '#4b5563', // gray-600
        fontSize: 14, // text-sm
        marginTop: 8,
    },
    chooseButton: {
        width: '100%',
        paddingVertical: 12,
        marginTop: 16,
        borderRadius: 8,
        backgroundColor: '#3970B7',
        alignItems: 'center',
    },
    chooseButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    paginationText: {
        textAlign: 'center',
        color: '#9ca3af', // gray-400
        fontSize: 12, // text-xs
        marginTop: 8,
    },
});
