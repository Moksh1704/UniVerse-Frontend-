// UniVerse Design System — Deep Midnight Theme
export const Colors = {
  // Core palette
  primary:        '#0F172A',   // Deep midnight navy — headers, nav bar, buttons
  primaryLight:   '#1E293B',   // Slightly lighter navy — cards, surfaces
  accent:         '#F59E0B',   // Warm amber gold — CTAs, active states, badges
  accentSoft:     '#FEF3C7',   // Very light amber — badge backgrounds
  
  // Backgrounds
  background:     '#FFFFFF',
  surface:        '#F8FAFC',   // Cool off-white for cards
  surfaceDark:    '#F1F5F9',   // Slightly darker surface

  // Text
  textPrimary:    '#0F172A',   // Near black
  textSecondary:  '#64748B',   // Medium slate
  textMuted:      '#94A3B8',   // Light slate
  textWhite:      '#FFFFFF',
  textOnAccent:   '#0F172A',   // Dark text on gold

  // Semantic
  error:          '#EF4444',
  success:        '#10B981',
  warning:        '#F59E0B',
  info:           '#3B82F6',

  // Borders & dividers
  border:         '#E2E8F0',
  borderStrong:   '#CBD5E1',

  // Misc
  accentLight:    '#FEF3C7',
  navyFaint:      'rgba(15,23,42,0.06)',
  overlay:        'rgba(15,23,42,0.6)',
};

export const Shadows = {
  card: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  strong: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.14,
    shadowRadius: 16,
    elevation: 6,
  },
  accent: {
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
};

export const Radius = {
  xs:   4,
  sm:   8,
  md:   12,
  lg:   16,
  xl:   24,
  full: 999,
};
