import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft, Share2, ZoomIn, ZoomOut } from 'lucide-react-native';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';

// Unused width removed

export const MindMapScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { colors } = useTheme();
  const { t } = useTranslation();

  // Hardcoded node positions for the mock mind map
  const centerNode = { x: 300, y: 300, label: 'Biology 101', color: '#4F46E5', bg: '#EEF2FF' };
  
  const childNodes = [
    { id: 1, x: 300, y: 150, label: 'Cell Structure', color: '#059669', bg: '#ECFDF5' },
    { id: 2, x: 150, y: 400, label: 'Genetics', color: '#D97706', bg: '#FEF3C7' },
    { id: 3, x: 450, y: 400, label: 'Ecology', color: '#DB2777', bg: '#FCE7F3' },
    { id: 4, x: 100, y: 200, label: 'Evolution', color: '#2563EB', bg: '#DBEAFE' },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top + 10, paddingBottom: insets.bottom + 20, backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={[styles.backBtn, { backgroundColor: colors.surface, borderColor: colors.border }]} onPress={() => navigation.goBack()}>
          <ChevronLeft color={colors.text} size={24} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{t('generate.mindMap')}</Text>
        <TouchableOpacity style={[styles.shareBtn, { backgroundColor: colors.surface, borderColor: colors.primary, borderWidth: 1 }]}>
          <Share2 color={colors.primary} size={20} />
        </TouchableOpacity>
      </View>

      {/* Map Area */}
      <View style={[styles.mapContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={{ width: 600 }}
          bounces={false}
        >
          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ height: 600 }}
            bounces={false}
          >
            {/* Draw SVG Lines connecting nodes */}
            <View style={styles.svgWrapper}>
              <Svg width="600" height="600">
                {childNodes.map(node => (
                  <Path
                    key={`line-${node.id}`}
                    d={`M${centerNode.x} ${centerNode.y} L${node.x} ${node.y}`}
                    stroke={colors.border}
                    strokeWidth="3"
                    fill="none"
                  />
                ))}
              </Svg>
            </View>

            {/* Render Nodes */}
            <TouchableOpacity 
              style={[styles.node, { left: centerNode.x - 75, top: centerNode.y - 30, backgroundColor: centerNode.color }]}
            >
              <Text style={[styles.nodeText, { color: '#FFF' }]}>{centerNode.label}</Text>
            </TouchableOpacity>

            {childNodes.map(node => (
              <TouchableOpacity 
                key={`node-${node.id}`}
                style={[styles.node, { left: node.x - 65, top: node.y - 25, backgroundColor: node.bg, borderColor: node.color }]}
              >
                <Text style={[styles.nodeText, { color: node.color }]}>{node.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </ScrollView>

        {/* Zoom Controls Overlay */}
        <View style={[styles.zoomControls, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <TouchableOpacity style={styles.zoomBtn}>
            <ZoomIn color={colors.textSecondary} size={24} />
          </TouchableOpacity>
          <View style={[styles.zoomDivider, { backgroundColor: colors.border }]} />
          <TouchableOpacity style={styles.zoomBtn}>
            <ZoomOut color={colors.textSecondary} size={24} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 16 },
  backBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  headerTitle: { fontSize: 18, fontWeight: '600' },
  shareBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  mapContainer: { flex: 1, borderRadius: 24, marginHorizontal: 20, marginBottom: 20, overflow: 'hidden', position: 'relative', borderWidth: 1 },
  svgWrapper: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  node: { position: 'absolute', width: 150, height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center', borderWidth: 2, shadowOpacity: 0.1, shadowOffset: { width: 0, height: 4 }, shadowRadius: 8, elevation: 4 },
  nodeText: { fontSize: 14, fontWeight: '700', textAlign: 'center' },
  zoomControls: { position: 'absolute', bottom: 20, right: 20, borderRadius: 12, shadowOpacity: 0.1, shadowOffset: { width: 0, height: 4 }, shadowRadius: 8, elevation: 4, borderWidth: 1 },
  zoomBtn: { padding: 12, alignItems: 'center', justifyContent: 'center' },
  zoomDivider: { height: 1, width: '100%' },
});
