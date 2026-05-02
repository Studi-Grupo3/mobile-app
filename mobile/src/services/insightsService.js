import axios from 'axios';
import Constants from 'expo-constants';

const INSIGHTS_URL =
    Constants.expoConfig?.extra?.INSIGHTS_URL || 'http://localhost:5001';

const insightsApi = axios.create({
    baseURL: INSIGHTS_URL,
    timeout: 90000, // 90s — geração de IA pode demorar
    headers: { 'Content-Type': 'application/json' },
});

export const insightsService = {
    async generateInsights() {
        const response = await insightsApi.post('/insights');
        return response.data; // { insights: string, generated_at: string }
    },
};
