import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, Alert, TouchableOpacity, StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Radius } from '../../utils/theme';
import { InputField, PrimaryButton } from '../../components/UI';
import { mockPost } from '../../utils/mockData';
import { validateAUEmail, validatePassword } from '../../utils/helpers';

export default function FacultyRegisterScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirm: '',
    designation: '', department: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const set = (key, val) => {
    setForm(f => ({ ...f, [key]: val }));
    setErrors(e => ({ ...e, [key]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim())
      e.name = 'Full name is required';
    if (!form.email.trim())
      e.email = 'Email is required';
    else if (!validateAUEmail(form.email))
      e.email = 'Use your faculty email: e.g. FAC001@andhrauniversity.edu.in';
    if (!form.password)
      e.password = 'Password is required';
    else if (!validatePassword(form.password))
      e.password = '6-12 characters with uppercase, lowercase and a special char (!@#$%^&*)';
    if (form.password !== form.confirm)
      e.confirm = 'Passwords do not match';
    if (!form.designation.trim())
      e.designation = 'Designation is required';
    if (!form.department.trim())
      e.department = 'Department is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await mockPost({ success: true });
      Alert.alert('Account Created', 'Your faculty account is ready. Please sign in.', [
        { text: 'Sign In', onPress: () => navigation.navigate('Login') },
      ]);
    } catch (err) {
      Alert.alert('Registration Failed', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Faculty Registration</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.sectionLabel}>Account Information</Text>

        <InputField
          label="Full Name"
          value={form.name}
          onChangeText={v => set('name', v)}
          placeholder="e.g. Dr. Lakshmi Prasad"
          error={errors.name}
        />

        <InputField
          label="University Email"
          value={form.email}
          onChangeText={v => set('email', v)}
          placeholder="FAC001@andhrauniversity.edu.in"
          keyboardType="email-address"
          autoCapitalize="none"
          error={errors.email}
        />

        <View style={styles.hintBox}>
          <Text style={styles.hintText}>
            Use your faculty ID as the email prefix.{'\n'}
            Format: <Text style={styles.hintMono}>FACULTYID@andhrauniversity.edu.in</Text>
          </Text>
        </View>

        <InputField
          label="Password"
          value={form.password}
          onChangeText={v => set('password', v)}
          placeholder="6-12 chars, uppercase, lowercase, special"
          secureTextEntry
          error={errors.password}
        />

        <InputField
          label="Confirm Password"
          value={form.confirm}
          onChangeText={v => set('confirm', v)}
          placeholder="Re-enter your password"
          secureTextEntry
          error={errors.confirm}
        />

        <Text style={[styles.sectionLabel, { marginTop: 8 }]}>Professional Details</Text>

        <InputField
          label="Designation"
          value={form.designation}
          onChangeText={v => set('designation', v)}
          placeholder="e.g. Professor, Assistant Professor, HOD"
          error={errors.designation}
        />

        <InputField
          label="Department"
          value={form.department}
          onChangeText={v => set('department', v)}
          placeholder="e.g. Computer Science"
          error={errors.department}
        />

        <PrimaryButton
          title="Create Faculty Account"
          onPress={handleRegister}
          loading={loading}
          style={{ marginTop: 12 }}
        />

        <View style={styles.signInRow}>
          <Text style={styles.signInText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.signInLink}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.primary, flexDirection: 'row',
    alignItems: 'center', paddingHorizontal: 16, paddingBottom: 16,
  },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  backArrow: { fontSize: 22, color: Colors.accent, fontWeight: '700' },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: 17, fontWeight: '700', color: '#fff' },
  scroll: { padding: 20 },
  sectionLabel: {
    fontSize: 11, fontWeight: '700', color: Colors.textSecondary,
    letterSpacing: 1, textTransform: 'uppercase', marginBottom: 14, marginTop: 4,
  },
  hintBox: {
    backgroundColor: Colors.accentLight, borderRadius: Radius.sm,
    padding: 10, marginBottom: 16, borderLeftWidth: 3, borderLeftColor: Colors.accent,
  },
  hintText: { fontSize: 12, color: Colors.primary, lineHeight: 18 },
  hintMono: { fontWeight: '700', fontSize: 12 },
  signInRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  signInText: { fontSize: 14, color: Colors.textSecondary },
  signInLink: { fontSize: 14, fontWeight: '700', color: Colors.accent },
});
