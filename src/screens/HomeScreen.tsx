import React, { useRef, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, BackHandler, Alert, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Flame, Camera, Layers, HelpCircle, FileText, Bot, Check, ChevronRight, Zap, BookOpen, TrendingUp, ArrowRight } from 'lucide-react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/StackNav';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const AnimatedCircularProgress = ({ progress = 75, size = 72, strokeWidth = 7 }) => {
  const { colors } = useTheme();
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 1200,
      useNativeDriver: false,
    }).start();
  }, [animatedValue]);

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ transform: [{ rotate: '-90deg' }], position: 'absolute' }}>
        <Svg width={size} height={size}>
          <Defs>
            <LinearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <Stop offset="0%" stopColor="#22C55E" />
              <Stop offset="100%" stopColor="#10B981" />
            </LinearGradient>
          </Defs>
          <Circle stroke={colors.border} fill="none" cx={size/2} cy={size/2} r={radius} strokeWidth={strokeWidth} opacity={0.3} />
          <Circle
            stroke="url(#progressGrad)"
            fill="none"
            cx={size/2} cy={size/2} r={radius}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </Svg>
      </View>
      <View style={{ backgroundColor: 'rgba(245, 158, 11, 0.15)', width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' }}>
        <Flame color="#F59E0B" fill="#F59E0B" size={20} />
      </View>
    </View>
  );
};

