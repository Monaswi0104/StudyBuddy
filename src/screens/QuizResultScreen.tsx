import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Trophy, Home, RotateCcw, CheckCircle2, XCircle, ChevronLeft } from 'lucide-react-native';
import Svg, { Circle } from 'react-native-svg';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';

export const QuizResultScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { colors } = useTheme();
  const { t } = useTranslation();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 6, tension: 40, useNativeDriver: true }),
    ]).start();
  }, [fadeAnim, scaleAnim]);

  // Mock data or route params
  const score = route.params?.score || 2;
  const total = 3;
  const percentage = Math.round((score / total) * 100);

  // SVG Circular Progress config
  const size = 180;
  const strokeWidth = 16;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  let message = t('quiz.goodEffort');
  let subMessage = t('quiz.keepReviewing');
  if (percentage === 100) {
    message = t('quiz.perfectScore');
    subMessage = t('quiz.mastered');
  } else if (percentage >= 66) {
    message = t('quiz.greatJob');
    subMessage = t('quiz.almostThere');
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top + 10, paddingBottom: insets.bottom + 20, backgroundColor: colors.background }]}>
      
      <View style={styles.header}>
        <TouchableOpacity style={[styles.backBtn, { backgroundColor: colors.surface, borderColor: colors.border }]} onPress={() => navigation.goBack()}>
          <ChevronLeft color={colors.text} size={24} />
        </TouchableOpacity>
      </View>

      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        <View style={[styles.trophyContainer, { backgroundColor: '#FEF3C7' }]}>
          <Trophy color="#F59E0B" size={48} />
        </View>

        <Text style={[styles.title, { color: colors.text }]}>{message}</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{subMessage}</Text>

        {/* Circular Progress */}
        <View style={styles.progressContainer}>
          <Svg width={size} height={size}>
            <Circle
              stroke={colors.border}
              fill="none"
              cx={size / 2}
              cy={size / 2}
              r={radius}
              strokeWidth={strokeWidth}
            />
            <Circle
              stroke="#10B981"
              fill="none"
              cx={size / 2}
              cy={size / 2}
              r={radius}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
            />
          </Svg>
          <View style={styles.progressTextContainer}>
            <Text style={[styles.progressPercent, { color: colors.text }]}>{percentage}%</Text>
            <Text style={[styles.progressLabel, { color: colors.textSecondary }]}>{t('quiz.scoreLabel')}</Text>
          </View>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={[styles.statBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <CheckCircle2 color="#10B981" size={24} />
            <Text style={[styles.statValue, { color: colors.text }]}>{score}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{t('quiz.correct')}</Text>
          </View>
          <View style={[styles.statBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <XCircle color="#EF4444" size={24} />
            <Text style={[styles.statValue, { color: colors.text }]}>{total - score}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{t('quiz.incorrect')}</Text>
          </View>
        </View>
      </Animated.View>

      {/* Buttons */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity 
          style={[styles.primaryBtn, { backgroundColor: colors.primary, shadowColor: colors.primary }]}
          onPress={() => navigation.goBack()}
        >
          <RotateCcw color="#FFF" size={20} />
          <Text style={styles.primaryBtnText}>{t('quiz.retakeQuiz')}</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.secondaryBtn, { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1 }]}
          onPress={() => navigation.navigate('MainTabs')}
        >
          <Home color={colors.textSecondary} size={20} />
          <Text style={[styles.secondaryBtnText, { color: colors.textSecondary }]}>{t('quiz.backToHome')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, marginBottom: 10 },
  backBtn: { width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 },
  trophyContainer: { width: 96, height: 96, borderRadius: 48, alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  title: { fontSize: 28, fontWeight: '800', marginBottom: 8, textAlign: 'center' },
  subtitle: { fontSize: 16, marginBottom: 40, textAlign: 'center' },
  progressContainer: { position: 'relative', alignItems: 'center', justifyContent: 'center', marginBottom: 40 },
  progressTextContainer: { position: 'absolute', alignItems: 'center', justifyContent: 'center' },
  progressPercent: { fontSize: 48, fontWeight: '800' },
  progressLabel: { fontSize: 16, fontWeight: '600', textTransform: 'uppercase' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', paddingHorizontal: 20 },
  statBox: { alignItems: 'center', paddingVertical: 20, paddingHorizontal: 30, borderRadius: 20, borderWidth: 1, shadowOpacity: 0.02, shadowOffset: { width: 0, height: 4 }, shadowRadius: 12, elevation: 2, width: '45%' },
  statValue: { fontSize: 24, fontWeight: '700', marginTop: 8, marginBottom: 4 },
  statLabel: { fontSize: 14 },
  bottomContainer: { paddingHorizontal: 20 },
  primaryBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 18, borderRadius: 16, marginBottom: 16, shadowOpacity: 0.3, shadowOffset: { width: 0, height: 4 }, shadowRadius: 8, elevation: 4 },
  primaryBtnText: { fontSize: 16, fontWeight: '600', color: '#FFF', marginLeft: 8 },
  secondaryBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 18, borderRadius: 16 },
  secondaryBtnText: { fontSize: 16, fontWeight: '600', marginLeft: 8 },
});
