import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator, NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import DashboardScreen from '../screens/DashboardScreen';
import SkillsScreen from '../screens/SkillsScreen';
import AddSkillScreen from '../screens/AddSkillScreen';
import PracticesScreen from '../screens/PracticesScreen';
import AddPracticeScreen from '../screens/AddPracticeScreen';
import AddAssessmentScreen from '../screens/AddAssessmentScreen';
import AnalyticsScreen from '../screens/AnalyticsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { COLORS } from '../utils/constants';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const stackScreenOptions: NativeStackNavigationOptions = {
  headerShown: true,
  headerStyle: { backgroundColor: COLORS.background },
  headerTintColor: COLORS.textDark,
  headerTitleStyle: { color: COLORS.textDark, fontWeight: 'bold', fontSize: 18 },
  headerShadowVisible: false,
  contentStyle: { backgroundColor: COLORS.background },
};

const SkillsNavigator = () => (
  <Stack.Navigator screenOptions={stackScreenOptions}>
    <Stack.Screen name="SkillsHome" component={SkillsScreen} options={{ title: 'Minhas Habilidades' }} />
    <Stack.Screen name="AddSkill" component={AddSkillScreen} options={{ title: 'Habilidade' }} />
  </Stack.Navigator>
);

const PracticesNavigator = () => (
  <Stack.Navigator screenOptions={stackScreenOptions}>
    <Stack.Screen name="PracticesHome" component={PracticesScreen} options={{ title: 'Praticas' }} />
    <Stack.Screen name="AddPractice" component={AddPracticeScreen} options={{ title: 'Registrar Pratica' }} />
    <Stack.Screen name="AddAssessment" component={AddAssessmentScreen} options={{ title: 'Autoavaliacao' }} />
  </Stack.Navigator>
);

const DashboardNavigator = () => (
  <Stack.Navigator screenOptions={stackScreenOptions}>
    <Stack.Screen name="DashboardHome" component={DashboardScreen} options={{ title: 'Dashboard' }} />
  </Stack.Navigator>
);

const AnalyticsNavigator = () => (
  <Stack.Navigator screenOptions={stackScreenOptions}>
    <Stack.Screen name="AnalyticsHome" component={AnalyticsScreen} options={{ title: 'Analytics' }} />
  </Stack.Navigator>
);

const ProfileNavigator = () => (
  <Stack.Navigator screenOptions={stackScreenOptions}>
    <Stack.Screen name="ProfileHome" component={ProfileScreen} options={{ title: 'Perfil' }} />
  </Stack.Navigator>
);

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

const iconMap: Record<string, IoniconsName> = {
  Dashboard: 'home',
  Skills: 'barbell',
  Practices: 'checkbox-outline',
  Analytics: 'analytics',
  Profile: 'person',
};

const AppNavigator: React.FC = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarActiveTintColor: COLORS.primary,
      tabBarInactiveTintColor: COLORS.textLight,
      tabBarStyle: {
        backgroundColor: COLORS.card,
        borderTopColor: COLORS.border,
        borderTopWidth: 1,
        height: 60,
        paddingBottom: 8,
        paddingTop: 8,
      },
      tabBarLabelStyle: { fontSize: 12, fontWeight: '600' },
      tabBarIcon: ({ color, size }) => {
        const iconName = iconMap[route.name as keyof typeof iconMap];
        return <Ionicons name={iconName} size={size} color={color} />;
      },
    })}
  >
    <Tab.Screen name="Dashboard" component={DashboardNavigator} options={{ title: 'Dashboard' }} />
    <Tab.Screen name="Skills" component={SkillsNavigator} options={{ title: 'Habilidades' }} />
    <Tab.Screen name="Practices" component={PracticesNavigator} options={{ title: 'Praticas' }} />
    <Tab.Screen name="Analytics" component={AnalyticsNavigator} options={{ title: 'Analytics' }} />
    <Tab.Screen name="Profile" component={ProfileNavigator} options={{ title: 'Perfil' }} />
  </Tab.Navigator>
);

export default AppNavigator;
