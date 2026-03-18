import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Circle, Rect, Line } from 'react-native-svg';
import { Colors, Shadows, Radius } from '../../utils/theme';

// Student icon — graduation cap
const StudentSVG = () => (
  <Svg width={36} height={36} viewBox="0 0 24 24" fill="none" stroke={Colors.accent} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M22 10v6M2 10l10-5 10 5-10 5z" />
    <Path d="M6 12v5c0 2.21 2.686 4 6 4s6-1.79 6-4v-5" />
  </Svg>
);

// Faculty icon — person + board
const FacultySVG = () => (
  <Svg width={36} height={36} viewBox="0 0 24 24" fill="none" stroke={Colors.accent} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="12" cy="8" r="3" />
    <Path d="M4 20c0-4 3.58-7 8-7s8 3 8 7" />
    <Rect x="14" y="3" width="7" height="5" rx="1" />
    <Line x1="16" y1="5" x2="19" y2="5" />
  </Svg>
);

export default function RoleSelectionScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom + 20 }]}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      <View style={styles.topSection}>
        <Text style={styles.heading}>Who are you?</Text>
        <Text style={styles.subheading}>Select your role to continue</Text>
        <View style={styles.accentBar} />
      </View>

      <View style={styles.cardsContainer}>
        {/* Student Card */}
        <TouchableOpacity
          style={styles.roleCard}
          onPress={() => navigation.navigate('StudentRegister')}
          activeOpacity={0.88}
        >
          <View style={styles.iconBox}>
            <StudentSVG />
          </View>
          <View style={styles.cardText}>
            <Text style={styles.roleTitle}>Student</Text>
            <Text style={styles.roleDesc}>Access attendance, events, career tools and campus feed</Text>
          </View>
          <View style={styles.arrow}>
            <Text style={styles.arrowText}>›</Text>
          </View>
        </TouchableOpacity>

        {/* Faculty Card */}
        <TouchableOpacity
          style={styles.roleCard}
          onPress={() => navigation.navigate('FacultyRegister')}
          activeOpacity={0.88}
        >
          <View style={styles.iconBox}>
            <FacultySVG />
          </View>
          <View style={styles.cardText}>
            <Text style={styles.roleTitle}>Faculty</Text>
            <Text style={styles.roleDesc}>Manage timetable, mark attendance and view class reports</Text>
          </View>
          <View style={styles.arrow}>
            <Text style={styles.arrowText}>›</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.footerLink}>Sign In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  topSection: { marginBottom: 40 },
  heading: {
    fontSize: 36,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: -1,
    lineHeight: 40,
  },
  subheading: {
    fontSize: 15,
    color: Colors.textSecondary,
    marginTop: 8,
  },
  accentBar: {
    width: 40,
    height: 3,
    backgroundColor: Colors.accent,
    borderRadius: 2,
    marginTop: 16,
  },
  cardsContainer: { gap: 14, marginBottom: 40 },
  roleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: Radius.lg,
    padding: 20,
    borderWidth: 1.5,
    borderColor: Colors.border,
    gap: 16,
    ...Shadows.card,
  },
  iconBox: {
    width: 64,
    height: 64,
    borderRadius: Radius.md,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  cardText: { flex: 1 },
  roleTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.primary,
    marginBottom: 4,
  },
  roleDesc: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  arrow: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowText: {
    fontSize: 20,
    color: Colors.primary,
    fontWeight: '700',
    lineHeight: 22,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: { fontSize: 14, color: Colors.textSecondary },
  footerLink: { fontSize: 14, fontWeight: '700', color: Colors.accent },
});
