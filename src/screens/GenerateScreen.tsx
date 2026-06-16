import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { ChevronLeft, Wand2, Upload, Camera } from 'lucide-react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/StackNav';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';

export const GenerateScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'Generate'>>();
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

  const [text, setText] = useState(route.params?.scannedText || '');
  const [outputType, setOutputType] = useState('Flashcards');
  const [difficulty, setDifficulty] = useState('Medium');

  const outputTypes = [
    { id: 'Flashcards', label: t('library.flashcards') },
    { id: 'Quiz', label: t('library.quizzes') },
    { id: 'Summary', label: 'Summary' },
    { id: 'Mind Map', label: t('generate.mindMap') }
  ];
  
  const difficulties = [
    { id: 'Easy', label: t('generate.easy') },
    { id: 'Medium', label: t('generate.medium') },
    { id: 'Hard', label: t('generate.hard') }
  ];

  const handleGenerate = () => {
    navigation.navigate('Processing');
  };

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: colors.background }]} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity style={[styles.backBtn, { backgroundColor: colors.surface, borderColor: colors.border }]} onPress={() => navigation.goBack()}>
          <ChevronLeft color={colors.text} size={24} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{t('generate.title')}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('generate.inputSource')}</Text>
          <View style={styles.sourceButtons}>
            <TouchableOpacity 
              style={[styles.sourceBtn, { backgroundColor: colors.surface, borderColor: colors.primary, borderWidth: 1 }]}
              onPress={() => navigation.navigate('MainTabs', { screen: 'Scan' })}
            >
              <Camera color={colors.primary} size={20} />
              <Text style={[styles.sourceBtnText, { color: colors.primary }]}>{t('generate.scanNotes')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.sourceBtn, { backgroundColor: colors.surface, borderColor: colors.primary, borderWidth: 1 }]}>
              <Upload color={colors.primary} size={20} />
              <Text style={[styles.sourceBtnText, { color: colors.primary }]}>{t('generate.uploadPdf')}</Text>
            </TouchableOpacity>
          </View>
          
          <View style={[styles.textInputContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <TextInput
              style={[styles.textInput, { color: colors.text }]}
              placeholder={t('generate.pasteText')}
              placeholderTextColor={colors.textSecondary}
              multiline
              textAlignVertical="top"
              value={text}
              onChangeText={setText}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('generate.outputType')}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollOptions}>
            {outputTypes.map((type) => (
              <TouchableOpacity 
                key={type.id}
                style={[styles.pill, { backgroundColor: colors.surface, borderColor: colors.border }, outputType === type.id && { backgroundColor: colors.primary, borderColor: colors.primary }]}
                onPress={() => setOutputType(type.id)}
              >
                <Text style={[styles.pillText, { color: colors.textSecondary }, outputType === type.id && styles.pillTextActive]}>
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('generate.difficultyLevel')}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollOptions}>
            {difficulties.map((level) => (
              <TouchableOpacity 
                key={level.id}
                style={[styles.pill, { backgroundColor: colors.surface, borderColor: colors.border }, difficulty === level.id && { backgroundColor: colors.primary, borderColor: colors.primary }]}
                onPress={() => setDifficulty(level.id)}
              >
                <Text style={[styles.pillText, { color: colors.textSecondary }, difficulty === level.id && styles.pillTextActive]}>
                  {level.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </ScrollView>

      <View style={[styles.bottomContainer, { paddingBottom: insets.bottom + 20, backgroundColor: colors.background }]}>
        <TouchableOpacity style={[styles.generateBtn, { backgroundColor: colors.primary, shadowColor: colors.primary }]} onPress={handleGenerate}>
          <Wand2 color="#FFF" size={20} style={{ marginRight: 8 }} />
          <Text style={styles.generateBtnText}>{t('generate.generateWithAi')}</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 20 },
  backBtn: { width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  headerTitle: { fontSize: 18, fontWeight: '600' },
  section: { paddingHorizontal: 20, marginBottom: 28 },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 16 },
  sourceButtons: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  sourceBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '48%', paddingVertical: 14, borderRadius: 12 },
  sourceBtnText: { fontSize: 14, fontWeight: '600', marginLeft: 8 },
  textInputContainer: { borderRadius: 16, borderWidth: 1, height: 200 },
  textInput: { flex: 1, padding: 16, fontSize: 15, lineHeight: 22 },
  scrollOptions: { flexDirection: 'row' },
  pill: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20, borderWidth: 1, marginRight: 12 },
  pillText: { fontSize: 14, fontWeight: '500' },
  pillTextActive: { color: '#FFF' },
  bottomContainer: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: 20, paddingTop: 16 },
  generateBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 18, borderRadius: 16, shadowOpacity: 0.3, shadowOffset: { width: 0, height: 4 }, shadowRadius: 8, elevation: 4 },
  generateBtnText: { fontSize: 16, fontWeight: '600', color: '#FFF' },
});
