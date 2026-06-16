import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BottomTabNav } from './BottomTabNav';
import { FlashCardScreen } from '../screens/FlashCardScreen';
import { QuizScreen } from '../screens/QuizScreen';
import { SummaryScreen } from '../screens/SummaryScreen';
import { ProcessingScreen } from '../screens/ProcessingScreen';
import { GenerateScreen } from '../screens/GenerateScreen';
import { QuizResultScreen } from '../screens/QuizResultScreen';
import { MindMapScreen } from '../screens/MindMapScreen';
import { StudyGoalsScreen } from '../screens/StudyGoalsScreen';
import { StatsScreen } from '../screens/StatsScreen';
import { LibraryScreen } from '../screens/LibraryScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { EditProfileScreen } from '../screens/EditProfileScreen';
import { ChangePasswordScreen } from '../screens/ChangePasswordScreen';
import { LanguageScreen } from '../screens/LanguageScreen';
import { LegalScreen } from '../screens/LegalScreen';

export type RootStackParamList = {
  MainTabs: { screen?: string } | undefined;
  FlashCards: { summaryId?: string };
  Quiz: { summaryId?: string };
  Summary: { summaryId?: string };
  Processing: undefined;
  Generate: { scannedText?: string } | undefined;
  QuizResult: { score?: number };
  MindMap: { summaryId?: string };
  StudyGoals: undefined;
  StatsStack: undefined;
  LibraryStack: undefined;
  Settings: undefined;
  EditProfile: undefined;
  ChangePassword: undefined;
  Language: undefined;
  Legal: { title: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const StackNav = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="MainTabs" component={BottomTabNav} />
      <Stack.Screen name="FlashCards" component={FlashCardScreen} />
      <Stack.Screen name="Quiz" component={QuizScreen} />
      <Stack.Screen name="Summary" component={SummaryScreen} />
      <Stack.Screen name="Processing" component={ProcessingScreen} />
      <Stack.Screen name="Generate" component={GenerateScreen} />
      <Stack.Screen name="QuizResult" component={QuizResultScreen} />
      <Stack.Screen name="MindMap" component={MindMapScreen} />
      <Stack.Screen name="StudyGoals" component={StudyGoalsScreen} />
      <Stack.Screen name="StatsStack" component={StatsScreen} />
      <Stack.Screen name="LibraryStack" component={LibraryScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
      <Stack.Screen name="Language" component={LanguageScreen} />
      <Stack.Screen name="Legal" component={LegalScreen} />
    </Stack.Navigator>
  );
};
