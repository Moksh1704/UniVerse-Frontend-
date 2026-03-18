/**
 * IntroAnimationScreen — Cinematic video intro
 *
 * Timeline:
 *   0.0s  Video plays fullscreen, muted, no UI
 *   1.5s  Dark overlay fades in (cinematic dim)
 *   2.8s  Blur overlay fades in on top
 *   3.4s  Logo + tagline rise into view
 *   4.6s  "Get Started" button slides up
 */

import React, { useEffect, useRef, useCallback } from 'react';
import {
  View, Text, StyleSheet, Animated,
  TouchableOpacity, Dimensions, Easing,
  StatusBar, Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Video, ResizeMode } from 'expo-av';
import { BlurView } from 'expo-blur';
import Svg, { Circle, Path } from 'react-native-svg';
import { Colors } from '../../utils/theme';

const { width: W, height: H } = Dimensions.get('window');
const EASE = Easing.out(Easing.cubic);

// ── Logo mark ────────────────────────────────────────────────────────────────
const LogoMark = ({ size = 64 }) => (
  <Svg width={size} height={size} viewBox="0 0 88 88" fill="none">
    <Circle cx="44" cy="48" r="30" stroke={Colors.accent} strokeWidth="2.5" />
    <Path d="M14 48 Q44 36 74 48" stroke={Colors.accent} strokeWidth="1.8" fill="none" />
    <Path d="M14 48 Q44 60 74 48" stroke={Colors.accent} strokeWidth="1.8" fill="none" />
    <Path d="M44 18 V78"           stroke={Colors.accent} strokeWidth="1.8" />
    <Path d="M26 26 L44 18 L62 26 L44 34 Z" fill={Colors.accent} />
    <Path d="M55 29 V40 Q44 46 33 40 V29" stroke={Colors.accent} strokeWidth="1.8" fill="none" />
    <Path d="M62 26 V36" stroke={Colors.accent} strokeWidth="2" strokeLinecap="round" />
    <Circle cx="62" cy="38" r="2" fill={Colors.accent} />
  </Svg>
);

