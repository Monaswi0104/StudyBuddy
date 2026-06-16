import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Settings, Target, Clock, FileText, Bot, HelpCircle, LogOut, ChevronRight } from 'lucide-react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/StackNav';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

export const ProfileScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { colors } = useTheme();
  const { logout } = useAuth();
  const { t } = useTranslation();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const menuItems = [
    { id: '1', title: t('profile.studyGoals'), icon: Target, route: 'StudyGoals' },
    { id: '2', title: t('profile.revisionHistory'), icon: Clock, route: 'StatsStack' },
    { id: '3', title: t('profile.savedNotes'), icon: FileText, route: 'LibraryStack' },
    { id: '4', title: t('profile.aiStudyBuddy'), icon: Bot, route: 'Generate' },
    { id: '5', title: t('settings.title'), icon: Settings, route: 'Settings' },
    { id: '6', title: t('profile.helpSupport'), icon: HelpCircle, route: 'none' },
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
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>{t('profile.title')}</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Settings' as never)}>
          <Settings color={colors.text} size={24} />
        </TouchableOpacity>
      </View>

      <View style={[styles.profileCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={styles.avatarBox}>
          <Text style={styles.avatarText}>M</Text>
        </View>
        <View style={styles.profileInfo}>
          <Text style={[styles.name, { color: colors.text }]}>Monaswi</Text>
          <Text style={[styles.email, { color: colors.textSecondary }]}>monaswi1792@gmail.com</Text>
          <View style={[styles.premiumBadge, { backgroundColor: colors.iconBg }]}>
            <Text style={styles.premiumText}>{t('profile.premiumUser')}</Text>
          </View>
        </View>
      </View>

      <View style={[styles.menuList, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        {menuItems.map(item => (
          <TouchableOpacity 
            key={item.id} 
            style={[styles.menuItem, { borderBottomColor: colors.border }]}
            onPress={() => handlePress(item)}
          >
            <View style={styles.menuItemLeft}>
              <item.icon color={colors.textSecondary} size={22} />
              <Text style={[styles.menuItemTitle, { color: colors.text }]}>{item.title}</Text>
            </View>
            <ChevronRight color={colors.border} size={20} />
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity 
        style={[styles.logoutBtn, { backgroundColor: colors.iconBg }]}
        onPress={handleLogout}
      >
        <LogOut color={colors.error} size={22} />
        <Text style={[styles.logoutText, { color: colors.error }]}>{t('profile.logOut')}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 20,
    marginBottom: 32,
    borderWidth: 1,
  },
  avatarBox: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#7C3AED',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFF',
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 2,
  },
  email: {
    fontSize: 13,
    marginBottom: 8,
  },
  premiumBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  premiumText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#7C3AED',
  },
  menuList: {
    borderRadius: 20,
    paddingHorizontal: 20,
    borderWidth: 1,
    marginBottom: 24,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemTitle: {
    fontSize: 15,
    fontWeight: '500',
    marginLeft: 16,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 12,
  },
});
