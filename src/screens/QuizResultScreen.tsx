import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Trophy, Home, RotateCcw, CheckCircle2, XCircle, ChevronLeft, ArrowRight } from 'lucide-react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const QuizResultScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { colors, isDarkMode } = useTheme();
  const { t } = useTranslation();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.7)).current;
  const statsFade = useRef(new Animated.Value(0)).current;
  const statsSlide = useRef(new Animated.Value(30)).current;
  const btnFade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.spring(scaleAnim, { toValue: 1, friction: 5, tension: 50, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(statsFade, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(statsSlide, { toValue: 0, duration: 400, useNativeDriver: true }),
      ]),
      Animated.timing(btnFade, { toValue: 1, duration: 300, useNativeDriver: true }),
    ]).start();
  }, [fadeAnim, scaleAnim, statsFade, statsSlide, btnFade]);

  const score = route.params?.score || 0;
  const total = route.params?.total || 10;
  const percentage = Math.round((score / total) * 100);

  const size = 180;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const scoreColor = percentage >= 90 ? '#22C55E' : percentage >= 60 ? '#3B82F6' : '#F59E0B';

  let message = t('quiz.goodEffort');
  let subMessage = t('quiz.keepReviewing');
  if (percentage === 100) { message = t('quiz.perfectScore'); subMessage = t('quiz.mastered'); }
  else if (percentage >= 66) { message = t('quiz.greatJob'); subMessage = t('quiz.almostThere'); }

  return (
    <View style={[styles.container, { paddingTop: insets.top + 10, paddingBottom: insets.bottom + 20, backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity style={[styles.backBtn, {
          backgroundColor: isDarkMode ? colors.surface : '#FFFFFF',
          borderColor: isDarkMode ? colors.border : '#F3F4F6',
        }]} onPress={() => navigation.goBack()}>
          <ChevronLeft color={colors.text} size={24} />
        </TouchableOpacity>
      </View>

      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        <View style={[styles.trophyContainer, { backgroundColor: isDarkMode ? 'rgba(245,158,11,0.15)' : '#FEF3C7' }]}>
          <Trophy color="#F59E0B" fill="#F59E0B" size={40} />
        </View>

        <Text style={[styles.title, { color: colors.text }]}>{message}</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{subMessage}</Text>

        {/* Circular Progress */}
        <View style={styles.progressContainer}>
          <Svg width={size} height={size}>
            <Defs>
              <LinearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <Stop offset="0%" stopColor={scoreColor} />
                <Stop offset="100%" stopColor={scoreColor} stopOpacity="0.6" />
              </LinearGradient>
            </Defs>
            <Circle stroke={isDarkMode ? colors.border : '#F3F4F6'} fill="none" cx={size / 2} cy={size / 2} r={radius} strokeWidth={strokeWidth} />
            <Circle
              stroke="url(#scoreGrad)"
              fill="none"
              cx={size / 2} cy={size / 2} r={radius}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
            />
          </Svg>
          <View style={styles.progressTextContainer}>
            <Text style={[styles.progressPercent, { color: scoreColor }]}>{percentage}%</Text>
            <Text style={[styles.progressLabel, { color: colors.textSecondary }]}>{t('quiz.scoreLabel')}</Text>
          </View>
        </View>
      </Animated.View>

      {/* Stats */}
      <Animated.View style={[styles.statsRow, { opacity: statsFade, transform: [{ translateY: statsSlide }] }]}>
        <View style={[styles.statBox, {
          backgroundColor: isDarkMode ? colors.surface : '#FFFFFF',
          borderColor: isDarkMode ? colors.border : '#F3F4F6',
        }]}>
          <View style={[styles.statIconBox, { backgroundColor: isDarkMode ? 'rgba(34,197,94,0.15)' : '#ECFDF5' }]}>
            <CheckCircle2 color="#22C55E" size={20} />
          </View>
          <Text style={[styles.statValue, { color: colors.text }]}>{score}</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{t('quiz.correct')}</Text>
        </View>
        <View style={[styles.statBox, {
          backgroundColor: isDarkMode ? colors.surface : '#FFFFFF',
          borderColor: isDarkMode ? colors.border : '#F3F4F6',
        }]}>
          <View style={[styles.statIconBox, { backgroundColor: isDarkMode ? 'rgba(239,68,68,0.15)' : '#FEF2F2' }]}>
            <XCircle color="#EF4444" size={20} />
          </View>
          <Text style={[styles.statValue, { color: colors.text }]}>{total - score}</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{t('quiz.incorrect')}</Text>
        </View>
      </Animated.View>

      {/* Buttons */}
      <Animated.View style={[styles.bottomContainer, { opacity: btnFade }]}>
        <TouchableOpacity style={styles.primaryBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.primaryBtnText}>{t('quiz.retakeQuiz')}</Text>
          <View style={styles.btnArrow}><ArrowRight color="#4F46E5" size={16} /></View>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.secondaryBtn, {
          backgroundColor: isDarkMode ? colors.surface : '#FFFFFF',
          borderColor: isDarkMode ? colors.border : '#F3F4F6',
        }]} onPress={() => navigation.navigate('MainTabs')}>
          <Home color={colors.textSecondary} size={18} />
          <Text style={[styles.secondaryBtnText, { color: colors.textSecondary }]}>{t('quiz.backToHome')}</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, marginBottom: 10 },
  backBtn: { width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 1, shadowColor: '#000', shadowOpacity: 0.04, shadowOffset: { width: 0, height: 2 }, shadowRadius: 8, elevation: 1 },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 },
  trophyContainer: { width: 88, height: 88, borderRadius: 44, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  title: { fontSize: 28, fontWeight: '800', letterSpacing: -0.5, marginBottom: 6, textAlign: 'center' },
  subtitle: { fontSize: 15, marginBottom: 32, textAlign: 'center' },
  progressContainer: { position: 'relative', alignItems: 'center', justifyContent: 'center', marginBottom: 32 },
  progressTextContainer: { position: 'absolute', alignItems: 'center', justifyContent: 'center' },
  progressPercent: { fontSize: 44, fontWeight: '800', letterSpacing: -1 },
  progressLabel: { fontSize: 14, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },

  statsRow: { flexDirection: 'row', justifyContent: 'center', paddingHorizontal: 20, gap: 16, marginBottom: 24 },
  statBox: { alignItems: 'center', paddingVertical: 18, paddingHorizontal: 28, borderRadius: 20, borderWidth: 1, flex: 1, shadowColor: '#000', shadowOpacity: 0.03, shadowOffset: { width: 0, height: 2 }, shadowRadius: 8, elevation: 1 },
  statIconBox: { width: 40, height: 40, borderRadius: 13, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  statValue: { fontSize: 28, fontWeight: '800', letterSpacing: -0.5, marginBottom: 2 },
  statLabel: { fontSize: 13 },

  bottomContainer: { paddingHorizontal: 20 },
  primaryBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 18, borderRadius: 16, marginBottom: 12, backgroundColor: '#4F46E5', shadowColor: '#4F46E5', shadowOpacity: 0.35, shadowOffset: { width: 0, height: 6 }, shadowRadius: 12, elevation: 6 },
  primaryBtnText: { fontSize: 16, fontWeight: '700', color: '#FFF', marginRight: 10 },
  btnArrow: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center' },
  secondaryBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 18, borderRadius: 16, borderWidth: 1, gap: 8 },
  secondaryBtnText: { fontSize: 15, fontWeight: '600' },
});
