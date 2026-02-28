import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TeacherInitialPage from '../pages/teacher/TeacherInitialPage';
import TeacherClassesPage from '../pages/teacher/TeacherClassesPage';
import TeacherGraph from '../pages/teacher/TeacherGraph';
import ProfilePage from '../pages/common/ProfilePage';
import { Home, BookOpen, BarChart2, User } from 'lucide-react-native';

const Tab = createBottomTabNavigator();

export function TeacherTabs() {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: '#FECB0A',
                tabBarInactiveTintColor: '#8BADD4',
                tabBarStyle: {
                    backgroundColor: '#3970B7',
                    borderTopWidth: 0,
                    height: 62,
                    paddingBottom: 8,
                    paddingTop: 6,
                    elevation: 12,
                    shadowColor: '#1E3A5F',
                    shadowOffset: { width: 0, height: -4 },
                    shadowOpacity: 0.15,
                    shadowRadius: 12,
                },
                tabBarLabelStyle: {
                    fontSize: 11,
                    fontWeight: '600',
                },
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
                name="Metrics"
                component={TeacherGraph}
                options={{
                    tabBarIcon: ({ color, size }) => <BarChart2 color={color} size={size} />,
                    tabBarLabel: 'Métricas'
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
