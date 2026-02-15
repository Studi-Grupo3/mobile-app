import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { GenericScreen } from '../components/GenericScreen';
import TeacherInitialPage from '../pages/TeacherInitialPage';
import TeacherClassesPage from '../pages/TeacherClassesPage';
import TeacherRequests from '../pages/TeacherRequests';
import TeacherGraph from '../pages/TeacherGraph';
import { Home, BookOpen, Inbox, BarChart2, User } from 'lucide-react-native';

const Tab = createBottomTabNavigator();

export function TeacherTabs() {
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
                component={TeacherInitialPage}
                options={{
                    tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
                    tabBarLabel: 'Início'
                }}
            />
            <Tab.Screen
                name="Classes"
                component={TeacherClassesPage}
                options={{
                    tabBarIcon: ({ color, size }) => <BookOpen color={color} size={size} />,
                    tabBarLabel: 'Aulas'
                }}
            />
            <Tab.Screen
                name="Requests"
                component={TeacherRequests}
                options={{
                    tabBarIcon: ({ color, size }) => <Inbox color={color} size={size} />,
                    tabBarLabel: 'Solicitações'
                }}
            />
            <Tab.Screen
                name="Metrics"
                component={TeacherGraph}
                options={{
                    tabBarIcon: ({ color, size }) => <BarChart2 color={color} size={size} />,
                    tabBarLabel: 'Métricas'
                }}
            />
            {/* Profile / History could be added or nested in Profile */}
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
