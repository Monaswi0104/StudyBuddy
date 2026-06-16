import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, LayoutAnimation } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, StackActions } from '@react-navigation/native';
import { ChevronLeft, CheckCircle2, XCircle } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';

const mockQuestions = [
  {
    id: '1',
    question: 'Which of the following cellular organelles is primarily responsible for protein synthesis?',
    options: ['Mitochondria', 'Ribosomes', 'Nucleus', 'Golgi Apparatus'],
    correctAnswer: 1,
  },
  {
    id: '2',
    question: 'During which phase of mitosis do the chromosomes align in the center of the cell?',
    options: ['Prophase', 'Metaphase', 'Anaphase', 'Telophase'],
    correctAnswer: 1,
  },
  {
    id: '3',
    question: 'What is the main function of the cell membrane?',
    options: [
      'To generate energy for the cell',
      'To store genetic information',
      'To regulate what enters and leaves the cell',
      'To break down cellular waste'
    ],
    correctAnswer: 2,
  }
];

export const QuizScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { colors, isDarkMode } = useTheme();
  const { t } = useTranslation();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

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
      if (selectedOption === currentQ.correctAnswer) {
        setScore(prev => prev + 1);
      }
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
      <View style={styles.header}>
        <TouchableOpacity style={[styles.backBtn, { backgroundColor: colors.surface, borderColor: colors.border }]} onPress={() => navigation.goBack()}>
          <ChevronLeft color={colors.text} size={24} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{t('quiz.title')}</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Progress */}
      <View style={styles.progressContainer}>
        <View style={[styles.progressTrack, { backgroundColor: colors.border }]}>
          <View style={[styles.progressFill, { width: `${progress}%`, backgroundColor: colors.primary }]} />
        </View>
        <Text style={[styles.progressText, { color: colors.textSecondary }]}>{t('quiz.questionOf', { current: currentIndex + 1, total: mockQuestions.length })}</Text>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 20 }}>
        {/* Question */}
        <View style={[styles.questionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.questionText, { color: colors.text }]}>{currentQ.question}</Text>
        </View>

        {/* Options */}
        <View style={styles.optionsContainer}>
          {currentQ.options.map((option, index) => {
            const isSelected = selectedOption === index;
            const isCorrect = isSubmitted && index === currentQ.correctAnswer;
            const isWrong = isSubmitted && isSelected && index !== currentQ.correctAnswer;

            let bgColor = colors.surface;
            let borderColor = colors.border;
            let textColor = colors.text;

            if (isSelected && !isSubmitted) {
              bgColor = isDarkMode ? 'rgba(79, 70, 229, 0.2)' : '#EEF2FF';
              borderColor = colors.primary;
              textColor = colors.primary;
            } else if (isCorrect) {
              bgColor = isDarkMode ? 'rgba(16, 185, 129, 0.2)' : '#ECFDF5';
              borderColor = '#10B981';
              textColor = isDarkMode ? '#34D399' : '#059669';
            } else if (isWrong) {
              bgColor = isDarkMode ? 'rgba(239, 68, 68, 0.2)' : '#FEF2F2';
              borderColor = '#EF4444';
              textColor = isDarkMode ? '#F87171' : '#DC2626';
            }

            return (
              <TouchableOpacity
                key={index}
                activeOpacity={0.7}
                style={[styles.optionBtn, { backgroundColor: bgColor, borderColor }]}
                onPress={() => handleSelect(index)}
              >
                <View style={styles.optionContent}>
                  <View style={[
                    styles.optionCircle, 
                    isSelected && !isSubmitted && { borderColor: '#4F46E5', borderWidth: 6 },
                    isCorrect && { borderColor: '#10B981', backgroundColor: '#10B981' },
                    isWrong && { borderColor: '#EF4444', backgroundColor: '#EF4444' }
                  ]} />
                  <Text style={[styles.optionText, { color: textColor }]}>{option}</Text>
                </View>
                {isCorrect && <CheckCircle2 color="#10B981" size={24} />}
                {isWrong && <XCircle color="#EF4444" size={24} />}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Bottom Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity 
          style={[styles.submitBtn, { backgroundColor: colors.primary, shadowColor: colors.primary }, selectedOption === null && !isSubmitted && { backgroundColor: colors.border, shadowOpacity: 0, elevation: 0 }]} 
          disabled={selectedOption === null && !isSubmitted}
          onPress={handleSubmit}
        >
          <Text style={[styles.submitBtnText, selectedOption === null && !isSubmitted && { color: colors.textSecondary }]}>
            {!isSubmitted ? t('quiz.submitAnswer') : (currentIndex < mockQuestions.length - 1 ? t('quiz.nextQuestion') : t('quiz.viewResults'))}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 20 },
  backBtn: { width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  headerTitle: { fontSize: 18, fontWeight: '600' },
  progressContainer: { paddingHorizontal: 20, marginBottom: 24 },
  progressTrack: { height: 8, borderRadius: 4, overflow: 'hidden', marginBottom: 8 },
  progressFill: { height: '100%', borderRadius: 4 },
  progressText: { fontSize: 14, fontWeight: '500' },
  questionCard: { padding: 24, borderRadius: 20, borderWidth: 1, shadowOpacity: 0.02, shadowOffset: { width: 0, height: 4 }, shadowRadius: 12, elevation: 2, marginBottom: 24 },
  questionText: { fontSize: 20, fontWeight: '600', lineHeight: 30 },
  optionsContainer: { marginBottom: 40 },
  optionBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, borderRadius: 16, borderWidth: 1.5, marginBottom: 12 },
  optionContent: { flexDirection: 'row', alignItems: 'center', flex: 1, paddingRight: 16 },
  optionCircle: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: '#D1D5DB', marginRight: 16 },
  optionText: { fontSize: 16, fontWeight: '500', flexShrink: 1, lineHeight: 24 },
  bottomContainer: { paddingHorizontal: 20, paddingTop: 10 },
  submitBtn: { paddingVertical: 18, borderRadius: 16, alignItems: 'center', shadowOpacity: 0.3, shadowOffset: { width: 0, height: 4 }, shadowRadius: 8, elevation: 4 },
  submitBtnDisabled: {},
  submitBtnText: { fontSize: 16, fontWeight: '600', color: '#FFF' },
});
