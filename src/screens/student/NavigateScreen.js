import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TextInput, TouchableOpacity,
  Linking, Modal, Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Radius, Shadows } from '../../utils/theme';
import { Badge, Card, EmptyState, Loader } from '../../components/UI';
import { ScreenHeader } from '../../components/ScreenHeader';
import { MOCK_NAV_SPOTS, MOCK_NAV_POPULAR, mockFetch } from '../../utils/mockData';
import { SearchIcon, MapPinIcon } from '../../components/Icons';

const CATEGORY_CONFIG = {
  academic: { bg: '#DBEAFE', text: '#1D4ED8', label: 'AC' },
  library:  { bg: '#FEF9C3', text: '#92400E', label: 'LB' },
  canteen:  { bg: '#DCFCE7', text: '#166534', label: 'CA' },
  sports:   { bg: '#FCE7F3', text: '#BE185D', label: 'SP' },
  admin:    { bg: Colors.accentLight, text: Colors.primary, label: 'AD' },
  hostel:   { bg: '#F3E8FF', text: '#7C3AED', label: 'HO' },
  lab:      { bg: '#FFF7ED', text: '#C2410C', label: 'LA' },
  general:  { bg: Colors.surface, text: Colors.textSecondary, label: 'GE' },
};

export default function NavigateScreen() {
  const insets = useSafeAreaInsets();
  const [spots, setSpots] = useState([]);
  const [popular, setPopular] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [showDirections, setShowDirections] = useState(false);

  const fetchPopular = useCallback(async () => {
    try {
      const res = await mockFetch(MOCK_NAV_POPULAR);
      setPopular(res.data || []);
      setSpots(res.data || []);
    } catch (e) {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPopular(); }, [fetchPopular]);

  const handleSearch = async (text) => {
    setQuery(text);
    if (!text.trim()) {
      setSpots(popular);
      return;
    }
    setSearching(true);
    await mockFetch(null, 500); // simulate search delay
    const q = text.toLowerCase();
    const results = MOCK_NAV_SPOTS.filter(s =>
      s.location_name.toLowerCase().includes(q) ||
      s.building.toLowerCase().includes(q) ||
      (s.category || '').toLowerCase().includes(q) ||
      (s.room_number || '').toLowerCase().includes(q)
    );
    setSpots(results);
    setSearching(false);
  };

  const openDirections = (spot) => {
    setSelectedSpot(spot);
    setShowDirections(true);
  };

  const openGoogleMaps = (lat, lng) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    Linking.openURL(url).catch(() => Alert.alert('Error', 'Cannot open Google Maps'));
  };

  const SpotCard = ({ spot }) => {
    const cat = spot.category?.toLowerCase() || 'general';
    const config = CATEGORY_CONFIG[cat] || CATEGORY_CONFIG.general;
    return (
      <View style={styles.spotCard}>
        <View style={styles.spotLeft}>
          <View style={[styles.spotIcon, { backgroundColor: config.bg }]}>
            <Text style={[styles.spotIconLabel, { color: config.text }]}>{config.label}</Text>
          </View>
        </View>
        <View style={styles.spotInfo}>
          <View style={styles.spotTopRow}>
            <Text style={styles.spotName}>{spot.location_name}</Text>
            <Badge label={spot.category || 'General'} color={config.bg} textColor={config.text} />
          </View>
          <Text style={styles.spotBuilding}>
            {spot.building}{spot.floor ? ` • Floor ${spot.floor}` : ''}
            {spot.room_number ? ` • Room ${spot.room_number}` : ''}
          </Text>
          <TouchableOpacity style={styles.directionsBtn} onPress={() => openDirections(spot)}>
            <Text style={styles.directionsBtnText}>Get Directions</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <ScreenHeader title="Campus Navigate" subtitle="Find any location" />

      {/* Search bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <SearchIcon size={16} color={Colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            value={query}
            onChangeText={handleSearch}
            placeholder="Search buildings, rooms, spots..."
            placeholderTextColor={Colors.textSecondary}
            returnKeyType="search"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => handleSearch('')}>
              <Text style={styles.clearBtn}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {loading ? <Loader /> : (
        <ScrollView
          contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 90 }]}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.sectionTitle}>
            {query ? `Results for "${query}"` : 'Popular Spots'}
          </Text>

          {searching ? <Loader /> : spots.length === 0
            ? <EmptyState message="No locations found" subMessage="Try a different search" />
            : spots.map((s, i) => <SpotCard key={s.id || i} spot={s} />)
          }
        </ScrollView>
      )}

      {/* Directions Bottom Sheet */}
      <Modal visible={showDirections} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.directionsSheet, { paddingBottom: insets.bottom + 16 }]}>
            <View style={styles.sheetHandle} />
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>{selectedSpot?.location_name}</Text>
              <TouchableOpacity onPress={() => setShowDirections(false)}>
                <Text style={styles.closeBtn}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.spotMeta}>
              <Text style={styles.metaText}>
                {selectedSpot?.building}
                {selectedSpot?.floor ? `  •  Floor ${selectedSpot.floor}` : ''}
                {selectedSpot?.room_number ? `  •  Room ${selectedSpot.room_number}` : ''}
              </Text>
            </View>

            {selectedSpot?.entrance_instruction && (
              <View style={styles.entranceBox}>
                <Text style={styles.entranceLabel}>Entrance</Text>
                <Text style={styles.entranceText}>{selectedSpot.entrance_instruction}</Text>
              </View>
            )}

            {selectedSpot?.indoor_steps && selectedSpot.indoor_steps.length > 0 && (
              <View style={styles.stepsContainer}>
                <Text style={styles.stepsTitle}>Indoor Steps</Text>
                {selectedSpot.indoor_steps.map((step, i) => (
                  <View key={i} style={styles.stepRow}>
                    <View style={styles.stepNumber}>
                      <Text style={styles.stepNumberText}>{i + 1}</Text>
                    </View>
                    <Text style={styles.stepText}>{step}</Text>
                  </View>
                ))}
              </View>
            )}

            {selectedSpot?.latitude && selectedSpot?.longitude && (
              <TouchableOpacity
                style={styles.mapsBtn}
                onPress={() => openGoogleMaps(selectedSpot.latitude, selectedSpot.longitude)}
              >
                <Text style={styles.mapsBtnText}>Open in Google Maps</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    padding: 16,
    backgroundColor: Colors.primary,
    paddingTop: 8,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: Radius.full,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  searchIcon: { fontSize: 16, marginRight: 8 },
  searchInput: { flex: 1, fontSize: 15, color: Colors.textPrimary },
  clearBtn: { fontSize: 14, color: Colors.textSecondary, paddingLeft: 8 },
  scroll: { padding: 16 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 14,
  },
  spotCard: {
    backgroundColor: Colors.background,
    borderRadius: Radius.md,
    marginBottom: 12,
    borderWidth: 0.5,
    borderColor: Colors.border,
    flexDirection: 'row',
    padding: 14,
    gap: 12,
    ...Shadows.card,
  },
  spotLeft: { justifyContent: 'flex-start', paddingTop: 2 },
  spotIcon: {
    width: 48,
    height: 48,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spotIconLabel: { fontSize: 12, fontWeight: '800', letterSpacing: 0.5 },
  spotInfo: { flex: 1 },
  spotTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 },
  spotName: { fontSize: 15, fontWeight: '700', color: Colors.primary, flex: 1, marginRight: 8 },
  spotBuilding: { fontSize: 12, color: Colors.textSecondary, marginBottom: 10 },
  directionsBtn: {
    backgroundColor: Colors.accent,
    borderRadius: Radius.sm,
    paddingVertical: 7,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
  },
  directionsBtnText: { fontSize: 12, fontWeight: '700', color: Colors.primary },
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.45)' },
  directionsSheet: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '75%',
  },
  sheetHandle: {
    width: 40, height: 4, backgroundColor: Colors.border,
    borderRadius: 2, alignSelf: 'center', marginBottom: 16,
  },
  sheetHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 12,
  },
  sheetTitle: { fontSize: 18, fontWeight: '800', color: Colors.primary, flex: 1 },
  closeBtn: { fontSize: 18, color: Colors.textSecondary, padding: 4 },
  spotMeta: {
    backgroundColor: Colors.surface, borderRadius: Radius.sm,
    padding: 12, marginBottom: 14,
  },
  metaText: { fontSize: 13, color: Colors.primary, fontWeight: '500' },
  entranceBox: {
    backgroundColor: Colors.accentLight, borderRadius: Radius.sm,
    padding: 12, marginBottom: 14, borderLeftWidth: 3, borderLeftColor: Colors.accent,
  },
  entranceLabel: { fontSize: 11, fontWeight: '700', color: Colors.accent, marginBottom: 4, letterSpacing: 0.5 },
  entranceText: { fontSize: 13, color: Colors.primary, lineHeight: 19 },
  stepsContainer: { marginBottom: 16 },
  stepsTitle: { fontSize: 14, fontWeight: '700', color: Colors.primary, marginBottom: 10 },
  stepRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10, gap: 10 },
  stepNumber: {
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  stepNumberText: { fontSize: 12, fontWeight: '700', color: Colors.accent },
  stepText: { fontSize: 13, color: Colors.textPrimary, flex: 1, lineHeight: 19 },
  mapsBtn: {
    backgroundColor: Colors.accent, borderRadius: Radius.md,
    paddingVertical: 14, alignItems: 'center',
  },
  mapsBtnText: { fontSize: 15, fontWeight: '700', color: Colors.primary },
});
