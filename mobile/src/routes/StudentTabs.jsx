import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import StudentInitialPage from '../pages/student/StudentInitialPage';
import AppointmentManagerPage from '../pages/student/AppointmentManagerPage';
import StudentPaymentsPage from '../pages/student/StudentPaymentsPage';
import ProfilePage from '../pages/common/ProfilePage';
import { Home, Calendar, CreditCard, User } from 'lucide-react-native';

const Tab = createBottomTabNavigator();

export function StudentTabs() {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: '#3970B7',
                tabBarInactiveTintColor: '#94A3B8',
                tabBarStyle: {
                    backgroundColor: '#FFFFFF',
                    borderTopWidth: 1,
                    borderTopColor: '#E2E8F0',
                    height: 60,
                    paddingBottom: 8,
                    paddingTop: 6,
                },
                tabBarLabelStyle: {
                    fontSize: 11,
                    fontWeight: '600',
                },
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
                component={StudentPaymentsPage}
                options={{
                    tabBarIcon: ({ color, size }) => <CreditCard color={color} size={size} />,
                    tabBarLabel: 'Pagamentos'
                }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfilePage}
                options={{
                    tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
                    tabBarLabel: 'Perfil'
                }}
            />
        </Tab.Navigator>
    );
}
