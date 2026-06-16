import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronDown, Flame, Clock, Layers, HelpCircle, Target, TrendingUp } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';

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

  const statCards = [
    { id: '1', title: t('stats.studyTime'), value: '12h 45m', icon: Clock, color: '#8B5CF6', bg: isDarkMode ? 'rgba(139,92,246,0.15)' : '#F5F3FF', trend: '+2.5h' },
    { id: '2', title: t('stats.cardsReviewed'), value: '342', icon: Layers, color: '#3B82F6', bg: isDarkMode ? 'rgba(59,130,246,0.15)' : '#EFF6FF', trend: '+48' },
    { id: '3', title: t('stats.quizzesTaken'), value: '18', icon: HelpCircle, color: '#F43F5E', bg: isDarkMode ? 'rgba(244,63,94,0.15)' : '#FFF1F2', trend: '+3' },
    { id: '4', title: t('stats.averageScore'), value: '85%', icon: Target, color: '#22C55E', bg: isDarkMode ? 'rgba(34,197,94,0.15)' : '#ECFDF5', trend: '+5%' },
  ];

  const chartData = [
    { day: 'Mon', height: 40 },
    { day: 'Tue', height: 60 },
    { day: 'Wed', height: 30 },
    { day: 'Thu', height: 80 },
    { day: 'Fri', height: 50 },
    { day: 'Sat', height: 100 },
    { day: 'Sun', height: 70 },
  ];

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
            <Text style={[styles.streakValue, { color: colors.text }]}>7 <Text style={[styles.streakUnit, { color: colors.textSecondary }]}>{t('home.days')}</Text></Text>
            <Text style={[styles.streakBest, { color: colors.textSecondary }]}>Best streak: 12 {t('home.days')}</Text>
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
          <Text style={[styles.chartTitle, { color: colors.text }]}>{t('stats.studyTimeH')}</Text>
          <View style={[styles.avgBadge, { backgroundColor: isDarkMode ? 'rgba(79,70,229,0.15)' : '#EEF2FF' }]}>
            <Text style={[styles.avgText, { color: colors.primary }]}>2.5h {t('stats.avg')}</Text>
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
