import React from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const DIST_COLORS = [
    '#3970B7', '#FECB0A', '#34D399', '#F87171',
    '#A78BFA', '#FB923C', '#38BDF8', '#E879F9',
    '#10B981', '#EF4444', '#6366F1', '#F59E0B',
    '#14B8A6', '#EC4899',
];

export function GraphCard({ title, data = [], type = 'bar', options = {}, color }) {
    const screenWidth = Dimensions.get('window').width;
    const cardWidth = screenWidth - 48;

    // Normalize chart type (doughnut/pie → horizontal bars)
    const chartType = (type === 'doughnut' || type === 'pie') ? 'distribution' : type;

    // Data mapping logic
    let labels = [], values = [];
    if (Array.isArray(data)) {
        labels = data.map(d => d.label);
        values = data.map(d => d.value);
    } else if (data.labels && data.datasets) {
        labels = data.labels;
        values = data.datasets[0]?.data || [];
    }

    // Guard: if no data, show placeholder
    if (!values.length || values.every(v => v === 0)) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>{title}</Text>
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>Sem dados disponíveis</Text>
                </View>
            </View>
        );
    }

    // Truncate long label list for bar charts
    const truncate = (lbl, max) => lbl.length > max ? lbl.substring(0, max) : lbl;
    const manyLabels = labels.length > 7;
    const displayLabels = manyLabels
        ? labels.map(l => truncate(l, 3))
        : labels.map(l => truncate(l, 8));

    const chartConfig = {
        backgroundColor: '#ffffff',
        backgroundGradientFrom: '#ffffff',
        backgroundGradientTo: '#ffffff',
        decimalPlaces: 0,
        color: (opacity = 1) => color || `rgba(57, 112, 183, ${opacity})`,
        labelColor: () => '#6B7280',
        style: { borderRadius: 12 },
        propsForBackgroundLines: {
            strokeDasharray: '',
            stroke: '#E5E7EB',
            strokeWidth: 1,
        },
    };

    const chartData = {
        labels: displayLabels,
        datasets: [{
            data: values,
            strokeWidth: 2,
        }],
    };

    // --- Custom Bar Chart (works on web) ---
    const renderBarChart = () => {
        const maxValue = Math.max(...values, 1);
        const barColor = color || '#3970B7';
        const chartHeight = 180;
        return (
            <View style={{ width: '100%' }}>
                <View style={{ flexDirection: 'row', alignItems: 'flex-end', height: chartHeight, paddingHorizontal: 4 }}>
                    {values.map((val, i) => {
                        const barHeight = maxValue > 0 ? (val / maxValue) * (chartHeight - 30) : 0;
                        return (
                            <View key={i} style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end' }}>
                                <Text style={{ fontSize: 11, fontWeight: '600', color: '#374151', marginBottom: 4 }}>
                                    {Math.round(val)}
                                </Text>
                                <View style={{
                                    width: '60%',
                                    height: Math.max(barHeight, 4),
                                    backgroundColor: barColor,
                                    borderTopLeftRadius: 4,
                                    borderTopRightRadius: 4,
                                }} />
                            </View>
                        );
                    })}
                </View>
                <View style={{ flexDirection: 'row', paddingHorizontal: 4, marginTop: 8 }}>
                    {displayLabels.map((lbl, i) => (
                        <View key={i} style={{ flex: 1, alignItems: 'center' }}>
                            <Text style={{ fontSize: 10, color: '#6B7280', textAlign: 'center' }} numberOfLines={1}>
                                {lbl}
                            </Text>
                        </View>
                    ))}
                </View>
            </View>
        );
    };

    // --- Distribution chart (replaces pie) ---
    const renderDistribution = () => {
        // Sort by value descending
        const indexed = values.map((v, i) => ({ label: labels[i], value: v, i }));
        indexed.sort((a, b) => b.value - a.value);
        const sortedLabels = indexed.map(x => x.label);
        const sortedValues = indexed.map(x => x.value);
        const total = sortedValues.reduce((a, b) => a + b, 0);
        return (
            <View style={styles.distributionContainer}>
                {/* Stacked bar */}
                <View style={styles.stackedBar}>
                    {sortedValues.map((val, i) => {
                        const pct = total > 0 ? (val / total) * 100 : 0;
                        if (pct < 1) return null;
                        return (
                            <View
                                key={i}
                                style={{
                                    flex: pct,
                                    backgroundColor: DIST_COLORS[i % DIST_COLORS.length],
                                    height: 14,
                                    borderTopLeftRadius: i === 0 ? 7 : 0,
                                    borderBottomLeftRadius: i === 0 ? 7 : 0,
                                    borderTopRightRadius: i === sortedValues.length - 1 ? 7 : 0,
                                    borderBottomRightRadius: i === sortedValues.length - 1 ? 7 : 0,
                                }}
                            />
                        );
                    })}
                </View>
                {/* Legend items */}
                {sortedLabels.map((label, i) => {
                    const pct = total > 0 ? ((sortedValues[i] / total) * 100).toFixed(1) : '0';
                    return (
                        <View key={i} style={styles.distRow}>
                            <View style={styles.distLeft}>
                                <View style={[styles.distDot, { backgroundColor: DIST_COLORS[i % DIST_COLORS.length] }]} />
                                <Text style={styles.distLabel} numberOfLines={1}>{label}</Text>
                            </View>
                            <View style={styles.distRight}>
                                <Text style={styles.distPct}>{pct}%</Text>
                            </View>
                        </View>
                    );
                })}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>

            <View style={styles.chartContainer}>
                {chartType === 'bar' && renderBarChart()}

                {chartType === 'line' && (
                    <LineChart
                        data={chartData}
                        width={cardWidth}
                        height={220}
                        chartConfig={chartConfig}
                        bezier
                        style={styles.chart}
                    />
                )}

                {chartType === 'distribution' && renderDistribution()}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 3,
        elevation: 2,
        marginBottom: 16,
    },
    title: {
        fontSize: 15,
        fontWeight: '700',
        marginBottom: 12,
        color: '#1F2937',
    },
    chartContainer: {
        alignItems: 'center',
        overflow: 'hidden',
        borderRadius: 8,
    },
    chart: {
        borderRadius: 8,
        marginLeft: -16,
    },
    emptyContainer: {
        height: 120,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        color: '#9CA3AF',
        fontSize: 14,
    },
    // Distribution (replaces pie)
    distributionContainer: {
        width: '100%',
        paddingHorizontal: 4,
    },
    stackedBar: {
        flexDirection: 'row',
        height: 14,
        borderRadius: 7,
        overflow: 'hidden',
        marginBottom: 16,
    },
    distRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 6,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    distLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    distDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: 10,
    },
    distLabel: {
        fontSize: 13,
        color: '#374151',
        flex: 1,
    },
    distRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    distValue: {
        fontSize: 13,
        fontWeight: '700',
        color: '#1F2937',
        minWidth: 30,
        textAlign: 'right',
    },
    distPct: {
        fontSize: 12,
        color: '#9CA3AF',
        minWidth: 42,
        textAlign: 'right',
    },
});
