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
import { MOCK_FACULTY, mockFetch, mockPost } from '../../utils/mockData';

const FEEDBACK_CATEGORIES = ['App', 'College', 'Suggestion', 'Complaint', 'Bug'];

const MenuRow = ({ label, sublabel, onPress, rightElement, danger = false }) => (
  <TouchableOpacity style={styles.menuRow} onPress={onPress} activeOpacity={onPress ? 0.65 : 1}>
    <View style={styles.menuRowBody}>
      <Text style={[styles.menuLabel, danger && { color: Colors.error }]}>{label}</Text>
      {sublabel ? <Text style={styles.menuSublabel}>{sublabel}</Text> : null}
    </View>
    {rightElement || (onPress ? <Text style={[styles.menuChevron, danger && { color: Colors.error }]}>›</Text> : null)}
  </TouchableOpacity>
);

const Divider = () => <View style={styles.divider} />;

const InfoLine = ({ label, value }) => (
  <View style={styles.infoLine}>
    <Text style={styles.infoLineLabel}>{label}</Text>
    <Text style={styles.infoLineValue}>{value || '—'}</Text>
  </View>
);

const SwitchRow = ({ label, value, onChange }) => (
  <View style={styles.switchRow}>
    <Text style={styles.switchLabel}>{label}</Text>
    <Switch value={value} onValueChange={onChange} trackColor={{ false: Colors.border, true: Colors.accent }} thumbColor={Colors.textWhite} />
  </View>
);

