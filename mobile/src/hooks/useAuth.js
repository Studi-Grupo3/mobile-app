import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useAuth = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadAuth = async () => {
            try {
                const token = await AsyncStorage.getItem('authToken');
                const userId = await AsyncStorage.getItem('userId');
                const role = await AsyncStorage.getItem('userRole');

                if (token && userId && role) {
                    setUser({ token, userId, role });
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error('Error loading auth:', error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        loadAuth();
    }, []);

    return { user, loading };
};
