import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Radius, Shadows } from '../../utils/theme';
import { Card, Badge, EmptyState, Loader } from '../../components/UI';
import { HomeHeader } from '../../components/ScreenHeader';
import { useAuth } from '../../hooks/useAuth';
import { formatDate, firstName } from '../../utils/helpers';
import { MOCK_ANNOUNCEMENTS, mockFetch } from '../../utils/mockData';
import { TimetableIcon, AttendanceIcon, ProfileIcon } from '../../components/Icons';

const CATEGORY_COLORS = {
  academic:  { bg: Colors.accentLight, text: Colors.primary },
  exam:      { bg: '#FEE2E2', text: '#DC2626' },
  event:     { bg: '#DCFCE7', text: '#16A34A' },
  holiday:   { bg: '#E0E7FF', text: '#4338CA' },
  general:   { bg: Colors.surface, text: Colors.textSecondary },
};

export default function FacultyHomeScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const res = await mockFetch(MOCK_ANNOUNCEMENTS);
      setAnnouncements(res.data || []);
    } catch { /* ignore */ }
    finally { setLoading(false); setRefreshing(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const onRefresh = () => { setRefreshing(true); fetchData(); };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <HomeHeader
        greeting={`Hi, ${firstName(user?.name)}!`}
        subtitle={`${user?.designation || 'Faculty'} · ${user?.department || ''}`}
      />
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 80 }]}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
      >
        {/* Quick stats row */}
        <View style={styles.quickRow}>
          <View style={styles.quickCard}>
            <TimetableIcon size={22} color={Colors.accent} />
            <Text style={styles.quickLabel}>Classes{'\n'}Today</Text>
          </View>
          <View style={styles.quickCard}>
            <AttendanceIcon size={22} color={Colors.accent} />
            <Text style={styles.quickLabel}>Attendance{'\n'}Pending</Text>
          </View>
          <View style={styles.quickCard}>
            <ProfileIcon size={22} color={Colors.accent} />
            <Text style={styles.quickLabel}>Students{'\n'}Managed</Text>
          </View>
        </View>

        {/* Announcements */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Announcements</Text>
          <View style={styles.sectionCount}>
            <Text style={styles.sectionCountText}>{announcements.length}</Text>
          </View>
        </View>

        {loading ? <Loader /> : announcements.length === 0
          ? <EmptyState message="No announcements" />
          : announcements.map((a, i) => {
            const cat = a.category?.toLowerCase() || 'general';
            const colors = CATEGORY_COLORS[cat] || CATEGORY_COLORS.general;
            return (
              <Card key={a.id || i} style={styles.announcementCard}>
                <View style={styles.cardTop}>
                  <Badge label={a.category || 'General'} color={colors.bg} textColor={colors.text} />
                  <Text style={styles.cardDate}>{formatDate(a.created_at || a.date)}</Text>
                </View>
                <Text style={styles.cardTitle}>{a.title}</Text>
                <Text style={styles.cardBody} numberOfLines={3}>{a.body || a.content}</Text>
              </Card>
            );
          })
        }
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 16 },
  quickRow: { flexDirection: 'row', gap: 10, marginBottom: 24 },
  quickCard: {
    flex: 1, backgroundColor: Colors.primary,
    borderRadius: Radius.md, padding: 14, alignItems: 'center', ...Shadows.card,
  },
  quickEmoji: { fontSize: 24, marginBottom: 6 },
  quickLabel: { fontSize: 11, fontWeight: '600', color: 'rgba(255,255,255,0.7)', textAlign: 'center', lineHeight: 16 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 8 },
  sectionTitle: { fontSize: 17, fontWeight: '800', color: Colors.primary },
  sectionCount: {
    backgroundColor: Colors.accent, borderRadius: Radius.full,
    width: 22, height: 22, alignItems: 'center', justifyContent: 'center',
  },
  sectionCountText: { fontSize: 11, fontWeight: '800', color: Colors.primary },
  announcementCard: { marginBottom: 12 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  cardDate: { fontSize: 11, color: Colors.textSecondary },
  cardTitle: { fontSize: 15, fontWeight: '700', color: Colors.primary, marginBottom: 6 },
  cardBody: { fontSize: 13, color: Colors.textSecondary, lineHeight: 19 },
});
