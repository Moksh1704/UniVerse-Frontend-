import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  ActivityIndicator, StyleSheet,
} from 'react-native';
import { Colors, Shadows, Radius } from '../utils/theme';

// ── Card ─────────────────────────────────────────────────────────────────────
export const Card = ({ children, style }) => (
  <View style={[styles.card, style]}>{children}</View>
);

// ── Badge ────────────────────────────────────────────────────────────────────
export const Badge = ({ label, color = Colors.accentSoft, textColor = Colors.primary, style }) => (
  <View style={[styles.badge, { backgroundColor: color }, style]}>
    <Text style={[styles.badgeText, { color: textColor }]}>{label}</Text>
  </View>
);

// ── Primary Button ────────────────────────────────────────────────────────────
export const PrimaryButton = ({ title, onPress, loading, disabled, style }) => (
  <TouchableOpacity
    style={[styles.primaryBtn, (disabled || loading) && styles.btnDisabled, style]}
    onPress={onPress}
    disabled={disabled || loading}
    activeOpacity={0.82}
  >
    {loading
      ? <ActivityIndicator color="#FFFFFF" size="small" />
      : <Text style={styles.primaryBtnText}>{title}</Text>
    }
  </TouchableOpacity>
);

// ── Gold / Accent CTA Button ──────────────────────────────────────────────────
export const GoldButton = ({ title, onPress, disabled, style }) => (
  <TouchableOpacity
    style={[styles.goldBtn, disabled && styles.btnDisabled, style]}
    onPress={onPress}
    disabled={disabled}
    activeOpacity={0.82}
  >
    <Text style={styles.goldBtnText}>{title}</Text>
  </TouchableOpacity>
);

// ── Outline Button ────────────────────────────────────────────────────────────
export const OutlineButton = ({ title, onPress, style }) => (
  <TouchableOpacity style={[styles.outlineBtn, style]} onPress={onPress} activeOpacity={0.8}>
    <Text style={styles.outlineBtnText}>{title}</Text>
  </TouchableOpacity>
);

// ── Input Field ───────────────────────────────────────────────────────────────
export const InputField = ({
  label, value, onChangeText, placeholder, secureTextEntry,
  keyboardType, error, autoCapitalize, multiline, numberOfLines,
  editable = true,
}) => {
  const [focused, setFocused] = useState(false);
  return (
    <View style={styles.inputWrapper}>
      {label ? <Text style={styles.inputLabel}>{label}</Text> : null}
      <TextInput
        style={[
          styles.input,
          focused && styles.inputFocused,
          error   && styles.inputError,
          multiline && { height: 100, textAlignVertical: 'top' },
          !editable && styles.inputDisabled,
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.textMuted}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType || 'default'}
        autoCapitalize={autoCapitalize || 'sentences'}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        multiline={multiline}
        numberOfLines={numberOfLines}
        editable={editable}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

// ── Chip (filter pill) ────────────────────────────────────────────────────────
export const Chip = ({ label, active, onPress }) => (
  <TouchableOpacity
    style={[styles.chip, active && styles.chipActive]}
    onPress={onPress}
    activeOpacity={0.8}
  >
    <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
  </TouchableOpacity>
);

// ── Empty State ───────────────────────────────────────────────────────────────
export const EmptyState = ({ message, subMessage }) => (
  <View style={styles.emptyState}>
    <Text style={styles.emptyMessage}>{message}</Text>
    {subMessage ? <Text style={styles.emptySubMessage}>{subMessage}</Text> : null}
  </View>
);

// ── Loader ────────────────────────────────────────────────────────────────────
export const Loader = ({ size = 'large' }) => (
  <View style={styles.loaderWrap}>
    <ActivityIndicator size={size} color={Colors.primary} />
  </View>
);

// ── Avatar (initials) ─────────────────────────────────────────────────────────
export const Avatar = ({ name, size = 48 }) => {
  const initials = name
    ? name.trim().split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
    : '?';
  return (
    <View style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }]}>
      <Text style={[styles.avatarText, { fontSize: size * 0.36 }]}>{initials}</Text>
    </View>
  );
};

// ── Divider ───────────────────────────────────────────────────────────────────
export const Divider = ({ style }) => (
  <View style={[styles.divider, style]} />
);

// ── Info Row ──────────────────────────────────────────────────────────────────
export const InfoRow = ({ label, value }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value || '—'}</Text>
  </View>
);

// ── Section Header ────────────────────────────────────────────────────────────
export const SectionHeader = ({ title, action, onAction }) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {action
      ? <TouchableOpacity onPress={onAction}><Text style={styles.sectionAction}>{action}</Text></TouchableOpacity>
      : null}
  </View>
);

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  // Card
  card: {
    backgroundColor: Colors.background,
    borderRadius: Radius.md,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.card,
  },
  // Badge
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: Radius.full,
    alignSelf: 'flex-start',
  },
  badgeText: { fontSize: 11, fontWeight: '700', letterSpacing: 0.2 },
  // Buttons
  primaryBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700', letterSpacing: 0.2 },
  goldBtn: {
    backgroundColor: Colors.accent,
    borderRadius: Radius.md,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goldBtnText: { color: Colors.primary, fontSize: 15, fontWeight: '700', letterSpacing: 0.2 },
  outlineBtn: {
    backgroundColor: Colors.background,
    borderRadius: Radius.md,
    paddingVertical: 13,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.borderStrong,
  },
  outlineBtnText: { color: Colors.primary, fontSize: 15, fontWeight: '600' },
  btnDisabled: { opacity: 0.45 },
  // Input
  inputWrapper: { marginBottom: 16 },
  inputLabel: { fontSize: 13, fontWeight: '600', color: Colors.textPrimary, marginBottom: 6, letterSpacing: 0.1 },
  input: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: Colors.textPrimary,
  },
  inputFocused: { borderColor: Colors.accent, borderWidth: 1.5, backgroundColor: Colors.background },
  inputError: { borderColor: Colors.error },
  inputDisabled: { opacity: 0.55 },
  errorText: { fontSize: 12, color: Colors.error, marginTop: 4, fontWeight: '500' },
  // Chip
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: Radius.full,
    backgroundColor: Colors.background,
    borderWidth: 1.5,
    borderColor: Colors.borderStrong,
    marginRight: 8,
  },
  chipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipText: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary },
  chipTextActive: { color: Colors.accent, fontWeight: '700' },
  // Empty state
  emptyState: { alignItems: 'center', justifyContent: 'center', padding: 48 },
  emptyIcon: { fontSize: 40, marginBottom: 12, opacity: 0.5 },
  emptyMessage: { fontSize: 16, fontWeight: '600', color: Colors.textSecondary, textAlign: 'center' },
  emptySubMessage: { fontSize: 13, color: Colors.textMuted, textAlign: 'center', marginTop: 6 },
  // Loader
  loaderWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  // Avatar
  avatar: { backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: Colors.accent, fontWeight: '800' },
  // Divider
  divider: { height: 1, backgroundColor: Colors.border, marginVertical: 12 },
  // InfoRow
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  infoLabel: { fontSize: 13, color: Colors.textSecondary, fontWeight: '500' },
  infoValue: { fontSize: 14, color: Colors.textPrimary, fontWeight: '600' },
  // SectionHeader
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: Colors.primary },
  sectionAction: { fontSize: 13, fontWeight: '600', color: Colors.accent },
});