export const HomeScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { colors, isDarkMode } = useTheme();
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

  // Staggered animations
  const headerFade = useRef(new Animated.Value(0)).current;
  const headerSlide = useRef(new Animated.Value(20)).current;
  const streakFade = useRef(new Animated.Value(0)).current;
  const streakSlide = useRef(new Animated.Value(30)).current;
  const actionsFade = useRef(new Animated.Value(0)).current;
  const actionsSlide = useRef(new Animated.Value(30)).current;
  const sessionsFade = useRef(new Animated.Value(0)).current;
  const sessionsSlide = useRef(new Animated.Value(30)).current;
  const bannerFade = useRef(new Animated.Value(0)).current;
  const bannerSlide = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    const stagger = (fade: Animated.Value, slide: Animated.Value, delay: number) =>
      Animated.parallel([
        Animated.timing(fade, { toValue: 1, duration: 450, delay, useNativeDriver: true }),
        Animated.timing(slide, { toValue: 0, duration: 450, delay, useNativeDriver: true }),
      ]);

    Animated.parallel([
      stagger(headerFade, headerSlide, 0),
      stagger(streakFade, streakSlide, 100),
      stagger(actionsFade, actionsSlide, 200),
      stagger(sessionsFade, sessionsSlide, 300),
      stagger(bannerFade, bannerSlide, 400),
    ]).start();
  }, [headerFade, headerSlide, streakFade, streakSlide, actionsFade, actionsSlide, sessionsFade, sessionsSlide, bannerFade, bannerSlide]);

  const days = [
    { name: 'M', active: true },
    { name: 'T', active: true },
    { name: 'W', active: true },
    { name: 'T', active: true },
    { name: 'F', active: true },
    { name: 'S', active: true },
    { name: 'S', active: true },
  ];

  const quickActions = [
    { title: t('home.scanNotes'), icon: Camera, color: '#22C55E', bg: isDarkMode ? 'rgba(34,197,94,0.15)' : '#ECFDF5', route: 'Scan' },
    { title: t('home.generateFlashcards'), icon: Layers, color: '#6366F1', bg: isDarkMode ? 'rgba(99,102,241,0.15)' : '#EEF2FF', route: 'Generate' },
    { title: t('home.quizMe'), icon: HelpCircle, color: '#3B82F6', bg: isDarkMode ? 'rgba(59,130,246,0.15)' : '#EFF6FF', route: 'Quiz' },
    { title: t('home.summarizeText'), icon: FileText, color: '#F97316', bg: isDarkMode ? 'rgba(249,115,22,0.15)' : '#FFF7ED', route: 'Summary' },
  ];

  const recentSessions = [
    { id: '1', title: 'Machine Learning Basics', subtitle: '20 flashcards • 15 min ago', score: 80, icon: BookOpen, color: '#6366F1' },
    { id: '2', title: 'Neural Networks', subtitle: '25 flashcards • Yesterday', score: 78, icon: TrendingUp, color: '#3B82F6' },
    { id: '3', title: 'Data Structures', subtitle: '30 flashcards • 2 days ago', score: 92, icon: Zap, color: '#22C55E' },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top + 10, backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View style={[styles.header, { opacity: headerFade, transform: [{ translateY: headerSlide }] }]}>
          <View>
            <Text style={[styles.greeting, { color: colors.text }]}>{t('home.greeting')}</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{t('home.subtitle')}</Text>
          </View>
          <View style={[styles.streakBadge, { backgroundColor: isDarkMode ? 'rgba(245,158,11,0.15)' : '#FFF8EB' }]}>
            <Flame color="#F59E0B" fill="#F59E0B" size={16} />
            <Text style={styles.streakBadgeText}>7</Text>
          </View>
        </Animated.View>

        {/* Streak Card - Premium gradient look */}
        <Animated.View style={[styles.streakCard, {
          backgroundColor: isDarkMode ? colors.surface : '#FFFFFF',
          borderColor: isDarkMode ? colors.border : 'rgba(34,197,94,0.12)',
          opacity: streakFade,
          transform: [{ translateY: streakSlide }],
        }]}>
          {/* Subtle accent stripe at top */}
          <View style={styles.streakAccentStripe} />

          <View style={styles.streakTopRow}>
            <View style={{ flex: 1 }}>
              <View style={styles.streakLabelRow}>
                <View style={[styles.streakDot, { backgroundColor: '#22C55E' }]} />
                <Text style={[styles.streakLabel, { color: colors.success }]}>{t('home.studyStreak')}</Text>
              </View>
              <Text style={[styles.streakDays, { color: colors.text }]}>7 <Text style={[styles.streakDaysUnit, { color: colors.textSecondary }]}>{t('home.days')}</Text></Text>
              <Text style={[styles.streakMotivation, { color: colors.textSecondary }]}>{t('home.keepItUp')}</Text>
            </View>
            <AnimatedCircularProgress progress={100} size={72} strokeWidth={7} />
          </View>

          {/* Days of Week */}
          <View style={[styles.daysRow, { borderTopColor: isDarkMode ? colors.border : '#F3F4F6' }]}>
            {days.map((day, index) => (
              <View key={index} style={styles.dayCol}>
                <View style={[
                  styles.dayCircle,
                  day.active
                    ? { backgroundColor: '#22C55E' }
                    : { backgroundColor: isDarkMode ? colors.surface : '#F3F4F6' }
                ]}>
                  {day.active && <Check color="#FFF" size={12} strokeWidth={3} />}
                </View>
                <Text style={[styles.dayText, { color: day.active ? colors.text : colors.textSecondary }]}>{day.name}</Text>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Quick Actions */}
        <Animated.View style={{ opacity: actionsFade, transform: [{ translateY: actionsSlide }] }}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('home.quickActions')}</Text>
          </View>
          <View style={styles.actionsGrid}>
            {quickActions.map((action, index) => {
              const IconComp = action.icon;
              return (
                <TouchableOpacity
                  key={index}
                  style={[styles.actionCard, {
                    backgroundColor: isDarkMode ? colors.surface : '#FFFFFF',
                    borderColor: isDarkMode ? colors.border : '#F3F4F6',
                  }]}
                  activeOpacity={0.7}
                  onPress={() => {
                    if (action.route === 'Scan') {
                      navigation.navigate('MainTabs', { screen: 'Scan' });
                    } else if (action.route === 'Quiz') {
                      navigation.navigate('Quiz', {});
                    } else if (action.route === 'Summary') {
                      navigation.navigate('Summary', {});
                    } else {
                      navigation.navigate(action.route as any);
                    }
                  }}
                >
                  <View style={[styles.actionIconWrap, { backgroundColor: action.bg }]}>
                    <IconComp color={action.color} size={22} />
                  </View>
                  <Text style={[styles.actionText, { color: colors.text }]} numberOfLines={2}>{action.title}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Animated.View>

        {/* Recent Sessions */}
        <Animated.View style={{ opacity: sessionsFade, transform: [{ translateY: sessionsSlide }] }}>
          <View style={[styles.sectionHeader, { marginTop: 4 }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('home.recentSessions')}</Text>
            <TouchableOpacity
              style={styles.viewAllBtn}
              onPress={() => navigation.navigate('MainTabs', { screen: 'Library' })}
            >
              <Text style={[styles.viewAllText, { color: colors.primary }]}>{t('home.viewAll')}</Text>
              <ChevronRight color={colors.primary} size={16} />
            </TouchableOpacity>
          </View>

          {recentSessions.map((session) => {
            const SessionIcon = session.icon;
            return (
              <TouchableOpacity
                key={session.id}
                style={[styles.sessionCard, {
                  backgroundColor: isDarkMode ? colors.surface : '#FFFFFF',
                  borderColor: isDarkMode ? colors.border : '#F3F4F6',
                }]}
                activeOpacity={0.7}
              >
                <View style={[styles.sessionIconBox, { backgroundColor: isDarkMode ? `${session.color}20` : `${session.color}10` }]}>
                  <SessionIcon color={session.color} size={20} />
                </View>
                <View style={styles.sessionInfo}>
                  <Text style={[styles.sessionTitle, { color: colors.text }]}>{session.title}</Text>
                  <Text style={[styles.sessionSubtitle, { color: colors.textSecondary }]}>{session.subtitle}</Text>
                  {/* Mini progress bar */}
                  <View style={[styles.progressTrack, { backgroundColor: isDarkMode ? colors.border : '#F3F4F6' }]}>
                    <View style={[styles.progressFill, {
                      width: `${session.score}%`,
                      backgroundColor: session.score >= 90 ? '#22C55E' : session.score >= 70 ? '#3B82F6' : '#F59E0B',
                    }]} />
                  </View>
                </View>
                <View style={styles.scoreContainer}>
                  <Text style={[styles.sessionScore, { color: session.score >= 90 ? '#22C55E' : session.score >= 70 ? '#3B82F6' : '#F59E0B' }]}>{session.score}%</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </Animated.View>
      </ScrollView>

      {/* AI Buddy Banner */}
      <Animated.View style={[styles.bannerContainer, {
        backgroundColor: colors.background,
        opacity: bannerFade,
        transform: [{ translateY: bannerSlide }],
      }]}>
        <TouchableOpacity style={styles.aiBanner} onPress={() => navigation.navigate('Generate')} activeOpacity={0.85}>
          <View style={styles.aiBannerLeft}>
            <View style={styles.aiIconBox}>
              <Bot color="#FFF" size={22} />
            </View>
            <View>
              <Text style={styles.aiBannerTitle}>{t('home.askAiTitle')}</Text>
              <Text style={styles.aiBannerSubtitle}>{t('home.askAiSubtitle')}</Text>
            </View>
          </View>
          <View style={styles.aiArrowCircle}>
            <ArrowRight color="#4F46E5" size={18} />
          </View>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 24,
  },
  streakBadgeText: {
    fontWeight: '800',
    fontSize: 16,
    marginLeft: 4,
    color: '#F59E0B',
  },

  // Streak Card
  streakCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#22C55E',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 3,
  },
  streakAccentStripe: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#22C55E',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  streakTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  streakLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  streakDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  streakLabel: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  streakDays: {
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: -1,
    marginBottom: 2,
  },
  streakDaysUnit: {
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0,
  },
  streakMotivation: {
    fontSize: 14,
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    paddingTop: 16,
  },
  dayCol: {
    alignItems: 'center',
    flex: 1,
  },
  dayCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  dayText: {
    fontSize: 11,
    fontWeight: '600',
  },

  // Section header
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  viewAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
    marginRight: 2,
  },

  // Quick Actions - 2x2 grid
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 12,
  },
  actionCard: {
    width: (SCREEN_WIDTH - 52) / 2,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 1,
  },
  actionIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  actionText: {
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
    lineHeight: 18,
  },

  // Session Cards
  sessionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 1,
  },
  sessionIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  sessionInfo: {
    flex: 1,
  },
  sessionTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 3,
  },
  sessionSubtitle: {
    fontSize: 12,
    marginBottom: 8,
  },
  progressTrack: {
    height: 4,
    borderRadius: 2,
    width: '100%',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  scoreContainer: {
    marginLeft: 12,
    alignItems: 'flex-end',
  },
  sessionScore: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.5,
  },

  // AI Banner
  bannerContainer: {
    paddingBottom: 16,
    paddingTop: 8,
  },
  aiBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: 20,
    backgroundColor: '#4F46E5',
    shadowColor: '#4F46E5',
    shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 16,
    elevation: 8,
  },
  aiBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  aiIconBox: {
    width: 46,
    height: 46,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  aiBannerTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 2,
  },
  aiBannerSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.75)',
  },
  aiArrowCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
