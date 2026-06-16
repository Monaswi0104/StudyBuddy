import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft, Target, Bell, Flame, Minus, Plus } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';

export const StudyGoalsScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
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

  const [dailyMinutes, setDailyMinutes] = useState(30);
  const [weeklyCards, setWeeklyCards] = useState(100);
  const [remindersEnabled, setRemindersEnabled] = useState(true);

  const incrementMinutes = () => setDailyMinutes(prev => Math.min(prev + 15, 180));
  const decrementMinutes = () => setDailyMinutes(prev => Math.max(prev - 15, 15));

  const incrementCards = () => setWeeklyCards(prev => Math.min(prev + 20, 500));
  const decrementCards = () => setWeeklyCards(prev => Math.max(prev - 20, 20));

  return (
    <View style={[styles.container, { paddingTop: insets.top + 10, paddingBottom: insets.bottom + 20, backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={[styles.backBtn, { backgroundColor: colors.surface, borderColor: colors.border }]} onPress={() => navigation.goBack()}>
          <ChevronLeft color={colors.text} size={24} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{t('goals.title')}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 20 }}>
        
        {/* Daily Goal Card */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.cardHeader}>
            <View style={[styles.iconBox, { backgroundColor: '#FEF3C7' }]}>
              <Flame color="#F59E0B" size={20} />
            </View>
            <Text style={[styles.cardTitle, { color: colors.text }]}>{t('goals.dailyTime')}</Text>
          </View>
          <Text style={[styles.cardDesc, { color: colors.textSecondary }]}>{t('goals.dailyDesc')}</Text>
          
          <View style={[styles.stepperContainer, { backgroundColor: colors.background, borderColor: colors.border }]}>
            <TouchableOpacity style={[styles.stepperBtn, { backgroundColor: colors.surface, borderColor: colors.border }]} onPress={decrementMinutes}>
              <Minus color={colors.textSecondary} size={20} />
            </TouchableOpacity>
            <Text style={[styles.stepperValue, { color: colors.text }]}>{dailyMinutes} <Text style={[styles.stepperLabel, { color: colors.textSecondary }]}>{t('goals.min')}</Text></Text>
            <TouchableOpacity style={[styles.stepperBtn, { backgroundColor: colors.surface, borderColor: colors.border }]} onPress={incrementMinutes}>
              <Plus color={colors.textSecondary} size={20} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Weekly Goal Card */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.cardHeader}>
            <View style={[styles.iconBox, { backgroundColor: '#ECFDF5' }]}>
              <Target color="#10B981" size={20} />
            </View>
            <Text style={[styles.cardTitle, { color: colors.text }]}>{t('goals.weeklyCards')}</Text>
          </View>
          <Text style={[styles.cardDesc, { color: colors.textSecondary }]}>{t('goals.weeklyDesc')}</Text>
          
          <View style={[styles.stepperContainer, { backgroundColor: colors.background, borderColor: colors.border }]}>
            <TouchableOpacity style={[styles.stepperBtn, { backgroundColor: colors.surface, borderColor: colors.border }]} onPress={decrementCards}>
              <Minus color={colors.textSecondary} size={20} />
            </TouchableOpacity>
            <Text style={[styles.stepperValue, { color: colors.text }]}>{weeklyCards} <Text style={[styles.stepperLabel, { color: colors.textSecondary }]}>{t('goals.cards')}</Text></Text>
            <TouchableOpacity style={[styles.stepperBtn, { backgroundColor: colors.surface, borderColor: colors.border }]} onPress={incrementCards}>
              <Plus color={colors.textSecondary} size={20} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Reminders Toggle */}
        <View style={[styles.card, styles.rowCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.rowLeft}>
            <View style={[styles.iconBox, { backgroundColor: '#EEF2FF' }]}>
              <Bell color="#4F46E5" size={20} />
            </View>
            <Text style={[styles.cardTitle, { color: colors.text }]}>{t('goals.reminders')}</Text>
          </View>
          <Switch 
            value={remindersEnabled} 
            onValueChange={setRemindersEnabled} 
            trackColor={{ false: colors.border, true: colors.primary }}
          />
        </View>

      </ScrollView>

      {/* Save Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={[styles.saveBtn, { backgroundColor: colors.primary, shadowColor: colors.primary }]} onPress={() => navigation.goBack()}>
          <Text style={styles.saveBtnText}>{t('goals.save')}</Text>
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
  card: { padding: 20, borderRadius: 16, borderWidth: 1, marginBottom: 16 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  iconBox: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  cardTitle: { fontSize: 16, fontWeight: '600' },
  cardDesc: { fontSize: 14, marginBottom: 20 },
  stepperContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 8, borderRadius: 12, borderWidth: 1 },
  stepperBtn: { width: 44, height: 44, borderRadius: 10, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  stepperValue: { fontSize: 24, fontWeight: '700' },
  stepperLabel: { fontSize: 16, fontWeight: '500' },
  rowCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  rowLeft: { flexDirection: 'row', alignItems: 'center' },
  bottomContainer: { paddingHorizontal: 20, paddingTop: 10 },
  saveBtn: { paddingVertical: 18, borderRadius: 16, alignItems: 'center', shadowOpacity: 0.3, shadowOffset: { width: 0, height: 4 }, shadowRadius: 8, elevation: 4 },
  saveBtnText: { fontSize: 16, fontWeight: '600', color: '#FFF' },
});
