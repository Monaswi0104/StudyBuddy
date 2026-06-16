import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Search, FileText, Layers, HelpCircle, ChevronRight } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/StackNav';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const LibraryScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { colors, isDarkMode } = useTheme();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('All');

  // Staggered animations
  const headerFade = useRef(new Animated.Value(0)).current;
  const headerSlide = useRef(new Animated.Value(20)).current;
  const tabsFade = useRef(new Animated.Value(0)).current;
  const tabsSlide = useRef(new Animated.Value(20)).current;
  const listFade = useRef(new Animated.Value(0)).current;
  const listSlide = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    const stagger = (fade: Animated.Value, slide: Animated.Value, delay: number) =>
      Animated.parallel([
        Animated.timing(fade, { toValue: 1, duration: 450, delay, useNativeDriver: true }),
        Animated.timing(slide, { toValue: 0, duration: 450, delay, useNativeDriver: true }),
      ]);

    Animated.parallel([
      stagger(headerFade, headerSlide, 0),
      stagger(tabsFade, tabsSlide, 100),
      stagger(listFade, listSlide, 200),
    ]).start();
  }, [headerFade, headerSlide, tabsFade, tabsSlide, listFade, listSlide]);

  const tabs = [
    { key: 'All', label: t('library.all') },
    { key: 'Notes', label: t('library.notes') },
    { key: 'Flashcards', label: t('library.flashcards') },
    { key: 'Quizzes', label: t('library.quizzes') },
  ];

  const libraryItems = [
    { id: '1', title: 'Photosynthesis Notes', subtitle: 'Today • 20 cards', type: 'Flashcards', icon: Layers, color: '#22C55E', bg: isDarkMode ? 'rgba(34,197,94,0.15)' : '#ECFDF5' },
    { id: '2', title: 'Machine Learning Basics', subtitle: 'Yesterday • 28 cards', type: 'Flashcards', icon: Layers, color: '#22C55E', bg: isDarkMode ? 'rgba(34,197,94,0.15)' : '#ECFDF5' },
    { id: '3', title: 'Neural Networks', subtitle: '2 days ago • 30 cards', type: 'Flashcards', icon: Layers, color: '#22C55E', bg: isDarkMode ? 'rgba(34,197,94,0.15)' : '#ECFDF5' },
    { id: '4', title: 'Data Structures Notes', subtitle: '3 days ago • Notes', type: 'Notes', icon: FileText, color: '#F59E0B', bg: isDarkMode ? 'rgba(245,158,11,0.15)' : '#FFF8EB' },
    { id: '5', title: 'Operating System Concepts', subtitle: '6 days ago • 10 cards', type: 'Quiz', icon: HelpCircle, color: '#3B82F6', bg: isDarkMode ? 'rgba(59,130,246,0.15)' : '#EFF6FF' },
    { id: '6', title: 'Database Management', subtitle: '1 week ago • 22 cards', type: 'Flashcards', icon: Layers, color: '#22C55E', bg: isDarkMode ? 'rgba(34,197,94,0.15)' : '#ECFDF5' },
  ];

  const filteredItems = libraryItems.filter(item => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Notes' && item.type === 'Notes') return true;
    if (activeTab === 'Flashcards' && item.type === 'Flashcards') return true;
    if (activeTab === 'Quizzes' && item.type === 'Quiz') return true;
    return false;
  });

  return (
    <View style={[styles.container, { paddingTop: insets.top + 10, backgroundColor: colors.background }]}>
      {/* Header */}
      <Animated.View style={[styles.header, { opacity: headerFade, transform: [{ translateY: headerSlide }] }]}>
        <View>
          <Text style={[styles.headerTitle, { color: colors.text }]}>{t('library.title')}</Text>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>{filteredItems.length} items</Text>
        </View>
        <TouchableOpacity style={[styles.searchBtn, {
          backgroundColor: isDarkMode ? colors.surface : '#FFFFFF',
          borderColor: isDarkMode ? colors.border : '#F3F4F6',
        }]}>
          <Search color={colors.text} size={20} />
        </TouchableOpacity>
      </Animated.View>

      {/* Tabs */}
      <Animated.View style={[styles.tabsContainer, { opacity: tabsFade, transform: [{ translateY: tabsSlide }] }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20 }}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[
                styles.tab,
                {
                  backgroundColor: activeTab === tab.key
                    ? colors.primary
                    : isDarkMode ? colors.surface : '#FFFFFF',
                  borderColor: activeTab === tab.key
                    ? colors.primary
                    : isDarkMode ? colors.border : '#F3F4F6',
                },
                activeTab === tab.key && styles.tabActive,
              ]}
              onPress={() => setActiveTab(tab.key)}
            >
              <Text style={[
                styles.tabText,
                { color: activeTab === tab.key ? '#FFF' : colors.textSecondary },
              ]}>{tab.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Animated.View>

      {/* List */}
      <Animated.View style={[{ flex: 1, opacity: listFade, transform: [{ translateY: listSlide }] }]}>
        <ScrollView
          contentContainerStyle={{ paddingBottom: 150, paddingHorizontal: 20 }}
          showsVerticalScrollIndicator={false}
        >
          {filteredItems.map((item, index) => {
            const IconComp = item.icon;
            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.listItem, {
                  backgroundColor: isDarkMode ? colors.surface : '#FFFFFF',
                  borderColor: isDarkMode ? colors.border : '#F3F4F6',
                }]}
                activeOpacity={0.7}
                onPress={() => {
                  if (item.type === 'Flashcards') navigation.navigate('FlashCards', {});
                  else if (item.type === 'Quiz') navigation.navigate('Quiz', {});
                  else if (item.type === 'Notes') navigation.navigate('Summary', {});
                }}
              >
                {/* Color accent left border */}
                <View style={[styles.itemAccent, { backgroundColor: item.color }]} />
                <View style={[styles.iconBox, { backgroundColor: item.bg }]}>
                  <IconComp color={item.color} size={20} />
                </View>
                <View style={styles.itemInfo}>
                  <Text style={[styles.itemTitle, { color: colors.text }]} numberOfLines={1}>{item.title}</Text>
                  <Text style={[styles.itemSubtitle, { color: colors.textSecondary }]}>{item.subtitle}</Text>
                </View>
                <View style={[styles.badge, { backgroundColor: item.bg }]}>
                  <Text style={[styles.badgeText, { color: item.color }]}>{item.type}</Text>
                </View>
                <ChevronRight color={colors.border} size={18} style={{ marginLeft: 8 }} />
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </Animated.View>
    </View>
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
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  searchBtn: {
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
  tabsContainer: {
    marginBottom: 20,
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 24,
    marginRight: 10,
    borderWidth: 1,
  },
  tabActive: {
    shadowColor: '#4F46E5',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
    elevation: 4,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 1,
  },
  itemAccent: {
    position: 'absolute',
    left: 0,
    top: 8,
    bottom: 8,
    width: 3,
    borderRadius: 2,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  itemInfo: {
    flex: 1,
    marginRight: 12,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 3,
  },
  itemSubtitle: {
    fontSize: 12,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
});
