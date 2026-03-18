import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, Alert,
  TouchableOpacity, StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Radius, Shadows } from '../../utils/theme';
import { InputField, PrimaryButton } from '../../components/UI';
import { useAuth } from '../../hooks/useAuth';
import { MOCK_STUDENT, MOCK_FACULTY, MOCK_TOKEN, mockPost } from '../../utils/mockData';

export default function LoginScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { signIn } = useAuth();
  const [form, setForm]     = useState({ email: '', password: '' });
  const [role, setRole]     = useState('student');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const set = (key, val) => {
    setForm(f => ({ ...f, [key]: val }));
    setErrors(e => ({ ...e, [key]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.email.trim())    e.email    = 'Email is required';
    if (!form.password.trim()) e.password = 'Password is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const mockUser = role === 'faculty' ? MOCK_FACULTY : MOCK_STUDENT;
      const res = await mockPost({ token: MOCK_TOKEN, user: mockUser });
      await signIn(res.data.token, res.data.user);
    } catch (err) {
      Alert.alert('Login Failed', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      {/* Top bar */}
      <View style={[styles.topBar, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
        <View style={styles.logoRow}>
          <Text style={styles.logoText}>UniVerse</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.heading}>Welcome back</Text>
        <Text style={styles.subheading}>Sign in to your account</Text>
        <View style={styles.accentBar} />

        {/* Role selector */}
        <View style={styles.roleToggle}>
          {[
            { key: 'student', label: 'Student' },
            { key: 'faculty', label: 'Faculty' },
          ].map(r => (
            <TouchableOpacity
              key={r.key}
              style={[styles.roleBtn, role === r.key && styles.roleBtnActive]}
              onPress={() => setRole(r.key)}
              activeOpacity={0.8}
            >
              <Text style={[styles.roleBtnText, role === r.key && styles.roleBtnTextActive]}>
                {r.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <InputField
          label="Email Address"
          value={form.email}
          onChangeText={v => set('email', v)}
          placeholder={role === 'student' ? '21CS3A047@andhrauniversity.edu.in' : 'FAC001@andhrauniversity.edu.in'}
          keyboardType="email-address"
          autoCapitalize="none"
          error={errors.email}
        />
        <InputField
          label="Password"
          value={form.password}
          onChangeText={v => set('password', v)}
          placeholder="Your password"
          secureTextEntry
          error={errors.password}
        />

        <PrimaryButton title="Sign In" onPress={handleLogin} loading={loading} />

        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerLabel}>New to UniVerse?</Text>
          <View style={styles.dividerLine} />
        </View>

        <TouchableOpacity
          style={styles.registerBtn}
          onPress={() => navigation.navigate('RoleSelection')}
          activeOpacity={0.82}
        >
          <Text style={styles.registerBtnText}>Create an Account</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  backArrow: { fontSize: 28, color: Colors.accent, fontWeight: '300', lineHeight: 32 },
  logoRow: { flex: 1, alignItems: 'center' },
  logoText: { fontSize: 20, fontWeight: '800', color: Colors.primary, letterSpacing: -0.5 },
  scroll: { paddingHorizontal: 24, paddingTop: 16 },
  heading: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: -1,
  },
  subheading: { fontSize: 14, color: Colors.textSecondary, marginTop: 6 },
  accentBar: { width: 36, height: 3, backgroundColor: Colors.accent, borderRadius: 2, marginTop: 14, marginBottom: 28 },
  roleToggle: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: 4,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  roleBtn: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: Radius.sm,
    alignItems: 'center',
  },
  roleBtnActive: {
    backgroundColor: Colors.primary,
    ...Shadows.card,
  },
  roleBtnText: { fontSize: 14, fontWeight: '600', color: Colors.textSecondary },
  roleBtnTextActive: { color: Colors.accent, fontWeight: '700' },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
    gap: 12,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: Colors.border },
  dividerLabel: { fontSize: 13, color: Colors.textMuted },
  registerBtn: {
    borderWidth: 1.5,
    borderColor: Colors.borderStrong,
    borderRadius: Radius.md,
    paddingVertical: 14,
    alignItems: 'center',
  },
  registerBtnText: { fontSize: 15, fontWeight: '600', color: Colors.primary },
});
