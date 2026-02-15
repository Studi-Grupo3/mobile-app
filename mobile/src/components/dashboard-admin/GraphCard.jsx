import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { BarChart, LineChart, PieChart } from 'react-native-chart-kit';

export function GraphCard({ title, data = [], type = 'bar', options = {}, color }) {
    const screenWidth = Dimensions.get('window').width;
    const cardWidth = screenWidth - 48; // Padding correction

    const defaultColors = [
        'rgba(75, 192, 192, 1)',
        'rgba(255, 99, 132, 1)',
        'rgba(255, 205, 86, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(201, 203, 207, 1)'
    ];

    // Data mapping logic
    let labels = [], values = [];
    if (Array.isArray(data)) {
        // [{label: 'Jan', value: 10}]
        labels = data.map(d => d.label);
        values = data.map(d => d.value);
    } else if (data.labels && data.datasets) {
        // ChartJS structure
        labels = data.labels;
        values = data.datasets[0]?.data || [];
    }

    const chartConfig = {
        backgroundColor: '#ffffff',
        backgroundGradientFrom: '#ffffff',
        backgroundGradientTo: '#ffffff',
        decimalPlaces: 0,
        color: (opacity = 1) => color || `rgba(54, 162, 235, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        style: {
            borderRadius: 16
        },
        propsForDots: {
            r: "6",
            strokeWidth: "2",
            stroke: "#ffa726"
        }
    };

    const chartData = {
        labels: labels,
        datasets: [
            {
                data: values,
                color: (opacity = 1) => color || `rgba(54, 162, 235, ${opacity})`,
                strokeWidth: 2
            }
        ],
        legend: [title]
    };

    // Pie chart data structure is different for RN Chart Kit
    const pieData = labels.map((label, index) => ({
        name: label,
        population: values[index],
        color: defaultColors[index % defaultColors.length],
        legendFontColor: "#7F7F7F",
        legendFontSize: 12
    }));

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>

            <View style={styles.chartContainer}>
                {type === 'bar' && (
                    <BarChart
                        data={chartData}
                        width={cardWidth}
                        height={220}
                        yAxisLabel=""
                        chartConfig={chartConfig}
                        verticalLabelRotation={30}
                        fromZero
                        showValuesOnTopOfBars
                    />
                )}

                {type === 'line' && (
                    <LineChart
                        data={chartData}
                        width={cardWidth}
                        height={220}
                        chartConfig={chartConfig}
                        bezier
                    />
                )}

                {type === 'pie' && (
                    <PieChart
                        data={pieData}
                        width={cardWidth}
                        height={220}
                        chartConfig={chartConfig}
                        accessor={"population"}
                        backgroundColor={"transparent"}
                        paddingLeft={"15"}
                        absolute
                    />
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 1,
        elevation: 1,
        marginBottom: 16,
    },
    title: {
        fontSize: 18, // text-lg
        fontWeight: '600',
        marginBottom: 16,
        color: '#1F2937', // gray-800
    },
    chartContainer: {
        alignItems: 'center',
    },
});
