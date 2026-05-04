import { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadAuth = async () => {
            try {
                const token = await AsyncStorage.getItem('authToken');
                const userId = await AsyncStorage.getItem('userId');
                const role = await AsyncStorage.getItem('userRole');
                const name = await AsyncStorage.getItem('userName');
                const email = await AsyncStorage.getItem('userEmail');

                if (token && userId && role) {
                    setUser({ token, userId, role, name, email });
                }
            } catch (error) {
                console.error('Error loading auth state:', error);
            } finally {
                setLoading(false);
            }
        };

        loadAuth();
    }, []);

    const login = async (userData) => {
        setUser(userData);
        await AsyncStorage.setItem('authToken', userData.token);
        await AsyncStorage.setItem('userId', String(userData.userId));
        await AsyncStorage.setItem('userRole', userData.role);
        if (userData.name) await AsyncStorage.setItem('userName', userData.name);
        if (userData.email) await AsyncStorage.setItem('userEmail', userData.email);
    };

    const logout = async () => {
        await AsyncStorage.clear();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
