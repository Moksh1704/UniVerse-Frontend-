import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, ScrollView, StyleSheet, Alert, TouchableOpacity, Modal, Switch,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Radius, Shadows } from '../../utils/theme';
import {
  Avatar, InputField, PrimaryButton, OutlineButton, Loader,
} from '../../components/UI';
import { useAuth } from '../../hooks/useAuth';
import { getAttendanceColor } from '../../utils/helpers';
import { MOCK_STUDENT, mockFetch, mockPost } from '../../utils/mockData';

const FEEDBACK_CATEGORIES = ['App', 'College', 'Suggestion', 'Complaint', 'Bug'];

/* ── Small reusable menu row ────────────────────────────────────────────────── */
const MenuRow = ({ label, sublabel, onPress, rightElement, danger = false }) => (
  <TouchableOpacity
    style={styles.menuRow}
    onPress={onPress}
    activeOpacity={onPress ? 0.65 : 1}
  >
    <View style={styles.menuRowBody}>
      <Text style={[styles.menuLabel, danger && { color: Colors.error }]}>{label}</Text>
      {sublabel ? <Text style={styles.menuSublabel}>{sublabel}</Text> : null}
    </View>
    {rightElement || (
      onPress
        ? <Text style={[styles.menuChevron, danger && { color: Colors.error }]}>›</Text>
        : null
    )}
  </TouchableOpacity>
);

