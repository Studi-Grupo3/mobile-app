import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { GenericScreen } from '../components/common/GenericScreen';
import StudentInitialPage from '../pages/student/StudentInitialPage';
import AppointmentManagerPage from '../pages/student/AppointmentManagerPage';
import { Home, Calendar, CreditCard, User } from 'lucide-react-native';

const Tab = createBottomTabNavigator();

export function StudentTabs() {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: '#3970B7',
                tabBarInactiveTintColor: 'gray',
            }}
        >
            <Tab.Screen
                name="Dashboard"
                component={StudentInitialPage}
                options={{
                    tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
                    tabBarLabel: 'Início'
                }}
            />
            <Tab.Screen
                name="Appointments"
                component={AppointmentManagerPage}
                options={{
                    tabBarIcon: ({ color, size }) => <Calendar color={color} size={size} />,
                    tabBarLabel: 'Agendamentos'
                }}
            />
            <Tab.Screen
                name="Payments"
                component={GenericScreen}
                options={{
                    tabBarIcon: ({ color, size }) => <CreditCard color={color} size={size} />,
                    tabBarLabel: 'Pagamentos'
                }}
            />
            <Tab.Screen
                name="Profile"
                component={GenericScreen}
                options={{
                    tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
                    tabBarLabel: 'Perfil'
                }}
            />
        </Tab.Navigator>
    );
}
