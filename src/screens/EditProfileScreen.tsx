import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ScrollView, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft, Camera } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';

export const EditProfileScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { colors } = useTheme();
  const { t } = useTranslation();

  const [name, setName] = useState('Monaswi');
  const [email, setEmail] = useState('monaswi1792@gmail.com');

  return (
    <KeyboardAvoidingView style={[styles.container, { backgroundColor: colors.background }]} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity style={[styles.backBtn, { backgroundColor: colors.surface, borderColor: colors.border }]} onPress={() => navigation.goBack()}>
          <ChevronLeft color={colors.text} size={24} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{t('settings.editProfile')}</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={[styles.saveText, { color: colors.primary }]}>{t('profile.save')}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.avatarContainer}>
          <View style={[styles.avatarBox, { backgroundColor: colors.primary }]}>
            <Text style={styles.avatarText}>{name ? name.charAt(0) : 'U'}</Text>
            <TouchableOpacity style={[styles.cameraBtn, { backgroundColor: colors.text, borderColor: colors.background }]}>
              <Camera color={colors.background} size={16} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>{t('profile.fullName')}</Text>
          <TextInput 
            style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]} 
            value={name} 
            onChangeText={setName} 
            placeholderTextColor={colors.textSecondary}
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>{t('profile.emailAddress')}</Text>
          <TextInput 
            style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]} 
            value={email} 
            onChangeText={setEmail} 
            keyboardType="email-address" 
            autoCapitalize="none" 
            placeholderTextColor={colors.textSecondary}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 20 },
  backBtn: { width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  headerTitle: { fontSize: 18, fontWeight: '600' },
  saveText: { fontSize: 16, fontWeight: '600' },
  content: { padding: 20 },
  avatarContainer: { alignItems: 'center', marginBottom: 32 },
  avatarBox: { width: 100, height: 100, borderRadius: 50, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  avatarText: { fontSize: 40, fontWeight: '700', color: '#FFF' },
  cameraBtn: { position: 'absolute', bottom: 0, right: 0, width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', borderWidth: 3 },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '500', marginBottom: 8, marginLeft: 4 },
  input: { borderWidth: 1, borderRadius: 12, padding: 16, fontSize: 16 },
});
