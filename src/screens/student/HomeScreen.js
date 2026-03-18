import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, ScrollView, StyleSheet, RefreshControl, StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Radius, Shadows } from '../../utils/theme';
import { Badge, EmptyState, Loader } from '../../components/UI';
import { useAuth } from '../../hooks/useAuth';
import { formatDate, firstName } from '../../utils/helpers';
import { MOCK_ANNOUNCEMENTS, mockFetch } from '../../utils/mockData';

const CATEGORY_COLORS = {
  exam:     { bg: '#FEE2E2', text: '#DC2626' },
  academic: { bg: Colors.accentLight, text: Colors.primary },
  event:    { bg: '#DCFCE7', text: '#16A34A' },
  holiday:  { bg: '#E0E7FF', text: '#4338CA' },
  general:  { bg: Colors.surface, text: Colors.textSecondary },
};

export default function StudentHomeScreen() {
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
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      {/* Professional top bar */}
      <View style={[styles.topBar, { paddingTop: insets.top + 16 }]}>
        <View>
          <Text style={styles.greeting}>Good day, {firstName(user?.name)}.</Text>
          <Text style={styles.subGreeting}>{user?.department} · Year {user?.year}</Text>
        </View>
        <View style={styles.regBadge}>
          <Text style={styles.regText}>{user?.reg_no || 'AU'}</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 80 }]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
        }
      >
        {/* Announcements section */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Announcements</Text>
          {!loading && (
            <View style={styles.countPill}>
              <Text style={styles.countText}>{announcements.length}</Text>
            </View>
          )}
        </View>

        {loading ? (
          <Loader />
        ) : announcements.length === 0 ? (
          <EmptyState message="No announcements" subMessage="Check back later" />
        ) : (
          announcements.map((a, i) => {
            const cat = a.category?.toLowerCase() || 'general';
            const colors = CATEGORY_COLORS[cat] || CATEGORY_COLORS.general;
            return (
              <View key={a.id || i} style={styles.card}>
                <View style={styles.cardTopRow}>
                  <Badge label={a.category || 'General'} color={colors.bg} textColor={colors.text} />
                  <Text style={styles.cardDate}>{formatDate(a.created_at || a.date)}</Text>
                </View>
                <Text style={styles.cardTitle}>{a.title}</Text>
                <View style={styles.divider} />
                <Text style={styles.cardBody} numberOfLines={4}>{a.body || a.content}</Text>
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  greeting: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.textWhite,
    letterSpacing: -0.3,
  },
  subGreeting: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.55)',
    marginTop: 3,
  },
  regBadge: {
    backgroundColor: Colors.accent,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.full,
  },
  regText: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: 0.5,
  },
  scroll: { padding: 16 },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 0.1,
  },
  countPill: {
    backgroundColor: Colors.accent,
    borderRadius: Radius.full,
    minWidth: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  countText: { fontSize: 11, fontWeight: '800', color: Colors.primary },
  card: {
    backgroundColor: Colors.background,
    borderRadius: Radius.md,
    padding: 16,
    marginBottom: 12,
    borderWidth: 0.5,
    borderColor: Colors.border,
    ...Shadows.card,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardDate: { fontSize: 11, color: Colors.textSecondary },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.primary,
    lineHeight: 22,
    marginBottom: 10,
  },
  divider: { height: 1, backgroundColor: Colors.border, marginBottom: 10 },
  cardBody: { fontSize: 13, color: Colors.textSecondary, lineHeight: 20 },
});
