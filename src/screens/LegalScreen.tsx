import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ChevronLeft, Shield, FileText } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';

export const LegalScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute<any>();
  const { colors, isDarkMode } = useTheme();
  const { t } = useTranslation();

  const isPrivacy = route.params?.title === 'Privacy Policy';
  const titleKey = isPrivacy ? 'settings.privacyPolicy' : 'settings.termsOfService';
  const title = t(titleKey);
  const IconComp = isPrivacy ? Shield : FileText;
  const accentColor = isPrivacy ? '#6366F1' : '#EC4899';

  return (
    <View style={[styles.container, { paddingTop: insets.top + 10, paddingBottom: insets.bottom, backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity style={[styles.backBtn, {
          backgroundColor: isDarkMode ? colors.surface : '#FFFFFF',
          borderColor: isDarkMode ? colors.border : '#F3F4F6',
        }]} onPress={() => navigation.goBack()}>
          <ChevronLeft color={colors.text} size={24} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{title}</Text>
        <View style={{ width: 42 }} />
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Title Card */}
        <View style={[styles.titleCard, {
          backgroundColor: isDarkMode ? colors.surface : '#FFFFFF',
          borderColor: isDarkMode ? colors.border : '#F3F4F6',
        }]}>
          <View style={[styles.titleAccent, { backgroundColor: accentColor }]} />
          <View style={[styles.titleIconBox, { backgroundColor: isDarkMode ? `${accentColor}20` : `${accentColor}10` }]}>
            <IconComp color={accentColor} size={24} />
          </View>
          <View>
            <Text style={[styles.titleText, { color: colors.text }]}>{title}</Text>
            <Text style={[styles.titleSub, { color: colors.textSecondary }]}>Last updated: June 2026</Text>
          </View>
        </View>

        {/* Content */}
        <View style={[styles.contentCard, {
          backgroundColor: isDarkMode ? colors.surface : '#FFFFFF',
          borderColor: isDarkMode ? colors.border : '#F3F4F6',
        }]}>
          <Text style={[styles.text, { color: colors.textSecondary }]}>
            This is a placeholder for the {title}.
            {'\n\n'}
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </Text>

          <View style={[styles.sectionDivider, { backgroundColor: isDarkMode ? colors.border : '#F3F4F6' }]} />

          <Text style={[styles.sectionTitle, { color: colors.text }]}>1. {t('settings.termsOfService')}</Text>
          <Text style={[styles.text, { color: colors.textSecondary }]}>
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
          </Text>

          <View style={[styles.sectionDivider, { backgroundColor: isDarkMode ? colors.border : '#F3F4F6' }]} />

          <Text style={[styles.sectionTitle, { color: colors.text }]}>2. {t('settings.privacyPolicy')}</Text>
          <Text style={[styles.text, { color: colors.textSecondary }]}>
            Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 20 },
  backBtn: { width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 1, shadowColor: '#000', shadowOpacity: 0.04, shadowOffset: { width: 0, height: 2 }, shadowRadius: 8, elevation: 1 },
  headerTitle: { fontSize: 18, fontWeight: '700', letterSpacing: -0.3 },
  content: { paddingHorizontal: 20, paddingBottom: 40 },

  titleCard: { flexDirection: 'row', alignItems: 'center', padding: 18, borderRadius: 20, borderWidth: 1, marginBottom: 16, overflow: 'hidden', gap: 14, shadowColor: '#000', shadowOpacity: 0.03, shadowOffset: { width: 0, height: 2 }, shadowRadius: 8, elevation: 1 },
  titleAccent: { position: 'absolute', top: 0, left: 0, right: 0, height: 3 },
  titleIconBox: { width: 48, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  titleText: { fontSize: 18, fontWeight: '700', letterSpacing: -0.3, marginBottom: 2 },
  titleSub: { fontSize: 12 },

  contentCard: { padding: 24, borderRadius: 20, borderWidth: 1, shadowColor: '#000', shadowOpacity: 0.03, shadowOffset: { width: 0, height: 2 }, shadowRadius: 8, elevation: 1 },
  text: { fontSize: 15, lineHeight: 26 },
  sectionDivider: { height: 1, marginVertical: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 10 },
});
