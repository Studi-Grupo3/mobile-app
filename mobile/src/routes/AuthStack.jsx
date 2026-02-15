import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import EmailVerificationPage from '../pages/EmailVerificationPage';
import HomePage from '../pages/HomePage';

const Stack = createStackNavigator();

export function AuthStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Home">
            <Stack.Screen name="Home" component={HomePage} />
            <Stack.Screen name="Login" component={LoginPage} />
            <Stack.Screen name="Register" component={RegisterPage} />
            <Stack.Screen name="ForgotPassword" component={EmailVerificationPage} />
        </Stack.Navigator>
    );
}
