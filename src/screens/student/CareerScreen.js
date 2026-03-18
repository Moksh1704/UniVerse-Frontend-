import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TextInput, TouchableOpacity,
  Modal,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Radius, Shadows } from '../../utils/theme';
import { Badge, EmptyState, Loader } from '../../components/UI';
import { ScreenHeader } from '../../components/ScreenHeader';
import { MOCK_CAREERS, mockFetch } from '../../utils/mockData';

const FILTERS = ['All', 'Tech', 'AI', 'Data', 'Cloud', 'Cybersecurity', 'Non-Tech'];

const DOMAIN_CONFIG = {
  tech:         { bg: '#DBEAFE', text: '#1D4ED8' },
  ai:           { bg: '#F3E8FF', text: '#7C3AED' },
  data:         { bg: '#DCFCE7', text: '#166534' },
  cloud:        { bg: '#E0F2FE', text: '#075985' },
  cybersecurity:{ bg: '#FEE2E2', text: '#DC2626' },
  'non-tech':   { bg: '#FEF9C3', text: '#92400E' },
  default:      { bg: Colors.accentLight, text: Colors.primary },
};

const DEMAND_CONFIG = {
  high:   { color: Colors.success,       bg: '#DCFCE7', label: 'High Demand' },
  medium: { color: Colors.warning,       bg: '#FEF9C3', label: 'Medium Demand' },
  low:    { color: Colors.textSecondary, bg: Colors.surface, label: 'Low Demand' },
};

