import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft, Share2, ZoomIn, ZoomOut } from 'lucide-react-native';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';

export const MindMapScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { colors, isDarkMode } = useTheme();
  const { t } = useTranslation();

  const centerNode = { x: 300, y: 300, label: 'Biology 101', color: '#4F46E5', bg: '#EEF2FF' };
  const childNodes = [
    { id: 1, x: 300, y: 150, label: 'Cell Structure', color: '#22C55E', bg: isDarkMode ? 'rgba(34,197,94,0.15)' : '#ECFDF5' },
    { id: 2, x: 150, y: 400, label: 'Genetics', color: '#F59E0B', bg: isDarkMode ? 'rgba(245,158,11,0.15)' : '#FFF8EB' },
    { id: 3, x: 450, y: 400, label: 'Ecology', color: '#EC4899', bg: isDarkMode ? 'rgba(236,72,153,0.15)' : '#FDF2F8' },
    { id: 4, x: 100, y: 200, label: 'Evolution', color: '#3B82F6', bg: isDarkMode ? 'rgba(59,130,246,0.15)' : '#EFF6FF' },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top + 10, paddingBottom: insets.bottom + 20, backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={[styles.backBtn, {
          backgroundColor: isDarkMode ? colors.surface : '#FFFFFF',
          borderColor: isDarkMode ? colors.border : '#F3F4F6',
        }]} onPress={() => navigation.goBack()}>
          <ChevronLeft color={colors.text} size={24} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{t('generate.mindMap')}</Text>
        <TouchableOpacity style={[styles.shareBtn, {
          backgroundColor: isDarkMode ? colors.surface : '#FFFFFF',
          borderColor: isDarkMode ? colors.border : '#F3F4F6',
        }]}>
          <Share2 color={colors.primary} size={18} />
        </TouchableOpacity>
      </View>

      {/* Map */}
      <View style={[styles.mapContainer, {
        backgroundColor: isDarkMode ? colors.surface : '#FFFFFF',
        borderColor: isDarkMode ? colors.border : '#F3F4F6',
      }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ width: 600 }} bounces={false}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ height: 600 }} bounces={false}>
            <View style={styles.svgWrapper}>
              <Svg width="600" height="600">
                {childNodes.map(node => (
                  <Path
                    key={`line-${node.id}`}
                    d={`M${centerNode.x} ${centerNode.y} L${node.x} ${node.y}`}
                    stroke={isDarkMode ? colors.border : '#E5E7EB'}
                    strokeWidth="2.5"
                    strokeDasharray="8,4"
                    fill="none"
                  />
                ))}
              </Svg>
            </View>

            <TouchableOpacity style={[styles.centerNode, { left: centerNode.x - 75, top: centerNode.y - 30, backgroundColor: centerNode.color }]}>
              <Text style={styles.centerNodeText}>{centerNode.label}</Text>
            </TouchableOpacity>

            {childNodes.map(node => (
              <TouchableOpacity
                key={`node-${node.id}`}
                style={[styles.childNode, { left: node.x - 65, top: node.y - 25, backgroundColor: node.bg, borderColor: node.color }]}
              >
                <View style={[styles.nodeDot, { backgroundColor: node.color }]} />
                <Text style={[styles.childNodeText, { color: node.color }]}>{node.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </ScrollView>

        {/* Zoom */}
        <View style={[styles.zoomControls, {
          backgroundColor: isDarkMode ? colors.surface : '#FFFFFF',
          borderColor: isDarkMode ? colors.border : '#F3F4F6',
        }]}>
          <TouchableOpacity style={styles.zoomBtn}><ZoomIn color={colors.textSecondary} size={20} /></TouchableOpacity>
          <View style={[styles.zoomDivider, { backgroundColor: isDarkMode ? colors.border : '#F3F4F6' }]} />
          <TouchableOpacity style={styles.zoomBtn}><ZoomOut color={colors.textSecondary} size={20} /></TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 16 },
  backBtn: { width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 1, shadowColor: '#000', shadowOpacity: 0.04, shadowOffset: { width: 0, height: 2 }, shadowRadius: 8, elevation: 1 },
  headerTitle: { fontSize: 18, fontWeight: '700', letterSpacing: -0.3 },
  shareBtn: { width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },

  mapContainer: { flex: 1, borderRadius: 20, marginHorizontal: 20, marginBottom: 20, overflow: 'hidden', position: 'relative', borderWidth: 1, shadowColor: '#000', shadowOpacity: 0.04, shadowOffset: { width: 0, height: 4 }, shadowRadius: 12, elevation: 2 },
  svgWrapper: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },

  centerNode: { position: 'absolute', width: 150, height: 60, borderRadius: 20, alignItems: 'center', justifyContent: 'center', shadowColor: '#4F46E5', shadowOpacity: 0.25, shadowOffset: { width: 0, height: 4 }, shadowRadius: 12, elevation: 6 },
  centerNodeText: { fontSize: 15, fontWeight: '800', color: '#FFF', textAlign: 'center', letterSpacing: -0.3 },

  childNode: { position: 'absolute', width: 150, height: 54, borderRadius: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderWidth: 2, shadowColor: '#000', shadowOpacity: 0.06, shadowOffset: { width: 0, height: 3 }, shadowRadius: 8, elevation: 3, gap: 6 },
  nodeDot: { width: 8, height: 8, borderRadius: 4 },
  childNodeText: { fontSize: 13, fontWeight: '700', textAlign: 'center' },

  zoomControls: { position: 'absolute', bottom: 16, right: 16, borderRadius: 14, borderWidth: 1, shadowColor: '#000', shadowOpacity: 0.06, shadowOffset: { width: 0, height: 2 }, shadowRadius: 8, elevation: 3 },
  zoomBtn: { padding: 12, alignItems: 'center', justifyContent: 'center' },
  zoomDivider: { height: 1, width: '100%' },
});
