import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft, User, Lock, Bell, Moon, Globe, Shield, FileText, ChevronRight } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';

export const SettingsScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const { colors, isDarkMode, toggleDarkMode } = useTheme();
  const { t } = useTranslation();

  const [notifications, setNotifications] = useState(true);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const SettingItem = ({ icon: Icon, title, rightContent, onPress, color = colors.textSecondary, bg = colors.iconBg }: any) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress} disabled={!onPress}>
      <View style={styles.settingItemLeft}>
        <View style={[styles.iconBox, { backgroundColor: bg }]}>
          <Icon color={color} size={20} />
        </View>
        <Text style={[styles.settingItemTitle, { color: colors.text }]}>{title}</Text>
      </View>
      {rightContent ? rightContent : <ChevronRight color={colors.border} size={20} />}
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top + 10, paddingBottom: insets.bottom, backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={[styles.backBtn, { backgroundColor: colors.surface, borderColor: colors.border }]} onPress={() => navigation.goBack()}>
          <ChevronLeft color={colors.text} size={24} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{t('settings.title')}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {/* Account Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>{t('settings.account')}</Text>
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <SettingItem 
              icon={User} 
              title={t('settings.editProfile')} 
              color="#3B82F6" 
              bg={isDarkMode ? 'rgba(59, 130, 246, 0.2)' : '#EFF6FF'} 
              onPress={() => navigation.navigate('EditProfile' as never)} 
            />
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <SettingItem 
              icon={Lock} 
              title={t('settings.changePassword')} 
              color="#F59E0B" 
              bg={isDarkMode ? 'rgba(245, 158, 11, 0.2)' : '#FFFBEB'} 
              onPress={() => navigation.navigate('ChangePassword' as never)} 
            />
          </View>
        </View>

        {/* Preferences Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>{t('settings.preferences')}</Text>
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <SettingItem 
              icon={Bell} 
              title={t('settings.pushNotifications')} 
              color="#10B981" 
              bg={isDarkMode ? 'rgba(16, 185, 129, 0.2)' : '#ECFDF5'} 
              rightContent={
                <Switch 
                  value={notifications} 
                  onValueChange={setNotifications} 
                  trackColor={{ false: colors.border, true: colors.primary }}
                />
              }
            />
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <SettingItem 
              icon={Moon} 
              title={t('settings.darkMode')} 
              color="#8B5CF6" 
              bg={isDarkMode ? 'rgba(139, 92, 246, 0.2)' : '#F5F3FF'} 
              rightContent={
                <Switch 
                  value={isDarkMode} 
                  onValueChange={toggleDarkMode} 
                  trackColor={{ false: colors.border, true: colors.primary }}
                />
              }
            />
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <SettingItem 
              icon={Globe} 
              title={t('settings.language')} 
              color="#06B6D4" 
              bg={isDarkMode ? 'rgba(6, 182, 212, 0.2)' : '#ECFEFF'} 
              rightContent={<Text style={[styles.valueText, { color: colors.textSecondary }]}>{t('language.english')}</Text>}
              onPress={() => navigation.navigate('Language' as never)}
            />
          </View>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>{t('settings.about')}</Text>
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <SettingItem 
              icon={Shield} 
              title={t('settings.privacyPolicy')} 
              onPress={() => navigation.navigate('Legal' as any, { title: 'Privacy Policy' } as any)} 
            />
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <SettingItem 
              icon={FileText} 
              title={t('settings.termsOfService')} 
              onPress={() => navigation.navigate('Legal' as any, { title: 'Terms of Service' } as any)} 
            />
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <View style={styles.settingItem}>
              <Text style={[styles.versionText, { color: colors.text }]}>{t('settings.appVersion')}</Text>
              <Text style={[styles.valueText, { color: colors.textSecondary }]}>v1.0.0</Text>
            </View>
          </View>
        </View>
        
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
    marginLeft: 4,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingItemTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    marginLeft: 64, // Aligns with text
  },
  valueText: {
    fontSize: 15,
    fontWeight: '500',
  },
  versionText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 16,
  },
});
