import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft, Share2, FileText, CheckCircle2 } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';

export const SummaryScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const { colors, isDarkMode } = useTheme();
  const { t } = useTranslation();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  return (
    <View style={[styles.container, { paddingTop: insets.top + 10, paddingBottom: insets.bottom + 20, backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={[styles.backBtn, { backgroundColor: colors.surface, borderColor: colors.border }]} onPress={() => navigation.goBack()}>
          <ChevronLeft color={colors.text} size={24} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{t('summary.title')}</Text>
        <TouchableOpacity style={[styles.shareBtn, { backgroundColor: colors.surface, borderColor: colors.primary, borderWidth: 1 }]}>
          <Share2 color={colors.primary} size={20} />
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}>
        
        {/* Title Area */}
        <View style={styles.titleContainer}>
          <View style={[styles.iconBox, { backgroundColor: '#FEF3C7' }]}>
            <FileText color="#F59E0B" size={28} />
          </View>
          <View>
            <Text style={[styles.docTitle, { color: colors.text }]}>Cellular Biology 101</Text>
            <Text style={[styles.docSub, { color: colors.textSecondary }]}>{t('summary.generatedNow')}</Text>
          </View>
        </View>

        {/* TL;DR */}
        <View style={[styles.tldrCard, { backgroundColor: isDarkMode ? 'rgba(79, 70, 229, 0.15)' : '#EEF2FF', borderLeftColor: colors.primary }]}>
          <Text style={[styles.tldrTitle, { color: colors.primary }]}>{t('summary.tldr')}</Text>
          <Text style={[styles.tldrText, { color: colors.text }]}>
            Cells are the basic structural, functional, and biological units of all known organisms. A cell is the smallest unit of life.
          </Text>
        </View>

        {/* Content Sections */}
        <View style={styles.section}>
          <Text style={[styles.sectionHeading, { color: colors.text }]}>Key Organelles</Text>
          <View style={styles.bulletRow}>
            <View style={[styles.bulletDot, { backgroundColor: colors.primary }]} />
            <Text style={[styles.bulletText, { color: colors.textSecondary }]}>
              <Text style={{ fontWeight: '700', color: colors.text }}>Nucleus:</Text> Contains the cell's genetic material (DNA).
            </Text>
          </View>
          <View style={styles.bulletRow}>
            <View style={[styles.bulletDot, { backgroundColor: colors.primary }]} />
            <Text style={[styles.bulletText, { color: colors.textSecondary }]}>
              <Text style={{ fontWeight: '700', color: colors.text }}>Mitochondria:</Text> The powerhouse of the cell, generates ATP.
            </Text>
          </View>
          <View style={styles.bulletRow}>
            <View style={[styles.bulletDot, { backgroundColor: colors.primary }]} />
            <Text style={[styles.bulletText, { color: colors.textSecondary }]}>
              <Text style={{ fontWeight: '700', color: colors.text }}>Ribosomes:</Text> Responsible for protein synthesis.
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionHeading, { color: colors.text }]}>Cell Division</Text>
          <Text style={[styles.paragraphText, { color: colors.textSecondary }]}>
            Mitosis is a part of the cell cycle in which replicated chromosomes are separated into two new nuclei. Cell division gives rise to genetically identical cells in which the total number of chromosomes is maintained.
          </Text>
        </View>

        {/* Action Call */}
        <View style={[styles.actionCard, { backgroundColor: isDarkMode ? 'rgba(16, 185, 129, 0.1)' : '#ECFDF5', borderColor: isDarkMode ? '#065F46' : '#D1FAE5' }]}>
          <View style={[styles.actionIconRing, { backgroundColor: isDarkMode ? 'rgba(16, 185, 129, 0.2)' : '#D1FAE5' }]}>
            <CheckCircle2 color="#10B981" size={24} />
          </View>
          <View style={styles.actionTextCol}>
            <Text style={[styles.actionTitle, { color: isDarkMode ? '#34D399' : '#065F46' }]}>{t('summary.readyToTest')}</Text>
            <Text style={[styles.actionSub, { color: isDarkMode ? '#059669' : '#047857' }]}>{t('summary.turnIntoQuiz')}</Text>
          </View>
        </View>

      </ScrollView>

      {/* Floating Action Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={[styles.generateQuizBtn, { backgroundColor: colors.primary, shadowColor: colors.primary }]} onPress={() => navigation.navigate('Generate' as any)}>
          <Text style={styles.generateQuizText}>{t('summary.generateQuiz')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 24 },
  backBtn: { width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  headerTitle: { fontSize: 18, fontWeight: '600' },
  shareBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  titleContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  iconBox: { width: 56, height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  docTitle: { fontSize: 22, fontWeight: '700', marginBottom: 4 },
  docSub: { fontSize: 14, fontWeight: '500' },
  tldrCard: { padding: 20, borderRadius: 16, borderLeftWidth: 4, marginBottom: 32 },
  tldrTitle: { fontSize: 16, fontWeight: '700', marginBottom: 8 },
  tldrText: { fontSize: 15, lineHeight: 24 },
  section: { marginBottom: 32 },
  sectionHeading: { fontSize: 18, fontWeight: '700', marginBottom: 16 },
  bulletRow: { flexDirection: 'row', marginBottom: 12, paddingRight: 16 },
  bulletDot: { width: 6, height: 6, borderRadius: 3, marginTop: 9, marginRight: 12 },
  bulletText: { fontSize: 16, lineHeight: 24 },
  paragraphText: { fontSize: 16, lineHeight: 26 },
  actionCard: { flexDirection: 'row', alignItems: 'center', padding: 20, borderRadius: 16, borderWidth: 1, marginTop: 10 },
  actionIconRing: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  actionTextCol: { flex: 1 },
  actionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  actionSub: { fontSize: 13 },
  bottomContainer: { paddingHorizontal: 20, paddingTop: 10 },
  generateQuizBtn: { paddingVertical: 18, borderRadius: 16, alignItems: 'center', shadowOpacity: 0.3, shadowOffset: { width: 0, height: 4 }, shadowRadius: 8, elevation: 4 },
  generateQuizText: { fontSize: 16, fontWeight: '600', color: '#FFF' },
});
