import React, { useState, useRef } from 'react';
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
  const { colors } = useTheme();
  const { t } = useTranslation();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const flipAnim = useRef(new Animated.Value(0)).current;

  const currentCard = mockCards[currentIndex];
  const progress = ((currentIndex + 1) / mockCards.length) * 100;

  const flipCard = () => {
    if (isFlipped) {
      Animated.spring(flipAnim, {
        toValue: 0,
        friction: 8,
        tension: 10,
        useNativeDriver: true,
      }).start();
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setIsFlipped(false);
    } else {
      Animated.spring(flipAnim, {
        toValue: 180,
        friction: 8,
        tension: 10,
        useNativeDriver: true,
      }).start();
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setIsFlipped(true);
    }
  };

  const nextCard = () => {
    if (currentIndex < mockCards.length - 1) {
      // Reset flip instantly without animation
      flipAnim.setValue(0);
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setIsFlipped(false);
      setCurrentIndex(prev => prev + 1);
    } else {
      // Finish review
      navigation.goBack();
    }
  };

  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
  });
  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '360deg'],
  });

  const frontAnimatedStyle = { transform: [{ rotateY: frontInterpolate }] };
  const backAnimatedStyle = { transform: [{ rotateY: backInterpolate }] };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 10, paddingBottom: insets.bottom + 20, backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={[styles.backBtn, { backgroundColor: colors.surface, borderColor: colors.border }]} onPress={() => navigation.goBack()}>
          <ChevronLeft color={colors.text} size={24} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Biology 101</Text>
        <View style={{ width: 40 }} /> {/* Spacer */}
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressHeader}>
          <Text style={[styles.progressText, { color: colors.textSecondary }]}>{t('flashcard.cardOf', { current: currentIndex + 1, total: mockCards.length })}</Text>
          <Text style={[styles.progressPercent, { color: colors.primary }]}>{Math.round(progress)}%</Text>
        </View>
        <View style={[styles.progressTrack, { backgroundColor: colors.border }]}>
          <View style={[styles.progressFill, { width: `${progress}%`, backgroundColor: colors.primary }]} />
        </View>
      </View>

      {/* Flashcard Area */}
      <View style={styles.cardArea}>
        <TouchableOpacity activeOpacity={0.9} onPress={flipCard} style={styles.cardWrapper}>
          {/* Front of Card */}
          <Animated.View style={[styles.card, styles.cardFront, frontAnimatedStyle, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.cardInner}>
              <Text style={[styles.cardTypeLabel, { color: colors.textSecondary }]}>{t('flashcard.question')}</Text>
              <Text style={[styles.cardText, { color: colors.text }]}>{currentCard.question}</Text>
              <View style={[styles.flipHintContainer, { backgroundColor: colors.background }]}>
                <RotateCcw color={colors.textSecondary} size={16} style={{ marginRight: 6 }} />
                <Text style={[styles.flipHint, { color: colors.textSecondary }]}>{t('flashcard.tapToFlip')}</Text>
              </View>
            </View>
          </Animated.View>

          {/* Back of Card */}
          <Animated.View style={[styles.card, styles.cardBack, backAnimatedStyle, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.cardInner}>
              <Text style={[styles.cardTypeLabel, { color: '#10B981' }]}>{t('flashcard.answer')}</Text>
              <Text style={[styles.cardText, { color: colors.text }]}>{currentCard.answer}</Text>
            </View>
          </Animated.View>
        </TouchableOpacity>
      </View>

      {/* Controls */}
      <View style={styles.controlsContainer}>
        {!isFlipped ? (
          <TouchableOpacity style={[styles.showAnswerBtn, { backgroundColor: colors.background }]} onPress={flipCard}>
            <Text style={[styles.showAnswerText, { color: colors.primary }]}>{t('flashcard.showAnswer')}</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.actionButtonsRow}>
            <TouchableOpacity style={[styles.actionBtn, styles.btnReview]} onPress={nextCard}>
              <X color="#EF4444" size={28} />
              <Text style={styles.btnReviewText}>{t('flashcard.needReview')}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.actionBtn, styles.btnGotIt]} onPress={nextCard}>
              <Check color="#FFF" size={28} />
              <Text style={styles.btnGotItText}>{t('flashcard.gotIt')}</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 20 },
  backBtn: { width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  headerTitle: { fontSize: 18, fontWeight: '600' },
  progressContainer: { paddingHorizontal: 20, marginBottom: 30 },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  progressText: { fontSize: 14, fontWeight: '500' },
  progressPercent: { fontSize: 14, fontWeight: '600' },
  progressTrack: { height: 8, borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 4 },
  cardArea: { flex: 1, paddingHorizontal: 20, alignItems: 'center', justifyContent: 'center' },
  cardWrapper: { width: '100%', height: '85%' },
  card: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: 24, backfaceVisibility: 'hidden', shadowOpacity: 0.05, shadowOffset: { width: 0, height: 8 }, shadowRadius: 16, elevation: 4, borderWidth: 1 },
  cardFront: { zIndex: 2 },
  cardBack: { zIndex: 1 },
  cardInner: { flex: 1, padding: 32, justifyContent: 'center', alignItems: 'center' },
  cardTypeLabel: { position: 'absolute', top: 32, fontSize: 12, fontWeight: '700', letterSpacing: 1.5 },
  cardText: { fontSize: 24, fontWeight: '500', textAlign: 'center', lineHeight: 34 },
  flipHintContainer: { position: 'absolute', bottom: 32, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  flipHint: { fontSize: 14, fontWeight: '500' },
  controlsContainer: { paddingHorizontal: 20, paddingTop: 20 },
  showAnswerBtn: { width: '100%', paddingVertical: 18, borderRadius: 16, alignItems: 'center' },
  showAnswerText: { fontSize: 16, fontWeight: '600' },
  actionButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '48%',
    paddingVertical: 16,
    borderRadius: 16,
  },
  btnReview: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  btnGotIt: {
    backgroundColor: '#10B981',
  },
  btnReviewText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#EF4444',
    marginLeft: 8,
  },
  btnGotItText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFF',
    marginLeft: 8,
  },
});
