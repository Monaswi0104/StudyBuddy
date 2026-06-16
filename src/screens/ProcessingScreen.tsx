import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { useNavigation, StackActions } from '@react-navigation/native';
import { Bot } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';

export const ProcessingScreen = () => {
  const navigation = useNavigation();
  const { colors, isDarkMode } = useTheme();
  const { t } = useTranslation();
  
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

    // Simulate AI steps
    const timer1 = setTimeout(() => setStepText(t('processing.step2')), 1500);
    const timer2 = setTimeout(() => setStepText(t('processing.step3')), 3000);
    const timer3 = setTimeout(() => {
      // Use replace so user can't go back to the loading screen
      navigation.dispatch(StackActions.replace('FlashCards', {}));
    }, 4500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [navigation, pulseValue, rotateValue, t]);

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
