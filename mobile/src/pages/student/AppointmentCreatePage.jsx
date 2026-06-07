import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { ChevronLeft } from 'lucide-react-native';
import { AlertModal } from '../../components/ui/AlertModal';
import { useAlert } from '../../hooks/useAlert';
import { studentService } from '../../services/studentService';
import { authService } from '../../services/authService';

// Import Wizard Steps
import ClassDetailsForm from '../../components/student/appointment-create/ClassDetailsForm';
import ClassModelSelection from '../../components/student/appointment-create/ClassModelSelection';
import ProfessorCarouselChoose from '../../components/student/appointment-create/ProfessorCarouselChoose';
import Scheduling from '../../components/student/appointment-create/Scheduling';
import Payment from '../../components/student/appointment-create/Payment';

const steps = [
    { key: "detalhes", label: "Detalhes", title: "Detalhes da Aula", Component: ClassDetailsForm },
    { key: "modelo", label: "Modelo", title: "Selecione o modelo", Component: ClassModelSelection },
    { key: "professor", label: "Professor", title: "Escolha um professor", Component: ProfessorCarouselChoose },
    { key: "agendamento", label: "Agendamento", title: "Data e horário", Component: Scheduling },
    { key: "pagamento", label: "Pagamento", title: "Pagamento", Component: Payment },
];

const createInitialFormData = () => ({
    phase: "",
    subject: "",
    duration: "",
    materials: [],
    classModel: null,
    professorId: null,
    date: null,
    time: null,
    personal: {},
    endereco: {},
    pagamento: {},
});

export default function AppointmentCreatePage() {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
    const { alertConfig, showAlert, hideAlert } = useAlert();
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState(createInitialFormData);
    const [profileIncomplete, setProfileIncomplete] = useState(false);

    const Step = steps[currentStep];

    const handleUpdate = (partialData) => {
        setFormData(prev => ({ ...prev, ...partialData }));
    };

    const goNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            showAlert('success', 'Sucesso', 'Agendamento realizado!', [
                { text: 'OK', onPress: () => { hideAlert(); navigation.navigate('Dashboard'); } }
            ]);
        }
    };

    const goBack = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        } else {
            navigation.goBack();
        }
    };

    useFocusEffect(
        useCallback(() => {
            setCurrentStep(0);
            setFormData(createInitialFormData());
            setProfileIncomplete(false);

            const checkProfile = async () => {
                try {
                    const studentId = await authService.getUserId();
                    if (!studentId) return;
                    const data = await studentService.getById(studentId);

                    const requiredFields = [
                        data.name, data.email, data.dateBirth,
                        data.schoolGrade, data.cellphoneNumber, data.schoolName,
                        data.cep, data.rua, data.cidade, data.estado,
                    ];
                    const isComplete = requiredFields.every(Boolean);

                    if (!isComplete) {
                        setProfileIncomplete(true);
                        showAlert('warning', 'Cadastro Incompleto', 'Complete seu cadastro antes de agendar uma aula. Preencha todos os dados pessoais e endereço.', [
                            { text: 'Completar Cadastro', onPress: () => { hideAlert(); navigation.navigate('Profile', { screen: 'CompleteStudentRegistration' }); } }
                        ]);
                    } else {
                        setProfileIncomplete(false);
                        setFormData(prev => ({
                            ...prev,
                            endereco: {
                                cep: data.cep || '',
                                rua: data.rua || '',
                                numero: data.numero || '',
                                complemento: data.complemento || '',
                                bairro: data.bairro || '',
                                cidade: data.cidade || '',
                                estado: data.estado || '',
                            }
                        }));
                    }
                } catch (e) {
                    // Student data not available
                }
            };
            checkProfile();
        }, [])
    );

    // Calculate total logic (simplified)
    useEffect(() => {
        if (currentStep === steps.length - 1) {
            // Simplified calculation
            const rate = formData.classModel === 'home' ? 70 : 50;
            const total = rate;

            setFormData(prev => ({
                ...prev,
                pagamento: { ...prev.pagamento, totalValue: total }
            }));
        }
    }, [currentStep]);

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={goBack} style={styles.backButton}>
                    <ChevronLeft size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Agendar Aula</Text>
            </View>

            {/* Steps Indicator */}
            <View style={styles.stepsContainer}>
                {steps.map((s, idx) => (
                    <View key={s.key} style={styles.stepItem}>
                        <View style={[
                            styles.stepDot,
                            idx <= currentStep ? styles.stepDotActive : styles.stepDotInactive
                        ]} />
                    </View>
                ))}
            </View>

            {!profileIncomplete && (
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.stepTitle}>{Step.title}</Text>

                {/* Render Current Step Component */}
                <Step.Component
                    data={formData}
                    onUpdate={handleUpdate}
                    onNext={goNext}
                />
            </ScrollView>
            )}
            <AlertModal visible={alertConfig.visible} type={alertConfig.type} title={alertConfig.title} message={alertConfig.message} onClose={() => { if (profileIncomplete) { navigation.navigate('Profile', { screen: 'CompleteStudentRegistration' }); } hideAlert(); }} buttons={alertConfig.buttons} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F1F5F9',
    },
    header: {
        backgroundColor: '#3970B7',
        paddingHorizontal: 16,
        paddingVertical: 14,
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: {
        marginRight: 16,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    stepsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 32,
        paddingVertical: 14,
        backgroundColor: '#FFFFFF',
        marginBottom: 8,
    },
    stepItem: {
        alignItems: 'center',
    },
    stepDot: {
        width: 12, // w-3
        height: 12, // h-3
        borderRadius: 6,
        marginBottom: 4,
    },
    stepDotActive: {
        backgroundColor: '#FECB0A',
    },
    stepDotInactive: {
        backgroundColor: '#CBD5E1',
    },
    scrollContent: {
        padding: 16,
    },
    stepTitle: {
        fontSize: 20, // text-xl
        fontWeight: 'bold',
        color: '#3970B7',
        textAlign: 'center',
        marginBottom: 24, // mb-6
    },
});
