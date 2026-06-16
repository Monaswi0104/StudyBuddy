import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ChevronLeft } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';

export const LegalScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute<any>();
  const { colors } = useTheme();
  const { t } = useTranslation();

  const titleKey = route.params?.title === 'Privacy Policy' ? 'settings.privacyPolicy' : 'settings.termsOfService';
  const title = t(titleKey);

  return (
    <View style={[styles.container, { paddingTop: insets.top + 10, paddingBottom: insets.bottom, backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity style={[styles.backBtn, { backgroundColor: colors.surface, borderColor: colors.border }]} onPress={() => navigation.goBack()}>
          <ChevronLeft color={colors.text} size={24} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{title}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.content}>
        <Text style={[styles.text, { color: colors.textSecondary }]}>
          This is a placeholder for the {title}. 
          {'\n\n'}
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          {'\n\n'}
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          {'\n\n'}
          <Text style={{ color: colors.text, fontWeight: '700' }}>1. {t('settings.termsOfService')}</Text>
          {'\n'}
          Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
          {'\n\n'}
          <Text style={{ color: colors.text, fontWeight: '700' }}>2. {t('settings.privacyPolicy')}</Text>
          {'\n'}
          Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
        </Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 20 },
  backBtn: { width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  headerTitle: { fontSize: 18, fontWeight: '600' },
  content: { padding: 20 },
  text: { fontSize: 16, lineHeight: 26 },
});
