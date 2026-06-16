import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, LayoutAnimation, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, StackActions } from '@react-navigation/native';
import { ChevronLeft, CheckCircle2, XCircle, ArrowRight } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';

const mockQuestions = [
  { id: '1', question: 'Which of the following cellular organelles is primarily responsible for protein synthesis?', options: ['Mitochondria', 'Ribosomes', 'Nucleus', 'Golgi Apparatus'], correctAnswer: 1 },
  { id: '2', question: 'During which phase of mitosis do the chromosomes align in the center of the cell?', options: ['Prophase', 'Metaphase', 'Anaphase', 'Telophase'], correctAnswer: 1 },
  { id: '3', question: 'What is the main function of the cell membrane?', options: ['To generate energy for the cell', 'To store genetic information', 'To regulate what enters and leaves the cell', 'To break down cellular waste'], correctAnswer: 2 },
];

const OPTION_LETTERS = ['A', 'B', 'C', 'D'];

export const QuizScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { colors, isDarkMode } = useTheme();
  const { t } = useTranslation();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // Entrance animations
  const headerFade = useRef(new Animated.Value(0)).current;
  const questionFade = useRef(new Animated.Value(0)).current;
  const questionSlide = useRef(new Animated.Value(30)).current;
  const optionsFade = useRef(new Animated.Value(0)).current;
  const optionsSlide = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    const stagger = (fade: Animated.Value, slide: Animated.Value | null, delay: number) => {
      const anims = [Animated.timing(fade, { toValue: 1, duration: 450, delay, useNativeDriver: true })];
      if (slide) anims.push(Animated.timing(slide, { toValue: 0, duration: 450, delay, useNativeDriver: true }));
      return Animated.parallel(anims);
    };
    Animated.parallel([
      stagger(headerFade, null, 0),
      stagger(questionFade, questionSlide, 100),
      stagger(optionsFade, optionsSlide, 200),
    ]).start();
  }, [headerFade, questionFade, questionSlide, optionsFade, optionsSlide]);

  const currentQ = mockQuestions[currentIndex];
  const progress = ((currentIndex + 1) / mockQuestions.length) * 100;

  const handleSelect = (index: number) => {
    if (!isSubmitted) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setSelectedOption(index);
    }
  };

  const handleSubmit = () => {
    if (!isSubmitted) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      if (selectedOption === currentQ.correctAnswer) setScore(prev => prev + 1);
      setIsSubmitted(true);
    } else {
      if (currentIndex < mockQuestions.length - 1) {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setCurrentIndex(prev => prev + 1);
        setSelectedOption(null);
        setIsSubmitted(false);
      } else {
        navigation.dispatch(StackActions.replace('QuizResult', { score }));
      }
    }
  };

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
        <Text style={[styles.headerTitle, { color: colors.text }]}>{t('quiz.title')}</Text>
        <View style={[styles.counterBadge, { backgroundColor: isDarkMode ? colors.surface : '#EEF2FF' }]}>
          <Text style={[styles.counterText, { color: colors.primary }]}>{currentIndex + 1}/{mockQuestions.length}</Text>
        </View>
      </Animated.View>

      {/* Progress */}
      <Animated.View style={[styles.progressContainer, { opacity: headerFade }]}>
        <View style={[styles.progressTrack, { backgroundColor: isDarkMode ? colors.border : '#F3F4F6' }]}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <Text style={[styles.progressText, { color: colors.textSecondary }]}>{t('quiz.questionOf', { current: currentIndex + 1, total: mockQuestions.length })}</Text>
      </Animated.View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 20 }} showsVerticalScrollIndicator={false}>
        {/* Question Card */}
        <Animated.View style={[styles.questionCard, {
          backgroundColor: isDarkMode ? colors.surface : '#FFFFFF',
          borderColor: isDarkMode ? colors.border : '#F3F4F6',
          opacity: questionFade,
          transform: [{ translateY: questionSlide }],
        }]}>
          <View style={styles.questionAccent} />
          <Text style={[styles.questionText, { color: colors.text }]}>{currentQ.question}</Text>
        </Animated.View>

        {/* Options */}
        <Animated.View style={[styles.optionsContainer, { opacity: optionsFade, transform: [{ translateY: optionsSlide }] }]}>
          {currentQ.options.map((option, index) => {
            const isSelected = selectedOption === index;
            const isCorrect = isSubmitted && index === currentQ.correctAnswer;
            const isWrong = isSubmitted && isSelected && index !== currentQ.correctAnswer;

            let bgColor = isDarkMode ? colors.surface : '#FFFFFF';
            let borderColor = isDarkMode ? colors.border : '#F3F4F6';
            let letterBg = isDarkMode ? colors.border : '#F3F4F6';
            let letterColor = colors.textSecondary;

            if (isSelected && !isSubmitted) {
              bgColor = isDarkMode ? 'rgba(79,70,229,0.12)' : '#EEF2FF';
              borderColor = '#4F46E5';
              letterBg = '#4F46E5';
              letterColor = '#FFF';
            } else if (isCorrect) {
              bgColor = isDarkMode ? 'rgba(34,197,94,0.12)' : '#ECFDF5';
              borderColor = '#22C55E';
              letterBg = '#22C55E';
              letterColor = '#FFF';
            } else if (isWrong) {
              bgColor = isDarkMode ? 'rgba(239,68,68,0.12)' : '#FEF2F2';
              borderColor = '#EF4444';
              letterBg = '#EF4444';
              letterColor = '#FFF';
            }

            return (
              <TouchableOpacity
                key={index}
                activeOpacity={0.7}
                style={[styles.optionBtn, { backgroundColor: bgColor, borderColor }]}
                onPress={() => handleSelect(index)}
              >
                <View style={[styles.optionLetter, { backgroundColor: letterBg }]}>
                  <Text style={[styles.optionLetterText, { color: letterColor }]}>{OPTION_LETTERS[index]}</Text>
                </View>
                <Text style={[styles.optionText, { color: colors.text, flex: 1 }]}>{option}</Text>
                {isCorrect && <CheckCircle2 color="#22C55E" size={22} />}
                {isWrong && <XCircle color="#EF4444" size={22} />}
              </TouchableOpacity>
            );
          })}
        </Animated.View>
      </ScrollView>

      {/* Bottom Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[
            styles.submitBtn,
            selectedOption === null && !isSubmitted
              ? { backgroundColor: isDarkMode ? colors.border : '#E5E7EB' }
              : { backgroundColor: '#4F46E5', shadowColor: '#4F46E5', shadowOpacity: 0.35, shadowOffset: { width: 0, height: 6 }, shadowRadius: 12, elevation: 6 },
          ]}
          disabled={selectedOption === null && !isSubmitted}
          onPress={handleSubmit}
        >
          <Text style={[styles.submitBtnText, selectedOption === null && !isSubmitted && { color: colors.textSecondary }]}>
            {!isSubmitted ? t('quiz.submitAnswer') : (currentIndex < mockQuestions.length - 1 ? t('quiz.nextQuestion') : t('quiz.viewResults'))}
          </Text>
          {(selectedOption !== null || isSubmitted) && <View style={styles.submitArrow}><ArrowRight color="#4F46E5" size={16} /></View>}
        </TouchableOpacity>
      </View>
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
  progressTrack: { height: 6, borderRadius: 3, overflow: 'hidden', marginBottom: 8 },
  progressFill: { height: '100%', borderRadius: 3, backgroundColor: '#4F46E5' },
  progressText: { fontSize: 13, fontWeight: '500' },

  questionCard: { padding: 24, borderRadius: 20, borderWidth: 1, marginBottom: 24, overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.03, shadowOffset: { width: 0, height: 2 }, shadowRadius: 8, elevation: 1 },
  questionAccent: { position: 'absolute', top: 0, left: 0, right: 0, height: 3, backgroundColor: '#4F46E5' },
  questionText: { fontSize: 18, fontWeight: '600', lineHeight: 28 },

  optionsContainer: { marginBottom: 40, gap: 12 },
  optionBtn: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 16, borderWidth: 1.5, gap: 14 },
  optionLetter: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  optionLetterText: { fontSize: 14, fontWeight: '700' },
  optionText: { fontSize: 15, fontWeight: '500', lineHeight: 22 },

  bottomContainer: { paddingHorizontal: 20, paddingTop: 10 },
  submitBtn: { flexDirection: 'row', paddingVertical: 18, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  submitBtnText: { fontSize: 16, fontWeight: '700', color: '#FFF', marginRight: 10 },
  submitArrow: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center' },
});
