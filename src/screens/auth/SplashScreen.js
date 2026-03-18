import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, Animated, StatusBar, TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Path, G } from 'react-native-svg';
import { Colors } from '../../utils/theme';

// Minimal globe + mortarboard mark — clean, scalable
const LogoMark = ({ size = 88 }) => (
  <Svg width={size} height={size} viewBox="0 0 88 88" fill="none">
    {/* Globe base */}
    <Circle cx="44" cy="48" r="30" stroke={Colors.accent} strokeWidth="2.5" />
    {/* Latitude lines */}
    <Path d="M14 48 Q44 36 74 48" stroke={Colors.accent} strokeWidth="1.8" fill="none" />
    <Path d="M14 48 Q44 60 74 48" stroke={Colors.accent} strokeWidth="1.8" fill="none" />
    {/* Vertical axis */}
    <Path d="M44 18 V78" stroke={Colors.accent} strokeWidth="1.8" />
    {/* Mortarboard cap */}
    <Path d="M26 26 L44 18 L62 26 L44 34 Z" fill={Colors.accent} />
    <Path d="M55 29 V40 Q44 46 33 40 V29" stroke={Colors.accent} strokeWidth="1.8" fill="none" />
    {/* Tassel */}
    <Path d="M62 26 V36" stroke={Colors.accent} strokeWidth="2" strokeLinecap="round" />
    <Circle cx="62" cy="38" r="2" fill={Colors.accent} />
  </Svg>
);

export default function SplashScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  const markOpacity  = useRef(new Animated.Value(0)).current;
  const markY        = useRef(new Animated.Value(20)).current;
  const textOpacity  = useRef(new Animated.Value(0)).current;
  const lineWidth    = useRef(new Animated.Value(0)).current;
  const btnOpacity   = useRef(new Animated.Value(0)).current;
  const btnY         = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(markOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(markY,       { toValue: 0, duration: 600, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(textOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.timing(lineWidth,   { toValue: 1, duration: 500, useNativeDriver: false }),
      ]),
      Animated.parallel([
        Animated.timing(btnOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(btnY,       { toValue: 0, duration: 400, useNativeDriver: true }),
      ]),
    ]).start();
  }, []);

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom + 40 }]}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      {/* Decorative background circles */}
      <View style={[styles.bgCircle, styles.bgCircle1]} />
      <View style={[styles.bgCircle, styles.bgCircle2]} />

      {/* Logo mark */}
      <Animated.View style={[styles.markWrap, { opacity: markOpacity, transform: [{ translateY: markY }] }]}>
        <View style={styles.markContainer}>
          <LogoMark size={90} />
        </View>
      </Animated.View>

      {/* App name + tagline */}
      <Animated.View style={[styles.textBlock, { opacity: textOpacity }]}>
        <Text style={styles.appName}>UniVerse</Text>
        <Animated.View style={[styles.accentLine, {
          width: lineWidth.interpolate({ inputRange: [0, 1], outputRange: ['0%', '60%'] }),
        }]} />
        <Text style={styles.tagline}>Your Campus, Connected</Text>
        <Text style={styles.university}>Andhra University</Text>
      </Animated.View>

      {/* CTA */}
      <Animated.View style={[styles.btnWrap, { opacity: btnOpacity, transform: [{ translateY: btnY }] }]}>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => navigation.replace('GetStarted')}
          activeOpacity={0.86}
        >
          <Text style={styles.btnText}>Get Started</Text>
          <View style={styles.btnArrowWrap}>
            <Text style={styles.btnArrow}>›</Text>
          </View>
        </TouchableOpacity>
      </Animated.View>

      <Text style={styles.versionText}>v1.0.0</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  bgCircle: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: 'rgba(245,158,11,0.05)',
  },
  bgCircle1: { width: 360, height: 360, top: -80, right: -100 },
  bgCircle2: { width: 280, height: 280, bottom: -60, left: -80 },
  markWrap: { marginBottom: 36 },
  markContainer: {
    width: 110,
    height: 110,
    borderRadius: 28,
    backgroundColor: 'rgba(245,158,11,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(245,158,11,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textBlock: { alignItems: 'center', marginBottom: 56 },
  appName: {
    fontSize: 52,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -2,
    lineHeight: 56,
  },
  accentLine: {
    height: 3,
    backgroundColor: Colors.accent,
    borderRadius: 2,
    marginVertical: 14,
    alignSelf: 'center',
  },
  tagline: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.55)',
    letterSpacing: 2.8,
    textTransform: 'uppercase',
    fontWeight: '500',
    marginBottom: 8,
  },
  university: {
    fontSize: 12,
    color: Colors.accent,
    fontWeight: '600',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  btnWrap: { width: '100%' },
  btn: {
    backgroundColor: Colors.accent,
    borderRadius: 14,
    paddingVertical: 15,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 8,
  },
  btnText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 0.4,
    flex: 1,
    textAlign: 'center',
  },
  btnArrowWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(15,23,42,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnArrow: {
    fontSize: 20,
    color: Colors.primary,
    fontWeight: '700',
    lineHeight: 22,
  },
  versionText: {
    position: 'absolute',
    bottom: 20,
    fontSize: 11,
    color: 'rgba(255,255,255,0.2)',
    letterSpacing: 1,
  },
});
