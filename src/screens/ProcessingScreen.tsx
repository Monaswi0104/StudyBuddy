import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Easing, Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp, StackActions } from '@react-navigation/native';
import { Bot } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { generateStudyMaterial } from '../api/aiService';
import { parseAIResponse } from '../utils/parseAIResponse';
import { RootStackParamList } from '../navigation/StackNav';
import { useStudyStore, StudyMaterial } from '../store/studyStore';

export const ProcessingScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RootStackParamList, 'Processing'>>();
  const { colors, isDarkMode } = useTheme();
  const { t } = useTranslation();
  const addMaterial = useStudyStore((state) => state.addMaterial);
  
  const pulseValue = useRef(new Animated.Value(1)).current;
  const rotateValue = useRef(new Animated.Value(0)).current;
  const [stepText, setStepText] = useState(t('processing.step1'));

  useEffect(() => {
    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseValue, { toValue: 1.15, duration: 1000, useNativeDriver: true }),
        Animated.timing(pulseValue, { toValue: 1, duration: 1000, useNativeDriver: true }),
      ])
    ).start();

    // Subtle rotation back and forth
    Animated.loop(
      Animated.sequence([
        Animated.timing(rotateValue, { toValue: 1, duration: 1500, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(rotateValue, { toValue: -1, duration: 3000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(rotateValue, { toValue: 0, duration: 1500, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    ).start();

    let isMounted = true;

    const processAI = async () => {
      try {
        const { scannedText = '', outputType = 'Summary', difficulty = 'Medium', numItems = 10 } = route.params || {};
        
        if (!scannedText) {
          throw new Error('No text provided for generation.');
        }

        const rawJson = await generateStudyMaterial({ 
          text: scannedText, 
          outputType: outputType as any, 
          difficulty,
          numItems,
          onProgress: (current, total) => {
            if (isMounted && total > 1) {
              setStepText(`Processing part ${current} of ${total}...`);
            } else if (isMounted) {
              setStepText(t('processing.step2'));
            }
          }
        });
        const parsedData = parseAIResponse(rawJson, outputType);

        // Generate a title from the first 40 chars of the scanned text
        const autoTitle = scannedText.substring(0, 40).replace(/\n/g, ' ').trim() + (scannedText.length > 40 ? '...' : '');

        // Generate a valid UUID v4 for Supabase
        const generateUUID = () => {
          return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
          });
        };

        // Save to persistent store
        const newMaterial: StudyMaterial = {
          id: generateUUID(),
          title: autoTitle || 'Untitled',
          type: outputType as StudyMaterial['type'],
          difficulty,
          data: parsedData,
          createdAt: Date.now(),
        };
        addMaterial(newMaterial);

        if (isMounted) setStepText(t('processing.step3'));

        setTimeout(() => {
          if (!isMounted) return;
          // Navigate to respective screens based on output type
          if (outputType === 'Flashcards') {
            navigation.dispatch(StackActions.replace('FlashCards', { data: parsedData, title: newMaterial.title }));
          } else if (outputType === 'Quiz') {
            navigation.dispatch(StackActions.replace('Quiz', { data: parsedData, title: newMaterial.title }));
          } else if (outputType === 'Summary') {
            navigation.dispatch(StackActions.replace('Summary', { data: parsedData, title: newMaterial.title }));
          } else if (outputType === 'Mind Map') {
            navigation.dispatch(StackActions.replace('MindMap', { data: parsedData, title: newMaterial.title }));
          } else {
            navigation.dispatch(StackActions.replace('MainTabs'));
          }
        }, 1000);
        
      } catch (error: any) {
        if (isMounted) {
          Alert.alert('Error', error.message || 'Something went wrong during generation.');
          navigation.goBack();
        }
      }
    };

    processAI();

    return () => {
      isMounted = false;
    };
  }, [navigation, pulseValue, rotateValue, t, route.params]);

  const spin = rotateValue.interpolate({
    inputRange: [-1, 1],
    outputRange: ['-10deg', '10deg'],
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Animated.View 
        style={[
          styles.iconRing, 
          { transform: [{ scale: pulseValue }], backgroundColor: isDarkMode ? 'rgba(124, 58, 237, 0.3)' : 'rgba(124, 58, 237, 0.15)' }
        ]}
      >
        <Animated.View style={{ transform: [{ rotate: spin }] }}>
          <View style={[styles.iconInner, { backgroundColor: colors.primary, shadowColor: colors.primary }]}>
            <Bot color="#FFF" size={48} />
          </View>
        </Animated.View>
      </Animated.View>

      <Text style={[styles.title, { color: colors.text }]}>{t('processing.title')}</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{stepText}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 },
  iconRing: { width: 140, height: 140, borderRadius: 70, alignItems: 'center', justifyContent: 'center', marginBottom: 40 },
  iconInner: { width: 90, height: 90, borderRadius: 45, alignItems: 'center', justifyContent: 'center', shadowOpacity: 0.4, shadowOffset: { width: 0, height: 8 }, shadowRadius: 16, elevation: 8 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 12 },
  subtitle: { fontSize: 16, fontWeight: '500' },
});
