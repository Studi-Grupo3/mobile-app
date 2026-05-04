import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { ContentTeacherRegistration } from '../../components/teacher/registration/ContentTeacherRegistration';
import { teacherService } from '../../services/teacherService';
import { User, GraduationCap, Image as ImageIcon, Clock } from 'lucide-react-native';
import { AlertModal } from '../../components/ui/AlertModal';
import { useAlert } from '../../hooks/useAlert';

export default function CompleteTeacherRegistrationPage() {
    const [activeTab, setActiveTab] = useState('Informacoes Pessoais');
    const [percentComplete, setPercentComplete] = useState(0);
    const { alertConfig, showAlert, hideAlert } = useAlert();
    const [formData, setFormData] = useState({
        id: null,
        name: "",
        email: "",
        cellphoneNumber: "",
        dateBirth: "",
        resumeTeacher: "",
        academicFormation: "",
        yearsExperience: "",
        subject: "",
    });

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        showAlert('success', 'Sucesso', 'Perfil atualizado!');
    };

    const tabs = [
        { id: "Informacoes Pessoais", label: "Pessoal", icon: User },
        { id: "Qualificacoes", label: "Qualif.", icon: GraduationCap },
        { id: "Foto e Documentos", label: "Foto", icon: ImageIcon },
        { id: "Disponibilidade", label: "Disp.", icon: Clock },
    ];

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Cadastro do Professor</Text>
            </View>

            <View style={styles.content}>
                <View style={styles.progressContainer}>
                    <Text style={styles.progressText}>Completar Perfil: {percentComplete}%</Text>
                    <View style={[styles.statusBadge, percentComplete === 100 ? styles.statusGreen : styles.statusOrange]}>
                        <Text style={styles.statusText}>{percentComplete === 0 ? "Iniciado" : "Em Progresso"}</Text>
                    </View>
                </View>

                <View style={styles.tabsContainer}>
                    {tabs.map(t => (
                        <TouchableOpacity
                            key={t.id}
                            onPress={() => setActiveTab(t.id)}
                            style={[
                                styles.tabItem,
                                activeTab === t.id && styles.activeTab
                            ]}
                        >
                            <t.icon size={20} color={activeTab === t.id ? '#ca8a04' : '#666'} />
                            <Text style={[
                                styles.tabLabel,
                                activeTab === t.id ? styles.activeTabLabel : styles.inactiveTabLabel
                            ]}>
                                {t.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 20 }}>
                    <ContentTeacherRegistration
                        current={activeTab}
                        formData={formData}
                        onChange={handleChange}
                        onSave={handleSave}
                        onAvailabilityChange={() => { }}
                    />
                </ScrollView>
            </View>
            <AlertModal visible={alertConfig.visible} type={alertConfig.type} title={alertConfig.title} message={alertConfig.message} onClose={hideAlert} buttons={alertConfig.buttons} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB', // gray-50
    },
    header: {
        backgroundColor: 'white',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB', // gray-200
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1F2937', // gray-800
    },
    content: {
        padding: 16,
        flex: 1,
    },
    progressContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    progressText: {
        color: '#4B5563', // gray-600
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    statusGreen: {
        backgroundColor: '#22c55e', // green-500
    },
    statusOrange: {
        backgroundColor: '#fb923c', // orange-400
    },
    statusText: {
        color: 'white',
        fontSize: 12,
    },
    tabsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 24,
        backgroundColor: 'white',
        padding: 8,
        borderRadius: 8,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 1,
    },
    tabItem: {
        alignItems: 'center',
        padding: 8,
        borderRadius: 6,
    },
    activeTab: {
        backgroundColor: '#FEF9C3', // yellow-100
    },
    tabLabel: {
        fontSize: 12, // text-xs
        marginTop: 4,
    },
    activeTabLabel: {
        color: '#A16207', // yellow-700
    },
    inactiveTabLabel: {
        color: '#6B7280', // gray-500
    },
});
