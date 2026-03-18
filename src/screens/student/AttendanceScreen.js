import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, ScrollView, StyleSheet, RefreshControl, TouchableOpacity,
} from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Radius, Shadows } from '../../utils/theme';
import { Card, Divider, EmptyState, Loader } from '../../components/UI';
import { ScreenHeader } from '../../components/ScreenHeader';
import { getAttendanceColor, formatDate } from '../../utils/helpers';
import {
  MOCK_ATTENDANCE_OVERVIEW,
  MOCK_ATTENDANCE_DAYWISE,
  mockFetch,
} from '../../utils/mockData';

// SVG-based circular progress ring
const CircleProgress = ({ percentage, size = 140 }) => {
  const color = getAttendanceColor(percentage);
  const strokeWidth = 11;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min(Math.max(percentage, 0), 100);
  const strokeDashoffset = circumference - (pct / 100) * circumference;

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={{ position: 'absolute' }}>
        {/* Track */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(27,43,94,0.12)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress arc */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      <View style={{ alignItems: 'center' }}>
        <Text style={[styles.circlePercent, { color }]}>{Math.round(pct)}%</Text>
        <Text style={styles.circleLabel}>Overall</Text>
      </View>
    </View>
  );
};

const SubjectCard = ({ subject }) => {
  const pct = subject.percentage || 0;
  const color = getAttendanceColor(pct);
  const canSkip = subject.total > 0
    ? Math.floor(subject.attended - 0.75 * subject.total)
    : 0;
  const needMore = subject.total > 0
    ? Math.ceil(0.75 * subject.total - subject.attended)
    : 0;

  return (
    <View style={[styles.subjectCard, { borderLeftColor: color }]}>
      <View style={styles.subjectTop}>
        <Text style={styles.subjectName}>{subject.subject_name || subject.name}</Text>
        <Text style={[styles.subjectPct, { color }]}>{Math.round(pct)}%</Text>
      </View>
      <View style={styles.subjectProgress}>
        <View style={[styles.progressTrack]}>
          <View style={[styles.progressFill, { width: `${Math.min(pct, 100)}%`, backgroundColor: color }]} />
        </View>
      </View>
      <View style={styles.subjectBottom}>
        <Text style={styles.subjectCount}>
          {subject.attended || 0}/{subject.total || 0} classes
        </Text>
        <Text style={[styles.subjectNote, { color: pct >= 75 ? Colors.success : Colors.error }]}>
          {pct >= 75
            ? canSkip > 0 ? `Can skip ${canSkip} more` : 'On track ✓'
            : needMore > 0 ? `Attend ${needMore} more for 75%` : 'Critical — Below 75%'
          }
        </Text>
      </View>
    </View>
  );
};

