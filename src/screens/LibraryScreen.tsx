import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, Dimensions, TextInput, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Search, FileText, Layers, HelpCircle, ChevronRight } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/StackNav';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { useStudyStore } from '../store/studyStore';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const LibraryScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { colors, isDarkMode } = useTheme();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const materials = useStudyStore((state) => state.materials);
  const deleteMaterial = useStudyStore((state) => state.deleteMaterial);

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
    { key: 'Flashcards', label: t('library.flashcards') },
    { key: 'Quiz', label: t('library.quizzes') },
    { key: 'Summary', label: 'Summary' },
  ];

  const typeToIcon: Record<string, { icon: any; color: string; bg: string }> = {
    'Flashcards': { icon: Layers, color: '#22C55E', bg: isDarkMode ? 'rgba(34,197,94,0.15)' : '#ECFDF5' },
    'Quiz': { icon: HelpCircle, color: '#3B82F6', bg: isDarkMode ? 'rgba(59,130,246,0.15)' : '#EFF6FF' },
    'Summary': { icon: FileText, color: '#F59E0B', bg: isDarkMode ? 'rgba(245,158,11,0.15)' : '#FFF8EB' },
    'Mind Map': { icon: Layers, color: '#8B5CF6', bg: isDarkMode ? 'rgba(139,92,246,0.15)' : '#F5F3FF' },
  };

  // Time ago helper
  const timeAgo = (ts: number) => {
    const diff = Date.now() - ts;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins} min ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days === 1) return 'Yesterday';
    return `${days} days ago`;
  };

  const filteredItems = materials.filter(item => {
    const matchesTab = activeTab === 'All' || item.type === activeTab;
    const matchesSearch = !searchQuery || item.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
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
        }]} onPress={() => setIsSearchVisible(!isSearchVisible)}>
          <Search color={colors.text} size={20} />
        </TouchableOpacity>
      </Animated.View>

      {/* Search Bar */}
      {isSearchVisible && (
        <View style={[styles.searchBarContainer, { backgroundColor: isDarkMode ? colors.surface : '#FFFFFF', borderColor: isDarkMode ? colors.border : '#F3F4F6' }]}>
          <Search color={colors.textSecondary} size={16} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search materials..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
          />
        </View>
      )}

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
          {filteredItems.length === 0 ? (
            <View style={[styles.emptyState, {
              backgroundColor: isDarkMode ? colors.surface : '#FFFFFF',
              borderColor: isDarkMode ? colors.border : '#F3F4F6',
            }]}>
              <Layers color={colors.textSecondary} size={32} />
              <Text style={[styles.emptyTitle, { color: colors.text }]}>
                {materials.length === 0 ? 'No materials yet' : 'No matches found'}
              </Text>
              <Text style={[styles.emptySub, { color: colors.textSecondary }]}>
                {materials.length === 0 ? 'Generate some study materials to see them here!' : 'Try a different search or filter.'}
              </Text>
            </View>
          ) : (
            filteredItems.map((item) => {
              const config = typeToIcon[item.type] || typeToIcon['Flashcards'];
              const IconComp = config.icon;
              const itemCount = Array.isArray(item.data) ? `${item.data.length} items` : item.type;
              return (
                <View key={item.id} style={[styles.listItem, {
                  backgroundColor: isDarkMode ? colors.surface : '#FFFFFF',
                  borderColor: isDarkMode ? colors.border : '#F3F4F6',
                }]}>
                  {/* Color accent left border */}
                  <View style={[styles.itemAccent, { backgroundColor: config.color }]} />
                  <TouchableOpacity
                    style={styles.itemTouchable}
                    activeOpacity={0.7}
                    onPress={() => {
                      if (item.type === 'Flashcards') navigation.navigate('FlashCards', { data: item.data, title: item.title });
                      else if (item.type === 'Quiz') navigation.navigate('Quiz', { data: item.data, title: item.title });
                      else if (item.type === 'Summary') navigation.navigate('Summary', { data: item.data, title: item.title });
                      else if (item.type === 'Mind Map') navigation.navigate('MindMap', { data: item.data, title: item.title });
                    }}
                  >
                    <View style={[styles.iconBox, { backgroundColor: config.bg }]}>
                      <IconComp color={config.color} size={20} />
                    </View>
                    <View style={styles.itemInfo}>
                      <Text style={[styles.itemTitle, { color: colors.text }]} numberOfLines={1}>{item.title}</Text>
                      <Text style={[styles.itemSubtitle, { color: colors.textSecondary }]}>{itemCount} • {timeAgo(item.createdAt)}</Text>
                    </View>
                    <View style={[styles.badge, { backgroundColor: config.bg }]}>
                      <Text style={[styles.badgeText, { color: config.color }]}>{item.type}</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.deleteBtn, { backgroundColor: isDarkMode ? 'rgba(239,68,68,0.12)' : '#FEF2F2' }]}
                    onPress={() => {
                      Alert.alert('Delete', `Delete "${item.title}"?`, [
                        { text: 'Cancel', style: 'cancel' },
                        { text: 'Delete', style: 'destructive', onPress: () => deleteMaterial(item.id) },
                      ]);
                    }}
                  >
                    <Text style={styles.deleteBtnText}>✕</Text>
                  </TouchableOpacity>
                </View>
              );
            })
          )}
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
  itemTouchable: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  deleteBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#EF4444',
  },

  // Search bar
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 0,
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
    borderRadius: 16,
    borderWidth: 1,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 12,
    marginBottom: 4,
  },
  emptySub: {
    fontSize: 13,
    textAlign: 'center',
    paddingHorizontal: 30,
  },
});
