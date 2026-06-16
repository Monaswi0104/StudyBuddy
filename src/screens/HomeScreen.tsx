import React, { useRef, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, BackHandler, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Flame, Camera, Layers, HelpCircle, FileText, Bot, Check, ChevronRight } from 'lucide-react-native';
import Svg, { Circle } from 'react-native-svg';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/StackNav';
import { Card } from '../components/common/Card';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';

const CircularProgress = ({ progress = 75, size = 60, strokeWidth = 6 }) => {
  const { colors } = useTheme();
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ transform: [{ rotate: '-90deg' }], position: 'absolute' }}>
        <Svg width={size} height={size}>
          <Circle stroke={colors.border} fill="none" cx={size/2} cy={size/2} r={radius} strokeWidth={strokeWidth} />
          <Circle 
            stroke={colors.success} 
            fill="none" 
            cx={size/2} cy={size/2} r={radius} 
            strokeWidth={strokeWidth} 
            strokeDasharray={circumference} 
            strokeDashoffset={strokeDashoffset} 
            strokeLinecap="round" 
          />
        </Svg>
      </View>
      <Flame color={colors.warning} fill={colors.warning} size={24} />
    </View>
  );
};

export const HomeScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { logout } = useAuth();

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        Alert.alert(
          'Logout',
          'Are you sure you want to logout?',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Logout', style: 'destructive', onPress: () => logout() }
          ]
        );
        return true;
      };

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => subscription.remove();
    }, [logout])
  );

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const days = [
    { name: 'Mon', active: true },
    { name: 'Tue', active: true },
    { name: 'Wed', active: true },
    { name: 'Thu', active: true },
    { name: 'Fri', active: true },
    { name: 'Sat', active: true },
    { name: 'Sun', active: true },
  ];

  const recentSessions = [
    { id: '1', title: 'Machine Learning Basics', subtitle: '20 flashcards • 15 min ago', score: '80%' },
    { id: '2', title: 'Neural Networks', subtitle: '25 flashcards • Yesterday', score: '78%' },
    { id: '3', title: 'Data Structures', subtitle: '30 flashcards • 2 days ago', score: '92%' },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top + 10, backgroundColor: colors.background }]}>
      <Animated.ScrollView 
        style={{ flex: 1, opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View>
              <Text style={[styles.greeting, { color: colors.text }]}>{t('home.greeting')}</Text>
              <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{t('home.subtitle')}</Text>
            </View>
          </View>
          <View style={[styles.fireBadge, { backgroundColor: colors.surface }]}>
            <Flame color={colors.warning} fill={colors.warning} size={16} />
            <Text style={[styles.fireBadgeText, { color: colors.warning }]}>7</Text>
          </View>
        </View>

        {/* Streak Card */}
        <Card style={styles.streakCard}>
          <View style={styles.streakTopRow}>
            <View>
              <Text style={[styles.streakTitle, { color: colors.success }]}>{t('home.studyStreak')}</Text>
              <Text style={[styles.streakDays, { color: colors.text }]}>7 {t('home.days')}</Text>
              <Text style={[styles.streakSubtitle, { color: colors.textSecondary }]}>{t('home.keepItUp')}</Text>
            </View>
            <CircularProgress progress={100} size={70} strokeWidth={6} />
          </View>
          
          <View style={styles.daysRow}>
            {days.map((day, index) => (
              <View key={index} style={styles.dayCol}>
                <View style={[styles.dayCircle, { backgroundColor: colors.border }, day.active && { backgroundColor: colors.success }]}>
                  {day.active && <Check color={colors.white} size={14} />}
                </View>
                <Text style={[styles.dayText, { color: colors.textSecondary }]}>{day.name}</Text>
              </View>
            ))}
          </View>
        </Card>

        {/* Quick Actions */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('home.quickActions')}</Text>
        </View>
        <View style={styles.actionsRow}>
          <TouchableOpacity 
            style={styles.actionBtn}
            onPress={() => navigation.navigate('MainTabs', { screen: 'Scan' })}
          >
            <View style={[styles.iconContainer, { backgroundColor: colors.iconBg }]}>
              <Camera color={colors.success} size={24} />
            </View>
            <Text style={[styles.actionText, { color: colors.text }]}>{t('home.scanNotes')}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionBtn}
            onPress={() => navigation.navigate('Generate')}
          >
            <View style={[styles.iconContainer, { backgroundColor: colors.iconBg }]}>
              <Layers color={colors.primary} size={24} />
            </View>
            <Text style={[styles.actionText, { color: colors.text }]}>{t('home.generateFlashcards')}</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionBtn}
            onPress={() => navigation.navigate('Quiz', {})}
          >
            <View style={[styles.iconContainer, { backgroundColor: colors.iconBg }]}>
              <HelpCircle color="#3B82F6" size={24} />
            </View>
            <Text style={[styles.actionText, { color: colors.text }]}>{t('home.quizMe')}</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionBtn}
            onPress={() => navigation.navigate('Summary', {})}
          >
            <View style={[styles.iconContainer, { backgroundColor: colors.iconBg }]}>
              <FileText color="#F97316" size={24} />
            </View>
            <Text style={[styles.actionText, { color: colors.text }]}>{t('home.summarizeText')}</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Sessions */}
        <View style={[styles.sectionHeader, { marginTop: 10 }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('home.recentSessions')}</Text>
          <TouchableOpacity onPress={() => navigation.navigate('MainTabs', { screen: 'Library' })}>
            <Text style={[styles.viewAllText, { color: colors.primary }]}>{t('home.viewAll')}</Text>
          </TouchableOpacity>
        </View>
        
        {recentSessions.map(session => (
          <TouchableOpacity key={session.id} style={[styles.sessionItem, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={[styles.sessionIconBox, { backgroundColor: colors.iconBg }]}>
              <Layers color={colors.primary} size={20} />
            </View>
            <View style={styles.sessionInfo}>
              <Text style={[styles.sessionTitle, { color: colors.text }]}>{session.title}</Text>
              <Text style={[styles.sessionSubtitle, { color: colors.textSecondary }]}>{session.subtitle}</Text>
            </View>
            <Text style={[styles.sessionScore, { color: colors.primary }]}>{session.score}</Text>
          </TouchableOpacity>
        ))}
      </Animated.ScrollView>

      {/* AI Buddy Banner Fixed at Bottom */}
      <View style={[styles.fixedBannerContainer, { backgroundColor: colors.background }]}>
        <TouchableOpacity style={styles.aiBanner} onPress={() => navigation.navigate('Generate')}>
          <View style={styles.aiBannerContent}>
            <View style={styles.aiIconBox}>
              <Bot color={colors.white} size={24} />
            </View>
            <View style={styles.aiBannerTextContainer}>
              <Text style={[styles.aiBannerTitle, { color: colors.white }]}>{t('home.askAiTitle')}</Text>
              <Text style={[styles.aiBannerSubtitle, { color: 'rgba(255,255,255,0.8)' }]}>{t('home.askAiSubtitle')}</Text>
            </View>
          </View>
          <View style={styles.arrowCircle}>
            <ChevronRight color="#7C3AED" size={18} />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greeting: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
  },
  fireBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  fireBadgeText: {
    fontWeight: '700',
    marginLeft: 4,
  },
  streakCard: {
    marginBottom: 24,
    padding: 20,
  },
  streakTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  streakTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  streakDays: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 4,
  },
  streakSubtitle: {
    fontSize: 14,
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayCol: {
    alignItems: 'center',
  },
  dayCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  dayText: {
    fontSize: 12,
    fontWeight: '500',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  actionBtn: {
    alignItems: 'center',
    width: '23%',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  sessionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  sessionIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  sessionInfo: {
    flex: 1,
  },
  sessionTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  sessionSubtitle: {
    fontSize: 13,
  },
  sessionScore: {
    fontSize: 16,
    fontWeight: '700',
  },
  fixedBannerContainer: {
    paddingBottom: 20,
    paddingTop: 10,
    backgroundColor: '#FAFBFC', // Match container background
  },
  aiBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#7C3AED',
    padding: 16,
    borderRadius: 16,
    shadowColor: '#7C3AED',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 5,
  },
  aiBannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  aiIconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  aiBannerTextContainer: {
    justifyContent: 'center',
  },
  aiBannerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 4,
  },
  aiBannerSubtitle: {
    fontSize: 13,
    color: '#E2E8F0',
  },
  arrowCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
