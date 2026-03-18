import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, Modal,
  TextInput, ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Radius, Shadows } from '../../utils/theme';
import { Avatar, Card, Divider, EmptyState, Loader, PrimaryButton, OutlineButton } from '../../components/UI';
import { ScreenHeader } from '../../components/ScreenHeader';
import { todayISO, formatDate } from '../../utils/helpers';
import {
  MOCK_TIMETABLE_TODAY,
  MOCK_STUDENTS_IN_CLASS,
  mockFetch,
  mockPost,
} from '../../utils/mockData';

const STEPS = { SELECT_CLASS: 1, PASSWORD: 2, MARK: 3, SUMMARY: 4 };

export default function FacultyAttendanceScreen() {
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState(STEPS.SELECT_CLASS);
  const [todayClasses, setTodayClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [students, setStudents] = useState([]);
  const [loadingClasses, setLoadingClasses] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [summary, setSummary] = useState(null);

  // Password gate
  const [password, setPassword] = useState('');
  const [pwLoading, setPwLoading] = useState(false);
  const [pwError, setPwError] = useState('');

  // Edit mode (for re-editing after submission)
  const [editPassword, setEditPassword] = useState('');
  const [showEditPwModal, setShowEditPwModal] = useState(false);
  const [editPwLoading, setEditPwLoading] = useState(false);

  const fetchTodayClasses = useCallback(async () => {
    try {
      const res = await mockFetch(MOCK_TIMETABLE_TODAY);
      setTodayClasses(res.data || []);
    } catch { /* ignore */ }
    finally { setLoadingClasses(false); }
  }, []);

  useEffect(() => { fetchTodayClasses(); }, [fetchTodayClasses]);

  // Step 1 → 2: pick class, then go to password gate
  const handleSelectClass = (cls) => {
    setSelectedClass(cls);
    setPassword('');
    setPwError('');
    setStep(STEPS.PASSWORD);
  };

  // Step 2 → 3: verify password then load students
  const handleVerifyPassword = async () => {
    if (!password.trim()) { setPwError('Please enter your password'); return; }
    setPwLoading(true);
    setPwError('');
    try {
      await mockPost({ verified: true }, 600);
      // Load students
      setLoadingStudents(true);
      setStep(STEPS.MARK);
      const res = await mockFetch(MOCK_STUDENTS_IN_CLASS);
      const list = (res.data || []).map(s => ({ ...s, status: 'present' }));
      setStudents(list);
    } catch (e) {
      setPwError('Password verification failed. Please try again.');
    } finally {
      setPwLoading(false);
      setLoadingStudents(false);
    }
  };

  const toggleStatus = (index) => {
    setStudents(prev => prev.map((s, i) =>
      i === index ? { ...s, status: s.status === 'present' ? 'absent' : 'present' } : s
    ));
  };

  // Step 3 → 4: submit and auto-navigate to summary
  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await mockPost({ success: true }, 1000);
      // Calculate real counts from actual student states
      const present = students.filter(s => s.status === 'present').length;
      const absent  = students.length - present;
      const pct     = students.length > 0 ? Math.round((present / students.length) * 100 * 10) / 10 : 0;
      // Chronic absentees: students marked absent (in real app this would come from backend)
      const chronic = students
        .filter(s => s.status === 'absent')
        .slice(0, 3)
        .map(s => ({ name: s.name, attendance_percentage: Math.floor(55 + Math.random() * 15) }));

      setSummary({ total_present: present, total_absent: absent, percentage: pct, chronic_absentees: chronic });
      setStep(STEPS.SUMMARY);
    } catch (e) {
      Alert.alert('Error', e.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Edit attendance: password modal → back to mark step
  const handleEditVerify = async () => {
    if (!editPassword.trim()) return;
    setEditPwLoading(true);
    try {
      await mockPost({ verified: true }, 600);
      setShowEditPwModal(false);
      setEditPassword('');
      setStep(STEPS.MARK);
    } catch (e) {
      Alert.alert('Error', 'Password verification failed.');
    } finally {
      setEditPwLoading(false);
    }
  };

  const resetFlow = () => {
    setStep(STEPS.SELECT_CLASS);
    setSummary(null);
    setSelectedClass(null);
    setStudents([]);
    setPassword('');
    setPwError('');
  };

  const presentCount = students.filter(s => s.status === 'present').length;
  const absentCount  = students.length - presentCount;
  const todayLabel   = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });

  // ── Step 1: Select class ──────────────────────────────────────────────────
  if (step === STEPS.SELECT_CLASS) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.background }}>
        <ScreenHeader title="Mark Attendance" subtitle="Select a class" />
        {loadingClasses ? <Loader /> : (
          <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 90 }]}>
            <View style={styles.dateBar}>
              <Text style={styles.dateText}>{todayLabel}</Text>
            </View>
            {todayClasses.length === 0
              ? <EmptyState message="No classes today" subMessage="No attendance to mark" />
              : todayClasses.map((cls, i) => (
                <TouchableOpacity key={i} style={styles.classCard} onPress={() => handleSelectClass(cls)} activeOpacity={0.85}>
                  <View style={styles.classIconBox}>
                    <Text style={styles.classIconLetter}>{(cls.subject || cls.subject_name || 'C')[0]}</Text>
                  </View>
                  <View style={styles.classInfo}>
                    <Text style={styles.className}>{cls.subject || cls.subject_name}</Text>
                    <Text style={styles.classCode}>{cls.subject_code}</Text>
                    <Text style={styles.classMeta}>{cls.class || cls.section}  ·  {cls.time}</Text>
                  </View>
                  <Text style={styles.classArrow}>›</Text>
                </TouchableOpacity>
              ))
            }
          </ScrollView>
        )}
      </View>
    );
  }

  // ── Step 2: Password gate ─────────────────────────────────────────────────
  if (step === STEPS.PASSWORD) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.background }}>
        <ScreenHeader
          title="Verify Identity"
          subtitle={selectedClass?.subject || ''}
          onBack={() => setStep(STEPS.SELECT_CLASS)}
        />
        <View style={styles.pwGateWrap}>
          <View style={styles.pwGateCard}>
            <Text style={styles.pwGateTitle}>Password Required</Text>
            <Text style={styles.pwGateSubtitle}>
              Enter your password to begin marking attendance for{'\n'}
              <Text style={{ fontWeight: '700', color: Colors.primary }}>
                {selectedClass?.subject} · {selectedClass?.class || selectedClass?.section}
              </Text>
            </Text>
            <TextInput
              style={[styles.pwInput, pwError ? { borderColor: Colors.error } : null]}
              value={password}
              onChangeText={v => { setPassword(v); setPwError(''); }}
              placeholder="Enter your password"
              secureTextEntry
              placeholderTextColor={Colors.textSecondary}
            />
            {pwError ? <Text style={styles.pwErrorText}>{pwError}</Text> : null}
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 16 }}>
              <OutlineButton title="Back" onPress={() => setStep(STEPS.SELECT_CLASS)} style={{ flex: 1 }} />
              <PrimaryButton title="Verify" onPress={handleVerifyPassword} loading={pwLoading} style={{ flex: 1 }} />
            </View>
          </View>
        </View>
      </View>
    );
  }

  // ── Step 3: Mark attendance ───────────────────────────────────────────────
  if (step === STEPS.MARK) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.background }}>
        <ScreenHeader
          title={selectedClass?.subject || 'Mark Attendance'}
          subtitle={`${selectedClass?.class || ''} · ${selectedClass?.time || ''}`}
          onBack={() => setStep(STEPS.SELECT_CLASS)}
        />
        <View style={styles.markSummaryBar}>
          <View style={styles.markStat}>
            <Text style={[styles.markStatValue, { color: Colors.success }]}>{presentCount}</Text>
            <Text style={styles.markStatLabel}>Present</Text>
          </View>
          <View style={styles.markStatDivider} />
          <View style={styles.markStat}>
            <Text style={[styles.markStatValue, { color: Colors.error }]}>{absentCount}</Text>
            <Text style={styles.markStatLabel}>Absent</Text>
          </View>
          <View style={styles.markStatDivider} />
          <View style={styles.markStat}>
            <Text style={[styles.markStatValue, { color: 'rgba(255,255,255,0.9)' }]}>{students.length}</Text>
            <Text style={styles.markStatLabel}>Total</Text>
          </View>
        </View>

        {loadingStudents ? <Loader /> : (
          <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: 120 }]}>
            {students.length === 0
              ? <EmptyState message="No students found" />
              : students.map((student, i) => (
                <TouchableOpacity
                  key={i}
                  style={[styles.studentCard, student.status === 'present' ? styles.studentPresent : styles.studentAbsent]}
                  onPress={() => toggleStatus(i)}
                  activeOpacity={0.8}
                >
                  <View style={styles.studentAvatar}>
                    <Text style={styles.studentInitial}>{(student.name || 'U')[0].toUpperCase()}</Text>
                  </View>
                  <View style={styles.studentInfo}>
                    <Text style={styles.studentName}>{student.name}</Text>
                    <Text style={styles.studentReg}>{student.reg_no}</Text>
                  </View>
                  <View style={[styles.statusToggle, { backgroundColor: student.status === 'present' ? Colors.success : Colors.error }]}>
                    <Text style={styles.statusToggleText}>{student.status === 'present' ? 'P' : 'A'}</Text>
                  </View>
                </TouchableOpacity>
              ))
            }
          </ScrollView>
        )}

        <View style={[styles.submitBar, { paddingBottom: insets.bottom + 16 }]}>
          <PrimaryButton title={`Submit Attendance (${students.length} students)`} onPress={handleSubmit} loading={submitting} />
        </View>
      </View>
    );
  }

  // ── Step 4: Summary (auto-navigated after submit) ─────────────────────────
  if (step === STEPS.SUMMARY && summary) {
    const chronic = summary.chronic_absentees || [];
    return (
      <View style={{ flex: 1, backgroundColor: Colors.background }}>
        <ScreenHeader title="Attendance Summary" subtitle="Today's report" />
        <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 90 }]}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Submitted Successfully</Text>
            <Text style={styles.summarySubject}>{selectedClass?.subject} · {selectedClass?.class}</Text>
            <Text style={styles.summaryDate}>{formatDate(todayISO())}</Text>
            <View style={styles.summaryStats}>
              <View style={styles.summaryStatItem}>
                <Text style={[styles.summaryStatValue, { color: Colors.success }]}>{summary.total_present}</Text>
                <Text style={styles.summaryStatLabel}>Present</Text>
              </View>
              <View style={styles.summaryStatItem}>
                <Text style={[styles.summaryStatValue, { color: Colors.error }]}>{summary.total_absent}</Text>
                <Text style={styles.summaryStatLabel}>Absent</Text>
              </View>
              <View style={styles.summaryStatItem}>
                <Text style={[styles.summaryStatValue, { color: Colors.accent }]}>{summary.percentage}%</Text>
                <Text style={styles.summaryStatLabel}>Attendance</Text>
              </View>
            </View>
          </View>

          {chronic.length > 0 && (
            <View style={styles.chronicCard}>
              <Text style={styles.chronicTitle}>Low Attendance</Text>
              <Text style={styles.chronicSub}>Students marked absent today</Text>
              {chronic.map((s, i) => (
                <View key={i} style={styles.chronicRow}>
                  <Text style={styles.chronicName}>{s.name}</Text>
                  <Text style={[styles.chronicPct, { color: Colors.error }]}>{s.attendance_percentage}%</Text>
                </View>
              ))}
            </View>
          )}

          <OutlineButton title="Edit Attendance" onPress={() => setShowEditPwModal(true)} style={{ marginBottom: 10 }} />
          <PrimaryButton title="Mark Another Class" onPress={resetFlow} />
        </ScrollView>

        {/* Edit attendance password modal */}
        <Modal visible={showEditPwModal} animationType="fade" transparent>
          <View style={styles.pwModalOverlay}>
            <View style={styles.pwModal}>
              <Text style={styles.pwTitle}>Verify Identity</Text>
              <Text style={styles.pwSubtitle}>Enter your password to edit attendance</Text>
              <TextInput
                style={styles.pwInput}
                value={editPassword}
                onChangeText={setEditPassword}
                placeholder="Your password"
                secureTextEntry
                placeholderTextColor={Colors.textSecondary}
              />
              <View style={{ flexDirection: 'row', gap: 10, marginTop: 12 }}>
                <OutlineButton title="Cancel" onPress={() => setShowEditPwModal(false)} style={{ flex: 1 }} />
                <PrimaryButton title="Verify" onPress={handleEditVerify} loading={editPwLoading} style={{ flex: 1 }} />
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  scroll: { padding: 16 },
  dateBar: { marginBottom: 16 },
  dateText: { fontSize: 14, fontWeight: '600', color: Colors.textSecondary },

  // Class select
  classCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.background, borderRadius: Radius.md, padding: 16,
    marginBottom: 12, borderWidth: 0.5, borderColor: Colors.border, gap: 12, ...Shadows.card,
  },
  classIconBox: {
    width: 50, height: 50, backgroundColor: Colors.primary,
    borderRadius: Radius.sm, alignItems: 'center', justifyContent: 'center',
  },
  classIconLetter: { fontSize: 22, fontWeight: '800', color: Colors.accent },
  classInfo: { flex: 1 },
  className: { fontSize: 15, fontWeight: '700', color: Colors.primary, marginBottom: 3 },
  classCode: { fontSize: 12, color: Colors.accent, fontWeight: '600', marginBottom: 5 },
  classMeta: { fontSize: 12, color: Colors.textSecondary },
  classArrow: { fontSize: 22, color: Colors.accent, fontWeight: '300', lineHeight: 24 },

  // Password gate
  pwGateWrap: { flex: 1, justifyContent: 'center', paddingHorizontal: 24 },
  pwGateCard: {
    backgroundColor: Colors.background, borderRadius: Radius.lg,
    padding: 24, borderWidth: 0.5, borderColor: Colors.border, ...Shadows.strong,
  },
  pwGateTitle: { fontSize: 18, fontWeight: '800', color: Colors.primary, marginBottom: 8 },
  pwGateSubtitle: { fontSize: 13, color: Colors.textSecondary, marginBottom: 20, lineHeight: 20 },
  pwInput: {
    backgroundColor: Colors.surface, borderRadius: Radius.sm,
    borderWidth: 1, borderColor: Colors.border,
    paddingHorizontal: 14, paddingVertical: 12,
    fontSize: 15, color: Colors.textPrimary,
  },
  pwErrorText: { fontSize: 12, color: Colors.error, marginTop: 6, fontWeight: '500' },

  // Mark attendance
  markSummaryBar: {
    flexDirection: 'row', backgroundColor: Colors.primary,
    paddingVertical: 14, paddingHorizontal: 16,
  },
  markStat: { flex: 1, alignItems: 'center' },
  markStatValue: { fontSize: 22, fontWeight: '900' },
  markStatLabel: { fontSize: 11, color: 'rgba(255,255,255,0.6)', marginTop: 2 },
  markStatDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.15)', marginVertical: 4 },
  studentCard: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: Radius.md, padding: 14, marginBottom: 8, borderWidth: 1.5, gap: 12,
  },
  studentPresent: { backgroundColor: '#F0FDF4', borderColor: Colors.success },
  studentAbsent:  { backgroundColor: '#FFF5F5', borderColor: '#FCA5A5' },
  studentAvatar: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center',
  },
  studentInitial: { fontSize: 16, fontWeight: '800', color: Colors.accent },
  studentInfo: { flex: 1 },
  studentName: { fontSize: 14, fontWeight: '700', color: Colors.primary },
  studentReg:  { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  statusToggle: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  statusToggleText: { fontSize: 14, fontWeight: '800', color: Colors.textWhite },
  submitBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    padding: 16, backgroundColor: Colors.background,
    borderTopWidth: 1, borderTopColor: Colors.border,
  },

  // Summary
  summaryCard: {
    backgroundColor: Colors.primary, borderRadius: Radius.lg,
    padding: 20, marginBottom: 16, ...Shadows.strong,
  },
  summaryTitle:   { fontSize: 18, fontWeight: '800', color: Colors.accent, marginBottom: 8 },
  summarySubject: { fontSize: 15, fontWeight: '600', color: Colors.textWhite, marginBottom: 4 },
  summaryDate:    { fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: 20 },
  summaryStats:   { flexDirection: 'row' },
  summaryStatItem:{ flex: 1, alignItems: 'center' },
  summaryStatValue: { fontSize: 28, fontWeight: '900' },
  summaryStatLabel: { fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 4 },

  chronicCard: {
    backgroundColor: '#FFF5F5', borderRadius: Radius.md, padding: 16,
    borderWidth: 1, borderColor: '#FCA5A5', marginBottom: 16,
  },
  chronicTitle: { fontSize: 15, fontWeight: '700', color: Colors.error, marginBottom: 4 },
  chronicSub:   { fontSize: 12, color: Colors.error, marginBottom: 12, opacity: 0.7 },
  chronicRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 8, borderBottomWidth: 0.5, borderBottomColor: '#FCA5A5',
  },
  chronicName: { fontSize: 14, color: Colors.primary, fontWeight: '500' },
  chronicPct:  { fontSize: 14, fontWeight: '700' },

  // Edit password modal
  pwModalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  pwModal: { backgroundColor: Colors.background, borderRadius: Radius.lg, padding: 24, width: '85%', ...Shadows.strong },
  pwTitle:    { fontSize: 18, fontWeight: '800', color: Colors.primary, marginBottom: 6 },
  pwSubtitle: { fontSize: 13, color: Colors.textSecondary, marginBottom: 16 },
});
