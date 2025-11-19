import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import AppNavigator from './src/navigation/AppNavigator';
import { SkillTrackProvider } from './src/context/SkillTrackContext';

export default function App() {
  return (
    <SafeAreaProvider>
      <SkillTrackProvider>
        <NavigationContainer>
          <StatusBar style="light" />
          <AppNavigator />
        </NavigationContainer>
      </SkillTrackProvider>
    </SafeAreaProvider>
  );
}
