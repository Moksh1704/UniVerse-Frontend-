import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, ActivityIndicator } from 'react-native';

import { useAuth } from '../hooks/useAuth';
import { Colors } from '../utils/theme';

// Auth screens
import IntroAnimationScreen  from '../screens/auth/IntroAnimationScreen';
import RoleSelectionScreen   from '../screens/auth/RoleSelectionScreen';
import StudentRegisterScreen from '../screens/auth/StudentRegisterScreen';
import FacultyRegisterScreen from '../screens/auth/FacultyRegisterScreen';
import LoginScreen           from '../screens/auth/LoginScreen';

// Tab navigators
import StudentTabNavigator from './StudentNavigator';
import FacultyTabNavigator from './FacultyNavigator';

const Stack = createNativeStackNavigator();

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
      <Stack.Screen name="Intro"           component={IntroAnimationScreen} />
      <Stack.Screen name="GetStarted"      component={RoleSelectionScreen} />
      <Stack.Screen name="RoleSelection"   component={RoleSelectionScreen} />
      <Stack.Screen name="StudentRegister" component={StudentRegisterScreen} options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="FacultyRegister" component={FacultyRegisterScreen} options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="Login"           component={LoginScreen} options={{ animation: 'slide_from_bottom' }} />
    </Stack.Navigator>
  );
}

function StudentStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="StudentMain" component={StudentTabNavigator} />
    </Stack.Navigator>
  );
}

function FacultyStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="FacultyMain" component={FacultyTabNavigator} />
    </Stack.Navigator>
  );
}

export default function RootNavigator() {
  const { user, token, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.primary }}>
        <ActivityIndicator size="large" color={Colors.accent} />
      </View>
    );
  }

  const isLoggedIn = !!token && !!user;

  return (
    <NavigationContainer>
      {!isLoggedIn ? (
        <AuthStack />
      ) : user.role === 'faculty' ? (
        <FacultyStack />
      ) : (
        <StudentStack />
      )}
    </NavigationContainer>
  );
}
