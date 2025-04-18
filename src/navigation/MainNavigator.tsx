import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import TaskScreen from '../screens/TaskScreen';

export type RootStackParamList = {
  Login: undefined;
  Tasks: undefined;
  ForgotPassword: undefined;
  SignUp: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const MainNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Login">
      {/* Pantallas deben ser los únicos hijos directos */}
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Tasks"
        component={TaskScreen}
        options={{ headerShown: false }}
      />
      {/* Otras pantallas... */}
    </Stack.Navigator>
  );
};

export default MainNavigator;