import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Search, FileText, Layers, HelpCircle, MoreVertical } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/StackNav';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';

export const LibraryScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('All');

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  }, [fadeAnim, slideAnim]);
  
  const tabs = ['All', 'Notes', 'Flashcards', 'Quizzes'];

  const libraryItems = [
    { id: '1', title: 'Photosynthesis Notes', subtitle: 'Today • 20 cards', type: 'Flashcards', icon: Layers, color: '#10B981', badgeBg: '#ECFDF5', badgeText: '#059669' },
    { id: '2', title: 'Machine Learning Basics', subtitle: 'Yesterday • 28 cards', type: 'Flashcards', icon: Layers, color: '#10B981', badgeBg: '#ECFDF5', badgeText: '#059669' },
    { id: '3', title: 'Neural Networks', subtitle: '2 days ago • 30 cards', type: 'Flashcards', icon: Layers, color: '#10B981', badgeBg: '#ECFDF5', badgeText: '#059669' },
    { id: '4', title: 'Data Structures Notes', subtitle: '3 days ago • Notes', type: 'Notes', icon: FileText, color: '#F59E0B', badgeBg: '#FFFBEB', badgeText: '#D97706' },
    { id: '5', title: 'Operating System Concepts', subtitle: '6 days ago • 10 cards', type: 'Quiz', icon: HelpCircle, color: '#3B82F6', badgeBg: '#EFF6FF', badgeText: '#2563EB' },
    { id: '6', title: 'Database Management', subtitle: '1 week ago • 22 cards', type: 'Flashcards', icon: Layers, color: '#10B981', badgeBg: '#ECFDF5', badgeText: '#059669' },
  ];

  return (
    <Animated.View style={[styles.container, { paddingTop: insets.top + 10, backgroundColor: colors.background, opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>{t('library.title')}</Text>
        </View>
        <TouchableOpacity style={[styles.searchBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Search color={colors.text} size={24} />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {tabs.map((tab) => (
            <TouchableOpacity 
              key={tab} 
              style={[
                styles.tab, 
                { backgroundColor: colors.surface, borderColor: colors.border },
                activeTab === tab && { backgroundColor: colors.primary, borderColor: colors.primary }
              ]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[
                styles.tabText, 
                { color: colors.textSecondary },
                activeTab === tab && { color: colors.white }
              ]}>
                {tab === 'All' ? t('library.all') : tab === 'Notes' ? t('library.notes') : tab === 'Flashcards' ? t('library.flashcards') : t('library.quizzes')}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* List */}
      <ScrollView 
        contentContainerStyle={{ paddingBottom: 150, paddingHorizontal: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {libraryItems.filter(item => {
          if (activeTab === 'All') return true;
          if (activeTab === 'Notes' && item.type === 'Notes') return true;
          if (activeTab === 'Flashcards' && item.type === 'Flashcards') return true;
          if (activeTab === 'Quizzes' && item.type === 'Quiz') return true;
          return false;
        }).map(item => (
          <TouchableOpacity 
            key={item.id} 
            style={[styles.listItem, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={() => {
              if (item.type === 'Flashcards') navigation.navigate('FlashCards', {});
              else if (item.type === 'Quiz') navigation.navigate('Quiz', {});
              else if (item.type === 'Notes') navigation.navigate('Summary', {});
            }}
          >
            <View style={[styles.iconBox, { backgroundColor: item.badgeBg }]}>
              <item.icon color={item.color} size={24} />
            </View>
            <View style={styles.itemInfo}>
              <Text style={[styles.itemTitle, { color: colors.text }]} numberOfLines={1}>{item.title}</Text>
              <Text style={[styles.itemSubtitle, { color: colors.textSecondary }]}>{item.subtitle}</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: item.badgeBg }]}>
              <Text style={[styles.badgeText, { color: item.badgeText }]}>{item.type}</Text>
            </View>
            <TouchableOpacity style={styles.moreBtn}>
              <MoreVertical color={colors.textSecondary} size={20} />
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </Animated.View>
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
    fontWeight: '700',
  },
  searchBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  tabsContainer: {
    paddingLeft: 20,
    marginBottom: 20,
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
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
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  itemInfo: {
    flex: 1,
    marginRight: 12,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  itemSubtitle: {
    fontSize: 13,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 12,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  moreBtn: {
    padding: 4,
  },
});
