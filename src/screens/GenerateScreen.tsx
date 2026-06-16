import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, Animated, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { ChevronLeft, Wand2, Upload, Camera, ArrowRight, Sparkles } from 'lucide-react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/StackNav';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const GenerateScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'Generate'>>();
  const { colors, isDarkMode } = useTheme();
  const { t } = useTranslation();

  // Staggered animations
  const headerFade = useRef(new Animated.Value(0)).current;
  const sourceFade = useRef(new Animated.Value(0)).current;
  const sourceSlide = useRef(new Animated.Value(30)).current;
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
      stagger(sourceFade, sourceSlide, 100),
      stagger(optionsFade, optionsSlide, 200),
    ]).start();
  }, [headerFade, sourceFade, sourceSlide, optionsFade, optionsSlide]);

  const [text, setText] = useState(route.params?.scannedText || '');
  const [outputType, setOutputType] = useState('Flashcards');
  const [difficulty, setDifficulty] = useState('Medium');
  const [isFocused, setIsFocused] = useState(false);

  const outputTypes = [
    { id: 'Flashcards', label: t('library.flashcards'), color: '#22C55E' },
    { id: 'Quiz', label: t('library.quizzes'), color: '#3B82F6' },
    { id: 'Summary', label: 'Summary', color: '#F59E0B' },
    { id: 'Mind Map', label: t('generate.mindMap'), color: '#8B5CF6' },
  ];

  const difficulties = [
    { id: 'Easy', label: t('generate.easy'), color: '#22C55E' },
    { id: 'Medium', label: t('generate.medium'), color: '#F59E0B' },
    { id: 'Hard', label: t('generate.hard'), color: '#EF4444' },
  ];

  const handleGenerate = () => {
    navigation.navigate('Processing');
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Header */}
      <Animated.View style={[styles.header, { paddingTop: insets.top + 10, opacity: headerFade }]}>
        <TouchableOpacity style={[styles.backBtn, {
          backgroundColor: isDarkMode ? colors.surface : '#FFFFFF',
          borderColor: isDarkMode ? colors.border : '#F3F4F6',
        }]} onPress={() => navigation.goBack()}>
          <ChevronLeft color={colors.text} size={24} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{t('generate.title')}</Text>
        <View style={[styles.aiBadge, { backgroundColor: isDarkMode ? 'rgba(139,92,246,0.15)' : '#F5F3FF' }]}>
          <Sparkles color="#8B5CF6" size={14} />
          <Text style={styles.aiBadgeText}>AI</Text>
        </View>
      </Animated.View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Source Section */}
        <Animated.View style={[styles.section, { opacity: sourceFade, transform: [{ translateY: sourceSlide }] }]}>
          <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>{t('generate.inputSource')}</Text>
          <View style={styles.sourceButtons}>
            <TouchableOpacity
              style={[styles.sourceBtn, {
                backgroundColor: isDarkMode ? colors.surface : '#FFFFFF',
                borderColor: isDarkMode ? colors.border : 'rgba(34,197,94,0.2)',
              }]}
              onPress={() => navigation.navigate('MainTabs', { screen: 'Scan' })}
            >
              <View style={[styles.sourceIconBox, { backgroundColor: isDarkMode ? 'rgba(34,197,94,0.15)' : '#ECFDF5' }]}>
                <Camera color="#22C55E" size={18} />
              </View>
              <Text style={[styles.sourceBtnText, { color: colors.text }]}>{t('generate.scanNotes')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.sourceBtn, {
              backgroundColor: isDarkMode ? colors.surface : '#FFFFFF',
              borderColor: isDarkMode ? colors.border : 'rgba(59,130,246,0.2)',
            }]}>
              <View style={[styles.sourceIconBox, { backgroundColor: isDarkMode ? 'rgba(59,130,246,0.15)' : '#EFF6FF' }]}>
                <Upload color="#3B82F6" size={18} />
              </View>
              <Text style={[styles.sourceBtnText, { color: colors.text }]}>{t('generate.uploadPdf')}</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.textInputContainer, {
            backgroundColor: isDarkMode ? colors.surface : '#FFFFFF',
            borderColor: isFocused ? colors.primary : (isDarkMode ? colors.border : '#F3F4F6'),
          }]}>
            <View style={[styles.textInputAccent, { backgroundColor: isFocused ? colors.primary : 'transparent' }]} />
            <TextInput
              style={[styles.textInput, { color: colors.text }]}
              placeholder={t('generate.pasteText')}
              placeholderTextColor={colors.textSecondary}
              multiline
              textAlignVertical="top"
              value={text}
              onChangeText={setText}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
          </View>
        </Animated.View>

        {/* Output Type */}
        <Animated.View style={[styles.section, { opacity: optionsFade, transform: [{ translateY: optionsSlide }] }]}>
          <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>{t('generate.outputType')}</Text>
          <View style={styles.pillGrid}>
            {outputTypes.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={[styles.pill, {
                  backgroundColor: outputType === type.id
                    ? colors.primary
                    : isDarkMode ? colors.surface : '#FFFFFF',
                  borderColor: outputType === type.id
                    ? colors.primary
                    : isDarkMode ? colors.border : '#F3F4F6',
                }, outputType === type.id && { shadowColor: colors.primary, shadowOpacity: 0.25, shadowOffset: { width: 0, height: 3 }, shadowRadius: 8, elevation: 4 }]}
                onPress={() => setOutputType(type.id)}
              >
                <Text style={[styles.pillText, { color: outputType === type.id ? '#FFF' : colors.textSecondary }]}>{type.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Difficulty */}
        <Animated.View style={[styles.section, { opacity: optionsFade, transform: [{ translateY: optionsSlide }] }]}>
          <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>{t('generate.difficultyLevel')}</Text>
          <View style={styles.pillGrid}>
            {difficulties.map((level) => (
              <TouchableOpacity
                key={level.id}
                style={[styles.pill, {
                  backgroundColor: difficulty === level.id
                    ? colors.primary
                    : isDarkMode ? colors.surface : '#FFFFFF',
                  borderColor: difficulty === level.id
                    ? colors.primary
                    : isDarkMode ? colors.border : '#F3F4F6',
                }, difficulty === level.id && { shadowColor: colors.primary, shadowOpacity: 0.25, shadowOffset: { width: 0, height: 3 }, shadowRadius: 8, elevation: 4 }]}
                onPress={() => setDifficulty(level.id)}
              >
                <View style={[styles.diffDot, { backgroundColor: level.color }]} />
                <Text style={[styles.pillText, { color: difficulty === level.id ? '#FFF' : colors.textSecondary }]}>{level.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>
      </ScrollView>

      {/* Generate Button */}
      <View style={[styles.bottomContainer, { paddingBottom: insets.bottom + 20, backgroundColor: colors.background }]}>
        <TouchableOpacity style={styles.generateBtn} onPress={handleGenerate}>
          <Wand2 color="#FFF" size={18} style={{ marginRight: 8 }} />
          <Text style={styles.generateBtnText}>{t('generate.generateWithAi')}</Text>
          <View style={styles.genArrow}><ArrowRight color="#4F46E5" size={16} /></View>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 20 },
  backBtn: { width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 1, shadowColor: '#000', shadowOpacity: 0.04, shadowOffset: { width: 0, height: 2 }, shadowRadius: 8, elevation: 1 },
  headerTitle: { fontSize: 18, fontWeight: '700', letterSpacing: -0.3 },
  aiBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10, gap: 4 },
  aiBadgeText: { fontSize: 12, fontWeight: '800', color: '#8B5CF6' },

  section: { paddingHorizontal: 20, marginBottom: 28 },
  sectionLabel: { fontSize: 13, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12, marginLeft: 4 },

  sourceButtons: { flexDirection: 'row', justifyContent: 'space-between', gap: 12, marginBottom: 16 },
  sourceBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderRadius: 14, borderWidth: 1, gap: 8 },
  sourceIconBox: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  sourceBtnText: { fontSize: 13, fontWeight: '600' },

  textInputContainer: { borderRadius: 20, borderWidth: 1.5, height: 180, overflow: 'hidden' },
  textInputAccent: { position: 'absolute', top: 0, left: 0, right: 0, height: 3 },
  textInput: { flex: 1, padding: 16, fontSize: 15, lineHeight: 22 },

  pillGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  pill: { paddingHorizontal: 18, paddingVertical: 10, borderRadius: 24, borderWidth: 1, flexDirection: 'row', alignItems: 'center' },
  pillText: { fontSize: 14, fontWeight: '600' },
  diffDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },

  bottomContainer: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: 20, paddingTop: 12 },
  generateBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 18, borderRadius: 16, backgroundColor: '#4F46E5', shadowColor: '#4F46E5', shadowOpacity: 0.35, shadowOffset: { width: 0, height: 6 }, shadowRadius: 12, elevation: 6 },
  generateBtnText: { fontSize: 16, fontWeight: '700', color: '#FFF', marginRight: 10 },
  genArrow: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center' },
});
