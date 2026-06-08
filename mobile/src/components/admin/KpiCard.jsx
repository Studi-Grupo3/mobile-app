import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

const statusStyles = {
    atencao_alta: {
        label: 'Atenção alta',
        color: '#EF4444',
        bgColor: '#FEE2E2',
        textColor: '#991B1B',
    },
    atencao_moderada: {
        label: 'Atenção moderada',
        color: '#E8A317',
        bgColor: '#FEF3C7',
        textColor: '#92400E',
    },
    bom_desempenho: {
        label: 'Bom desempenho',
        color: '#3970B7',
        bgColor: '#DBEAFE',
        textColor: '#1E40AF',
    },
    desempenho_forte: {
        label: 'Desempenho forte',
        color: '#22C55E',
        bgColor: '#DCFCE7',
        textColor: '#166534',
    },
};

function getStatusStyle(statusLabel) {
    return statusStyles[statusLabel] || {
        label: 'Indicador',
        color: '#6B7280',
        bgColor: '#F3F4F6',
        textColor: '#374151',
    };
}

function formatKpiValue(value) {
    const parsedValue = Number(value);

    if (!Number.isFinite(parsedValue)) {
        return '--/10';
    }

    return `${parsedValue.toFixed(1)}/10`;
}

export function KpiCard({
    title,
    value,
    statusLabel,
    description,
    helperText,
    recordsCovered,
    loading,
    message,
    icon,
}) {
    const statusStyle = getStatusStyle(statusLabel);

    return (
        <View style={[styles.card, { borderLeftColor: statusStyle.color }]}>
            <View style={styles.content}>
                <View style={styles.headerRow}>
                    <Text style={styles.subtitle}>{title}</Text>
                    {!loading && !message ? (
                        <View style={[styles.badge, { backgroundColor: statusStyle.bgColor }]}>
                            <Text style={[styles.badgeText, { color: statusStyle.textColor }]}>
                                {statusStyle.label}
                            </Text>
                        </View>
                    ) : null}
                </View>

                {loading ? (
                    <View style={styles.stateRow}>
                        <ActivityIndicator size="small" color="#3970B7" />
                        <Text style={styles.stateText}>Carregando KPI...</Text>
                    </View>
                ) : message ? (
                    <Text style={styles.messageText}>{message}</Text>
                ) : (
                    <>
                        <Text style={styles.title}>{formatKpiValue(value)}</Text>
                        {description ? <Text style={styles.description}>{description}</Text> : null}
                        {helperText ? <Text style={styles.helperText}>{helperText}</Text> : null}
                        {recordsCovered ? (
                            <Text style={styles.metaText}>
                                {Number(recordsCovered).toLocaleString('pt-BR')} registros analisados
                            </Text>
                        ) : null}
                    </>
                )}
            </View>

            {icon ? (
                <View style={[styles.iconContainer, { backgroundColor: statusStyle.bgColor }]}>
                    {icon}
                </View>
            ) : null}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: 'white',
        borderRadius: 12,
        borderLeftWidth: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 1,
        elevation: 1,
        paddingHorizontal: 20,
        paddingVertical: 16,
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 16,
    },
    content: {
        flex: 1,
        marginRight: 16,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 8,
        marginBottom: 6,
    },
    subtitle: {
        flex: 1,
        fontSize: 14,
        color: '#6B7280',
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#111827',
        marginTop: 2,
    },
    description: {
        color: '#1F2937',
        fontSize: 14,
        fontWeight: '600',
        marginTop: 6,
    },
    helperText: {
        color: '#6B7280',
        fontSize: 13,
        marginTop: 2,
    },
    metaText: {
        color: '#9CA3AF',
        fontSize: 11,
        marginTop: 8,
    },
    badge: {
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderRadius: 12,
    },
    badgeText: {
        fontSize: 11,
        fontWeight: '700',
    },
    iconContainer: {
        padding: 8,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        width: 48,
        height: 48,
    },
    stateRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 12,
    },
    stateText: {
        color: '#6B7280',
        fontSize: 14,
    },
    messageText: {
        color: '#6B7280',
        fontSize: 14,
        lineHeight: 20,
        marginTop: 8,
    },
});