export default function FacultyProfileScreen() {
  const insets = useSafeAreaInsets();
  const { user, signOut, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeModal, setActiveModal] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', department: '', designation: '' });
  const [editLoading, setEditLoading] = useState(false);
  const [feedback, setFeedback] = useState({ category: 'App', subject: '', message: '' });
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [showCatPicker, setShowCatPicker] = useState(false);
  const [notifAttendance, setNotifAttendance] = useState(true);
  const [notifAnnouncements, setNotifAnnouncements] = useState(true);
  const [notifEvents, setNotifEvents] = useState(false);

  const fetchProfile = useCallback(async () => {
    try {
      const res = await mockFetch({ ...MOCK_FACULTY, ...(user || {}) });
      setProfile(res.data);
      setEditForm({ name: res.data.name || '', department: res.data.department || '', designation: res.data.designation || '' });
    } catch { setProfile(user); }
    finally { setLoading(false); }
  }, [user]);

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  const handleSaveEdit = async () => {
    if (!editForm.name.trim()) { Alert.alert('Error', 'Name cannot be empty'); return; }
    setEditLoading(true);
    try {
      const updated = { ...profile, name: editForm.name.trim(), department: editForm.department, designation: editForm.designation };
      await mockPost(updated, 800);
      setProfile(updated);
      await updateUser(updated);
      setActiveModal(null);
      Alert.alert('Success', 'Profile updated.');
    } catch (e) { Alert.alert('Error', e.message); }
    finally { setEditLoading(false); }
  };

  const handleSendFeedback = async () => {
    if (!feedback.subject.trim() || !feedback.message.trim()) { Alert.alert('Error', 'Please fill all fields'); return; }
    setFeedbackLoading(true);
    try {
      await mockPost({ success: true }, 900);
      Alert.alert('Thank you', 'Your feedback has been submitted.');
      setFeedback({ category: 'App', subject: '', message: '' });
      setActiveModal(null);
    } catch (e) { Alert.alert('Error', e.message); }
    finally { setFeedbackLoading(false); }
  };

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: signOut },
    ]);
  };

  if (loading) return <><View style={styles.headerPlaceholder} /><Loader /></>;
  const p = profile || user;

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 90 }]}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[0]}
      >
        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.avatarRing}><Avatar name={p?.name} size={72} /></View>
          <Text style={styles.heroName}>{p?.name || 'Faculty'}</Text>
          <Text style={styles.heroSub}>{p?.designation || 'Faculty'}</Text>
          <Text style={styles.heroDept}>{p?.department || ''}</Text>
          <View style={styles.rolePill}><Text style={styles.rolePillText}>Faculty</Text></View>
        </View>

        {/* Menu */}
        <View style={styles.menuCard}>
          <MenuRow label="Personal Info" sublabel="Name, designation, department, email" onPress={() => setActiveModal('personalInfo')} />
          <Divider />
          <MenuRow label="Settings" sublabel="Notifications and preferences" onPress={() => setActiveModal('settings')} />
          <Divider />
          <MenuRow label="Send Feedback" sublabel="Report issues or share suggestions" onPress={() => setActiveModal('feedback')} />
          <Divider />
          <MenuRow label="About UniVerse" sublabel="Version 1.0.0 · Andhra University" onPress={() => Alert.alert('UniVerse', 'Version 1.0.0\nDeveloped for Andhra University\n\u00A9 2025 UniVerse Team')} />
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* MODAL — Personal Info */}
      <Modal visible={activeModal === 'personalInfo'} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.sheet, { paddingBottom: insets.bottom + 16 }]}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>Personal Info</Text>
            <View style={styles.infoList}>
              <InfoLine label="Full Name"   value={p?.name} />
              <InfoLine label="Email"       value={p?.email} />
              <InfoLine label="Designation" value={p?.designation} />
              <InfoLine label="Department"  value={p?.department} />
              <InfoLine label="Role"        value="Faculty" />
            </View>
            <Text style={[styles.sheetTitle, { marginTop: 20, marginBottom: 12 }]}>Edit Profile</Text>
            <InputField label="Full Name" value={editForm.name} onChangeText={v => setEditForm(f => ({ ...f, name: v }))} placeholder="Your full name" />
            <InputField label="Designation" value={editForm.designation} onChangeText={v => setEditForm(f => ({ ...f, designation: v }))} placeholder="e.g. Professor, Assistant Professor" />
            <InputField label="Department" value={editForm.department} onChangeText={v => setEditForm(f => ({ ...f, department: v }))} placeholder="Department" />
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 4 }}>
              <OutlineButton title="Cancel" onPress={() => setActiveModal(null)} style={{ flex: 1 }} />
              <PrimaryButton title="Save" onPress={handleSaveEdit} loading={editLoading} style={{ flex: 1 }} />
            </View>
          </View>
        </View>
      </Modal>

      {/* MODAL — Settings */}
      <Modal visible={activeModal === 'settings'} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.sheet, { paddingBottom: insets.bottom + 16 }]}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>Settings</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.settingGroup}>NOTIFICATIONS</Text>
              <View style={styles.settingCard}>
                <SwitchRow label="Attendance Alerts"  value={notifAttendance}    onChange={setNotifAttendance} />
                <Divider />
                <SwitchRow label="Announcements"      value={notifAnnouncements} onChange={setNotifAnnouncements} />
                <Divider />
                <SwitchRow label="Events"             value={notifEvents}        onChange={setNotifEvents} />
              </View>
            </ScrollView>
            <OutlineButton title="Close" onPress={() => setActiveModal(null)} style={{ marginTop: 16 }} />
          </View>
        </View>
      </Modal>

      {/* MODAL — Feedback */}
      <Modal visible={activeModal === 'feedback'} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.sheet, { paddingBottom: insets.bottom + 16 }]}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>Send Feedback</Text>
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Category</Text>
              <TouchableOpacity style={styles.catPicker} onPress={() => setShowCatPicker(v => !v)}>
                <Text style={styles.catPickerValue}>{feedback.category}</Text>
                <Text style={styles.pickerChevron}>{showCatPicker ? '▲' : '▼'}</Text>
              </TouchableOpacity>
              {showCatPicker && (
                <View style={styles.catDropdown}>
                  {FEEDBACK_CATEGORIES.map(c => (
                    <TouchableOpacity key={c} style={[styles.catItem, feedback.category === c && styles.catItemActive]}
                      onPress={() => { setFeedback(f => ({ ...f, category: c })); setShowCatPicker(false); }}>
                      <Text style={[styles.catItemText, feedback.category === c && styles.catItemTextActive]}>{c}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
            <InputField label="Subject" value={feedback.subject} onChangeText={v => setFeedback(f => ({ ...f, subject: v }))} placeholder="Brief subject" />
            <InputField label="Message" value={feedback.message} onChangeText={v => setFeedback(f => ({ ...f, message: v }))} placeholder="Your detailed feedback..." multiline numberOfLines={4} />
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

const styles = StyleSheet.create({
  headerPlaceholder: { height: 60, backgroundColor: Colors.primary },
  scroll: { padding: 0 },
  hero: { alignItems: 'center', paddingTop: 32, paddingBottom: 24, paddingHorizontal: 24, backgroundColor: Colors.primary },
  avatarRing: { borderWidth: 3, borderColor: Colors.accent, borderRadius: 999, padding: 3, marginBottom: 12 },
  heroName: { fontSize: 20, fontWeight: '800', color: Colors.textWhite, marginBottom: 2 },
  heroSub:  { fontSize: 13, color: Colors.accent, fontWeight: '600', marginBottom: 2 },
  heroDept: { fontSize: 12, color: 'rgba(255,255,255,0.55)', marginBottom: 12 },
  rolePill: { backgroundColor: 'rgba(245,158,11,0.15)', borderWidth: 1, borderColor: Colors.accent, paddingHorizontal: 16, paddingVertical: 4, borderRadius: Radius.full },
  rolePillText: { fontSize: 11, fontWeight: '700', color: Colors.accent, letterSpacing: 1, textTransform: 'uppercase' },
  menuCard: { backgroundColor: Colors.background, borderRadius: Radius.md, marginHorizontal: 16, marginTop: 20, borderWidth: 0.5, borderColor: Colors.border, ...Shadows.card, overflow: 'hidden' },
  menuRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 16 },
  menuRowBody: { flex: 1 },
  menuLabel: { fontSize: 15, fontWeight: '600', color: Colors.textPrimary },
  menuSublabel: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  menuChevron: { fontSize: 22, color: Colors.textSecondary, fontWeight: '300', lineHeight: 24 },
  divider: { height: 0.5, backgroundColor: Colors.border, marginLeft: 16 },
  logoutBtn: { margin: 16, marginTop: 12, padding: 16, alignItems: 'center', borderRadius: Radius.md, borderWidth: 1.5, borderColor: Colors.error },
  logoutText: { fontSize: 15, fontWeight: '700', color: Colors.error },
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.45)' },
  sheet: { backgroundColor: Colors.background, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, maxHeight: '92%' },
  sheetHandle: { width: 40, height: 4, backgroundColor: Colors.border, borderRadius: 2, alignSelf: 'center', marginBottom: 16 },
  sheetTitle: { fontSize: 18, fontWeight: '800', color: Colors.primary, marginBottom: 16 },
  infoList: { backgroundColor: Colors.surface, borderRadius: Radius.sm, borderWidth: 0.5, borderColor: Colors.border, overflow: 'hidden', marginBottom: 4 },
  infoLine: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 12, borderBottomWidth: 0.5, borderBottomColor: Colors.border },
  infoLineLabel: { fontSize: 13, color: Colors.textSecondary, fontWeight: '500' },
  infoLineValue: { fontSize: 14, color: Colors.textPrimary, fontWeight: '600', maxWidth: '60%', textAlign: 'right' },
  settingGroup: { fontSize: 11, fontWeight: '700', color: Colors.textSecondary, letterSpacing: 1, marginBottom: 8, marginTop: 4 },
  settingCard: { backgroundColor: Colors.surface, borderRadius: Radius.sm, borderWidth: 0.5, borderColor: Colors.border, overflow: 'hidden' },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 12 },
  switchLabel: { fontSize: 14, color: Colors.textPrimary, fontWeight: '500' },
  fieldGroup: { marginBottom: 12 },
  fieldLabel: { fontSize: 13, fontWeight: '600', color: Colors.primary, marginBottom: 6 },
  catPicker: { backgroundColor: Colors.surface, borderRadius: Radius.sm, borderWidth: 1, borderColor: Colors.border, paddingHorizontal: 14, paddingVertical: 13, flexDirection: 'row', justifyContent: 'space-between' },
  catPickerValue: { fontSize: 15, color: Colors.textPrimary },
  pickerChevron: { fontSize: 11, color: Colors.textSecondary },
  catDropdown: { backgroundColor: Colors.background, borderRadius: Radius.sm, borderWidth: 1, borderColor: Colors.border, marginTop: 4, zIndex: 99, elevation: 8 },
  catItem: { paddingHorizontal: 14, paddingVertical: 11 },
  catItemActive: { backgroundColor: Colors.accentLight },
  catItemText: { fontSize: 14, color: Colors.textPrimary },
  catItemTextActive: { fontWeight: '700', color: Colors.primary },
});
