import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft, Target, Bell, Flame, Minus, Plus, ArrowRight } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';

export const StudyGoalsScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { colors, isDarkMode } = useTheme();
  const { t } = useTranslation();

  const headerFade = useRef(new Animated.Value(0)).current;
  const card1Fade = useRef(new Animated.Value(0)).current;
  const card1Slide = useRef(new Animated.Value(20)).current;
  const card2Fade = useRef(new Animated.Value(0)).current;
  const card2Slide = useRef(new Animated.Value(20)).current;
  const card3Fade = useRef(new Animated.Value(0)).current;
  const card3Slide = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    const s = (f: Animated.Value, sl: Animated.Value | null, d: number) => {
      const a = [Animated.timing(f, { toValue: 1, duration: 400, delay: d, useNativeDriver: true })];
      if (sl) a.push(Animated.timing(sl, { toValue: 0, duration: 400, delay: d, useNativeDriver: true }));
      return Animated.parallel(a);
    };
    Animated.parallel([s(headerFade, null, 0), s(card1Fade, card1Slide, 80), s(card2Fade, card2Slide, 160), s(card3Fade, card3Slide, 240)]).start();
  }, [headerFade, card1Fade, card1Slide, card2Fade, card2Slide, card3Fade, card3Slide]);

  const [dailyMinutes, setDailyMinutes] = useState(30);
  const [weeklyCards, setWeeklyCards] = useState(100);
  const [remindersEnabled, setRemindersEnabled] = useState(true);

  return (
    <View style={[styles.container, { paddingTop: insets.top + 10, paddingBottom: insets.bottom + 20, backgroundColor: colors.background }]}>
      <Animated.View style={[styles.header, { opacity: headerFade }]}>
        <TouchableOpacity style={[styles.backBtn, {
          backgroundColor: isDarkMode ? colors.surface : '#FFFFFF',
          borderColor: isDarkMode ? colors.border : '#F3F4F6',
        }]} onPress={() => navigation.goBack()}>
          <ChevronLeft color={colors.text} size={24} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{t('goals.title')}</Text>
        <View style={{ width: 42 }} />
      </Animated.View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 20 }} showsVerticalScrollIndicator={false}>
        {/* Daily Goal */}
        <Animated.View style={[styles.card, {
          backgroundColor: isDarkMode ? colors.surface : '#FFFFFF',
          borderColor: isDarkMode ? colors.border : '#F3F4F6',
          opacity: card1Fade, transform: [{ translateY: card1Slide }],
        }]}>
          <View style={[styles.cardAccent, { backgroundColor: '#F59E0B' }]} />
          <View style={styles.cardHeader}>
            <View style={[styles.iconBox, { backgroundColor: isDarkMode ? 'rgba(245,158,11,0.15)' : '#FFF8EB' }]}>
              <Flame color="#F59E0B" size={18} />
            </View>
            <Text style={[styles.cardTitle, { color: colors.text }]}>{t('goals.dailyTime')}</Text>
          </View>
          <Text style={[styles.cardDesc, { color: colors.textSecondary }]}>{t('goals.dailyDesc')}</Text>
          <View style={[styles.stepper, { backgroundColor: isDarkMode ? colors.background : '#F9FAFB', borderColor: isDarkMode ? colors.border : '#F3F4F6' }]}>
            <TouchableOpacity style={[styles.stepBtn, { backgroundColor: isDarkMode ? colors.surface : '#FFFFFF', borderColor: isDarkMode ? colors.border : '#F3F4F6' }]} onPress={() => setDailyMinutes(Math.max(dailyMinutes - 15, 15))}>
              <Minus color={colors.textSecondary} size={18} />
            </TouchableOpacity>
            <Text style={[styles.stepValue, { color: colors.text }]}>{dailyMinutes} <Text style={[styles.stepUnit, { color: colors.textSecondary }]}>{t('goals.min')}</Text></Text>
            <TouchableOpacity style={[styles.stepBtn, { backgroundColor: isDarkMode ? colors.surface : '#FFFFFF', borderColor: isDarkMode ? colors.border : '#F3F4F6' }]} onPress={() => setDailyMinutes(Math.min(dailyMinutes + 15, 180))}>
              <Plus color={colors.textSecondary} size={18} />
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Weekly Goal */}
        <Animated.View style={[styles.card, {
          backgroundColor: isDarkMode ? colors.surface : '#FFFFFF',
          borderColor: isDarkMode ? colors.border : '#F3F4F6',
          opacity: card2Fade, transform: [{ translateY: card2Slide }],
        }]}>
          <View style={[styles.cardAccent, { backgroundColor: '#22C55E' }]} />
          <View style={styles.cardHeader}>
            <View style={[styles.iconBox, { backgroundColor: isDarkMode ? 'rgba(34,197,94,0.15)' : '#ECFDF5' }]}>
              <Target color="#22C55E" size={18} />
            </View>
            <Text style={[styles.cardTitle, { color: colors.text }]}>{t('goals.weeklyCards')}</Text>
          </View>
          <Text style={[styles.cardDesc, { color: colors.textSecondary }]}>{t('goals.weeklyDesc')}</Text>
          <View style={[styles.stepper, { backgroundColor: isDarkMode ? colors.background : '#F9FAFB', borderColor: isDarkMode ? colors.border : '#F3F4F6' }]}>
            <TouchableOpacity style={[styles.stepBtn, { backgroundColor: isDarkMode ? colors.surface : '#FFFFFF', borderColor: isDarkMode ? colors.border : '#F3F4F6' }]} onPress={() => setWeeklyCards(Math.max(weeklyCards - 20, 20))}>
              <Minus color={colors.textSecondary} size={18} />
            </TouchableOpacity>
            <Text style={[styles.stepValue, { color: colors.text }]}>{weeklyCards} <Text style={[styles.stepUnit, { color: colors.textSecondary }]}>{t('goals.cards')}</Text></Text>
            <TouchableOpacity style={[styles.stepBtn, { backgroundColor: isDarkMode ? colors.surface : '#FFFFFF', borderColor: isDarkMode ? colors.border : '#F3F4F6' }]} onPress={() => setWeeklyCards(Math.min(weeklyCards + 20, 500))}>
              <Plus color={colors.textSecondary} size={18} />
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Reminders */}
        <Animated.View style={[styles.reminderCard, {
          backgroundColor: isDarkMode ? colors.surface : '#FFFFFF',
          borderColor: isDarkMode ? colors.border : '#F3F4F6',
          opacity: card3Fade, transform: [{ translateY: card3Slide }],
        }]}>
          <View style={[styles.iconBox, { backgroundColor: isDarkMode ? 'rgba(79,70,229,0.15)' : '#EEF2FF' }]}>
            <Bell color="#4F46E5" size={18} />
          </View>
          <Text style={[styles.cardTitle, { color: colors.text, flex: 1 }]}>{t('goals.reminders')}</Text>
          <Switch value={remindersEnabled} onValueChange={setRemindersEnabled} trackColor={{ false: colors.border, true: colors.primary }} />
        </Animated.View>
      </ScrollView>

      <View style={styles.bottom}>
        <TouchableOpacity style={styles.saveBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.saveBtnText}>{t('goals.save')}</Text>
          <View style={styles.saveArrow}><ArrowRight color="#4F46E5" size={16} /></View>
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

  card: { padding: 20, borderRadius: 20, borderWidth: 1, marginBottom: 16, overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.03, shadowOffset: { width: 0, height: 2 }, shadowRadius: 8, elevation: 1 },
  cardAccent: { position: 'absolute', top: 0, left: 0, right: 0, height: 3 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  iconBox: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  cardTitle: { fontSize: 16, fontWeight: '700' },
  cardDesc: { fontSize: 13, marginBottom: 18, marginLeft: 50 },
  stepper: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 8, borderRadius: 14, borderWidth: 1 },
  stepBtn: { width: 42, height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  stepValue: { fontSize: 24, fontWeight: '800', letterSpacing: -0.5 },
  stepUnit: { fontSize: 15, fontWeight: '600', letterSpacing: 0 },

  reminderCard: { flexDirection: 'row', alignItems: 'center', padding: 18, borderRadius: 20, borderWidth: 1, gap: 12, shadowColor: '#000', shadowOpacity: 0.03, shadowOffset: { width: 0, height: 2 }, shadowRadius: 8, elevation: 1 },

  bottom: { paddingHorizontal: 20, paddingTop: 10 },
  saveBtn: { flexDirection: 'row', paddingVertical: 18, borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: '#4F46E5', shadowColor: '#4F46E5', shadowOpacity: 0.35, shadowOffset: { width: 0, height: 6 }, shadowRadius: 12, elevation: 6 },
  saveBtnText: { fontSize: 16, fontWeight: '700', color: '#FFF', marginRight: 10 },
  saveArrow: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center' },
});
