import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft } from 'lucide-react-native';
import ContentStudentRegistration from '../../components/student/registration/ContentStudentRegistration';
import { studentService } from '../../services/studentService';
import { authService } from '../../services/authService';
import { User, Image as ImageIcon, Users } from 'lucide-react-native';
import { AlertModal } from '../../components/ui/AlertModal';
import { useAlert } from '../../hooks/useAlert';

export default function CompleteStudentRegistrationPage() {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();
    const { alertConfig, showAlert, hideAlert } = useAlert();
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

    // Fetch student data from API
    useEffect(() => {
        const fetchStudentData = async () => {
            try {
                const studentId = await authService.getUserId();
                if (studentId) {
                    const data = await studentService.getById(studentId);
                    setFormData(prev => ({
                        ...prev,
                        id: data.id || studentId,
                        name: data.name || '',
                        email: data.email || '',
                        dateBirth: data.dateBirth || '',
                        schoolGrade: data.schoolGrade || '',
                        schoolName: data.schoolName || '',
                        cellphoneNumber: data.cellphoneNumber || '',
                        responsible: {
                            responsibleName: data.responsible?.responsibleName || '',
                            kinship: data.responsible?.kinship || '',
                            responsibleCpf: data.responsible?.responsibleCpf || '',
                            responsibleCellphoneNumber: data.responsible?.responsibleCellphoneNumber || '',
                        },
                    }));
                }
            } catch (err) {
                console.log('Erro ao buscar dados do aluno, usando dados padr\u00e3o:', err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchStudentData();
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
        try {
            const studentId = formData.id || await authService.getUserId();
            if (!studentId) {
                showAlert('error', 'Erro', 'Usuário não encontrado.');
                return;
            }
            const payload = {
                name: formData.name,
                email: formData.email,
                dateBirth: formData.dateBirth,
                schoolGrade: formData.schoolGrade,
                schoolName: formData.schoolName,
                cellphoneNumber: formData.cellphoneNumber,
                responsible: {
                    responsibleName: formData.responsible.responsibleName,
                    kinship: formData.responsible.kinship,
                    responsibleCpf: formData.responsible.responsibleCpf,
                    responsibleCellphoneNumber: formData.responsible.responsibleCellphoneNumber,
                },
            };
            await studentService.update(studentId, payload);
            showAlert('success', 'Sucesso', 'Perfil atualizado com sucesso!');
        } catch (err) {
            console.error('Erro ao salvar:', err);
            showAlert('error', 'Erro', 'Não foi possível salvar as alterações. Tente novamente.');
        }
    };

    const tabs = [
        { id: "Dados do Aluno", label: "Dados", icon: User },
        { id: "Responsavel", label: "Resp.", icon: Users },
        { id: "Foto do Aluno", label: "Foto", icon: ImageIcon },
    ];

    if (loading) return <View style={styles.centered}><ActivityIndicator size="large" color="#3970B7" /></View>;

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 12 }}>
                    <ChevronLeft size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Cadastro do Aluno</Text>
            </View>

            <View style={styles.content}>
                <View style={styles.progressContainer}>
                    <Text style={styles.progressText}>Completar Perfil: {percentComplete}%</Text>
                    <View style={[styles.statusBadge, percentComplete === 100 ? styles.statusGreen : styles.statusOrange]}>
                        <Text style={styles.statusText}>{percentComplete === 100 ? "Completo" : percentComplete === 0 ? "Iniciado" : "Em Progresso"}</Text>
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
                            <t.icon size={20} color={activeTab === t.id ? '#FECB0A' : '#64748B'} />
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
                    <ContentStudentRegistration
                        current={activeTab}
                        formData={formData}
                        onChange={handleChange}
                        onSave={handleSave}
                        onProgressChange={setPercentComplete}
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
        backgroundColor: '#F1F5F9',
    },
    header: {
        backgroundColor: '#3970B7',
        paddingHorizontal: 16,
        paddingVertical: 14,
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FFFFFF',
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
        padding: 6,
        borderRadius: 12,
        elevation: 2,
        shadowColor: '#3970B7',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
    },
    tabItem: {
        alignItems: 'center',
        padding: 10,
        borderRadius: 10,
        flex: 1,
    },
    activeTab: {
        backgroundColor: '#3970B7',
    },
    tabLabel: {
        fontSize: 12, // text-xs
        marginTop: 4,
    },
    activeTabLabel: {
        color: '#FFFFFF',
    },
    inactiveTabLabel: {
        color: '#64748B',
    },
});
