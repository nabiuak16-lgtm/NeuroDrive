import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import { AppProvider, useApp } from './src/context/AppContext';
import { I18nProvider } from './src/i18n/I18nContext';
import { AppNavigator } from './src/navigation/AppNavigator';
import { SplashScreen } from './src/components/SplashScreen';
import { EmergencyModal } from './src/components/EmergencyModal';
import { BreathingExercise } from './src/components/BreathingExercise';
import { colors } from './src/theme/colors';

function AppContent() {
  const { showSplash, showBreathing, closeBreathing } = useApp();

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <>
      <AppNavigator />
      <EmergencyModal />
      <BreathingExercise visible={showBreathing} onClose={closeBreathing} />
      <StatusBar style="light" />
    </>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <I18nProvider>
        <AppProvider>
          <AppContent />
        </AppProvider>
      </I18nProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
