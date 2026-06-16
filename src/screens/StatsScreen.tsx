import React, { useRef, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronDown, Settings, Flame, Clock, Layers, HelpCircle, Target } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';

export const StatsScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const { colors } = useTheme();
  const { t } = useTranslation();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const statCards = [
    { id: '1', title: t('stats.studyTime'), value: '12h 45m', icon: Clock, color: '#8B5CF6', bgColor: '#EDE9FE' },
    { id: '2', title: t('stats.cardsReviewed'), value: '342', icon: Layers, color: '#3B82F6', bgColor: '#DBEAFE' },
    { id: '3', title: t('stats.quizzesTaken'), value: '18', icon: HelpCircle, color: '#F43F5E', bgColor: '#FFE4E6' },
    { id: '4', title: t('stats.averageScore'), value: '85%', icon: Target, color: '#10B981', bgColor: '#D1FAE5' },
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
    <Animated.ScrollView 
      style={[styles.container, { paddingTop: insets.top + 10, backgroundColor: colors.background, opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
      contentContainerStyle={{ paddingBottom: 120 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity style={styles.dropdown}>
            <Text style={[styles.headerTitle, { color: colors.text }]}>{t('stats.thisWeek')}</Text>
            <ChevronDown color={colors.text} size={20} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity>
          <Settings color={colors.textSecondary} size={24} />
        </TouchableOpacity>
      </View>

      {/* Main Streak Card */}
      <View style={[styles.mainCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={styles.streakInfo}>
          <Text style={[styles.streakLabel, { color: colors.primary }]}>{t('home.studyStreak')}</Text>
          <Text style={[styles.streakValue, { color: colors.text }]}>7 {t('home.days')}</Text>
          <Text style={[styles.streakSub, { color: colors.textSecondary }]}>Best streak: 12 {t('home.days')}</Text>
        </View>
        <Flame color={colors.warning} fill={colors.warning} size={56} />
      </View>

      {/* Stats Grid */}
      <View style={styles.grid}>
        {statCards.map((stat) => (
          <View key={stat.id} style={[styles.gridCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.gridCardHeader}>
              <View style={[styles.iconBox, { backgroundColor: stat.bgColor }]}>
                <stat.icon color={stat.color} size={20} />
              </View>
            </View>
            <Text style={[styles.gridCardValue, { color: colors.text }]}>{stat.value}</Text>
            <Text style={[styles.gridCardTitle, { color: colors.textSecondary }]}>{stat.title}</Text>
          </View>
        ))}
      </View>

      {/* Chart Section */}
      <View style={[styles.chartContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={styles.chartHeader}>
          <Text style={[styles.chartTitle, { color: colors.text }]}>{t('stats.studyTimeH')}</Text>
          <View style={[styles.chartBadge, { backgroundColor: colors.iconBg }]}>
            <Text style={[styles.chartBadgeText, { color: colors.text }]}>2.5h {t('stats.avg')}</Text>
          </View>
        </View>
        
        <View style={styles.chartBars}>
          {chartData.map((data, index) => (
            <View key={index} style={styles.barCol}>
              <View style={[styles.barTrack, { backgroundColor: colors.iconBg }]}>
                <View style={[styles.barFill, { height: `${data.height}%`, backgroundColor: colors.primary }]} />
              </View>
              <Text style={[styles.barLabel, { color: colors.textSecondary }]}>{data.day}</Text>
            </View>
          ))}
        </View>
      </View>

    </Animated.ScrollView>
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
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginRight: 4,
  },
  mainCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    borderRadius: 20,
    marginBottom: 24,
    borderWidth: 1,
  },
  streakInfo: {
    flex: 1,
  },
  streakLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  streakValue: {
    fontSize: 36,
    fontWeight: '800',
    marginBottom: 4,
  },
  streakSub: {
    fontSize: 13,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  gridCard: {
    width: '48%',
    padding: 20,
    borderRadius: 20,
    marginBottom: 16,
    borderWidth: 1,
  },
  gridCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridCardValue: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
  },
  gridCardTitle: {
    fontSize: 13,
  },
  chartContainer: {
    padding: 24,
    borderRadius: 20,
    borderWidth: 1,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  chartBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  chartBadgeText: {
    fontSize: 12,
    fontWeight: '600',
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
    width: 24,
    height: 130,
    borderRadius: 12,
    justifyContent: 'flex-end',
    marginBottom: 12,
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    borderRadius: 12,
  },
  barLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
});
