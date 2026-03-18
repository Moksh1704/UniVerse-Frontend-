import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../utils/theme';
import { BackIcon } from './Icons';

export const ScreenHeader = ({ title, subtitle, onBack, rightIcon, onRight }) => {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      <View style={styles.row}>
        {onBack ? (
          <TouchableOpacity style={styles.iconBtn} onPress={onBack} activeOpacity={0.75}>
            <BackIcon size={20} color={Colors.accent} />
          </TouchableOpacity>
        ) : (
          <View style={styles.iconBtn} />
        )}

        <View style={styles.titleBlock}>
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text> : null}
        </View>

        {onRight ? (
          <TouchableOpacity style={styles.iconBtn} onPress={onRight} activeOpacity={0.75}>
            <Text style={styles.rightText}>{rightIcon || '+'}</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.iconBtn} />
        )}
      </View>
    </View>
  );
};

export const HomeHeader = ({ greeting, subtitle }) => {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.homeHeader, { paddingTop: insets.top + 18 }]}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      <Text style={styles.homeGreeting}>{greeting}</Text>
      {subtitle ? <Text style={styles.homeSubtitle}>{subtitle}</Text> : null}
      <View style={styles.accentBar} />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.primary,
    paddingBottom: 14,
    paddingHorizontal: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleBlock: { flex: 1, alignItems: 'center' },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  subtitle: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.5)',
    marginTop: 1,
    letterSpacing: 0.3,
  },
  rightText: {
    fontSize: 22,
    color: Colors.accent,
    fontWeight: '400',
    lineHeight: 26,
  },
  homeHeader: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingBottom: 22,
  },
  homeGreeting: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  homeSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.5)',
    marginTop: 4,
    letterSpacing: 0.2,
  },
  accentBar: {
    height: 2,
    width: 32,
    backgroundColor: Colors.accent,
    borderRadius: 1,
    marginTop: 14,
  },
});
