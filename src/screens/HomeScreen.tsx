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
import { useStudyStore } from '../store/studyStore';

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
  const { logout, session } = useAuth();
  const materials = useStudyStore((state) => state.materials);
  const fetchMaterials = useStudyStore((state) => state.fetchMaterials);

  // Fetch materials when session is available
  useEffect(() => {
    if (session) {
      fetchMaterials();
    }
  }, [session, fetchMaterials]);

  // Helper: relative time string
  const timeAgo = (ts: number) => {
    const diff = Date.now() - ts;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins} min ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days === 1) return 'Yesterday';
    return `${days} days ago`;
  };

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

  // Calculate which days of this week had study activity
  const getWeekDays = () => {
    const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0=Sun
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - dayOfWeek + 1); // Monday
    startOfWeek.setHours(0, 0, 0, 0);

    // For each day Mon-Sun, check if any material was created on that day
    return ['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((name, i) => {
      const dayStart = new Date(startOfWeek);
      dayStart.setDate(startOfWeek.getDate() + i);
      const dayEnd = new Date(dayStart);
      dayEnd.setDate(dayStart.getDate() + 1);

      const active = materials.some(m => {
        const d = new Date(m.createdAt);
        return d >= dayStart && d < dayEnd;
      });
      return { name, active };
    });
  };

  const days = getWeekDays();

  // Calculate streak (consecutive days with at least 1 material, ending today or yesterday)
  const calculateStreak = () => {
    if (materials.length === 0) return 0;
    const uniqueDays = new Set(
      materials.map(m => {
        const d = new Date(m.createdAt);
        return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      })
    );
    let streak = 0;
    const check = new Date();
    check.setHours(0, 0, 0, 0);
    // Check if today has activity, if not start from yesterday
    const todayKey = `${check.getFullYear()}-${check.getMonth()}-${check.getDate()}`;
    if (!uniqueDays.has(todayKey)) {
      check.setDate(check.getDate() - 1);
    }
    while (true) {
      const key = `${check.getFullYear()}-${check.getMonth()}-${check.getDate()}`;
      if (uniqueDays.has(key)) {
        streak++;
        check.setDate(check.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  };

  const streakCount = calculateStreak();
  const streakProgress = Math.min(streakCount / 7 * 100, 100); // progress out of 7 day goal

  // User's first name
  const userName = session?.user?.user_metadata?.full_name?.split(' ')[0] || 'Student';

  const quickActions = [
    { title: t('home.scanNotes'), icon: Camera, color: '#22C55E', bg: isDarkMode ? 'rgba(34,197,94,0.15)' : '#ECFDF5', route: 'Scan' },
    { title: t('home.generateFlashcards'), icon: Layers, color: '#6366F1', bg: isDarkMode ? 'rgba(99,102,241,0.15)' : '#EEF2FF', route: 'Generate' },
    { title: t('home.quizMe'), icon: HelpCircle, color: '#3B82F6', bg: isDarkMode ? 'rgba(59,130,246,0.15)' : '#EFF6FF', route: 'Quiz' },
    { title: t('home.summarizeText'), icon: FileText, color: '#F97316', bg: isDarkMode ? 'rgba(249,115,22,0.15)' : '#FFF7ED', route: 'Summary' },
  ];

  const recentMaterials = materials.slice(0, 5);

  const typeConfig: Record<string, { icon: any; color: string }> = {
    'Flashcards': { icon: Layers, color: '#6366F1' },
    'Quiz': { icon: HelpCircle, color: '#3B82F6' },
    'Summary': { icon: FileText, color: '#F59E0B' },
    'Mind Map': { icon: TrendingUp, color: '#22C55E' },
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 10, backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View style={[styles.header, { opacity: headerFade, transform: [{ translateY: headerSlide }] }]}>
          <View>
            <Text style={[styles.greeting, { color: colors.text }]}>Hi, {userName}</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{t('home.subtitle')}</Text>
          </View>
          <View style={[styles.streakBadge, { backgroundColor: isDarkMode ? 'rgba(245,158,11,0.15)' : '#FFF8EB' }]}>
            <Flame color="#F59E0B" fill="#F59E0B" size={16} />
            <Text style={styles.streakBadgeText}>{streakCount}</Text>
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
              <Text style={[styles.streakDays, { color: colors.text }]}>{streakCount} <Text style={[styles.streakDaysUnit, { color: colors.textSecondary }]}>{t('home.days')}</Text></Text>
              <Text style={[styles.streakMotivation, { color: colors.textSecondary }]}>{streakCount > 0 ? t('home.keepItUp') : 'Start studying to build a streak!'}</Text>
            </View>
            <AnimatedCircularProgress progress={streakProgress} size={72} strokeWidth={7} />
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
                    } else if (action.route === 'Quiz' || action.route === 'Summary') {
                      navigation.navigate('Generate');
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

          {recentMaterials.length === 0 ? (
            <View style={[styles.emptyState, {
              backgroundColor: isDarkMode ? colors.surface : '#FFFFFF',
              borderColor: isDarkMode ? colors.border : '#F3F4F6',
            }]}>
              <BookOpen color={colors.textSecondary} size={32} />
              <Text style={[styles.emptyTitle, { color: colors.text }]}>No study materials yet</Text>
              <Text style={[styles.emptySub, { color: colors.textSecondary }]}>Scan some notes or upload a PDF to get started!</Text>
            </View>
          ) : (
            recentMaterials.map((material) => {
              const config = typeConfig[material.type] || { icon: BookOpen, color: '#6366F1' };
              const MaterialIcon = config.icon;
              const itemCount = Array.isArray(material.data) ? `${material.data.length} items` : material.type;
              return (
                <TouchableOpacity
                  key={material.id}
                  style={[styles.sessionCard, {
                    backgroundColor: isDarkMode ? colors.surface : '#FFFFFF',
                    borderColor: isDarkMode ? colors.border : '#F3F4F6',
                  }]}
                  activeOpacity={0.7}
                  onPress={() => {
                    if (material.type === 'Flashcards') navigation.navigate('FlashCards', { data: material.data });
                    else if (material.type === 'Quiz') navigation.navigate('Quiz', { data: material.data });
                    else if (material.type === 'Summary') navigation.navigate('Summary', { data: material.data });
                    else if (material.type === 'Mind Map') navigation.navigate('MindMap', { data: material.data });
                  }}
                >
                  <View style={[styles.sessionIconBox, { backgroundColor: isDarkMode ? `${config.color}20` : `${config.color}10` }]}>
                    <MaterialIcon color={config.color} size={20} />
                  </View>
                  <View style={styles.sessionInfo}>
                    <Text style={[styles.sessionTitle, { color: colors.text }]} numberOfLines={1}>{material.title}</Text>
                    <Text style={[styles.sessionSubtitle, { color: colors.textSecondary }]}>{itemCount} • {timeAgo(material.createdAt)}</Text>
                  </View>
                  <ChevronRight color={colors.border} size={18} />
                </TouchableOpacity>
              );
            })
          )}
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

  // Empty State
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    borderRadius: 16,
    borderWidth: 1,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 12,
    marginBottom: 4,
  },
  emptySub: {
    fontSize: 13,
    textAlign: 'center',
    paddingHorizontal: 30,
  },
});