export default function CareerScreen() {
  const insets = useSafeAreaInsets();
  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All');
  const [selected, setSelected] = useState(null);

  const fetchCareers = useCallback(async (q = '', domain = '') => {
    try {
      await mockFetch(null, 800);
      let results = MOCK_CAREERS;
      if (q.trim()) {
        const lq = q.toLowerCase();
        results = results.filter(c =>
          c.title.toLowerCase().includes(lq) ||
          c.domain.toLowerCase().includes(lq) ||
          (c.tech_stack || []).some(t => t.toLowerCase().includes(lq)) ||
          c.description.toLowerCase().includes(lq)
        );
      }
      if (domain && domain !== 'All') {
        results = results.filter(c =>
          c.domain.toLowerCase() === domain.toLowerCase()
        );
      }
      setCareers(results);
    } catch (e) { /* ignore */ }
    finally {
      setLoading(false);
      setSearching(false);
    }
  }, []);

  const debounceRef = useRef(null);
  useEffect(() => { fetchCareers(); }, [fetchCareers]);

  const handleSearch = (text) => {
    setQuery(text);
    setSearching(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchCareers(text, filter), 400);
  };

  const handleFilter = (f) => {
    setFilter(f);
    setSearching(true);
    fetchCareers(query, f);
  };

  const getDomainConfig = (domain) => {
    const key = domain?.toLowerCase();
    return DOMAIN_CONFIG[key] || DOMAIN_CONFIG.default;
  };

  /* ── Career Card — styled like Events card ──────────────────────────────── */
  const CareerCard = ({ career }) => {
    const domainCfg = getDomainConfig(career.domain);
    const demandCfg = DEMAND_CONFIG[career.market_demand?.toLowerCase()] || DEMAND_CONFIG.low;
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => setSelected(career)}
        activeOpacity={0.85}
      >
        {/* Left accent strip — mirrors the date-badge column in Events */}
        <View style={styles.cardLeft}>
          <Text style={styles.cardLeftDomain} numberOfLines={2}>
            {career.domain?.toUpperCase()}
          </Text>
        </View>

        {/* Body */}
        <View style={styles.cardBody}>
          <Badge
            label={career.domain}
            color={domainCfg.bg}
            textColor={domainCfg.text}
            style={{ marginBottom: 8 }}
          />
          <Text style={styles.careerTitle}>{career.title}</Text>
          <Text style={styles.careerDesc} numberOfLines={2}>{career.description}</Text>

          {/* Key details row */}
          <View style={styles.detailsRow}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>SALARY</Text>
              <Text style={styles.detailValue}>
                {'\u20B9'}{(career.salary_min / 100000).toFixed(1)}L – {'\u20B9'}{(career.salary_max / 100000).toFixed(1)}L
              </Text>
            </View>
            <View style={styles.detailDivider} />
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>DEMAND</Text>
              <Text style={[styles.detailValue, { color: demandCfg.color }]}>
                {career.market_demand || 'N/A'}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  /* ── Detail Modal ────────────────────────────────────────────────────────── */
  const DetailModal = () => {
    if (!selected) return null;
    const domainCfg = getDomainConfig(selected.domain);
    const demandCfg = DEMAND_CONFIG[selected.market_demand?.toLowerCase()] || DEMAND_CONFIG.low;
    const techStack = selected.tech_stack || [];

    return (
      <Modal visible={!!selected} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.detailSheet, { paddingBottom: insets.bottom + 16 }]}>
            <View style={styles.sheetHandle} />
            <ScrollView showsVerticalScrollIndicator={false}>

              {/* Header */}
              <View style={[styles.detailHeader, { backgroundColor: domainCfg.bg }]}>
                <View style={styles.detailTitleBlock}>
                  <Text style={[styles.detailTitle, { color: domainCfg.text }]}>{selected.title}</Text>
                  <Badge label={selected.domain} color={Colors.primary} textColor={Colors.accent} />
                </View>
                <TouchableOpacity onPress={() => setSelected(null)} style={styles.closeBtn}>
                  <Text style={styles.closeBtnText}>X</Text>
                </TouchableOpacity>
              </View>

              {/* Salary + Demand */}
              <View style={styles.detailMetaRow}>
                <View style={styles.detailMetaItem}>
                  <Text style={styles.detailMetaLabel}>SALARY RANGE</Text>
                  <Text style={styles.detailMetaValue}>
                    {'\u20B9'}{(selected.salary_min / 100000).toFixed(1)}L – {'\u20B9'}{(selected.salary_max / 100000).toFixed(1)}L/yr
                  </Text>
                </View>
                <View style={styles.detailMetaDivider} />
                <View style={styles.detailMetaItem}>
                  <Text style={styles.detailMetaLabel}>MARKET DEMAND</Text>
                  <Text style={[styles.detailMetaValue, { color: demandCfg.color }]}>
                    {selected.market_demand || '—'}
                  </Text>
                </View>
              </View>

              {selected.description && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>About this Role</Text>
                  <Text style={styles.sectionBody}>{selected.description}</Text>
                </View>
              )}
              {selected.requirements && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Requirements</Text>
                  <Text style={styles.sectionBody}>{selected.requirements}</Text>
                </View>
              )}
              {techStack.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Tech Stack</Text>
                  <View style={styles.chipRow}>
                    {techStack.map((t, i) => (
                      <View key={i} style={styles.techChip}>
                        <Text style={styles.techChipText}>{t}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
              {selected.future_scope && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Future Scope</Text>
                  <Text style={styles.sectionBody}>{selected.future_scope}</Text>
                </View>
              )}
              {selected.benefits && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Benefits</Text>
                  <Text style={styles.sectionBody}>{selected.benefits}</Text>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <ScreenHeader title="Career Explorer" subtitle="Discover your path" />

      {/* Search — same style as Events */}
      <View style={styles.searchWrap}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>&#x2315;</Text>
          <TextInput
            style={styles.searchInput}
            value={query}
            onChangeText={handleSearch}
            placeholder="Search roles, skills, domain..."
            placeholderTextColor={Colors.textSecondary}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => handleSearch('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Text style={styles.clearIcon}>X</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filters — same pill style as Events */}
      <View style={styles.filterBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
          {FILTERS.map(f => (
            <TouchableOpacity
              key={f}
              style={[styles.filterPill, filter === f && styles.filterPillActive]}
              onPress={() => handleFilter(f)}
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
        >
          {searching ? <Loader /> : careers.length === 0
            ? <EmptyState message="No careers found" subMessage="Try a different search" />
            : careers.map((c, i) => <CareerCard key={c.id || i} career={c} />)
          }
        </ScrollView>
      )}

      <DetailModal />
    </View>
  );
}

const styles = StyleSheet.create({
  /* Search — mirrors EventsScreen */
  searchWrap: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16, paddingTop: 4, paddingBottom: 12,
  },
  searchBar: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.background, borderRadius: Radius.sm,
    paddingHorizontal: 14, paddingVertical: 10,
  },
  searchIcon: { fontSize: 16, color: Colors.textSecondary, marginRight: 8 },
  searchInput: { flex: 1, fontSize: 14, color: Colors.textPrimary },
  clearIcon: { fontSize: 13, color: Colors.textSecondary, paddingLeft: 8 },

  /* Filters — mirrors EventsScreen */
  filterBar: {
    backgroundColor: Colors.background,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
    paddingVertical: 10,
  },
  filterRow: { paddingHorizontal: 16, gap: 8 },
  filterPill: {
    paddingHorizontal: 18, paddingVertical: 8,
    borderRadius: Radius.full, backgroundColor: Colors.background,
    borderWidth: 1.5, borderColor: Colors.primary,
  },
  filterPillActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  filterText: { fontSize: 13, fontWeight: '700', color: Colors.primary },
  filterTextActive: { color: Colors.accent },

  scroll: { padding: 16 },

  /* Card — mirrors Events card layout */
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
    padding: 8,
  },
  cardLeftDomain: {
    fontSize: 9, fontWeight: '800',
    color: Colors.accent,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  cardBody: { flex: 1, padding: 14 },
  careerTitle: { fontSize: 15, fontWeight: '700', color: Colors.primary, marginBottom: 4 },
  careerDesc: { fontSize: 12, color: Colors.textSecondary, lineHeight: 18, marginBottom: 10 },

  detailsRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.xs, padding: 8,
  },
  detailItem: { flex: 1, alignItems: 'center' },
  detailLabel: {
    fontSize: 9, fontWeight: '700', color: Colors.textSecondary,
    letterSpacing: 0.5, marginBottom: 2,
  },
  detailValue: { fontSize: 12, fontWeight: '700', color: Colors.primary },
  detailDivider: { width: 1, height: 28, backgroundColor: Colors.border, marginHorizontal: 4 },

  /* Modal */
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.45)' },
  detailSheet: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '90%',
  },
  sheetHandle: {
    width: 40, height: 4, backgroundColor: Colors.border,
    borderRadius: 2, alignSelf: 'center', marginVertical: 12,
  },
  detailHeader: {
    flexDirection: 'row', alignItems: 'center', padding: 20, gap: 14,
    marginHorizontal: 16, borderRadius: Radius.lg, marginBottom: 16,
  },
  detailTitleBlock: { flex: 1, gap: 8 },
  detailTitle: { fontSize: 18, fontWeight: '800' },
  closeBtn: { padding: 4 },
  closeBtnText: { fontSize: 16, color: Colors.textSecondary, fontWeight: '700' },
  detailMetaRow: {
    flexDirection: 'row', backgroundColor: Colors.surface,
    marginHorizontal: 16, borderRadius: Radius.md,
    padding: 16, marginBottom: 16, borderWidth: 0.5, borderColor: Colors.border,
  },
  detailMetaItem: { flex: 1, alignItems: 'center' },
  detailMetaLabel: {
    fontSize: 10, fontWeight: '700', color: Colors.textSecondary,
    letterSpacing: 0.5, marginBottom: 6,
  },
  detailMetaValue: { fontSize: 14, fontWeight: '800', color: Colors.primary, textAlign: 'center' },
  detailMetaDivider: { width: 1, backgroundColor: Colors.border, marginHorizontal: 8 },
  section: { marginHorizontal: 16, marginBottom: 18 },
  sectionTitle: {
    fontSize: 14, fontWeight: '800', color: Colors.primary,
    marginBottom: 8, letterSpacing: 0.2,
  },
  sectionBody: { fontSize: 13, color: Colors.textSecondary, lineHeight: 20 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  techChip: {
    paddingHorizontal: 12, paddingVertical: 6,
    backgroundColor: Colors.primary, borderRadius: Radius.full,
  },
  techChipText: { fontSize: 12, fontWeight: '600', color: Colors.accent },
});
