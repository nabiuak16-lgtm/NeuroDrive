import React from 'react';
import { StyleSheet, Platform } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { TabParamList, RootStackParamList } from './types';
import { useI18n } from '../i18n/I18nContext';

import { HomeScreen } from '../screens/HomeScreen';
import { DriveScreen } from '../screens/DriveScreen';
import { AnalyticsScreen } from '../screens/AnalyticsScreen';
import { HistoryScreen } from '../screens/HistoryScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { TripReportScreen } from '../screens/TripReportScreen';
import { DeviceCenterScreen } from '../screens/DeviceCenterScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { AchievementsScreen } from '../screens/AchievementsScreen';
import { AICoachScreen } from '../screens/AICoachScreen';

const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.background,
    card: colors.backgroundSecondary,
    text: colors.text,
    border: colors.border,
    primary: colors.primary,
  },
};

function TabNavigator() {
  const { t } = useI18n();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarBackground: () =>
          Platform.OS === 'ios' ? (
            <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill} />
          ) : undefined,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: typography.tab,
        tabBarIcon: ({ focused, color, size }) => {
          const icons: Record<string, keyof typeof Ionicons.glyphMap> = {
            Home: focused ? 'home' : 'home-outline',
            Drive: focused ? 'car-sport' : 'car-sport-outline',
            Analytics: focused ? 'bar-chart' : 'bar-chart-outline',
            History: focused ? 'time' : 'time-outline',
            Profile: focused ? 'person' : 'person-outline',
          };
          return <Ionicons name={icons[route.name]} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: t.tabHome }} />
      <Tab.Screen name="Drive" component={DriveScreen} options={{ tabBarLabel: t.tabDrive }} />
      <Tab.Screen name="Analytics" component={AnalyticsScreen} options={{ tabBarLabel: t.tabAnalytics }} />
      <Tab.Screen name="History" component={HistoryScreen} options={{ tabBarLabel: t.tabHistory }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarLabel: t.tabProfile }} />
    </Tab.Navigator>
  );
}

function StackNavigator() {
  const { t } = useI18n();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.backgroundSecondary },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: '600' as const },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.background },
        animation: 'slide_from_right' as const,
      }}
    >
      <Stack.Screen name="MainTabs" component={TabNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="TripReport" component={TripReportScreen} options={{ title: t.tripReport }} />
      <Stack.Screen name="DeviceCenter" component={DeviceCenterScreen} options={{ title: t.deviceCenter }} />
      <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: t.settings }} />
      <Stack.Screen name="Achievements" component={AchievementsScreen} options={{ title: t.achievements }} />
      <Stack.Screen name="AICoach" component={AICoachScreen} options={{ title: t.aiCoach }} />
    </Stack.Navigator>
  );
}

export function AppNavigator() {
  return (
    <NavigationContainer theme={navTheme}>
      <StackNavigator />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    backgroundColor: Platform.OS === 'ios' ? 'transparent' : colors.tabBar,
    borderTopColor: colors.border,
    borderTopWidth: 1,
    height: Platform.OS === 'ios' ? 88 : 68,
    paddingBottom: Platform.OS === 'ios' ? 28 : 8,
    paddingTop: 8,
    elevation: 0,
  },
});