export default function AttendanceScreen() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('overview');
  const [overview, setOverview] = useState(null);
  const [daywise, setDaywise] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOverview = useCallback(async () => {
    try {
      const res = await mockFetch(MOCK_ATTENDANCE_OVERVIEW);
      setOverview(res.data);
    } catch (e) { /* ignore */ }
  }, []);

  const fetchDaywise = useCallback(async () => {
    try {
      const res = await mockFetch(MOCK_ATTENDANCE_DAYWISE);
      setDaywise(res.data || []);
    } catch (e) { /* ignore */ }
  }, []);

  const fetchAll = useCallback(async () => {
    await Promise.all([fetchOverview(), fetchDaywise()]);
    setLoading(false);
    setRefreshing(false);
  }, [fetchOverview, fetchDaywise]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const onRefresh = () => { setRefreshing(true); fetchAll(); };

  const STATUS_CONFIG = {
    present: { color: Colors.success, bg: '#DCFCE7', label: 'P' },
    absent: { color: Colors.error, bg: '#FEE2E2', label: 'A' },
    late: { color: Colors.warning, bg: '#FEF9C3', label: 'L' },
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <ScreenHeader title="Attendance" subtitle="Track your presence" />

      {/* Tabs */}
      <View style={styles.tabBar}>
        {['overview', 'daywise'].map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab === 'overview' ? 'Overview' : 'Day-wise'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? <Loader /> : (
        <ScrollView
          contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 90 }]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
          }
        >
          {activeTab === 'overview' ? (
            <>
              {/* Circular overall */}
              <View style={styles.overallCard}>
                <CircleProgress percentage={overview?.overall_percentage || 0} />
                <View style={styles.overallInfo}>
                  <Text style={styles.overallTitle}>Attendance Status</Text>
                  <View style={styles.overallStats}>
                    <View style={styles.statItem}>
                      <Text style={[styles.statValue, { color: Colors.success }]}>
                        {overview?.total_present || 0}
                      </Text>
                      <Text style={styles.statLabel}>Present</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                      <Text style={[styles.statValue, { color: Colors.error }]}>
                        {overview?.total_absent || 0}
                      </Text>
                      <Text style={styles.statLabel}>Absent</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                      <Text style={[styles.statValue, { color: Colors.primary }]}>
                        {overview?.total_classes || 0}
                      </Text>
                      <Text style={styles.statLabel}>Total</Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Subject-wise */}
              <Text style={styles.sectionTitle}>Subject-wise Breakdown</Text>
              {(overview?.subjects || []).length === 0
                ? <EmptyState message="No subjects found" />
                : (overview?.subjects || []).map((s, i) => <SubjectCard key={i} subject={s} />)
              }
            </>
          ) : (
            <>
              <Text style={styles.sectionTitle}>Day-wise Attendance</Text>
              {daywise.length === 0
                ? <EmptyState message="No records found" />
                : daywise.map((day, i) => (
                  <View key={i} style={styles.dayCard}>
                    <View style={styles.dayHeader}>
                      <Text style={styles.dayDate}>{formatDate(day.date)}</Text>
                      <View style={styles.dayStats}>
                        <Text style={[styles.dayStatText, { color: Colors.success }]}>
                          {day.present} P
                        </Text>
                        <Text style={styles.dayStatSep}>  ·  </Text>
                        <Text style={[styles.dayStatText, { color: Colors.error }]}>
                          {day.absent} A
                        </Text>
                      </View>
                    </View>
                    {(day.records || []).map((r, j) => {
                      const cfg = STATUS_CONFIG[r.status?.toLowerCase()] || STATUS_CONFIG.absent;
                      return (
                        <View key={j} style={styles.recordRow}>
                          <Text style={styles.recordSubject}>{r.subject_name || r.subject}</Text>
                          <View style={[styles.statusBadge, { backgroundColor: cfg.bg }]}>
                            <Text style={[styles.statusText, { color: cfg.color }]}>{cfg.label}</Text>
                          </View>
                        </View>
                      );
                    })}
                  </View>
                ))
              }
            </>
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tab: {
    flex: 1, paddingVertical: 13, alignItems: 'center',
    borderBottomWidth: 2.5, borderBottomColor: 'transparent',
  },
  tabActive: { borderBottomColor: Colors.accent },
  tabText: { fontSize: 14, fontWeight: '600', color: Colors.textSecondary },
  tabTextActive: { color: Colors.primary, fontWeight: '700' },
  scroll: { padding: 16 },
  overallCard: {
    flexDirection: 'row',
    backgroundColor: Colors.primary,
    borderRadius: Radius.lg,
    padding: 20,
    marginBottom: 24,
    alignItems: 'center',
    gap: 20,
    ...Shadows.strong,
  },
  circlePercent: { fontSize: 28, fontWeight: '900' },
  circleLabel: { fontSize: 11, color: 'rgba(255,255,255,0.6)', fontWeight: '500' },
  overallInfo: { flex: 1 },
  overallTitle: { fontSize: 15, fontWeight: '700', color: Colors.accent, marginBottom: 14 },
  overallStats: { flexDirection: 'row', alignItems: 'center' },
  statItem: { alignItems: 'center', flex: 1 },
  statValue: { fontSize: 22, fontWeight: '900' },
  statLabel: { fontSize: 11, color: 'rgba(255,255,255,0.55)', marginTop: 2 },
  statDivider: { width: 1, height: 32, backgroundColor: 'rgba(255,255,255,0.15)' },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: Colors.primary, marginBottom: 12 },
  subjectCard: {
    backgroundColor: Colors.background,
    borderRadius: Radius.md,
    padding: 14,
    marginBottom: 10,
    borderWidth: 0.5,
    borderColor: Colors.border,
    borderLeftWidth: 4,
    ...Shadows.card,
  },
  subjectTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  subjectName: { fontSize: 14, fontWeight: '700', color: Colors.primary, flex: 1 },
  subjectPct: { fontSize: 17, fontWeight: '900' },
  subjectProgress: { marginBottom: 8 },
  progressTrack: {
    height: 6, backgroundColor: Colors.surface, borderRadius: 3, overflow: 'hidden',
  },
  progressFill: { height: 6, borderRadius: 3 },
  subjectBottom: { flexDirection: 'row', justifyContent: 'space-between' },
  subjectCount: { fontSize: 12, color: Colors.textSecondary },
  subjectNote: { fontSize: 12, fontWeight: '600' },
  dayCard: {
    backgroundColor: Colors.background,
    borderRadius: Radius.md,
    padding: 14,
    marginBottom: 12,
    borderWidth: 0.5,
    borderColor: Colors.border,
    ...Shadows.card,
  },
  dayHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 12, paddingBottom: 10,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  dayDate: { fontSize: 14, fontWeight: '700', color: Colors.primary },
  dayStats: { flexDirection: 'row', alignItems: 'center' },
  dayStatText: { fontSize: 13, fontWeight: '700' },
  dayStatSep: { color: Colors.textSecondary },
  recordRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingVertical: 7,
    borderBottomWidth: 0.5, borderBottomColor: Colors.border,
  },
  recordSubject: { fontSize: 13, color: Colors.textPrimary, flex: 1 },
  statusBadge: {
    width: 28, height: 28, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
  },
  statusText: { fontSize: 12, fontWeight: '800' },
});
