import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, ScrollView, StyleSheet, RefreshControl, TouchableOpacity,
  Modal, Alert, ActivityIndicator,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Radius, Shadows } from '../../utils/theme';
import { Card, EmptyState, Loader, InputField, PrimaryButton, OutlineButton } from '../../components/UI';
import { ScreenHeader } from '../../components/ScreenHeader';
import {
  MOCK_TIMETABLE_ALL,
  MOCK_TIMETABLE_TODAY,
  mockFetch,
  mockPost,
} from '../../utils/mockData';
import { EditIcon, UploadIcon } from '../../components/Icons';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function TimetableScreen() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('today');
  const [todayClasses, setTodayClasses] = useState([]);
  const [weekTimetable, setWeekTimetable] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showManualForm, setShowManualForm] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [manualForm, setManualForm] = useState({
    subject: '', subject_code: '', class: '', time: '', day: 'Monday',
  });
  const [manualLoading, setManualLoading] = useState(false);
  const [showDayPicker, setShowDayPicker] = useState(false);

  const fetchToday = useCallback(async () => {
    try {
      const res = await mockFetch(MOCK_TIMETABLE_TODAY);
      setTodayClasses(res.data || []);
    } catch { /* ignore */ }
  }, []);

  const fetchWeek = useCallback(async () => {
    try {
      const res = await mockFetch(MOCK_TIMETABLE_ALL);
      const grouped = {};
      (res.data || []).forEach(entry => {
        const day = entry.day || 'Unknown';
        if (!grouped[day]) grouped[day] = [];
        grouped[day].push(entry);
      });
      setWeekTimetable(grouped);
    } catch { /* ignore */ }
  }, []);

  const fetchAll = useCallback(async () => {
    await Promise.all([fetchToday(), fetchWeek()]);
    setLoading(false);
    setRefreshing(false);
  }, [fetchToday, fetchWeek]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const onRefresh = () => { setRefreshing(true); fetchAll(); };

  const handleUploadImage = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/*', 'application/pdf'],
        copyToCacheDirectory: true,
      });
      if (result.canceled) return;
      setUploadLoading(true);
      // Simulate upload processing delay
      await mockPost({ success: true }, 1500);
      Alert.alert('Success!', 'Timetable uploaded and processed.');
      setShowUploadModal(false);
      fetchAll();
    } catch (e) {
      Alert.alert('Upload Failed', e.message);
    } finally {
      setUploadLoading(false);
    }
  };

  const handleManualSubmit = async () => {
    if (!manualForm.subject.trim() || !manualForm.subject_code.trim() || !manualForm.class.trim() || !manualForm.time.trim()) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    setManualLoading(true);
    try {
      await mockPost({ success: true }, 800);
      Alert.alert('Success', 'Class added to timetable');
      setManualForm({ subject: '', subject_code: '', class: '', time: '', day: 'Monday' });
      setShowManualForm(false);
      fetchAll();
    } catch (e) {
      Alert.alert('Error', e.message);
    } finally {
      setManualLoading(false);
    }
  };

  const ClassCard = ({ entry }) => (
    <View style={styles.classCard}>
      <View style={styles.classTime}>
        <Text style={styles.classTimeText}>{entry.time || '--'}</Text>
      </View>
      <View style={styles.classInfo}>
        <Text style={styles.className}>{entry.subject || entry.subject_name}</Text>
        <Text style={styles.classCode}>{entry.subject_code}</Text>
        <View style={styles.classMeta}>
          <Text style={styles.classSection}>{entry.class || entry.section}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <ScreenHeader
        title="Timetable"
        subtitle="Your class schedule"
        rightIcon="+"
        onRight={() => setShowUploadModal(true)}
      />

      {/* Tabs */}
      <View style={styles.tabBar}>
        {[{ key: 'today', label: 'Today' }, { key: 'week', label: 'Full Week' }].map(t => (
          <TouchableOpacity
            key={t.key}
            style={[styles.tab, activeTab === t.key && styles.tabActive]}
            onPress={() => setActiveTab(t.key)}
          >
            <Text style={[styles.tabText, activeTab === t.key && styles.tabTextActive]}>{t.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? <Loader /> : (
        <ScrollView
          contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 90 }]}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
        >
          {activeTab === 'today' ? (
            <>
              <View style={styles.dateHeader}>
                <Text style={styles.dateLabel}>Today's Classes</Text>
                <Text style={styles.dateValue}>
                  {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
                </Text>
              </View>
              {todayClasses.length === 0
                ? <EmptyState message="No classes today" subMessage="No scheduled classes" />
                : todayClasses.map((c, i) => <ClassCard key={i} entry={c} />)
              }
            </>
          ) : (
            DAYS.map(day => {
              const classes = weekTimetable[day] || [];
              return (
                <View key={day} style={styles.daySection}>
                  <View style={styles.dayHeader}>
                    <Text style={styles.dayName}>{day}</Text>
                    <Text style={styles.dayCount}>{classes.length} class{classes.length !== 1 ? 'es' : ''}</Text>
                  </View>
                  {classes.length === 0
                    ? <Text style={styles.noClassText}>No classes</Text>
                    : classes.map((c, i) => <ClassCard key={i} entry={c} />)
                  }
                </View>
              );
            })
          )}
        </ScrollView>
      )}

      {/* Upload Modal */}
      <Modal visible={showUploadModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalSheet, { paddingBottom: insets.bottom + 16 }]}>
            <View style={styles.sheetHandle} />
            <Text style={styles.modalTitle}>Upload Timetable</Text>
            <Text style={styles.modalSubtitle}>Choose how to add your timetable</Text>

            <TouchableOpacity
              style={styles.uploadOption}
              onPress={() => { setShowUploadModal(false); setShowManualForm(true); }}
            >
              <View style={styles.uploadOptionIconWrap}>
                <EditIcon size={20} color={Colors.primary} />
              </View>
              <View style={styles.uploadOptionInfo}>
                <Text style={styles.uploadOptionTitle}>Manual Entry</Text>
                <Text style={styles.uploadOptionSub}>Add classes one by one</Text>
              </View>
              <Text style={styles.optionArrow}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.uploadOption, uploadLoading && { opacity: 0.6 }]}
              onPress={handleUploadImage}
              disabled={uploadLoading}
            >
              {uploadLoading
                ? <ActivityIndicator color={Colors.primary} size="small" style={{ marginRight: 12 }} />
                : <View style={styles.uploadOptionIconWrap}><UploadIcon size={20} color={Colors.primary} /></View>
              }
              <View style={styles.uploadOptionInfo}>
                <Text style={styles.uploadOptionTitle}>Upload Image / PDF</Text>
                <Text style={styles.uploadOptionSub}>Auto-detect from file</Text>
              </View>
              <Text style={styles.optionArrow}>›</Text>
            </TouchableOpacity>

            <OutlineButton title="Cancel" onPress={() => setShowUploadModal(false)} style={{ marginTop: 8 }} />
          </View>
        </View>
      </Modal>

      {/* Manual Form Modal */}
      <Modal visible={showManualForm} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <ScrollView>
            <View style={[styles.modalSheet, styles.formSheet, { paddingBottom: insets.bottom + 16 }]}>
              <View style={styles.sheetHandle} />
              <Text style={styles.modalTitle}>Add Class</Text>

              <InputField
                label="Subject Name"
                value={manualForm.subject}
                onChangeText={v => setManualForm(f => ({ ...f, subject: v }))}
                placeholder="e.g. Data Structures"
              />
              <InputField
                label="Subject Code"
                value={manualForm.subject_code}
                onChangeText={v => setManualForm(f => ({ ...f, subject_code: v }))}
                placeholder="e.g. CS301"
                autoCapitalize="characters"
              />
              <InputField
                label="Class / Section"
                value={manualForm.class}
                onChangeText={v => setManualForm(f => ({ ...f, class: v }))}
                placeholder="e.g. CS-3A"
              />
              <InputField
                label="Time"
                value={manualForm.time}
                onChangeText={v => setManualForm(f => ({ ...f, time: v }))}
                placeholder="e.g. 09:00 - 10:00"
              />

              {/* Day picker */}
              <View style={{ marginBottom: 16 }}>
                <Text style={styles.inputLabel}>Day</Text>
                <TouchableOpacity
                  style={styles.dayPickerBtn}
                  onPress={() => setShowDayPicker(!showDayPicker)}
                >
                  <Text style={styles.dayPickerValue}>{manualForm.day}</Text>
                  <Text style={{ color: Colors.textSecondary, fontSize: 11 }}>{showDayPicker ? '▲' : '▼'}</Text>
                </TouchableOpacity>
                {showDayPicker && (
                  <View style={styles.dayDropdown}>
                    {DAYS.map(d => (
                      <TouchableOpacity
                        key={d}
                        style={[styles.dayDropdownItem, manualForm.day === d && styles.dayDropdownItemActive]}
                        onPress={() => { setManualForm(f => ({ ...f, day: d })); setShowDayPicker(false); }}
                      >
                        <Text style={[styles.dayDropdownText, manualForm.day === d && styles.dayDropdownTextActive]}>{d}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              <View style={{ flexDirection: 'row', gap: 10 }}>
                <OutlineButton title="Cancel" onPress={() => setShowManualForm(false)} style={{ flex: 1 }} />
                <PrimaryButton title="Add Class" onPress={handleManualSubmit} loading={manualLoading} style={{ flex: 1 }} />
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: { flexDirection: 'row', backgroundColor: Colors.background, borderBottomWidth: 1, borderBottomColor: Colors.border },
  tab: { flex: 1, paddingVertical: 13, alignItems: 'center', borderBottomWidth: 2.5, borderBottomColor: 'transparent' },
  tabActive: { borderBottomColor: Colors.accent },
  tabText: { fontSize: 14, fontWeight: '600', color: Colors.textSecondary },
  tabTextActive: { color: Colors.primary, fontWeight: '700' },
  scroll: { padding: 16 },
  dateHeader: { marginBottom: 16 },
  dateLabel: { fontSize: 13, color: Colors.textSecondary, fontWeight: '500' },
  dateValue: { fontSize: 17, fontWeight: '700', color: Colors.primary },
  classCard: {
    flexDirection: 'row', backgroundColor: Colors.background,
    borderRadius: Radius.md, marginBottom: 10,
    borderWidth: 0.5, borderColor: Colors.border,
    overflow: 'hidden', ...Shadows.card,
  },
  classTime: {
    width: 72, backgroundColor: Colors.primary,
    padding: 12, alignItems: 'center', justifyContent: 'center',
  },
  classTimeText: { fontSize: 12, fontWeight: '700', color: Colors.accent, textAlign: 'center' },
  classInfo: { flex: 1, padding: 14 },
  className: { fontSize: 14, fontWeight: '700', color: Colors.primary, marginBottom: 3 },
  classCode: { fontSize: 12, color: Colors.accent, fontWeight: '600', marginBottom: 6 },
  classMeta: { flexDirection: 'row' },
  classSection: { fontSize: 12, color: Colors.textSecondary },
  daySection: { marginBottom: 20 },
  dayHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: Colors.primary, borderRadius: Radius.sm,
    paddingHorizontal: 14, paddingVertical: 8, marginBottom: 8,
  },
  dayName: { fontSize: 14, fontWeight: '700', color: Colors.accent },
  dayCount: { fontSize: 12, color: 'rgba(255,255,255,0.6)' },
  noClassText: { fontSize: 13, color: Colors.textSecondary, paddingLeft: 4, paddingBottom: 4 },
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.45)' },
  modalSheet: { backgroundColor: Colors.background, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20 },
  formSheet: { marginTop: 60 },
  sheetHandle: { width: 40, height: 4, backgroundColor: Colors.border, borderRadius: 2, alignSelf: 'center', marginBottom: 16 },
  modalTitle: { fontSize: 20, fontWeight: '800', color: Colors.primary, marginBottom: 4 },
  modalSubtitle: { fontSize: 13, color: Colors.textSecondary, marginBottom: 20 },
  uploadOption: {
    flexDirection: 'row', alignItems: 'center', padding: 16,
    backgroundColor: Colors.surface, borderRadius: Radius.md, marginBottom: 10,
    borderWidth: 0.5, borderColor: Colors.border,
  },
  uploadOptionIconWrap: {
    width: 40, height: 40, borderRadius: Radius.sm,
    backgroundColor: Colors.accentLight,
    alignItems: 'center', justifyContent: 'center',
    marginRight: 14,
  },
  uploadOptionInfo: { flex: 1 },
  uploadOptionTitle: { fontSize: 15, fontWeight: '700', color: Colors.primary },
  uploadOptionSub: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  optionArrow: { fontSize: 18, color: Colors.accent, fontWeight: '700' },
  inputLabel: { fontSize: 13, fontWeight: '600', color: Colors.primary, marginBottom: 6 },
  dayPickerBtn: {
    backgroundColor: Colors.surface, borderRadius: Radius.sm,
    borderWidth: 1, borderColor: Colors.border,
    paddingHorizontal: 14, paddingVertical: 13,
    flexDirection: 'row', justifyContent: 'space-between',
  },
  dayPickerValue: { fontSize: 15, color: Colors.textPrimary },
  dayDropdown: { backgroundColor: Colors.background, borderRadius: Radius.sm, borderWidth: 1, borderColor: Colors.border, marginTop: 4 },
  dayDropdownItem: { paddingHorizontal: 14, paddingVertical: 11 },
  dayDropdownItemActive: { backgroundColor: Colors.accentLight },
  dayDropdownText: { fontSize: 14, color: Colors.textPrimary },
  dayDropdownTextActive: { fontWeight: '700', color: Colors.primary },
});
