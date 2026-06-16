import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, LayoutAnimation, Animated } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Mail, Lock, Eye, EyeOff, ArrowRight, BookOpen, Sparkles } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../navigation/AuthStack';

const GoogleIcon = () => (
  <Svg width="18" height="18" viewBox="0 0 48 48">
    <Path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <Path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <Path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
    <Path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    <Path fill="none" d="M0 0h48v48H0z"/>
  </Svg>
);

const AppleIcon = ({ color }: { color: string }) => (
  <Svg width="18" height="18" viewBox="0 0 384 512">
    <Path fill={color} d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
  </Svg>
);

// Unused width removed

export const LoginScreen = () => {
  const insets = useSafeAreaInsets();
  const { colors, isDarkMode } = useTheme();
  const { login } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  // Animations
  const logoScale = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [fadeAnim, logoScale, slideAnim]);

  const handleLogin = () => {
    if (!email || !password) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setError('Please fill in all fields');
      return;
    }
    setError('');
    login();
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={[styles.container, { paddingBottom: insets.bottom + 20 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Header */}
        <View style={[styles.heroSection, { paddingTop: insets.top + 30 }]}>
          {/* Decorative circles */}
          <View style={[styles.decorCircle1, { backgroundColor: 'rgba(79, 70, 229, 0.08)' }]} />
          <View style={[styles.decorCircle2, { backgroundColor: 'rgba(124, 58, 237, 0.06)' }]} />

          <Animated.View style={[styles.logoContainer, { transform: [{ scale: logoScale }] }]}>
            <View style={styles.logoOuter}>
              <View style={styles.logoInner}>
                <BookOpen color="#FFF" size={32} />
              </View>
            </View>
            <View style={styles.sparkleWrap}>
              <Sparkles color="#F59E0B" size={16} fill="#F59E0B" />
            </View>
          </Animated.View>

          <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
            <Text style={[styles.appName, { color: colors.text }]}>StudyBuddy</Text>
            <Text style={[styles.title, { color: colors.text }]}>Welcome Back</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Sign in to continue your learning journey
            </Text>
          </Animated.View>
        </View>

        {/* Form */}
        <Animated.View style={[styles.form, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Email</Text>
            <View style={[
              styles.inputContainer,
              { backgroundColor: isDarkMode ? colors.surface : '#F8F9FB', borderColor: email ? colors.primary : 'transparent' }
            ]}>
              <View style={[styles.iconWrap, { backgroundColor: isDarkMode ? 'rgba(79,70,229,0.15)' : 'rgba(79,70,229,0.08)' }]}>
                <Mail color={colors.primary} size={18} />
              </View>
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="Enter your email"
                placeholderTextColor={colors.textSecondary}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Password</Text>
            <View style={[
              styles.inputContainer,
              { backgroundColor: isDarkMode ? colors.surface : '#F8F9FB', borderColor: password ? colors.primary : 'transparent' }
            ]}>
              <View style={[styles.iconWrap, { backgroundColor: isDarkMode ? 'rgba(79,70,229,0.15)' : 'rgba(79,70,229,0.08)' }]}>
                <Lock color={colors.primary} size={18} />
              </View>
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="Enter your password"
                placeholderTextColor={colors.textSecondary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                {showPassword ? (
                  <EyeOff color={colors.textSecondary} size={20} />
                ) : (
                  <Eye color={colors.textSecondary} size={20} />
                )}
              </TouchableOpacity>
            </View>
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={[styles.forgotPasswordText, { color: colors.primary }]}>Forgot Password?</Text>
          </TouchableOpacity>

          {/* Sign In Button */}
          <TouchableOpacity
            style={styles.loginBtn}
            onPress={handleLogin}
            activeOpacity={0.85}
          >
            <View style={styles.loginBtnGradient}>
              <Text style={styles.loginBtnText}>Sign In</Text>
              <View style={styles.arrowCircle}>
                <ArrowRight color="#4F46E5" size={18} />
              </View>
            </View>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
            <Text style={[styles.dividerText, { color: colors.textSecondary }]}>or continue with</Text>
            <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
          </View>

          {/* Social buttons */}
          <View style={styles.socialRow}>
            <TouchableOpacity style={[styles.socialBtn, { backgroundColor: isDarkMode ? colors.surface : '#F8F9FB', borderColor: colors.border }]}>
              <View style={styles.socialIconWrap}>
                <GoogleIcon />
              </View>
              <Text style={[styles.socialText, { color: colors.text }]}>Google</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.socialBtn, { backgroundColor: isDarkMode ? colors.surface : '#F8F9FB', borderColor: colors.border }]}>
              <View style={styles.socialIconWrap}>
                <AppleIcon color={isDarkMode ? '#FFF' : '#000'} />
              </View>
              <Text style={[styles.socialText, { color: colors.text }]}>Apple</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={[styles.footerLink, { color: colors.primary }]}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 36,
    overflow: 'hidden',
  },
  decorCircle1: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    top: -40,
    right: -60,
  },
  decorCircle2: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    top: 20,
    left: -50,
  },
  logoContainer: {
    marginBottom: 20,
    position: 'relative',
  },
  logoOuter: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: 'rgba(79, 70, 229, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoInner: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: '#4F46E5',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4F46E5',
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 8,
  },
  sparkleWrap: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#FEF3C7',
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appName: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
    textAlign: 'center',
    marginBottom: 8,
    opacity: 0.4,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  form: {
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 16,
    paddingHorizontal: 14,
    height: 56,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    height: '100%',
  },
  eyeIcon: {
    padding: 8,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
    marginTop: -4,
  },
  forgotPasswordText: {
    fontSize: 13,
    fontWeight: '600',
  },
  loginBtn: {
    marginBottom: 28,
  },
  loginBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderRadius: 16,
    backgroundColor: '#4F46E5',
    shadowColor: '#4F46E5',
    shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 6,
  },
  loginBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
    marginRight: 12,
  },
  arrowCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 14,
    fontSize: 13,
    fontWeight: '500',
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  socialBtn: {
    flex: 1,
    flexDirection: 'row',
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  socialIconWrap: {
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialText: {
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto',
    paddingTop: 20,
  },
  footerText: {
    fontSize: 14,
  },
  footerLink: {
    fontSize: 14,
    fontWeight: '700',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 13,
    marginBottom: 12,
    marginTop: -6,
    marginLeft: 4,
  },
});
