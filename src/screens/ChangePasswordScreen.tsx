import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';

export const ChangePasswordScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { colors } = useTheme();
  const { t } = useTranslation();

  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  return (
    <KeyboardAvoidingView style={[styles.container, { backgroundColor: colors.background }]} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity style={[styles.backBtn, { backgroundColor: colors.surface, borderColor: colors.border }]} onPress={() => navigation.goBack()}>
          <ChevronLeft color={colors.text} size={24} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{t('settings.changePassword')}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>{t('password.current')}</Text>
          <TextInput 
            style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]} 
            secureTextEntry 
            value={currentPass} 
            onChangeText={setCurrentPass} 
            placeholder="••••••••"
            placeholderTextColor={colors.textSecondary}
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>{t('password.new')}</Text>
          <TextInput 
            style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]} 
            secureTextEntry 
            value={newPass} 
            onChangeText={setNewPass} 
            placeholder="••••••••"
            placeholderTextColor={colors.textSecondary}
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>{t('password.confirm')}</Text>
          <TextInput 
            style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]} 
            secureTextEntry 
            value={confirmPass} 
            onChangeText={setConfirmPass} 
            placeholder="••••••••"
            placeholderTextColor={colors.textSecondary}
          />
        </View>
      </ScrollView>

      <View style={[styles.bottomContainer, { paddingBottom: insets.bottom + 20 }]}>
        <TouchableOpacity style={[styles.saveBtn, { backgroundColor: colors.primary, shadowColor: colors.primary }]} onPress={() => navigation.goBack()}>
          <Text style={styles.saveBtnText}>{t('password.update')}</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 20 },
  backBtn: { width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  headerTitle: { fontSize: 18, fontWeight: '600' },
  content: { padding: 20 },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '500', marginBottom: 8, marginLeft: 4 },
  input: { borderWidth: 1, borderRadius: 12, padding: 16, fontSize: 16 },
  bottomContainer: { paddingHorizontal: 20, paddingTop: 10 },
  saveBtn: { paddingVertical: 18, borderRadius: 16, alignItems: 'center', shadowOpacity: 0.3, shadowOffset: { width: 0, height: 4 }, shadowRadius: 8, elevation: 4 },
  saveBtnText: { fontSize: 16, fontWeight: '600', color: '#FFF' },
});
