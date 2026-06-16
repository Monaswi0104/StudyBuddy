import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft, Camera } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';

export const EditProfileScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { colors, isDarkMode } = useTheme();
  const { t } = useTranslation();

  const [name, setName] = useState('Monaswi');
  const [email, setEmail] = useState('monaswi1792@gmail.com');
  const [nameFocused, setNameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);

  return (
    <KeyboardAvoidingView style={[styles.container, { backgroundColor: colors.background }]} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity style={[styles.backBtn, {
          backgroundColor: isDarkMode ? colors.surface : '#FFFFFF',
          borderColor: isDarkMode ? colors.border : '#F3F4F6',
        }]} onPress={() => navigation.goBack()}>
          <ChevronLeft color={colors.text} size={24} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{t('settings.editProfile')}</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={[styles.saveText, { color: colors.primary }]}>{t('profile.save')}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatarRing}>
            <View style={styles.avatarBox}>
              <Text style={styles.avatarText}>{name ? name.charAt(0) : 'U'}</Text>
            </View>
          </View>
          <TouchableOpacity style={[styles.cameraBtn, { backgroundColor: colors.text, borderColor: colors.background }]}>
            <Camera color={colors.background} size={14} />
          </TouchableOpacity>
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>{t('profile.fullName')}</Text>
          <TextInput
            style={[styles.input, {
              backgroundColor: isDarkMode ? colors.surface : '#FFFFFF',
              borderColor: nameFocused ? colors.primary : (isDarkMode ? colors.border : '#F3F4F6'),
              color: colors.text,
            }]}
            value={name}
            onChangeText={setName}
            placeholderTextColor={colors.textSecondary}
            onFocus={() => setNameFocused(true)}
            onBlur={() => setNameFocused(false)}
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>{t('profile.emailAddress')}</Text>
          <TextInput
            style={[styles.input, {
              backgroundColor: isDarkMode ? colors.surface : '#FFFFFF',
              borderColor: emailFocused ? colors.primary : (isDarkMode ? colors.border : '#F3F4F6'),
              color: colors.text,
            }]}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor={colors.textSecondary}
            onFocus={() => setEmailFocused(true)}
            onBlur={() => setEmailFocused(false)}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 20 },
  backBtn: { width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 1, shadowColor: '#000', shadowOpacity: 0.04, shadowOffset: { width: 0, height: 2 }, shadowRadius: 8, elevation: 1 },
  headerTitle: { fontSize: 18, fontWeight: '700', letterSpacing: -0.3 },
  saveText: { fontSize: 15, fontWeight: '700' },
  content: { padding: 20 },
  avatarContainer: { alignItems: 'center', marginBottom: 32, position: 'relative' },
  avatarRing: { width: 104, height: 104, borderRadius: 52, borderWidth: 2.5, borderColor: '#6366F1', alignItems: 'center', justifyContent: 'center' },
  avatarBox: { width: 92, height: 92, borderRadius: 46, backgroundColor: '#4F46E5', alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 36, fontWeight: '800', color: '#FFF' },
  cameraBtn: { position: 'absolute', bottom: 2, right: '35%', width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', borderWidth: 3 },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8, marginLeft: 4 },
  input: { borderWidth: 1.5, borderRadius: 14, padding: 16, fontSize: 15, fontWeight: '500' },
});