const Divider = () => <View style={styles.divider} />;

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { user, signOut, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  /* Modals */
  const [activeModal, setActiveModal] = useState(null); // 'personalInfo' | 'attendance' | 'academics' | 'settings' | 'feedback'

  /* Edit profile form */
  const [editForm, setEditForm] = useState({ name: '', department: '' });
  const [editLoading, setEditLoading] = useState(false);

  /* Feedback */
  const [feedback, setFeedback] = useState({ category: 'App', subject: '', message: '' });
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [showCatPicker, setShowCatPicker] = useState(false);

  /* Settings toggles */
  const [notifAnnouncements, setNotifAnnouncements] = useState(true);
  const [notifAttendance, setNotifAttendance]       = useState(true);
  const [notifEvents, setNotifEvents]               = useState(false);
  const [notifResults, setNotifResults]             = useState(true);
  const [profileVisible, setProfileVisible]         = useState(true);

  const fetchProfile = useCallback(async () => {
    try {
      const res = await mockFetch({ ...MOCK_STUDENT, ...(user || {}) });
      setProfile(res.data);
      setEditForm({ name: res.data.name || '', department: res.data.department || '' });
    } catch {
      setProfile(user);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  const handleSaveEdit = async () => {
    if (!editForm.name.trim()) { Alert.alert('Error', 'Name cannot be empty'); return; }
    setEditLoading(true);
    try {
      const updated = { ...profile, name: editForm.name.trim(), department: editForm.department };
      await mockPost(updated, 800);
      setProfile(updated);
      await updateUser(updated);
      setActiveModal(null);
      Alert.alert('Success', 'Profile updated.');
    } catch (e) {
      Alert.alert('Error', e.message);
    } finally {
      setEditLoading(false);
    }
  };

  const handleSendFeedback = async () => {
    if (!feedback.subject.trim() || !feedback.message.trim()) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    setFeedbackLoading(true);
    try {
      await mockPost({ success: true }, 900);
      Alert.alert('Thank you', 'Your feedback has been submitted.');
      setFeedback({ category: 'App', subject: '', message: '' });
      setActiveModal(null);
    } catch (e) {
      Alert.alert('Error', e.message);
    } finally {
      setFeedbackLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: signOut },
    ]);
  };

  if (loading) return <><View style={styles.headerPlaceholder} /><Loader /></>;

  const p = profile || user;
  const attendancePct = p?.attendance_percentage || 0;
  const attColor = getAttendanceColor(attendancePct);
  const attStatus = attendancePct >= 75 ? 'Good Standing' : attendancePct >= 60 ? 'At Risk' : 'Critical';

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 90 }]}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[0]}
      >
        {/* ── Hero header (sticky) ───────────────────────────────────────── */}
        <View style={styles.hero}>
          <View style={styles.avatarRing}>
            <Avatar name={p?.name} size={72} />
          </View>
          <Text style={styles.heroName}>{p?.name || 'Student'}</Text>
          <Text style={styles.heroEmail}>{p?.email || ''}</Text>
          <View style={styles.rolePill}>
            <Text style={styles.rolePillText}>Student</Text>
          </View>
        </View>

        {/* ── Attendance summary strip ───────────────────────────────────── */}
        <View style={styles.attStrip}>
          <View style={styles.attStripLeft}>
            <Text style={styles.attStripLabel}>Attendance</Text>
            <Text style={[styles.attStripValue, { color: attColor }]}>{Math.round(attendancePct)}%</Text>
          </View>
          <View style={styles.attBarWrap}>
            <View style={styles.attBarTrack}>
              <View style={[styles.attBarFill, { width: `${Math.min(attendancePct, 100)}%`, backgroundColor: attColor }]} />
            </View>
            <Text style={[styles.attStripStatus, { color: attColor }]}>{attStatus}</Text>
          </View>
        </View>

        {/* ── Main menu list ─────────────────────────────────────────────── */}
        <View style={styles.menuCard}>
          <MenuRow
            label="Personal Info"
            sublabel="Name, email, department"
            onPress={() => setActiveModal('personalInfo')}
          />
          <Divider />
          <MenuRow
            label="Attendance"
            sublabel="View detailed attendance records"
            onPress={() => setActiveModal('attendance')}
          />
          <Divider />
          <MenuRow
            label="Academics"
            sublabel="Subjects, year, section, reg. number"
            onPress={() => setActiveModal('academics')}
          />
          <Divider />
          <MenuRow
            label="Settings"
            sublabel="Notifications, privacy, security"
            onPress={() => setActiveModal('settings')}
          />
          <Divider />
          <MenuRow
            label="Send Feedback"
            sublabel="Report issues or share suggestions"
            onPress={() => setActiveModal('feedback')}
          />
          <Divider />
          <MenuRow
            label="About UniVerse"
            sublabel="Version 1.0.0 · Andhra University"
            onPress={() => Alert.alert('UniVerse', 'Version 1.0.0\nDeveloped for Andhra University\n\u00A9 2025 UniVerse Team')}
          />
        </View>

        {/* ── Sign out ───────────────────────────────────────────────────── */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* ════════════════════════════════════════════════════════════════════
          MODAL — Personal Info / Edit Profile
      ════════════════════════════════════════════════════════════════════ */}
      <Modal visible={activeModal === 'personalInfo'} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.sheet, { paddingBottom: insets.bottom + 16 }]}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>Personal Info</Text>

            <View style={styles.infoList}>
              <InfoLine label="Full Name"    value={p?.name} />
              <InfoLine label="Email"        value={p?.email} />
              <InfoLine label="Department"   value={p?.department} />
              <InfoLine label="Role"         value="Student" />
            </View>

            <Text style={[styles.sheetTitle, { marginTop: 20, marginBottom: 12 }]}>Edit Profile</Text>
            <InputField
              label="Full Name"
              value={editForm.name}
              onChangeText={v => setEditForm(f => ({ ...f, name: v }))}
              placeholder="Your full name"
            />
            <InputField
              label="Department"
              value={editForm.department}
              onChangeText={v => setEditForm(f => ({ ...f, department: v }))}
              placeholder="Department"
            />
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 4 }}>
              <OutlineButton title="Cancel" onPress={() => setActiveModal(null)} style={{ flex: 1 }} />
              <PrimaryButton title="Save" onPress={handleSaveEdit} loading={editLoading} style={{ flex: 1 }} />
            </View>
          </View>
        </View>
      </Modal>

      {/* ════════════════════════════════════════════════════════════════════
          MODAL — Attendance
      ════════════════════════════════════════════════════════════════════ */}
      <Modal visible={activeModal === 'attendance'} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.sheet, { paddingBottom: insets.bottom + 16 }]}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>Attendance Overview</Text>

            <View style={styles.attModalCard}>
              <Text style={styles.attModalPct} style={[styles.attModalPct, { color: attColor }]}>
                {Math.round(attendancePct)}%
              </Text>
              <Text style={styles.attModalLabel}>Overall Attendance</Text>
              <View style={styles.attBarTrack}>
                <View style={[styles.attBarFill, { width: `${Math.min(attendancePct, 100)}%`, backgroundColor: attColor }]} />
              </View>
              <Text style={[styles.attModalStatus, { color: attColor }]}>{attStatus}</Text>
            </View>

            <OutlineButton title="Close" onPress={() => setActiveModal(null)} style={{ marginTop: 16 }} />
          </View>
        </View>
      </Modal>

      {/* ════════════════════════════════════════════════════════════════════
          MODAL — Academics
      ════════════════════════════════════════════════════════════════════ */}
      <Modal visible={activeModal === 'academics'} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.sheet, { paddingBottom: insets.bottom + 16 }]}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>Academic Details</Text>

            <View style={styles.infoList}>
              <InfoLine label="Reg. Number" value={p?.reg_no} />
              <InfoLine label="Year"        value={p?.year ? `Year ${p.year}` : null} />
              <InfoLine label="Section"     value={p?.section} />
              <InfoLine label="Department"  value={p?.department} />
            </View>

            <OutlineButton title="Close" onPress={() => setActiveModal(null)} style={{ marginTop: 16 }} />
          </View>
        </View>
      </Modal>

      {/* ════════════════════════════════════════════════════════════════════
          MODAL — Settings
      ════════════════════════════════════════════════════════════════════ */}
      <Modal visible={activeModal === 'settings'} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.sheet, { paddingBottom: insets.bottom + 16 }]}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>Settings</Text>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.settingGroup}>NOTIFICATIONS</Text>
              <View style={styles.settingCard}>
                <SwitchRow label="Announcements"     value={notifAnnouncements} onChange={setNotifAnnouncements} />
                <Divider />
                <SwitchRow label="Attendance Alerts" value={notifAttendance}    onChange={setNotifAttendance} />
                <Divider />
                <SwitchRow label="Events"            value={notifEvents}        onChange={setNotifEvents} />
                <Divider />
                <SwitchRow label="Results & Grades"  value={notifResults}       onChange={setNotifResults} />
              </View>

              <Text style={styles.settingGroup}>PRIVACY</Text>
              <View style={styles.settingCard}>
                <SwitchRow label="Profile Visibility" value={profileVisible} onChange={setProfileVisible} />
                <Divider />
                <MenuRow
                  label="Change Password"
                  onPress={() => Alert.alert('Change Password', 'A reset link has been sent to your registered email.')}
                />
                <Divider />
                <MenuRow
                  label="Delete Account"
                  danger
                  onPress={() => Alert.alert('Delete Account', 'This action is permanent. Contact support to proceed.')}
                />
              </View>
            </ScrollView>

            <OutlineButton title="Close" onPress={() => setActiveModal(null)} style={{ marginTop: 12 }} />
          </View>
        </View>
      </Modal>

      {/* ════════════════════════════════════════════════════════════════════
          MODAL — Feedback
      ════════════════════════════════════════════════════════════════════ */}
      <Modal visible={activeModal === 'feedback'} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.sheet, { paddingBottom: insets.bottom + 16 }]}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>Send Feedback</Text>

            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Category</Text>
              <TouchableOpacity
                style={styles.catPicker}
                onPress={() => setShowCatPicker(!showCatPicker)}
              >
                <Text style={styles.catPickerValue}>{feedback.category}</Text>
                <Text style={styles.pickerChevron}>{showCatPicker ? 'A' : 'V'}</Text>
              </TouchableOpacity>
              {showCatPicker && (
                <View style={styles.catDropdown}>
                  {FEEDBACK_CATEGORIES.map(c => (
                    <TouchableOpacity
                      key={c}
                      style={[styles.catItem, feedback.category === c && styles.catItemActive]}
                      onPress={() => { setFeedback(f => ({ ...f, category: c })); setShowCatPicker(false); }}
                    >
                      <Text style={[styles.catItemText, feedback.category === c && styles.catItemTextActive]}>{c}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            <InputField
              label="Subject"
              value={feedback.subject}
              onChangeText={v => setFeedback(f => ({ ...f, subject: v }))}
              placeholder="Brief subject"
            />
            <InputField
              label="Message"
              value={feedback.message}
              onChangeText={v => setFeedback(f => ({ ...f, message: v }))}
              placeholder="Your detailed feedback..."
              multiline
              numberOfLines={4}
            />
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <OutlineButton title="Cancel" onPress={() => setActiveModal(null)} style={{ flex: 1 }} />
              <PrimaryButton title="Submit" onPress={handleSendFeedback} loading={feedbackLoading} style={{ flex: 1 }} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

/* ── Helper sub-components ────────────────────────────────────────────────── */
const InfoLine = ({ label, value }) => (
  <View style={styles.infoLine}>
    <Text style={styles.infoLineLabel}>{label}</Text>
    <Text style={styles.infoLineValue}>{value || '—'}</Text>
  </View>
);

const SwitchRow = ({ label, value, onChange }) => (
  <View style={styles.menuRow}>
    <View style={styles.menuRowBody}>
      <Text style={styles.menuLabel}>{label}</Text>
    </View>
    <Switch
      value={value}
      onValueChange={onChange}
      trackColor={{ false: Colors.border, true: Colors.accent }}
      thumbColor={value ? Colors.primary : '#f4f3f4'}
    />
  </View>
);

const styles = StyleSheet.create({
  scroll: {},

  /* Hero */
  hero: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 28,
    paddingHorizontal: 24,
    backgroundColor: Colors.primary,
  },
  avatarRing: {
    borderWidth: 2.5, borderColor: Colors.accent,
    borderRadius: 999, padding: 3, marginBottom: 14,
  },
  heroName:  { fontSize: 20, fontWeight: '800', color: Colors.textWhite, marginBottom: 4 },
  heroEmail: { fontSize: 13, color: 'rgba(255,255,255,0.55)', marginBottom: 12 },
  rolePill: {
    backgroundColor: Colors.accent,
    paddingHorizontal: 18, paddingVertical: 5, borderRadius: Radius.full,
  },
  rolePillText: { fontSize: 12, fontWeight: '700', color: Colors.primary },

  /* Attendance strip */
  attStrip: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingHorizontal: 20, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
    gap: 16,
  },
  attStripLeft: { alignItems: 'center', minWidth: 52 },
  attStripLabel: { fontSize: 10, fontWeight: '600', color: Colors.textSecondary, letterSpacing: 0.3 },
  attStripValue: { fontSize: 22, fontWeight: '900' },
  attBarWrap: { flex: 1 },
  attBarTrack: {
    height: 6, backgroundColor: Colors.border,
    borderRadius: 3, overflow: 'hidden', marginBottom: 6,
  },
  attBarFill: { height: 6, borderRadius: 3 },
  attStripStatus: { fontSize: 11, fontWeight: '700' },

  /* Menu card */
  menuCard: {
    backgroundColor: Colors.background,
    marginHorizontal: 16, marginTop: 20,
    borderRadius: Radius.md,
    borderWidth: 0.5, borderColor: Colors.border,
    ...Shadows.card, overflow: 'hidden',
  },
  menuRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 18, paddingVertical: 15,
  },
  menuRowBody: { flex: 1 },
  menuLabel: { fontSize: 15, fontWeight: '600', color: Colors.textPrimary },
  menuSublabel: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  menuChevron: { fontSize: 22, color: Colors.textSecondary, fontWeight: '300' },
  divider: { height: 1, backgroundColor: Colors.border, marginHorizontal: 18 },

  /* Logout */
  logoutBtn: {
    marginHorizontal: 16, marginTop: 16, marginBottom: 8,
    padding: 15, alignItems: 'center',
    borderRadius: Radius.md, borderWidth: 1.5, borderColor: Colors.error,
  },
  logoutText: { fontSize: 15, fontWeight: '700', color: Colors.error },

  /* Modals / sheets */
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.45)' },
  sheet: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 20, maxHeight: '85%',
  },
  sheetHandle: {
    width: 40, height: 4, backgroundColor: Colors.border,
    borderRadius: 2, alignSelf: 'center', marginBottom: 16,
  },
  sheetTitle: { fontSize: 18, fontWeight: '800', color: Colors.primary, marginBottom: 16 },

  headerPlaceholder: { height: 60, backgroundColor: Colors.primary },

  /* Info lines */
  infoList: {
    borderRadius: Radius.md, borderWidth: 0.5,
    borderColor: Colors.border, overflow: 'hidden',
  },
  infoLine: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 13,
    borderBottomWidth: 0.5, borderBottomColor: Colors.border,
    backgroundColor: Colors.background,
  },
  infoLineLabel: { fontSize: 13, color: Colors.textSecondary, fontWeight: '500' },
  infoLineValue: { fontSize: 13, color: Colors.textPrimary, fontWeight: '600' },

  /* Attendance modal */
  attModalCard: {
    alignItems: 'center', padding: 20,
    backgroundColor: Colors.surface,
    borderRadius: Radius.md, borderWidth: 0.5, borderColor: Colors.border,
  },
  attModalPct: { fontSize: 48, fontWeight: '900', marginBottom: 4 },
  attModalLabel: { fontSize: 13, color: Colors.textSecondary, marginBottom: 14 },
  attModalStatus: { fontSize: 13, fontWeight: '700', marginTop: 8 },

  /* Settings */
  settingGroup: {
    fontSize: 11, fontWeight: '700', color: Colors.textSecondary,
    letterSpacing: 1, marginBottom: 8, marginTop: 16, paddingLeft: 2,
  },
  settingCard: {
    backgroundColor: Colors.background,
    borderRadius: Radius.md, borderWidth: 0.5, borderColor: Colors.border,
    overflow: 'hidden',
  },

  /* Feedback */
  inputWrapper: { marginBottom: 16 },
  inputLabel: { fontSize: 13, fontWeight: '600', color: Colors.primary, marginBottom: 6 },
  catPicker: {
    backgroundColor: Colors.surface, borderRadius: Radius.sm,
    borderWidth: 1, borderColor: Colors.border,
    paddingHorizontal: 14, paddingVertical: 13,
    flexDirection: 'row', justifyContent: 'space-between',
  },
  catPickerValue: { fontSize: 15, color: Colors.textPrimary },
  pickerChevron: { fontSize: 11, color: Colors.textSecondary },
  catDropdown: {
    backgroundColor: Colors.background, borderRadius: Radius.sm,
    borderWidth: 1, borderColor: Colors.border, marginTop: 4, zIndex: 99, elevation: 8,
  },
  catItem: { paddingHorizontal: 14, paddingVertical: 11 },
  catItemActive: { backgroundColor: Colors.accentLight },
  catItemText: { fontSize: 14, color: Colors.textPrimary },
  catItemTextActive: { fontWeight: '700', color: Colors.primary },
});
