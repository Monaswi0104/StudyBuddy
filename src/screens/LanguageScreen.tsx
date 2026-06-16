import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft, Check } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';

const FLAGS: Record<string, string> = { en: '🇺🇸', es: '🇪🇸', fr: '🇫🇷', de: '🇩🇪', ja: '🇯🇵', ko: '🇰🇷', zh: '🇨🇳' };

export const LanguageScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { t, i18n } = useTranslation();
  const { colors, isDarkMode } = useTheme();
  const [activeLang, setActiveLang] = useState(i18n.language || 'en');

  const languages = [
    { id: 'en', name: t('language.english') },
    { id: 'es', name: t('language.spanish') },
    { id: 'fr', name: t('language.french') },
    { id: 'de', name: t('language.german') || 'German (Deutsch)' },
    { id: 'ja', name: t('language.japanese') || 'Japanese (日本語)' },
    { id: 'ko', name: t('language.korean') || 'Korean (한국어)' },
    { id: 'zh', name: 'Chinese (中文)' },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top + 10, paddingBottom: insets.bottom, backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity style={[styles.backBtn, {
          backgroundColor: isDarkMode ? colors.surface : '#FFFFFF',
          borderColor: isDarkMode ? colors.border : '#F3F4F6',
        }]} onPress={() => navigation.goBack()}>
          <ChevronLeft color={colors.text} size={24} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{t('language.title')}</Text>
        <View style={{ width: 42 }} />
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {languages.map((lang) => {
          const isActive = activeLang === lang.id;
          return (
            <TouchableOpacity
              key={lang.id}
              style={[styles.langCard, {
                backgroundColor: isActive
                  ? isDarkMode ? 'rgba(79,70,229,0.12)' : '#EEF2FF'
                  : isDarkMode ? colors.surface : '#FFFFFF',
                borderColor: isActive
                  ? colors.primary
                  : isDarkMode ? colors.border : '#F3F4F6',
              }]}
              onPress={() => { setActiveLang(lang.id); i18n.changeLanguage(lang.id); }}
              activeOpacity={0.7}
            >
              <Text style={styles.flag}>{FLAGS[lang.id] || '🌐'}</Text>
              <Text style={[styles.langText, {
                color: isActive ? colors.primary : colors.text,
                fontWeight: isActive ? '700' : '500',
              }]}>{lang.name}</Text>
              {isActive && (
                <View style={[styles.checkCircle, { backgroundColor: colors.primary }]}>
                  <Check color="#FFF" size={14} strokeWidth={3} />
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 20 },
  backBtn: { width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 1, shadowColor: '#000', shadowOpacity: 0.04, shadowOffset: { width: 0, height: 2 }, shadowRadius: 8, elevation: 1 },
  headerTitle: { fontSize: 18, fontWeight: '700', letterSpacing: -0.3 },
  content: { paddingHorizontal: 20, gap: 10 },
  langCard: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 16, borderWidth: 1.5, shadowColor: '#000', shadowOpacity: 0.03, shadowOffset: { width: 0, height: 2 }, shadowRadius: 8, elevation: 1 },
  flag: { fontSize: 24, marginRight: 14 },
  langText: { fontSize: 16, flex: 1 },
  checkCircle: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
});
