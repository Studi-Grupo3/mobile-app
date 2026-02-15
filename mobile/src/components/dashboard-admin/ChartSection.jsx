import React from 'react';
import { View, StyleSheet } from 'react-native';
import { GraphCard } from './GraphCard';

export function ChartSection({ charts = [] }) {
    return (
        <View style={styles.container}>
            {charts.map((chart, index) => (
                <GraphCard
                    key={index}
                    title={chart.title}
                    type={chart.type}
                    data={chart.data}
                    options={chart.options}
                    color={chart.color}
                />
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        gap: 16,
    },
});
