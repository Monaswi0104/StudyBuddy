import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView, Animated } from 'react-native';
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

  const headerFade = useRef(new Animated.Value(0)).current;
  const sec1Fade = useRef(new Animated.Value(0)).current;
  const sec1Slide = useRef(new Animated.Value(20)).current;
  const sec2Fade = useRef(new Animated.Value(0)).current;
  const sec2Slide = useRef(new Animated.Value(20)).current;
  const sec3Fade = useRef(new Animated.Value(0)).current;
  const sec3Slide = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    const s = (f: Animated.Value, sl: Animated.Value | null, d: number) => {
      const a = [Animated.timing(f, { toValue: 1, duration: 400, delay: d, useNativeDriver: true })];
      if (sl) a.push(Animated.timing(sl, { toValue: 0, duration: 400, delay: d, useNativeDriver: true }));
      return Animated.parallel(a);
    };
    Animated.parallel([s(headerFade, null, 0), s(sec1Fade, sec1Slide, 80), s(sec2Fade, sec2Slide, 160), s(sec3Fade, sec3Slide, 240)]).start();
  }, [headerFade, sec1Fade, sec1Slide, sec2Fade, sec2Slide, sec3Fade, sec3Slide]);

  const SettingItem = ({ icon: Icon, title, rightContent, onPress, color = colors.textSecondary, bg = colors.iconBg }: any) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress} disabled={!onPress}>
      <View style={styles.settingLeft}>
        <View style={[styles.iconBox, { backgroundColor: bg }]}>
          <Icon color={color} size={18} />
        </View>
        <Text style={[styles.settingTitle, { color: colors.text }]}>{title}</Text>
      </View>
      {rightContent ? rightContent : <ChevronRight color={colors.border} size={18} />}
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top + 10, paddingBottom: insets.bottom, backgroundColor: colors.background }]}>
      <Animated.View style={[styles.header, { opacity: headerFade }]}>
        <TouchableOpacity style={[styles.backBtn, {
          backgroundColor: isDarkMode ? colors.surface : '#FFFFFF',
          borderColor: isDarkMode ? colors.border : '#F3F4F6',
        }]} onPress={() => navigation.goBack()}>
          <ChevronLeft color={colors.text} size={24} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{t('settings.title')}</Text>
        <View style={{ width: 42 }} />
      </Animated.View>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {/* Account */}
        <Animated.View style={[styles.section, { opacity: sec1Fade, transform: [{ translateY: sec1Slide }] }]}>
          <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>{t('settings.account')}</Text>
          <View style={[styles.card, { backgroundColor: isDarkMode ? colors.surface : '#FFFFFF', borderColor: isDarkMode ? colors.border : '#F3F4F6' }]}>
            <SettingItem icon={User} title={t('settings.editProfile')} color="#3B82F6" bg={isDarkMode ? 'rgba(59,130,246,0.15)' : '#EFF6FF'} onPress={() => navigation.navigate('EditProfile')} />
            <View style={[styles.divider, { backgroundColor: isDarkMode ? colors.border : '#F3F4F6' }]} />
            <SettingItem icon={Lock} title={t('settings.changePassword')} color="#F59E0B" bg={isDarkMode ? 'rgba(245,158,11,0.15)' : '#FFF8EB'} onPress={() => navigation.navigate('ChangePassword')} />
          </View>
        </Animated.View>

        {/* Preferences */}
        <Animated.View style={[styles.section, { opacity: sec2Fade, transform: [{ translateY: sec2Slide }] }]}>
          <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>{t('settings.preferences')}</Text>
          <View style={[styles.card, { backgroundColor: isDarkMode ? colors.surface : '#FFFFFF', borderColor: isDarkMode ? colors.border : '#F3F4F6' }]}>
            <SettingItem icon={Bell} title={t('settings.pushNotifications')} color="#22C55E" bg={isDarkMode ? 'rgba(34,197,94,0.15)' : '#ECFDF5'} rightContent={<Switch value={notifications} onValueChange={setNotifications} trackColor={{ false: colors.border, true: colors.primary }} />} />
            <View style={[styles.divider, { backgroundColor: isDarkMode ? colors.border : '#F3F4F6' }]} />
            <SettingItem icon={Moon} title={t('settings.darkMode')} color="#8B5CF6" bg={isDarkMode ? 'rgba(139,92,246,0.15)' : '#F5F3FF'} rightContent={<Switch value={isDarkMode} onValueChange={toggleDarkMode} trackColor={{ false: colors.border, true: colors.primary }} />} />
            <View style={[styles.divider, { backgroundColor: isDarkMode ? colors.border : '#F3F4F6' }]} />
            <SettingItem icon={Globe} title={t('settings.language')} color="#06B6D4" bg={isDarkMode ? 'rgba(6,182,212,0.15)' : '#ECFEFF'} rightContent={<Text style={[styles.valueText, { color: colors.textSecondary }]}>{t('language.english')}</Text>} onPress={() => navigation.navigate('Language')} />
          </View>
        </Animated.View>

        {/* About */}
        <Animated.View style={[styles.section, { opacity: sec3Fade, transform: [{ translateY: sec3Slide }] }]}>
          <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>{t('settings.about')}</Text>
          <View style={[styles.card, { backgroundColor: isDarkMode ? colors.surface : '#FFFFFF', borderColor: isDarkMode ? colors.border : '#F3F4F6' }]}>
            <SettingItem icon={Shield} title={t('settings.privacyPolicy')} color="#6366F1" bg={isDarkMode ? 'rgba(99,102,241,0.15)' : '#EEF2FF'} onPress={() => navigation.navigate('Legal', { title: 'Privacy Policy' })} />
            <View style={[styles.divider, { backgroundColor: isDarkMode ? colors.border : '#F3F4F6' }]} />
            <SettingItem icon={FileText} title={t('settings.termsOfService')} color="#EC4899" bg={isDarkMode ? 'rgba(236,72,153,0.15)' : '#FDF2F8'} onPress={() => navigation.navigate('Legal', { title: 'Terms of Service' })} />
            <View style={[styles.divider, { backgroundColor: isDarkMode ? colors.border : '#F3F4F6' }]} />
            <View style={styles.settingItem}>
              <Text style={[styles.versionLabel, { color: colors.text }]}>{t('settings.appVersion')}</Text>
              <View style={[styles.versionBadge, { backgroundColor: isDarkMode ? colors.border : '#F3F4F6' }]}>
                <Text style={[styles.versionText, { color: colors.textSecondary }]}>v1.0.0</Text>
              </View>
            </View>
          </View>
        </Animated.View>
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 24 },
  backBtn: { width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 1, shadowColor: '#000', shadowOpacity: 0.04, shadowOffset: { width: 0, height: 2 }, shadowRadius: 8, elevation: 1 },
  headerTitle: { fontSize: 18, fontWeight: '700', letterSpacing: -0.3 },

  section: { marginBottom: 24, paddingHorizontal: 20 },
  sectionLabel: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 10, marginLeft: 4 },
  card: { borderRadius: 20, borderWidth: 1, overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.03, shadowOffset: { width: 0, height: 2 }, shadowRadius: 8, elevation: 1 },

  settingItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  settingLeft: { flexDirection: 'row', alignItems: 'center' },
  iconBox: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  settingTitle: { fontSize: 15, fontWeight: '600' },
  divider: { height: 1, marginLeft: 68 },
  valueText: { fontSize: 14, fontWeight: '500' },
  versionLabel: { fontSize: 15, fontWeight: '600', marginLeft: 16 },
  versionBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  versionText: { fontSize: 13, fontWeight: '600' },
});
