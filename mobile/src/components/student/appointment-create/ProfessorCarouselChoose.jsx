import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import { ChevronLeft, ChevronRight, MapPin, Laptop, Phone } from 'lucide-react-native';
import { teacherService } from '../../../services/teacherService';
import { formatPhoneNumber } from '../../../utils/phoneUtils';
import { getProfessorImage } from '../../../mocks/mockImages';

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

    // Mock professors used as fallback when API is unavailable
    const mockProfessors = [
        { id: 2, name: 'Prof. Carlos Lima', subjects: ['MATHEMATICS', 'PHYSICS'], classType: 'ONLINE', cellphoneNumber: '11988885678', resumeTeacher: 'Licenciado em Matemática pela USP. 10 anos de experiência em aulas particulares.' },
        { id: 4, name: 'Prof. Beatriz Costa', subjects: ['PORTUGUESE'], classType: 'ONLINE', cellphoneNumber: '11977774321', resumeTeacher: 'Mestra em Letras pela PUC-SP. Especialista em redação ENEM.' },
        { id: 5, name: 'Prof. Fernanda Alvez', subjects: ['CHEMISTRY', 'SCIENCE'], classType: 'ONLINE', cellphoneNumber: '11966663333', resumeTeacher: 'Farmacêutica e licenciada em Química, apaixonada pelo ensino.' },
        { id: 6, name: 'Prof. Rodrigo Santos', subjects: ['HISTORY'], classType: 'IN_PERSON', cellphoneNumber: '11955552222', resumeTeacher: 'Historiador com abordagem interdisciplinar e dinâmica.' },
        { id: 7, name: 'Prof. Marina Oliveira', subjects: ['GEOGRAPHY'], classType: 'ONLINE', cellphoneNumber: '11944441111', resumeTeacher: 'Geógrafa pela UNICAMP, especialista em geopolítica.' },
    ];

    useEffect(() => {
        setLoading(true);
        teacherService.list()
            .then((professorsData) => {
                const list = Array.isArray(professorsData)
                    ? professorsData
                    : (Array.isArray(professorsData?.content) ? professorsData.content : []);

                const processedList = list.length > 0 ? list : mockProfessors;
                setProfessors(enrichProfessors(processedList));
            })
            .catch((err) => {
                console.log("Using mock professors data:", err.message);
                setProfessors(enrichProfessors(mockProfessors));
            })
            .finally(() => setLoading(false));
    }, []);

    const enrichProfessors = (list) => {
        const IMAGE_SOURCE_CONFIG = { useMock: true };
        const allowedSubjects = [
            "PORTUGUESE", "MATHEMATICS", "HISTORY", "GEOGRAPHY",
            "SCIENCE", "PHYSICS", "CHEMISTRY",
        ];

        const enriched = list.map((prof) => {
            const subjectsArray = Array.isArray(prof.subjects) ? prof.subjects : [];
            const translatedSubjects = subjectsArray
                .filter((s) => allowedSubjects.includes(s))
                .map((s) => subjectMap[s]);

            const isOnline = prof.classType === 'ONLINE' || prof.online === true;
            const isPresencial = prof.classType === 'IN_PERSON' || prof.classType === 'HOME' || prof.presencial === true;
            let locationLabel = 'Online';
            if (isPresencial && isOnline) locationLabel = 'Online e Presencial';
            else if (isPresencial) locationLabel = 'Presencial';

            // Resolve mock image from name
            let profilePhotoUrl = prof.profilePhotoUrl || null;
            // Only use backend URL if it's a valid http(s) URL
            if (profilePhotoUrl && !profilePhotoUrl.startsWith('http')) {
                profilePhotoUrl = null;
            }
            if (!profilePhotoUrl && IMAGE_SOURCE_CONFIG.useMock) {
                profilePhotoUrl = getProfessorImage(prof.name);
            }

            return {
                ...prof,
                profilePhotoUrl,
                locationLabel,
                isOnline: isOnline || (!isPresencial),
                isPresencial,
                phone: prof.cellphoneNumber || prof.phone || null,
                subjectsTranslated: translatedSubjects,
                description: prof.resumeTeacher || 'Professor experiente',

            };
        });

        return enriched.filter(
            (prof, index, self) => index === self.findIndex((p) => p.id === prof.id)
        );
    };

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
                            <ChevronLeft size={24} color="#3970B7" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={nextSlide} style={[styles.arrow, styles.arrowRight]}>
                            <ChevronRight size={24} color="#3970B7" />
                        </TouchableOpacity>
                    </>
                )}

                {/* Professor Avatar */}
                <View style={styles.avatarSection}>
                    <View style={styles.avatarCircle}>
                        {currentProf.profilePhotoUrl ? (
                            <Image
                                source={typeof currentProf.profilePhotoUrl === 'string' ? { uri: currentProf.profilePhotoUrl } : currentProf.profilePhotoUrl}
                                style={styles.avatarImage}
                                resizeMode="cover"
                            />
                        ) : (
                            <Text style={styles.avatarInitial}>
                                {currentProf.name?.charAt(0)?.toUpperCase() || '?'}
                            </Text>
                        )}
                    </View>
                </View>

                <View style={styles.detailsContainer}>
                    <Text style={styles.profName}>{currentProf.name}</Text>

                    {/* Location Badge */}
                    <View style={styles.locationBadge}>
                        {currentProf.isOnline ? (
                            <Laptop size={14} color="#3970B7" />
                        ) : (
                            <MapPin size={14} color="#3970B7" />
                        )}
                        <Text style={styles.locationText}>{currentProf.locationLabel}</Text>
                    </View>

                    {/* Subjects */}
                    <View style={styles.subjectsRow}>
                        {currentProf.subjectsTranslated?.map((s, i) => (
                            <View key={i} style={styles.subjectBadge}>
                                <Text style={styles.subjectBadgeText}>{s}</Text>
                            </View>
                        ))}
                    </View>

                    <Text style={styles.profDesc} numberOfLines={3}>
                        {currentProf.description}
                    </Text>

                    {/* Phone */}
                    {currentProf.phone && (
                        <View style={styles.infoRow}>
                            <Phone size={14} color="#64748B" />
                            <Text style={styles.infoText}>{formatPhoneNumber(currentProf.phone)}</Text>
                        </View>
                    )}

                    <TouchableOpacity
                        onPress={() => choose(currentProf)}
                        style={styles.chooseButton}
                    >
                        <Text style={styles.chooseButtonText}>Escolher Professor</Text>
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
        color: '#dc2626',
    },
    infoText: {
        color: '#64748B',
        fontSize: 13,
        marginLeft: 6,
    },
    container: {
        paddingVertical: 16,
        alignItems: 'center',
    },
    card: {
        width: Dimensions.get('window').width - 64,
        backgroundColor: 'white',
        borderRadius: 14,
        shadowColor: "#3970B7",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.10,
        shadowRadius: 8,
        elevation: 4,
        overflow: 'hidden',
        position: 'relative',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    avatarSection: {
        backgroundColor: '#3970B7',
        paddingVertical: 18,
        alignItems: 'center',
    },
    avatarCircle: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: '#FECB0A',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#FFF',
    },
    avatarImage: {
        width: 64,
        height: 64,
        borderRadius: 32,
    },
    avatarInitial: {
        fontSize: 32,
        fontWeight: '700',
        color: '#3970B7',
    },
    arrow: {
        position: 'absolute',
        top: '50%',
        zIndex: 10,
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    arrowLeft: {
        left: 8,
    },
    arrowRight: {
        right: 8,
    },
    detailsContainer: {
        padding: 14,
    },
    profName: {
        fontSize: 17,
        fontWeight: '700',
        color: '#1E293B',
        textAlign: 'center',
    },
    locationBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 8,
        backgroundColor: '#EFF6FF',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
        alignSelf: 'center',
    },
    locationText: {
        color: '#3970B7',
        fontSize: 12,
        fontWeight: '600',
        marginLeft: 4,
    },
    subjectsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 6,
        marginTop: 12,
    },
    subjectBadge: {
        backgroundColor: '#FEF9C3',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 10,
    },
    subjectBadgeText: {
        fontSize: 11,
        fontWeight: '600',
        color: '#854D0E',
    },
    profDesc: {
        color: '#64748B',
        fontSize: 13,
        marginTop: 12,
        textAlign: 'center',
        lineHeight: 19,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 8,
    },
    chooseButton: {
        width: '100%',
        paddingVertical: 12,
        marginTop: 12,
        borderRadius: 10,
        backgroundColor: '#FECB0A',
        alignItems: 'center',
    },
    chooseButtonText: {
        color: '#1E293B',
        fontWeight: '700',
        fontSize: 15,
    },
    paginationText: {
        textAlign: 'center',
        color: '#94A3B8',
        fontSize: 12,
        marginTop: 10,
        fontWeight: '600',
    },
});
