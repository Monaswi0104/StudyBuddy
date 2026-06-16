import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, BookOpen, Plus, BarChart2, User } from 'lucide-react-native';
import { HomeScreen } from '../screens/HomeScreen';
import { LibraryScreen } from '../screens/LibraryScreen';
import { ScanScreen } from '../screens/ScanScreen';
import { StatsScreen } from '../screens/StatsScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { useTheme } from '../context/ThemeContext';

const Tab = createBottomTabNavigator();

// Custom FAB component for the middle Scan tab
const CustomTabBarButton = (props: any) => {
  const { colors } = useTheme();
  return (
    <View style={props.style} pointerEvents="box-none">
      <View style={styles.customButtonContainer} pointerEvents="box-none">
        <TouchableOpacity
          style={[styles.customButtonInner, { backgroundColor: colors.primary, shadowColor: colors.primary }]}
          onPress={props.onPress}
          activeOpacity={0.8}
        >
          <Plus color="#FFFFFF" size={28} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export const BottomTabNav = () => {
  const { colors, isDarkMode } = useTheme();
  
  return (
    <Tab.Navigator
      backBehavior="firstRoute"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary, // Purple from mockup
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          height: 90,
          paddingHorizontal: 5,
          paddingTop: 10,
          backgroundColor: colors.surface,
          borderTopWidth: isDarkMode ? 1 : 0,
          borderTopColor: colors.border,
          elevation: 10,
          shadowColor: '#000',
          shadowOpacity: isDarkMode ? 0.2 : 0.05,
          shadowRadius: 10,
        },
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 12,
          paddingBottom: 10,
        }
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />
        }}
      />
      <Tab.Screen 
        name="Library" 
        component={LibraryScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <BookOpen color={color} size={size} />
        }}
      />
      <Tab.Screen 
        name="Scan" 
        component={ScanScreen} 
        options={{
          tabBarLabel: () => null,
          tabBarButton: (props) => <CustomTabBarButton {...props} />
        }}
      />
      <Tab.Screen 
        name="Stats" 
        component={StatsScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <BarChart2 color={color} size={size} />
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  customButtonContainer: {
    top: -25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  customButtonInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 6,
  }
});
