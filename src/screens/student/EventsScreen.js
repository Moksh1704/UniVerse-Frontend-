import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, ScrollView, StyleSheet, RefreshControl,
  TouchableOpacity, Linking, TextInput,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Radius, Shadows } from '../../utils/theme';
import { Badge, EmptyState, Loader } from '../../components/UI';
import { ScreenHeader } from '../../components/ScreenHeader';
import { formatDate } from '../../utils/helpers';
import { MOCK_EVENTS, mockFetch } from '../../utils/mockData';

const FILTERS = ['All', 'Technical', 'Non-Technical', 'Cultural', 'Sports'];

const CATEGORY_CONFIG = {
  technical:    { bg: '#DBEAFE', text: '#1D4ED8' },
  'non-technical': { bg: '#FCE7F3', text: '#BE185D' },
  cultural:     { bg: '#FEF9C3', text: '#92400E' },
  sports:       { bg: '#DCFCE7', text: '#166534' },
  general:      { bg: Colors.accentLight, text: Colors.primary },
};

export default function EventsScreen() {
  const insets = useSafeAreaInsets();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('All');
  const [query, setQuery] = useState('');

  const fetchEvents = useCallback(async () => {
    try {
      const res = await mockFetch(MOCK_EVENTS);
      setEvents(res.data || []);
    } catch { /* ignore */ }
    finally { setLoading(false); setRefreshing(false); }
  }, []);

  useEffect(() => { fetchEvents(); }, [fetchEvents]);
  const onRefresh = () => { setRefreshing(true); fetchEvents(); };

  const filtered = events.filter(e => {
    const matchFilter = filter === 'All' || (e.category || '').toLowerCase() === filter.toLowerCase();
    const matchQuery = !query.trim() ||
      (e.name || e.title || '').toLowerCase().includes(query.toLowerCase()) ||
      (e.venue || '').toLowerCase().includes(query.toLowerCase()) ||
      (e.description || '').toLowerCase().includes(query.toLowerCase());
    return matchFilter && matchQuery;
  });

  const handleRegister = (url) => {
    if (!url) return;
    Linking.openURL(url).catch(() => {});
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <ScreenHeader title="Events" subtitle="Upcoming campus events" />

      {/* Search bar */}
      <View style={styles.searchWrap}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>&#x2315;</Text>
          <TextInput
            style={styles.searchInput}
            value={query}
            onChangeText={setQuery}
            placeholder="Search events, venues..."
            placeholderTextColor={Colors.textSecondary}
            returnKeyType="search"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filter tabs — solid pill buttons so they're always visible */}
      <View style={styles.filterBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
          {FILTERS.map(f => (
            <TouchableOpacity
              key={f}
              style={[styles.filterPill, filter === f && styles.filterPillActive]}
              onPress={() => setFilter(f)}
              activeOpacity={0.8}
            >
              <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {loading ? <Loader /> : (
        <ScrollView
          contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 90 }]}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
        >
          {filtered.length === 0 ? (
            <EmptyState message="No events found" subMessage={query ? 'Try a different search' : 'Check back soon'} />
          ) : (
            filtered.map((event, i) => {
              const cat = (event.category || '').toLowerCase();
              const config = CATEGORY_CONFIG[cat] || CATEGORY_CONFIG.general;
              const eventDate = event.date || event.event_date;
              const d = new Date(eventDate);
              return (
                <View key={event.id || i} style={styles.card}>
                  <View style={styles.cardLeft}>
                    <View style={styles.dateBadge}>
                      <Text style={styles.dateDay}>{isNaN(d) ? '--' : d.getDate()}</Text>
                      <Text style={styles.dateMonth}>
                        {isNaN(d) ? '---' : d.toLocaleString('default', { month: 'short' }).toUpperCase()}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.cardBody}>
                    <Badge
                      label={event.category || 'General'}
                      color={config.bg}
                      textColor={config.text}
                      style={{ marginBottom: 8 }}
                    />
                    <Text style={styles.eventName}>{event.name || event.title}</Text>
                    <Text style={styles.eventVenue}>{event.venue || 'Venue TBD'}</Text>
                    {event.description ? (
                      <Text style={styles.eventDesc} numberOfLines={2}>{event.description}</Text>
                    ) : null}
                    {event.needs_registration && event.registration_url && (
                      <TouchableOpacity
                        style={styles.regBtn}
                        onPress={() => handleRegister(event.registration_url)}
                        activeOpacity={0.85}
                      >
                        <Text style={styles.regBtnText}>Register Now</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              );
            })
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  searchWrap: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: Radius.sm,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  searchIcon: { fontSize: 16, color: Colors.textSecondary, marginRight: 8 },
  searchInput: { flex: 1, fontSize: 14, color: Colors.textPrimary },
  clearIcon: { fontSize: 13, color: Colors.textSecondary, paddingLeft: 8 },
  filterBar: {
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingVertical: 10,
  },
  filterRow: { paddingHorizontal: 16, gap: 8 },
  filterPill: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: Radius.full,
    backgroundColor: Colors.background,
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  filterPillActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
  },
  filterTextActive: {
    color: Colors.accent,
  },
  scroll: { padding: 16 },
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.background,
    borderRadius: Radius.md,
    marginBottom: 12,
    borderWidth: 0.5,
    borderColor: Colors.border,
    overflow: 'hidden',
    ...Shadows.card,
  },
  cardLeft: {
    width: 64,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  dateBadge: { alignItems: 'center' },
  dateDay: { fontSize: 24, fontWeight: '900', color: Colors.accent, lineHeight: 28 },
  dateMonth: { fontSize: 10, fontWeight: '700', color: 'rgba(255,255,255,0.65)', letterSpacing: 0.5 },
  cardBody: { flex: 1, padding: 14 },
  eventName: { fontSize: 15, fontWeight: '700', color: Colors.primary, marginBottom: 4 },
  eventVenue: { fontSize: 12, color: Colors.textSecondary, marginBottom: 6 },
  eventDesc: { fontSize: 12, color: Colors.textSecondary, lineHeight: 18, marginBottom: 10 },
  regBtn: {
    backgroundColor: Colors.accent,
    borderRadius: Radius.sm,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
  },
  regBtnText: { fontSize: 12, fontWeight: '700', color: Colors.primary },
});
