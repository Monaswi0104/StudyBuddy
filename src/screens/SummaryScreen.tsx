import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/StackNav';
import { ChevronLeft, Share2, FileText, CheckCircle2, ArrowRight } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';

export const SummaryScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<RootStackParamList, 'Summary'>>();
  const { colors, isDarkMode } = useTheme();
  const { t } = useTranslation();

  const rawData = route.params?.data || {};
  
  // Handle case where LLM might wrap it in a nested "summary" object
  const actualData = typeof rawData.summary === 'object' && rawData.summary !== null && rawData.summary.summary 
    ? rawData.summary 
    : rawData;

  const data = {
    summary: actualData.summary || 'Cells are the basic structural, functional, and biological units of all known organisms. A cell is the smallest unit of life.',
    keyPoints: Array.isArray(actualData.keyPoints) ? actualData.keyPoints : [
      'Nucleus: Contains the cell\'s genetic material (DNA).',
      'Mitochondria: The powerhouse of the cell, generates ATP.',
      'Ribosomes: Responsible for protein synthesis.'
    ]
  };

  const headerFade = useRef(new Animated.Value(0)).current;
  const titleFade = useRef(new Animated.Value(0)).current;
  const titleSlide = useRef(new Animated.Value(20)).current;
  const contentFade = useRef(new Animated.Value(0)).current;
  const contentSlide = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    const stagger = (fade: Animated.Value, slide: Animated.Value | null, delay: number) => {
      const anims = [Animated.timing(fade, { toValue: 1, duration: 450, delay, useNativeDriver: true })];
      if (slide) anims.push(Animated.timing(slide, { toValue: 0, duration: 450, delay, useNativeDriver: true }));
      return Animated.parallel(anims);
    };
    Animated.parallel([
      stagger(headerFade, null, 0),
      stagger(titleFade, titleSlide, 100),
      stagger(contentFade, contentSlide, 200),
    ]).start();
  }, [headerFade, titleFade, titleSlide, contentFade, contentSlide]);

  return (
    <View style={[styles.container, { paddingTop: insets.top + 10, paddingBottom: insets.bottom + 20, backgroundColor: colors.background }]}>
      {/* Header */}
      <Animated.View style={[styles.header, { opacity: headerFade }]}>
        <TouchableOpacity style={[styles.backBtn, {
          backgroundColor: isDarkMode ? colors.surface : '#FFFFFF',
          borderColor: isDarkMode ? colors.border : '#F3F4F6',
        }]} onPress={() => navigation.goBack()}>
          <ChevronLeft color={colors.text} size={24} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{t('summary.title')}</Text>
        <TouchableOpacity style={[styles.shareBtn, {
          backgroundColor: isDarkMode ? colors.surface : '#FFFFFF',
          borderColor: isDarkMode ? colors.border : '#F3F4F6',
        }]}>
          <Share2 color={colors.primary} size={18} />
        </TouchableOpacity>
      </Animated.View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        {/* Title */}
        <Animated.View style={[styles.titleContainer, { opacity: titleFade, transform: [{ translateY: titleSlide }] }]}>
          <View style={[styles.docIconBox, { backgroundColor: isDarkMode ? 'rgba(245,158,11,0.15)' : '#FFF8EB' }]}>
            <FileText color="#F59E0B" size={24} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.docTitle, { color: colors.text }]} numberOfLines={2}>{route.params?.title || 'Summary'}</Text>
            <Text style={[styles.docSub, { color: colors.textSecondary }]}>{t('summary.generatedNow')}</Text>
          </View>
        </Animated.View>

        <Animated.View style={{ opacity: contentFade, transform: [{ translateY: contentSlide }] }}>
          {/* TL;DR */}
          <View style={[styles.tldrCard, {
            backgroundColor: isDarkMode ? 'rgba(79,70,229,0.1)' : '#EEF2FF',
            borderLeftColor: colors.primary,
          }]}>
            <View style={styles.tldrAccent} />
            <Text style={[styles.tldrTitle, { color: colors.primary }]}>{t('summary.tldr')}</Text>
            <Text style={[styles.tldrText, { color: colors.text }]}>
              {data.summary}
            </Text>
          </View>

          {/* Key Organelles / Points */}
          <View style={styles.section}>
            <Text style={[styles.sectionHeading, { color: colors.text }]}>Key Points</Text>
            {data.keyPoints.map((point: string, i: number) => {
              const color = i % 3 === 0 ? '#6366F1' : i % 3 === 1 ? '#22C55E' : '#3B82F6';
              return (
                <View key={i} style={styles.bulletRow}>
                  <View style={[styles.bulletDot, { backgroundColor: color }]} />
                  <Text style={[styles.bulletText, { color: colors.textSecondary }]}>
                    {point}
                  </Text>
                </View>
              );
            })}
          </View>

          {/* Ready Card */}
          <View style={[styles.readyCard, {
            backgroundColor: isDarkMode ? 'rgba(34,197,94,0.1)' : '#ECFDF5',
            borderColor: isDarkMode ? 'rgba(34,197,94,0.2)' : '#D1FAE5',
          }]}>
            <View style={[styles.readyIconBox, { backgroundColor: isDarkMode ? 'rgba(34,197,94,0.2)' : '#D1FAE5' }]}>
              <CheckCircle2 color="#22C55E" size={22} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.readyTitle, { color: isDarkMode ? '#4ADE80' : '#065F46' }]}>{t('summary.readyToTest')}</Text>
              <Text style={[styles.readySub, { color: isDarkMode ? '#22C55E' : '#047857' }]}>{t('summary.turnIntoQuiz')}</Text>
            </View>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Bottom */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.quizBtn} onPress={() => navigation.navigate('Generate' as any)}>
          <Text style={styles.quizBtnText}>{t('summary.generateQuiz')}</Text>
          <View style={styles.quizArrow}><ArrowRight color="#4F46E5" size={16} /></View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 24 },
  backBtn: { width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 1, shadowColor: '#000', shadowOpacity: 0.04, shadowOffset: { width: 0, height: 2 }, shadowRadius: 8, elevation: 1 },
  headerTitle: { fontSize: 18, fontWeight: '700', letterSpacing: -0.3 },
  shareBtn: { width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },

  titleContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  docIconBox: { width: 52, height: 52, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  docTitle: { fontSize: 20, fontWeight: '800', letterSpacing: -0.3, marginBottom: 3 },
  docSub: { fontSize: 13, fontWeight: '500' },

  tldrCard: { padding: 20, borderRadius: 16, borderLeftWidth: 4, marginBottom: 28, overflow: 'hidden' },
  tldrAccent: { position: 'absolute', top: 0, left: 0, right: 0, height: 0 },
  tldrTitle: { fontSize: 14, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 },
  tldrText: { fontSize: 15, lineHeight: 24 },

  section: { marginBottom: 28 },
  sectionHeading: { fontSize: 18, fontWeight: '700', letterSpacing: -0.3, marginBottom: 14 },
  bulletRow: { flexDirection: 'row', marginBottom: 12, paddingRight: 16 },
  bulletDot: { width: 7, height: 7, borderRadius: 4, marginTop: 8, marginRight: 12 },
  bulletText: { fontSize: 15, lineHeight: 24, flex: 1 },
  paragraphText: { fontSize: 15, lineHeight: 26 },

  readyCard: { flexDirection: 'row', alignItems: 'center', padding: 18, borderRadius: 16, borderWidth: 1, gap: 14 },
  readyIconBox: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  readyTitle: { fontSize: 15, fontWeight: '700', marginBottom: 2 },
  readySub: { fontSize: 13 },

  bottomContainer: { paddingHorizontal: 20, paddingTop: 10 },
  quizBtn: { flexDirection: 'row', paddingVertical: 18, borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: '#4F46E5', shadowColor: '#4F46E5', shadowOpacity: 0.35, shadowOffset: { width: 0, height: 6 }, shadowRadius: 12, elevation: 6 },
  quizBtnText: { fontSize: 16, fontWeight: '700', color: '#FFF', marginRight: 10 },
  quizArrow: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center' },
});