export default function IntroAnimationScreen({ navigation }) {
  const insets   = useSafeAreaInsets();
  const videoRef = useRef(null);

  // ── Animation values ─────────────────────────────────────────────────────
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const blurOpacity    = useRef(new Animated.Value(0)).current;
  const logoOpacity    = useRef(new Animated.Value(0)).current;
  const logoY          = useRef(new Animated.Value(24)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const btnOpacity     = useRef(new Animated.Value(0)).current;
  const btnY           = useRef(new Animated.Value(20)).current;
  const exitOpacity    = useRef(new Animated.Value(1)).current;

  const runIntroSequence = useCallback(() => {
    // Step 1 — dark overlay fades in at 1.5s
    setTimeout(() => {
      Animated.timing(overlayOpacity, {
        toValue: 1, duration: 1000, easing: EASE, useNativeDriver: true,
      }).start();
    }, 1500);

    // Step 2 — blur overlay at 2.8s
    setTimeout(() => {
      Animated.timing(blurOpacity, {
        toValue: 1, duration: 900, easing: EASE, useNativeDriver: true,
      }).start();
    }, 2800);

    // Step 3 — logo + tagline at 3.4s
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(logoOpacity,    { toValue: 1, duration: 700, easing: EASE, useNativeDriver: true }),
        Animated.timing(logoY,          { toValue: 0, duration: 700, easing: EASE, useNativeDriver: true }),
        Animated.timing(taglineOpacity, { toValue: 1, duration: 900, easing: EASE, useNativeDriver: true }),
      ]).start();
    }, 3400);

    // Step 4 — button at 4.6s
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(btnOpacity, { toValue: 1, duration: 600, easing: EASE, useNativeDriver: true }),
        Animated.timing(btnY,       { toValue: 0, duration: 600, easing: EASE, useNativeDriver: true }),
      ]).start();
    }, 4600);
  }, []);

  useEffect(() => {
    runIntroSequence();
  }, []);

  const handleGetStarted = () => {
    // Fade entire screen to black then navigate
    Animated.timing(exitOpacity, {
      toValue: 0, duration: 500, easing: Easing.in(Easing.cubic), useNativeDriver: true,
    }).start(() => {
      navigation.replace('GetStarted');
    });
  };

  return (
    <Animated.View style={[styles.root, { opacity: exitOpacity }]}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* ── Video background ──────────────────────────────────────────────── */}
      <Video
        ref={videoRef}
        source={require('../../../assets/videos/intro.mp4')}
        style={styles.video}
        resizeMode={ResizeMode.COVER}
        shouldPlay
        isLooping
        isMuted
        rate={1.0}
        volume={0}
      />

      {/* ── Permanent base vignette (top + bottom) — always on ────────────── */}
      <View style={styles.vignetteTop}    pointerEvents="none" />
      <View style={styles.vignetteBottom} pointerEvents="none" />

      {/* ── Animated dark overlay ─────────────────────────────────────────── */}
      <Animated.View
        style={[styles.darkOverlay, { opacity: overlayOpacity }]}
        pointerEvents="none"
      />

      {/* ── Animated blur layer ───────────────────────────────────────────── */}
      <Animated.View
        style={[styles.blurLayer, { opacity: blurOpacity }]}
        pointerEvents="none"
      >
        <BlurView
          intensity={18}
          tint="dark"
          style={StyleSheet.absoluteFillObject}
        />
      </Animated.View>

      {/* ── Letterbox bars — cinematic framing ───────────────────────────── */}
      <View style={[styles.letterbox, { top: 0 }]}    pointerEvents="none" />
      <View style={[styles.letterbox, { bottom: 0 }]} pointerEvents="none" />

      {/* ── Logo + tagline — centered ─────────────────────────────────────── */}
      <Animated.View style={[
        styles.logoBlock,
        { opacity: logoOpacity, transform: [{ translateY: logoY }] },
      ]}>
        <View style={styles.logoRing}>
          <LogoMark size={64} />
        </View>

        <Text style={styles.appName}>UniVerse</Text>
        <View style={styles.accentDivider} />

        <Animated.Text style={[styles.tagline, { opacity: taglineOpacity }]}>
          Your Campus, Connected
        </Animated.Text>
        <Animated.Text style={[styles.universityName, { opacity: taglineOpacity }]}>
          Andhra University
        </Animated.Text>
      </Animated.View>

      {/* ── Get Started button ────────────────────────────────────────────── */}
      <Animated.View style={[
        styles.btnContainer,
        { paddingBottom: insets.bottom + 48 },
        { opacity: btnOpacity, transform: [{ translateY: btnY }] },
      ]}>
        <TouchableOpacity
          style={styles.btn}
          onPress={handleGetStarted}
          activeOpacity={0.84}
        >
          <Text style={styles.btnText}>Get Started</Text>
          <View style={styles.btnArrow}>
            <Text style={styles.btnArrowText}>›</Text>
          </View>
        </TouchableOpacity>

        <Animated.Text style={[styles.signInHint, { opacity: taglineOpacity }]}>
          Already have an account?{'  '}
          <Text
            style={styles.signInLink}
            onPress={() => navigation.navigate('Login')}
          >
            Sign In
          </Text>
        </Animated.Text>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#03060f',
  },

  // Video — absolute fullscreen
  video: {
    position: 'absolute',
    top: 0, left: 0,
    width: W, height: H,
  },

  // Always-on vignette edges for contrast
  vignetteTop: {
    position: 'absolute', top: 0, left: 0, right: 0,
    height: H * 0.38,
    backgroundColor: 'rgba(3,6,20,0.55)',
  },
  vignetteBottom: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    height: H * 0.42,
    backgroundColor: 'rgba(3,6,20,0.65)',
  },

  // Animated dark overlay
  darkOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(3,6,20,0.42)',
  },

  // Blur layer
  blurLayer: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
  },

  // Letterbox bars
  letterbox: {
    position: 'absolute', left: 0, right: 0,
    height: 54,
    backgroundColor: 'rgba(2,4,14,0.92)',
  },

  // Logo block
  logoBlock: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  logoRing: {
    width: 100, height: 100, borderRadius: 24,
    backgroundColor: 'rgba(245,158,11,0.10)',
    borderWidth: 1.5,
    borderColor: 'rgba(245,158,11,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    // Subtle glow
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 8,
  },
  appName: {
    fontSize: 52, fontWeight: '800',
    color: '#FFFFFF', letterSpacing: -1.5, lineHeight: 56,
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  accentDivider: {
    width: 52, height: 2.5,
    backgroundColor: Colors.accent,
    borderRadius: 2,
    marginVertical: 14,
  },
  tagline: {
    fontSize: 11, color: 'rgba(255,255,255,0.62)',
    letterSpacing: 3.2, textTransform: 'uppercase',
    fontWeight: '500', textAlign: 'center',
  },
  universityName: {
    fontSize: 11, color: Colors.accent,
    letterSpacing: 2.2, textTransform: 'uppercase',
    fontWeight: '700', marginTop: 10,
  },

  // Button
  btnContainer: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    paddingHorizontal: 28,
    alignItems: 'center',
  },
  btn: {
    width: '100%',
    backgroundColor: Colors.accent,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 18,
    elevation: 12,
  },
  btnText: {
    fontSize: 16, fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 0.4,
    flex: 1, textAlign: 'center',
  },
  btnArrow: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: 'rgba(15,23,42,0.18)',
    alignItems: 'center', justifyContent: 'center',
  },
  btnArrowText: {
    fontSize: 20, color: Colors.primary,
    fontWeight: '700', lineHeight: 22,
  },
  signInHint: {
    marginTop: 14,
    fontSize: 13,
    color: 'rgba(255,255,255,0.45)',
  },
  signInLink: {
    color: Colors.accent,
    fontWeight: '700',
  },
});
