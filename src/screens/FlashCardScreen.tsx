import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, LayoutAnimation } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft, Check, X, RotateCcw } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';

const mockCards = [
  { id: '1', question: 'What is the powerhouse of the cell?', answer: 'Mitochondria' },
  { id: '2', question: 'What is the main function of the cell membrane?', answer: 'It regulates what enters and leaves the cell, providing protection and support.' },
  { id: '3', question: 'Define Photosynthesis.', answer: 'The process by which green plants and some other organisms use sunlight to synthesize foods with the help of chlorophyll.' },
  { id: '4', question: 'What is the difference between RNA and DNA?', answer: 'DNA contains deoxyribose and is double-stranded. RNA contains ribose and is single-stranded.' },
];

export const FlashCardScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { colors, isDarkMode } = useTheme();
  const { t } = useTranslation();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const flipAnim = useRef(new Animated.Value(0)).current;

  // Entrance animations
  const headerFade = useRef(new Animated.Value(0)).current;
  const cardFade = useRef(new Animated.Value(0)).current;
  const cardSlide = useRef(new Animated.Value(30)).current;
  const controlsFade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const stagger = (fade: Animated.Value, slide: Animated.Value | null, delay: number) => {
      const anims = [Animated.timing(fade, { toValue: 1, duration: 450, delay, useNativeDriver: true })];
      if (slide) anims.push(Animated.timing(slide, { toValue: 0, duration: 450, delay, useNativeDriver: true }));
      return Animated.parallel(anims);
    };
    Animated.parallel([
      stagger(headerFade, null, 0),
      stagger(cardFade, cardSlide, 100),
      stagger(controlsFade, null, 250),
    ]).start();
  }, [headerFade, cardFade, cardSlide, controlsFade]);

  const currentCard = mockCards[currentIndex];
  const progress = ((currentIndex + 1) / mockCards.length) * 100;

  const flipCard = () => {
    if (isFlipped) {
      Animated.spring(flipAnim, { toValue: 0, friction: 8, tension: 10, useNativeDriver: true }).start();
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setIsFlipped(false);
    } else {
      Animated.spring(flipAnim, { toValue: 180, friction: 8, tension: 10, useNativeDriver: true }).start();
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setIsFlipped(true);
    }
  };

  const nextCard = () => {
    if (currentIndex < mockCards.length - 1) {
      flipAnim.setValue(0);
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setIsFlipped(false);
      setCurrentIndex(prev => prev + 1);
    } else {
      navigation.goBack();
    }
  };

  const frontInterpolate = flipAnim.interpolate({ inputRange: [0, 180], outputRange: ['0deg', '180deg'] });
  const backInterpolate = flipAnim.interpolate({ inputRange: [0, 180], outputRange: ['180deg', '360deg'] });
  const frontAnimatedStyle = { transform: [{ rotateY: frontInterpolate }] };
  const backAnimatedStyle = { transform: [{ rotateY: backInterpolate }] };

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
        <Text style={[styles.headerTitle, { color: colors.text }]}>Biology 101</Text>
        <View style={[styles.counterBadge, { backgroundColor: isDarkMode ? colors.surface : '#EEF2FF' }]}>
          <Text style={[styles.counterText, { color: colors.primary }]}>{currentIndex + 1}/{mockCards.length}</Text>
        </View>
      </Animated.View>

      {/* Progress */}
      <Animated.View style={[styles.progressContainer, { opacity: headerFade }]}>
        <View style={styles.progressHeader}>
          <Text style={[styles.progressText, { color: colors.textSecondary }]}>{t('flashcard.cardOf', { current: currentIndex + 1, total: mockCards.length })}</Text>
          <Text style={[styles.progressPercent, { color: colors.primary }]}>{Math.round(progress)}%</Text>
        </View>
        <View style={[styles.progressTrack, { backgroundColor: isDarkMode ? colors.border : '#F3F4F6' }]}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
      </Animated.View>

      {/* Card */}
      <Animated.View style={[styles.cardArea, { opacity: cardFade, transform: [{ translateY: cardSlide }] }]}>
        <TouchableOpacity activeOpacity={0.9} onPress={flipCard} style={styles.cardWrapper}>
          {/* Front */}
          <Animated.View style={[styles.card, styles.cardFront, frontAnimatedStyle, {
            backgroundColor: isDarkMode ? colors.surface : '#FFFFFF',
            borderColor: isDarkMode ? colors.border : '#F3F4F6',
          }]}>
            <View style={styles.cardAccentQ} />
            <View style={styles.cardInner}>
              <View style={[styles.cardLabel, { backgroundColor: isDarkMode ? 'rgba(79,70,229,0.15)' : '#EEF2FF' }]}>
                <Text style={[styles.cardLabelText, { color: colors.primary }]}>{t('flashcard.question')}</Text>
              </View>
              <Text style={[styles.cardText, { color: colors.text }]}>{currentCard.question}</Text>
              <View style={[styles.flipHint, { backgroundColor: isDarkMode ? colors.border : '#F3F4F6' }]}>
                <RotateCcw color={colors.textSecondary} size={14} style={{ marginRight: 6 }} />
                <Text style={[styles.flipHintText, { color: colors.textSecondary }]}>{t('flashcard.tapToFlip')}</Text>
              </View>
            </View>
          </Animated.View>

          {/* Back */}
          <Animated.View style={[styles.card, styles.cardBack, backAnimatedStyle, {
            backgroundColor: isDarkMode ? colors.surface : '#FFFFFF',
            borderColor: isDarkMode ? colors.border : '#F3F4F6',
          }]}>
            <View style={styles.cardAccentA} />
            <View style={styles.cardInner}>
              <View style={[styles.cardLabel, { backgroundColor: isDarkMode ? 'rgba(34,197,94,0.15)' : '#ECFDF5' }]}>
                <Text style={[styles.cardLabelText, { color: '#22C55E' }]}>{t('flashcard.answer')}</Text>
              </View>
              <Text style={[styles.cardText, { color: colors.text }]}>{currentCard.answer}</Text>
            </View>
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>

      {/* Controls */}
      <Animated.View style={[styles.controlsContainer, { opacity: controlsFade }]}>
        {!isFlipped ? (
          <TouchableOpacity style={[styles.showAnswerBtn, {
            backgroundColor: isDarkMode ? colors.surface : '#EEF2FF',
            borderColor: isDarkMode ? colors.border : 'rgba(79,70,229,0.2)',
          }]} onPress={flipCard}>
            <RotateCcw color={colors.primary} size={18} style={{ marginRight: 8 }} />
            <Text style={[styles.showAnswerText, { color: colors.primary }]}>{t('flashcard.showAnswer')}</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.actionButtonsRow}>
            <TouchableOpacity style={[styles.actionBtn, {
              backgroundColor: isDarkMode ? 'rgba(239,68,68,0.1)' : '#FEF2F2',
              borderColor: isDarkMode ? 'rgba(239,68,68,0.2)' : '#FEE2E2',
            }]} onPress={nextCard}>
              <X color="#EF4444" size={24} />
              <Text style={styles.btnReviewText}>{t('flashcard.needReview')}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btnGotIt} onPress={nextCard}>
              <Check color="#FFF" size={24} />
              <Text style={styles.btnGotItText}>{t('flashcard.gotIt')}</Text>
            </TouchableOpacity>
          </View>
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 20 },
  backBtn: { width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 1, shadowColor: '#000', shadowOpacity: 0.04, shadowOffset: { width: 0, height: 2 }, shadowRadius: 8, elevation: 1 },
  headerTitle: { fontSize: 18, fontWeight: '700', letterSpacing: -0.3 },
  counterBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  counterText: { fontSize: 13, fontWeight: '700' },

  progressContainer: { paddingHorizontal: 20, marginBottom: 24 },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  progressText: { fontSize: 13, fontWeight: '500' },
  progressPercent: { fontSize: 13, fontWeight: '700' },
  progressTrack: { height: 6, borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 3, backgroundColor: '#4F46E5' },

  cardArea: { flex: 1, paddingHorizontal: 20, alignItems: 'center', justifyContent: 'center' },
  cardWrapper: { width: '100%', height: '85%' },
  card: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: 24, backfaceVisibility: 'hidden', borderWidth: 1, overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.06, shadowOffset: { width: 0, height: 6 }, shadowRadius: 16, elevation: 4 },
  cardFront: { zIndex: 2 },
  cardBack: { zIndex: 1 },
  cardAccentQ: { position: 'absolute', top: 0, left: 0, right: 0, height: 3, backgroundColor: '#4F46E5' },
  cardAccentA: { position: 'absolute', top: 0, left: 0, right: 0, height: 3, backgroundColor: '#22C55E' },
  cardInner: { flex: 1, padding: 28, justifyContent: 'center', alignItems: 'center' },
  cardLabel: { position: 'absolute', top: 24, paddingHorizontal: 14, paddingVertical: 5, borderRadius: 10 },
  cardLabelText: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 },
  cardText: { fontSize: 22, fontWeight: '600', textAlign: 'center', lineHeight: 32 },
  flipHint: { position: 'absolute', bottom: 24, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20 },
  flipHintText: { fontSize: 13, fontWeight: '500' },

  controlsContainer: { paddingHorizontal: 20, paddingTop: 16 },
  showAnswerBtn: { flexDirection: 'row', width: '100%', paddingVertical: 16, borderRadius: 16, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  showAnswerText: { fontSize: 15, fontWeight: '600' },
  actionButtonsRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flex: 1, paddingVertical: 16, borderRadius: 16, borderWidth: 1, gap: 8 },
  btnReviewText: { fontSize: 14, fontWeight: '700', color: '#EF4444' },
  btnGotIt: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flex: 1, paddingVertical: 16, borderRadius: 16, backgroundColor: '#22C55E', shadowColor: '#22C55E', shadowOpacity: 0.3, shadowOffset: { width: 0, height: 4 }, shadowRadius: 8, elevation: 4, gap: 8 },
  btnGotItText: { fontSize: 14, fontWeight: '700', color: '#FFF' },
});
