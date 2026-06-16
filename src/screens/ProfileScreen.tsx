import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Settings, Target, Clock, FileText, Bot, HelpCircle, LogOut, ChevronRight, Crown } from 'lucide-react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/StackNav';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

export const ProfileScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { colors, isDarkMode } = useTheme();
  const { logout } = useAuth();
  const { t } = useTranslation();

  // Staggered animations
  const headerFade = useRef(new Animated.Value(0)).current;
  const headerSlide = useRef(new Animated.Value(20)).current;
  const profileFade = useRef(new Animated.Value(0)).current;
  const profileSlide = useRef(new Animated.Value(30)).current;
  const menuFade = useRef(new Animated.Value(0)).current;
  const menuSlide = useRef(new Animated.Value(30)).current;
  const logoutFade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const stagger = (fade: Animated.Value, slide: Animated.Value, delay: number) =>
      Animated.parallel([
        Animated.timing(fade, { toValue: 1, duration: 450, delay, useNativeDriver: true }),
        Animated.timing(slide, { toValue: 0, duration: 450, delay, useNativeDriver: true }),
      ]);

    Animated.parallel([
      stagger(headerFade, headerSlide, 0),
      stagger(profileFade, profileSlide, 100),
      stagger(menuFade, menuSlide, 200),
      Animated.timing(logoutFade, { toValue: 1, duration: 450, delay: 350, useNativeDriver: true }),
    ]).start();
  }, [headerFade, headerSlide, profileFade, profileSlide, menuFade, menuSlide, logoutFade]);

  const menuItems = [
    { id: '1', title: t('profile.studyGoals'), icon: Target, color: '#22C55E', bg: isDarkMode ? 'rgba(34,197,94,0.15)' : '#ECFDF5', route: 'StudyGoals' },
    { id: '2', title: t('profile.revisionHistory'), icon: Clock, color: '#8B5CF6', bg: isDarkMode ? 'rgba(139,92,246,0.15)' : '#F5F3FF', route: 'StatsStack' },
    { id: '3', title: t('profile.savedNotes'), icon: FileText, color: '#F59E0B', bg: isDarkMode ? 'rgba(245,158,11,0.15)' : '#FFF8EB', route: 'LibraryStack' },
    { id: '4', title: t('profile.aiStudyBuddy'), icon: Bot, color: '#3B82F6', bg: isDarkMode ? 'rgba(59,130,246,0.15)' : '#EFF6FF', route: 'Generate' },
    { id: '5', title: t('settings.title'), icon: Settings, color: '#6366F1', bg: isDarkMode ? 'rgba(99,102,241,0.15)' : '#EEF2FF', route: 'Settings' },
    { id: '6', title: t('profile.helpSupport'), icon: HelpCircle, color: '#06B6D4', bg: isDarkMode ? 'rgba(6,182,212,0.15)' : '#ECFEFF', route: 'none' },
  ];

  const handlePress = (item: any) => {
    if (item.route !== 'none') {
      navigation.navigate(item.route as any);
    } else {
      Alert.alert('Coming Soon', `${item.title} will be available in the next update!`);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      t('profile.logoutConfirmTitle'),
      t('profile.logoutConfirmMessage'),
      [
        { text: t('profile.cancel'), style: 'cancel' },
        {
          text: t('profile.logOut'),
          style: 'destructive',
          onPress: () => logout()
        }
      ]
    );
  };

  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top + 10, backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: 150 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <Animated.View style={[styles.header, { opacity: headerFade, transform: [{ translateY: headerSlide }] }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{t('profile.title')}</Text>
        <TouchableOpacity
          style={[styles.settingsBtn, {
            backgroundColor: isDarkMode ? colors.surface : '#FFFFFF',
            borderColor: isDarkMode ? colors.border : '#F3F4F6',
          }]}
          onPress={() => navigation.navigate('Settings' as never)}
        >
          <Settings color={colors.text} size={20} />
        </TouchableOpacity>
      </Animated.View>

      {/* Profile Card */}
      <Animated.View style={[styles.profileCard, {
        backgroundColor: isDarkMode ? colors.surface : '#FFFFFF',
        borderColor: isDarkMode ? colors.border : '#F3F4F6',
        opacity: profileFade,
        transform: [{ translateY: profileSlide }],
      }]}>
        <View style={styles.profileAccent} />
        <View style={styles.avatarContainer}>
          <View style={styles.avatarRing}>
            <View style={styles.avatarBox}>
              <Text style={styles.avatarText}>M</Text>
            </View>
          </View>
          <View style={styles.profileInfo}>
            <Text style={[styles.name, { color: colors.text }]}>Monaswi</Text>
            <Text style={[styles.email, { color: colors.textSecondary }]}>monaswi1792@gmail.com</Text>
            <View style={[styles.premiumBadge, { backgroundColor: isDarkMode ? 'rgba(139,92,246,0.15)' : '#F5F3FF' }]}>
              <Crown color="#8B5CF6" size={12} />
              <Text style={styles.premiumText}>{t('profile.premiumUser')}</Text>
            </View>
          </View>
        </View>
      </Animated.View>

      {/* Menu */}
      <Animated.View style={[styles.menuContainer, { opacity: menuFade, transform: [{ translateY: menuSlide }] }]}>
        {menuItems.map((item, index) => {
          const IconComp = item.icon;
          return (
            <TouchableOpacity
              key={item.id}
              style={[styles.menuItem, {
                backgroundColor: isDarkMode ? colors.surface : '#FFFFFF',
                borderColor: isDarkMode ? colors.border : '#F3F4F6',
              }]}
              activeOpacity={0.7}
              onPress={() => handlePress(item)}
            >
              <View style={[styles.menuIconBox, { backgroundColor: item.bg }]}>
                <IconComp color={item.color} size={20} />
              </View>
              <Text style={[styles.menuTitle, { color: colors.text }]}>{item.title}</Text>
              <ChevronRight color={colors.border} size={18} />
            </TouchableOpacity>
          );
        })}
      </Animated.View>

      {/* Logout */}
      <Animated.View style={{ opacity: logoutFade, paddingHorizontal: 20 }}>
        <TouchableOpacity
          style={[styles.logoutBtn, {
            backgroundColor: isDarkMode ? 'rgba(239,68,68,0.1)' : '#FEF2F2',
            borderColor: isDarkMode ? 'rgba(239,68,68,0.2)' : '#FEE2E2',
          }]}
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <LogOut color="#EF4444" size={20} />
          <Text style={styles.logoutText}>{t('profile.logOut')}</Text>
        </TouchableOpacity>
      </Animated.View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  settingsBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 1,
  },

  // Profile Card
  profileCard: {
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#6366F1',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 3,
  },
  profileAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#6366F1',
  },
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarRing: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 2.5,
    borderColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  avatarBox: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#4F46E5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFF',
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.3,
    marginBottom: 2,
  },
  email: {
    fontSize: 13,
    marginBottom: 8,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    gap: 5,
  },
  premiumText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#8B5CF6',
  },

  // Menu
  menuContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
    gap: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 1,
  },
  menuIconBox: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  menuTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
  },

  // Logout
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 10,
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#EF4444',
  },
});
