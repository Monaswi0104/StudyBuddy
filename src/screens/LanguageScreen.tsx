import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft, CheckCircle2 } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';

export const LanguageScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { t, i18n } = useTranslation();
  const { colors } = useTheme();

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
        <TouchableOpacity style={[styles.backBtn, { backgroundColor: colors.surface, borderColor: colors.border }]} onPress={() => navigation.goBack()}>
          <ChevronLeft color={colors.text} size={24} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{t('language.title')}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.content}>
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          {languages.map((lang, index) => (
            <React.Fragment key={lang.id}>
              <TouchableOpacity 
                style={styles.langItem}
                onPress={() => {
                  setActiveLang(lang.id);
                  i18n.changeLanguage(lang.id);
                }}
              >
                <Text style={[styles.langText, { color: colors.textSecondary }, activeLang === lang.id && { color: colors.text, fontWeight: '600' }]}>
                  {lang.name}
                </Text>
                {activeLang === lang.id && <CheckCircle2 color={colors.primary} size={20} />}
              </TouchableOpacity>
              {index < languages.length - 1 && <View style={[styles.divider, { backgroundColor: colors.border }]} />}
            </React.Fragment>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 20 },
  backBtn: { width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  headerTitle: { fontSize: 18, fontWeight: '600' },
  content: { paddingHorizontal: 20 },
  card: { borderRadius: 16, borderWidth: 1, overflow: 'hidden' },
  langItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  langText: { fontSize: 16, fontWeight: '500' },
  divider: { height: 1, marginLeft: 16 },
});
