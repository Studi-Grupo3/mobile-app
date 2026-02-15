import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft } from 'lucide-react-native';

// Import Wizard Steps
import { ClassDetailsForm } from '../components/appointment-class/ClassDetailsForm';
import { ClassModelSelection } from '../components/appointment-class/ClassModelSelection';
import { ProfessorCarouselChoose } from '../components/appointment-class/ProfessorCarouselChoose';
import { Scheduling } from '../components/appointment-class/Scheduling';
import { Payment } from '../components/appointment-class/Payment';

const steps = [
    { key: "detalhes", label: "Detalhes", title: "Detalhes da Aula", Component: ClassDetailsForm },
    { key: "modelo", label: "Modelo", title: "Selecione o modelo", Component: ClassModelSelection },
    { key: "professor", label: "Professor", title: "Escolha um professor", Component: ProfessorCarouselChoose },
    { key: "agendamento", label: "Agendamento", title: "Data e horário", Component: Scheduling },
    { key: "pagamento", label: "Pagamento", title: "Pagamento", Component: Payment },
];

export default function AppointmentCreatePage() {
    const navigation = useNavigation();
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState({
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

    const Step = steps[currentStep];

    const handleUpdate = (partialData) => {
        setFormData(prev => ({ ...prev, ...partialData }));
    };

    const goNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            // Finish
            Alert.alert("Sucesso", "Agendamento realizado!", [
                { text: "OK", onPress: () => navigation.navigate('Dashboard') }
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
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={goBack} style={styles.backButton}>
                    <ChevronLeft size={24} color="#333" />
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

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.stepTitle}>{Step.title}</Text>

                {/* Render Current Step Component */}
                <Step.Component
                    data={formData}
                    onUpdate={handleUpdate}
                    onNext={goNext}
                />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB', // gray-50
    },
    header: {
        backgroundColor: '#FFFFFF',
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB', // gray-200
        elevation: 1, // shadow-sm
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 1,
    },
    backButton: {
        marginRight: 16,
    },
    headerTitle: {
        fontSize: 18, // text-lg
        fontWeight: '600',
        color: '#1F2937', // gray-800
    },
    stepsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 32, // px-8
        paddingVertical: 16, // py-4
        backgroundColor: '#FFFFFF',
        marginBottom: 8, // mb-2
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
        backgroundColor: '#2563EB', // blue-600
    },
    stepDotInactive: {
        backgroundColor: '#D1D5DB', // gray-300
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
