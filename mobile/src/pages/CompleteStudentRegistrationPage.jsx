import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import { ContentStudentRegistration } from '../components/complete-registration/ContentStudentRegistration';
import { User, Image as ImageIcon, Users } from 'lucide-react-native';

export default function CompleteStudentRegistrationPage() {
    const [activeTab, setActiveTab] = useState('Dados do Aluno');
    const [percentComplete, setPercentComplete] = useState(0);
    const [formData, setFormData] = useState({
        id: null,
        name: "",
        email: "",
        dateBirth: "",
        schoolGrade: "",
        schoolName: "",
        cellphoneNumber: "",
        responsible: {
            responsibleName: "",
            kinship: "",
            responsibleCpf: "",
            responsibleCellphoneNumber: "",
        },
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(false);
    }, []);

    const handleChange = (field, value) => {
        if (['responsibleName', 'kinship', 'responsibleCpf', 'responsibleCellphoneNumber'].includes(field)) {
            setFormData(prev => ({
                ...prev,
                responsible: { ...prev.responsible, [field]: value }
            }));
        } else {
            setFormData(prev => ({ ...prev, [field]: value }));
        }
    };

    const handleSave = async () => {
        Alert.alert("Sucesso", "Perfil atualizado!");
    };

    const tabs = [
        { id: "Dados do Aluno", label: "Dados", icon: User },
        { id: "Responsavel", label: "Resp.", icon: Users },
        { id: "Foto do Aluno", label: "Foto", icon: ImageIcon },
    ];

    if (loading) return <View style={styles.centered}><ActivityIndicator size="large" color="#3970B7" /></View>;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Cadastro do Aluno</Text>
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

                <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
                    <ContentStudentRegistration
                        current={activeTab}
                        formData={formData}
                        onChange={handleChange}
                        onSave={handleSave}
                        onProgressChange={setPercentComplete}
                    />
                </ScrollView>
            </View>
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
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
