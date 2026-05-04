import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { StatCard } from '../../components/admin/StatCard';
import { ChartSection } from '../../components/admin/ChartSection';
import { TableSection } from '../../components/admin/TableSection';
import { overviewDashService } from '../../services/dashboard/overviewDashService';
import { insightsService } from '../../services/insightsService';
import { DollarSign, Users, Clock, CalendarCheck, Brain, X, RefreshCw } from 'lucide-react-native';
import { translatePaymentStatus } from '../../utils/tradutionUtils';
import { SubjectBadge } from '../../components/admin/SubjectBadge';
import { useNavigation } from '@react-navigation/native';

export default function VisaoGeralPage() {
    const navigation = useNavigation();
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalTeachers: 0,
        pendingAmount: 0,
        totalAppointments: 0,
    });
    const [charts, setCharts] = useState([]);
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    // Insights modal state
    const [modalVisible, setModalVisible] = useState(false);
    const [insightsLoading, setInsightsLoading] = useState(false);
    const [insightsText, setInsightsText] = useState('');
    const [insightsGeneratedAt, setInsightsGeneratedAt] = useState('');
    const [insightsError, setInsightsError] = useState('');

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [statsData, revenueChart, lessonsChart, paymentsData] = await Promise.all([
                overviewDashService.getStats(),
                overviewDashService.getMonthlyRevenueChart(),
                overviewDashService.getLessonsPerDayChart(),
                overviewDashService.getRecentPaymentsTable()
            ]);
            setStats(statsData);
            setCharts([revenueChart, lessonsChart]);
            setPayments(paymentsData);
        } catch (error) {
            console.error('Error fetching overview data:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('adminRefresh', fetchData);
        return unsubscribe;
    }, [navigation, fetchData]);

    async function handleInsightsPress() {
        setInsightsText('');
        setInsightsError('');
        setInsightsGeneratedAt('');
        setModalVisible(true);
        setInsightsLoading(true);
        try {
            const result = await insightsService.generateInsights();
            setInsightsText(result.insights);
            if (result.generated_at) {
                const d = new Date(result.generated_at);
                setInsightsGeneratedAt(
                    d.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
                );
            }
        } catch (err) {
            const msg =
                err?.response?.data?.detail ||
                err?.message ||
                'Erro ao gerar insights. Verifique se o serviço Python está rodando na porta 5001.';
            setInsightsError(msg);
        } finally {
            setInsightsLoading(false);
        }
    }

    function handleRetry() {
        handleInsightsPress();
    }

    if (loading)
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#3970B7" />
            </View>
        );

    return (
        <>
            <ScrollView style={styles.container} contentContainerStyle={styles.content}>
                <StatCard
                    title={`R$ ${stats.totalRevenue?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}`}
                    subtitle="Receita Total do Mês"
                    icon={<DollarSign size={20} color="#3970B7" />}
                />
                <StatCard
                    title={stats.totalTeachers}
                    subtitle="Professores Cadastrados"
                    icon={<Users size={20} color="#3970B7" />}
                />
                <StatCard
                    title={`R$ ${stats.pendingAmount?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}`}
                    subtitle="Valor Pendente de Pagamento"
                    icon={<Clock size={20} color="#E8A317" />}
                />
                <StatCard
                    title={stats.totalAppointments}
                    subtitle="Agendamentos no Mês"
                    icon={<CalendarCheck size={20} color="#3970B7" />}
                />

                <TouchableOpacity
                    style={styles.aiInsightsButton}
                    onPress={handleInsightsPress}
                    activeOpacity={0.8}
                >
                    <View style={styles.aiInsightsContent}>
                        <Brain size={20} color="#FFFFFF" />
                        <Text style={styles.aiInsightsText}>Insights com IA</Text>
                    </View>
                </TouchableOpacity>

                <ChartSection charts={charts} />

                <TableSection
                    title="Pagamentos Recentes"
                    data={payments}
                    columns={[
                        { label: 'Professor', accessor: 'teacherName' },
                        {
                            label: 'Matéria',
                            accessor: 'subject',
                            render: (row) => <SubjectBadge subjects={row.subject} />,
                        },
                        { label: 'Valor/Hora', accessor: 'hourlyRate' },
                        { label: 'Total', accessor: 'totalValue' },
                        {
                            label: 'Status',
                            accessor: 'paymentStatus',
                            render: (row) => {
                                const translated = translatePaymentStatus(row.paymentStatus);
                                const isPaid =
                                    row.paymentStatus === 'PAID' || row.paymentStatus === 'Pago';
                                return (
                                    <View
                                        style={{
                                            backgroundColor: isPaid ? '#DCFCE7' : '#FEF9C3',
                                            paddingHorizontal: 10,
                                            paddingVertical: 3,
                                            borderRadius: 12,
                                        }}
                                    >
                                        <Text
                                            style={{
                                                color: isPaid ? '#166534' : '#92400E',
                                                fontSize: 11,
                                                fontWeight: '700',
                                            }}
                                        >
                                            {translated}
                                        </Text>
                                    </View>
                                );
                            },
                        },
                    ]}
                />
            </ScrollView>

            {/* ── Insights Modal ── */}
            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalCard}>
                        {/* Header */}
                        <View style={styles.modalHeader}>
                            <View style={styles.modalTitleRow}>
                                <Brain size={20} color="#3970B7" />
                                <Text style={styles.modalTitle}>Insights com IA</Text>
                            </View>
                            <TouchableOpacity
                                onPress={() => setModalVisible(false)}
                                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                            >
                                <X size={22} color="#6B7280" />
                            </TouchableOpacity>
                        </View>

                        {/* Body */}
                        {insightsLoading ? (
                            <View style={styles.modalCentered}>
                                <ActivityIndicator size="large" color="#3970B7" />
                                <Text style={styles.loadingText}>
                                    Analisando dados e gerando insights…
                                </Text>
                            </View>
                        ) : insightsError ? (
                            <View style={styles.modalCentered}>
                                <Text style={styles.errorText}>{insightsError}</Text>
                                <TouchableOpacity
                                    style={styles.retryButton}
                                    onPress={handleRetry}
                                >
                                    <RefreshCw size={16} color="#FFFFFF" />
                                    <Text style={styles.retryButtonText}>Tentar novamente</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <ScrollView
                                style={styles.insightsScroll}
                                contentContainerStyle={styles.insightsScrollContent}
                                showsVerticalScrollIndicator={false}
                            >
                                <Text style={styles.insightsText}>{insightsText}</Text>
                                {insightsGeneratedAt ? (
                                    <Text style={styles.timestampText}>
                                        Gerado em {insightsGeneratedAt}
                                    </Text>
                                ) : null}
                            </ScrollView>
                        )}
                    </View>
                </View>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6',
    },
    content: {
        padding: 16,
        paddingBottom: 32,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    // ── AI Button ──
    aiInsightsButton: {
        backgroundColor: '#3970B7',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        elevation: 2,
        marginBottom: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    aiInsightsContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    aiInsightsText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },

    // ── Modal ──
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.45)',
        justifyContent: 'flex-end',
    },
    modalCard: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingTop: 16,
        paddingHorizontal: 20,
        paddingBottom: 32,
        maxHeight: '85%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        paddingBottom: 12,
    },
    modalTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
    },
    modalCentered: {
        alignItems: 'center',
        paddingVertical: 40,
        gap: 16,
    },
    loadingText: {
        color: '#6B7280',
        fontSize: 14,
        textAlign: 'center',
    },
    errorText: {
        color: '#DC2626',
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 20,
    },
    retryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#3970B7',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        gap: 8,
        marginTop: 8,
    },
    retryButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },

    // ── Insights text ──
    insightsScroll: {
        flex: 1,
    },
    insightsScrollContent: {
        paddingBottom: 16,
    },
    insightsText: {
        fontSize: 14,
        color: '#1F2937',
        lineHeight: 22,
    },
    timestampText: {
        marginTop: 20,
        fontSize: 11,
        color: '#9CA3AF',
        textAlign: 'right',
    },
});
