import React, { useCallback, useEffect, useState } from 'react';
import { View, ScrollView, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StatCard } from '../../components/admin/StatCard';
import { ToggleSwitch } from '../../components/ui/ToggleSwitch';
import { AlertModal } from '../../components/ui/AlertModal';
import { paymentDashService } from '../../services/dashboard/paymentDashService';
import { DollarSign, CreditCard, Wallet, TrendingUp } from 'lucide-react-native';
import { translatePaymentStatus } from '../../utils/tradutionUtils';
import { SubjectBadge } from '../../components/admin/SubjectBadge';

export default function PagamentosPage() {
    const navigation = useNavigation();
    const [stats, setStats] = useState({
        totalAmount: 0,
        pendingAmount: 0,
        realizedAmount: 0,
        averageAmountPerTeacher: 0
    });
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [onlyPending, setOnlyPending] = useState(false);

    // Alert modal state
    const [alertConfig, setAlertConfig] = useState({ visible: false, type: 'info', title: '', message: '', buttons: null });
    const showAlert = (type, title, message, buttons) => setAlertConfig({ visible: true, type, title, message, buttons });
    const hideAlert = () => setAlertConfig(prev => ({ ...prev, visible: false }));

    const fetchData = useCallback(async ({ withLoading = true } = {}) => {
        if (withLoading) setLoading(true);
        const now = new Date();
        const month = now.getMonth() + 1;
        const year = now.getFullYear();
        try {
            const [statsData, recentData] = await Promise.all([
                paymentDashService.getStats(month, year),
                paymentDashService.getRecent(month, year)
            ]);
            setStats(statsData);
            setPayments(recentData);
        } catch (err) {
            console.error(err);
        } finally {
            if (withLoading) setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('adminRefresh', fetchData);
        return unsubscribe;
    }, [navigation, fetchData]);

    const doToggle = async (item) => {
        const now = new Date();
        const month = now.getMonth() + 1;
        const year = now.getFullYear();
        try {
            await paymentDashService.toggleStatus(item.id, month, year);
            await fetchData({ withLoading: false });
        } catch (e) {
            showAlert('error', 'Erro', 'Falha ao atualizar status do pagamento.');
        }
    };

    const toggleStatus = (item) => {
        const rawStatus = (item.status || '').toUpperCase();
        const isPaid = rawStatus === 'PAID' || rawStatus === 'PAGO';
        const action = isPaid ? 'Pendente' : 'Pago';
        showAlert('warning', 'Confirmar alteração', `Deseja marcar o pagamento de ${item.name} como "${action}"?`, [
            { text: 'Cancelar', style: 'cancel', onPress: hideAlert },
            { text: 'Confirmar', onPress: () => { hideAlert(); doToggle(item); } },
        ]);
    };

    const filtered = payments.filter(p => {
        if (!onlyPending) return true;
        const s = (p.status || '').toUpperCase();
        return s === 'PENDING' || s === 'PENDENTE';
    });

    if (loading) return <View style={styles.centered}><ActivityIndicator size="large" color="#3970B7" /></View>;

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <StatCard
                title={`R$ ${Number(stats.totalAmount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                subtitle="Total em Pagamentos"
                icon={<DollarSign size={20} color="#3970B7" />}
            />
            <StatCard
                title={`R$ ${Number(stats.realizedAmount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                subtitle="Total Pago no Mês"
                icon={<CreditCard size={20} color="#22C55E" />}
            />
            <StatCard
                title={`R$ ${Number(stats.pendingAmount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                subtitle="Valor Pendente"
                icon={<Wallet size={20} color="#E8A317" />}
            />
            <StatCard
                title={`R$ ${Number(stats.averageAmountPerTeacher).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                subtitle="Média por Professor"
                icon={<TrendingUp size={20} color="#3970B7" />}
            />

            <View style={styles.filterContainer}>
                <ToggleSwitch checked={onlyPending} onChange={setOnlyPending} />
                <Text style={styles.filterText}>Somente pendentes</Text>
            </View>

            {filtered.length === 0 && (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>Nenhum pagamento encontrado.</Text>
                </View>
            )}

            {filtered.map(item => {
                const rawStatus = (item.status || '').toUpperCase();
                const isPaid = rawStatus === 'PAID' || rawStatus === 'PAGO';
                const statusLabel = translatePaymentStatus(item.status);
                return (
                    <View key={`${item.id}-${item.status}`} style={styles.paymentCard}>
                        <View style={styles.paymentHeader}>
                            <Text style={styles.paymentName}>{item.name}</Text>
                            <ToggleSwitch
                                checked={isPaid}
                                onChange={() => toggleStatus(item)}
                            />
                        </View>
                        <View style={styles.paymentSubjectRow}><SubjectBadge subjects={item.subject} /></View>
                        <View style={styles.paymentDetails}>
                            <View style={styles.paymentDetailItem}>
                                <Text style={styles.detailLabel}>VALOR/HORA</Text>
                                <Text style={styles.detailValue}>R$ {Number(item.valuePerHour).toFixed(2)}</Text>
                            </View>
                            <View style={styles.paymentDetailItem}>
                                <Text style={styles.detailLabel}>HORAS</Text>
                                <Text style={styles.detailValue}>{item.hours}h</Text>
                            </View>
                            <View style={styles.paymentDetailItem}>
                                <Text style={styles.detailLabel}>TOTAL</Text>
                                <Text style={[styles.detailValue, { fontWeight: '700' }]}>R$ {Number(item.total).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</Text>
                            </View>
                        </View>
                        <View style={[styles.statusBadge, { backgroundColor: isPaid ? '#DCFCE7' : '#FEF9C3' }]}>
                            <Text style={{ color: isPaid ? '#166534' : '#92400E', fontSize: 12, fontWeight: '700' }}>{statusLabel}</Text>
                        </View>
                    </View>
                );
            })}

            <AlertModal
                visible={alertConfig.visible}
                type={alertConfig.type}
                title={alertConfig.title}
                message={alertConfig.message}
                onClose={hideAlert}
                buttons={alertConfig.buttons}
            />
        </ScrollView>
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
    filterContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 12,
    },
    filterText: {
        marginLeft: 8,
        color: '#374151',
        fontWeight: '600',
    },
    emptyContainer: {
        padding: 24,
        alignItems: 'center',
    },
    emptyText: {
        color: '#9CA3AF',
        fontSize: 14,
    },
    paymentCard: {
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 3,
    },
    paymentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    paymentName: {
        fontWeight: '700',
        color: '#1F2937',
        fontSize: 15,
    },
    paymentSubjectRow: {
        marginBottom: 12,
    },
    paymentDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    paymentDetailItem: {
        alignItems: 'center',
    },
    detailLabel: {
        fontSize: 11,
        color: '#9CA3AF',
        textTransform: 'uppercase',
        fontWeight: '600',
        marginBottom: 2,
    },
    detailValue: {
        fontSize: 14,
        color: '#1F2937',
        fontWeight: '500',
    },
    statusBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
});
