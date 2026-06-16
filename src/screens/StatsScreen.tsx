import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronDown, Flame, Clock, Layers, HelpCircle, Target, TrendingUp } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { useStudyStore } from '../store/studyStore';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const StreakRing = ({ size = 80, strokeWidth = 8 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ transform: [{ rotate: '-90deg' }], position: 'absolute' }}>
        <Svg width={size} height={size}>
          <Defs>
            <LinearGradient id="streakGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <Stop offset="0%" stopColor="#F59E0B" />
              <Stop offset="100%" stopColor="#EF4444" />
            </LinearGradient>
          </Defs>
          <Circle stroke="rgba(245,158,11,0.15)" fill="none" cx={size/2} cy={size/2} r={radius} strokeWidth={strokeWidth} />
          <Circle
            stroke="url(#streakGrad)"
            fill="none"
            cx={size/2} cy={size/2} r={radius}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={circumference * 0.0}
            strokeLinecap="round"
          />
        </Svg>
      </View>
      <Flame color="#F59E0B" fill="#F59E0B" size={28} />
    </View>
  );
};

export const StatsScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const { colors, isDarkMode } = useTheme();
  const { t } = useTranslation();
  const materials = useStudyStore((state) => state.materials);

  // Staggered animations
  const headerFade = useRef(new Animated.Value(0)).current;
  const headerSlide = useRef(new Animated.Value(20)).current;
  const streakFade = useRef(new Animated.Value(0)).current;
  const streakSlide = useRef(new Animated.Value(30)).current;
  const gridFade = useRef(new Animated.Value(0)).current;
  const gridSlide = useRef(new Animated.Value(30)).current;
  const chartFade = useRef(new Animated.Value(0)).current;
  const chartSlide = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    const stagger = (fade: Animated.Value, slide: Animated.Value, delay: number) =>
      Animated.parallel([
        Animated.timing(fade, { toValue: 1, duration: 450, delay, useNativeDriver: true }),
        Animated.timing(slide, { toValue: 0, duration: 450, delay, useNativeDriver: true }),
      ]);

    Animated.parallel([
      stagger(headerFade, headerSlide, 0),
      stagger(streakFade, streakSlide, 100),
      stagger(gridFade, gridSlide, 200),
      stagger(chartFade, chartSlide, 300),
    ]).start();
  }, [headerFade, headerSlide, streakFade, streakSlide, gridFade, gridSlide, chartFade, chartSlide]);

  // Calculate dynamic stats
  const totalMaterials = materials.length;
  const totalFlashcards = materials.filter(m => m.type === 'Flashcards').reduce((acc, m) => acc + (Array.isArray(m.data) ? m.data.length : 0), 0);
  const totalQuizzes = materials.filter(m => m.type === 'Quiz').length;
  const totalSummaries = materials.filter(m => m.type === 'Summary').length;

  // Calculate streak
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

  // Count materials created today for trend badges
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayMaterials = materials.filter(m => new Date(m.createdAt) >= today);
  const todayFlashcards = todayMaterials.filter(m => m.type === 'Flashcards').length;
  const todayQuizzes = todayMaterials.filter(m => m.type === 'Quiz').length;
  const todaySummaries = todayMaterials.filter(m => m.type === 'Summary').length;

  const statCards = [
    { id: '1', title: 'Total Materials', value: totalMaterials.toString(), icon: Layers, color: '#8B5CF6', bg: isDarkMode ? 'rgba(139,92,246,0.15)' : '#F5F3FF', trend: todayMaterials.length > 0 ? `+${todayMaterials.length}` : '0' },
    { id: '2', title: 'Flashcards Made', value: totalFlashcards.toString(), icon: Layers, color: '#3B82F6', bg: isDarkMode ? 'rgba(59,130,246,0.15)' : '#EFF6FF', trend: todayFlashcards > 0 ? `+${todayFlashcards}` : '0' },
    { id: '3', title: 'Quizzes Created', value: totalQuizzes.toString(), icon: HelpCircle, color: '#F43F5E', bg: isDarkMode ? 'rgba(244,63,94,0.15)' : '#FFF1F2', trend: todayQuizzes > 0 ? `+${todayQuizzes}` : '0' },
    { id: '4', title: 'Summaries', value: totalSummaries.toString(), icon: Target, color: '#22C55E', bg: isDarkMode ? 'rgba(34,197,94,0.15)' : '#ECFDF5', trend: todaySummaries > 0 ? `+${todaySummaries}` : '0' },
  ];

  // Calculate chart data (Last 7 days of generated materials)
  const chartData = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dayStr = d.toLocaleDateString('en-US', { weekday: 'short' });
    
    // Count materials generated on this day
    const count = materials.filter(m => {
      const mDate = new Date(m.createdAt);
      return mDate.getDate() === d.getDate() && mDate.getMonth() === d.getMonth() && mDate.getFullYear() === d.getFullYear();
    }).length;
    
    return {
      day: dayStr,
      count,
      height: count > 0 ? Math.max(20, Math.min(100, count * 20)) : 10 // scale for height
    };
  });
  
  const avgGenerated = totalMaterials > 0 ? (totalMaterials / 7).toFixed(1) : '0';

  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top + 10, backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: 120 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <Animated.View style={[styles.header, { opacity: headerFade, transform: [{ translateY: headerSlide }] }]}>
        <View>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Statistics</Text>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>Track your progress</Text>
        </View>
        <TouchableOpacity style={[styles.periodBadge, { backgroundColor: isDarkMode ? colors.surface : '#FFFFFF', borderColor: isDarkMode ? colors.border : '#F3F4F6' }]}>
          <Text style={[styles.periodText, { color: colors.text }]}>{t('stats.thisWeek')}</Text>
          <ChevronDown color={colors.textSecondary} size={16} />
        </TouchableOpacity>
      </Animated.View>

      {/* Streak Card */}
      <Animated.View style={[styles.streakCard, {
        backgroundColor: isDarkMode ? colors.surface : '#FFFFFF',
        borderColor: isDarkMode ? colors.border : 'rgba(245,158,11,0.12)',
        opacity: streakFade,
        transform: [{ translateY: streakSlide }],
      }]}>
        <View style={styles.streakAccent} />
        <View style={styles.streakContent}>
          <View style={{ flex: 1 }}>
            <View style={styles.streakLabelRow}>
              <View style={[styles.streakDot, { backgroundColor: '#F59E0B' }]} />
              <Text style={styles.streakLabelText}>{t('home.studyStreak')}</Text>
            </View>
            <Text style={[styles.streakValue, { color: colors.text }]}>{streakCount} <Text style={[styles.streakUnit, { color: colors.textSecondary }]}>{t('home.days')}</Text></Text>
            <Text style={[styles.streakBest, { color: colors.textSecondary }]}>{streakCount > 0 ? 'Keep it going! 🔥' : 'Generate something to start!'}</Text>
          </View>
          <StreakRing />
        </View>
      </Animated.View>

      {/* Stats Grid */}
      <Animated.View style={[styles.grid, { opacity: gridFade, transform: [{ translateY: gridSlide }] }]}>
        {statCards.map((stat) => {
          const StatIcon = stat.icon;
          return (
            <View key={stat.id} style={[styles.gridCard, {
              backgroundColor: isDarkMode ? colors.surface : '#FFFFFF',
              borderColor: isDarkMode ? colors.border : '#F3F4F6',
            }]}>
              <View style={styles.gridCardTop}>
                <View style={[styles.statIconBox, { backgroundColor: stat.bg }]}>
                  <StatIcon color={stat.color} size={18} />
                </View>
                <View style={[styles.trendBadge, { backgroundColor: isDarkMode ? 'rgba(34,197,94,0.15)' : '#ECFDF5' }]}>
                  <TrendingUp color="#22C55E" size={10} />
                  <Text style={styles.trendText}>{stat.trend}</Text>
                </View>
              </View>
              <Text style={[styles.gridValue, { color: colors.text }]}>{stat.value}</Text>
              <Text style={[styles.gridLabel, { color: colors.textSecondary }]}>{stat.title}</Text>
            </View>
          );
        })}
      </Animated.View>

      {/* Chart */}
      <Animated.View style={[styles.chartCard, {
        backgroundColor: isDarkMode ? colors.surface : '#FFFFFF',
        borderColor: isDarkMode ? colors.border : '#F3F4F6',
        opacity: chartFade,
        transform: [{ translateY: chartSlide }],
      }]}>
        <View style={styles.chartAccent} />
        <View style={styles.chartHeader}>
          <Text style={[styles.chartTitle, { color: colors.text }]}>Materials Generated</Text>
          <View style={[styles.avgBadge, { backgroundColor: isDarkMode ? 'rgba(79,70,229,0.15)' : '#EEF2FF' }]}>
            <Text style={[styles.avgText, { color: colors.primary }]}>{avgGenerated} {t('stats.avg')}</Text>
          </View>
        </View>

        <View style={styles.chartBars}>
          {chartData.map((data, index) => {
            const isMax = data.height === 100;
            return (
              <View key={index} style={styles.barCol}>
                <View style={[styles.barTrack, { backgroundColor: isDarkMode ? colors.border : '#F3F4F6' }]}>
                  <View style={[
                    styles.barFill,
                    {
                      height: `${data.height}%`,
                      backgroundColor: isMax ? '#4F46E5' : isDarkMode ? 'rgba(79,70,229,0.5)' : 'rgba(79,70,229,0.3)',
                      borderRadius: 8,
                    },
                  ]} />
                </View>
                <Text style={[styles.barLabel, {
                  color: isMax ? colors.primary : colors.textSecondary,
                  fontWeight: isMax ? '700' : '500',
                }]}>{data.day}</Text>
              </View>
            );
          })}
        </View>
      </Animated.View>
    </ScrollView>
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
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  periodBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1,
    gap: 4,
  },
  periodText: {
    fontSize: 14,
    fontWeight: '600',
  },

  // Streak Card
  streakCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#F59E0B',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 3,
  },
  streakAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#F59E0B',
  },
  streakContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  streakLabelText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#F59E0B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  streakValue: {
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: -1,
    marginBottom: 2,
  },
  streakUnit: {
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0,
  },
  streakBest: {
    fontSize: 13,
  },

  // Grid
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 12,
  },
  gridCard: {
    width: (SCREEN_WIDTH - 52) / 2,
    padding: 18,
    borderRadius: 20,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 1,
  },
  gridCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  statIconBox: {
    width: 40,
    height: 40,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    gap: 3,
  },
  trendText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#22C55E',
  },
  gridValue: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 2,
  },
  gridLabel: {
    fontSize: 12,
  },

  // Chart
  chartCard: {
    padding: 24,
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 1,
  },
  chartAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#4F46E5',
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 28,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  avgBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 10,
  },
  avgText: {
    fontSize: 12,
    fontWeight: '700',
  },
  chartBars: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 160,
  },
  barCol: {
    alignItems: 'center',
    flex: 1,
  },
  barTrack: {
    width: 28,
    height: 130,
    borderRadius: 10,
    justifyContent: 'flex-end',
    marginBottom: 10,
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
  },
  barLabel: {
    fontSize: 12,
  },
});
