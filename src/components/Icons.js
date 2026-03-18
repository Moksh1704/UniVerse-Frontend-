import React from 'react';
import { View } from 'react-native';
import Svg, {
  Path, Circle, Rect, Line, Polyline, Polygon,
  G, Defs, LinearGradient, Stop,
} from 'react-native-svg';

// Base icon wrapper
const Icon = ({ size = 24, color = '#0F172A', children, style }) => (
  <View style={style}>
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
      {children}
    </Svg>
  </View>
);

// ── Tab Bar Icons ─────────────────────────────────────────────────────────────

export const HomeIcon = ({ size, color }) => (
  <Icon size={size} color={color}>
    <Path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
    <Path d="M9 21V12h6v9" />
  </Icon>
);

export const FeedIcon = ({ size, color }) => (
  <Icon size={size} color={color}>
    <Rect x="3" y="3" width="18" height="18" rx="2" />
    <Line x1="3" y1="9" x2="21" y2="9" />
    <Line x1="9" y1="21" x2="9" y2="9" />
  </Icon>
);

export const EventsIcon = ({ size, color }) => (
  <Icon size={size} color={color}>
    <Rect x="3" y="4" width="18" height="18" rx="2" />
    <Line x1="16" y1="2" x2="16" y2="6" />
    <Line x1="8" y1="2" x2="8" y2="6" />
    <Line x1="3" y1="10" x2="21" y2="10" />
    <Path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" strokeWidth={2.5} />
  </Icon>
);

export const NavigateIcon = ({ size, color }) => (
  <Icon size={size} color={color}>
    <Circle cx="12" cy="11" r="4" />
    <Path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
  </Icon>
);

export const AttendanceIcon = ({ size, color }) => (
  <Icon size={size} color={color}>
    <Path d="M9 11l3 3L22 4" />
    <Path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
  </Icon>
);

export const CareerIcon = ({ size, color }) => (
  <Icon size={size} color={color}>
    <Rect x="2" y="7" width="20" height="14" rx="2" />
    <Path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
    <Line x1="12" y1="12" x2="12" y2="16" />
    <Line x1="10" y1="14" x2="14" y2="14" />
  </Icon>
);

export const ProfileIcon = ({ size, color }) => (
  <Icon size={size} color={color}>
    <Circle cx="12" cy="8" r="4" />
    <Path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
  </Icon>
);

export const TimetableIcon = ({ size, color }) => (
  <Icon size={size} color={color}>
    <Rect x="3" y="4" width="18" height="18" rx="2" />
    <Line x1="16" y1="2" x2="16" y2="6" />
    <Line x1="8" y1="2" x2="8" y2="6" />
    <Line x1="3" y1="10" x2="21" y2="10" />
    <Line x1="8" y1="14" x2="8" y2="14" strokeWidth={2.5} />
    <Line x1="12" y1="14" x2="16" y2="14" />
    <Line x1="8" y1="18" x2="8" y2="18" strokeWidth={2.5} />
    <Line x1="12" y1="18" x2="16" y2="18" />
  </Icon>
);

// ── UI Icons ──────────────────────────────────────────────────────────────────

export const BackIcon = ({ size = 22, color }) => (
  <Icon size={size} color={color}>
    <Path d="M19 12H5M12 5l-7 7 7 7" />
  </Icon>
);

export const SearchIcon = ({ size = 20, color }) => (
  <Icon size={size} color={color}>
    <Circle cx="11" cy="11" r="8" />
    <Line x1="21" y1="21" x2="16.65" y2="16.65" />
  </Icon>
);

export const CloseIcon = ({ size = 18, color }) => (
  <Icon size={size} color={color}>
    <Line x1="18" y1="6" x2="6" y2="18" />
    <Line x1="6" y1="6" x2="18" y2="18" />
  </Icon>
);

export const PlusIcon = ({ size = 24, color }) => (
  <Icon size={size} color={color}>
    <Line x1="12" y1="5" x2="12" y2="19" />
    <Line x1="5" y1="12" x2="19" y2="12" />
  </Icon>
);

export const HeartIcon = ({ size = 20, color, filled }) => (
  <Icon size={size} color={color}>
    <Path
      d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"
      fill={filled ? color : 'none'}
    />
  </Icon>
);

export const CommentIcon = ({ size = 20, color }) => (
  <Icon size={size} color={color}>
    <Path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
  </Icon>
);

export const TrashIcon = ({ size = 18, color }) => (
  <Icon size={size} color={color}>
    <Polyline points="3 6 5 6 21 6" />
    <Path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2" />
  </Icon>
);

export const SendIcon = ({ size = 18, color }) => (
  <Icon size={size} color={color}>
    <Line x1="22" y1="2" x2="11" y2="13" />
    <Polygon points="22 2 15 22 11 13 2 9 22 2" />
  </Icon>
);

export const EditIcon = ({ size = 18, color }) => (
  <Icon size={size} color={color}>
    <Path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
    <Path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
  </Icon>
);

export const ChevronDownIcon = ({ size = 16, color }) => (
  <Icon size={size} color={color}>
    <Polyline points="6 9 12 15 18 9" />
  </Icon>
);

export const ChevronUpIcon = ({ size = 16, color }) => (
  <Icon size={size} color={color}>
    <Polyline points="18 15 12 9 6 15" />
  </Icon>
);

export const ChevronRightIcon = ({ size = 16, color }) => (
  <Icon size={size} color={color}>
    <Polyline points="9 18 15 12 9 6" />
  </Icon>
);

export const MapPinIcon = ({ size = 18, color }) => (
  <Icon size={size} color={color}>
    <Circle cx="12" cy="11" r="3" />
    <Path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
  </Icon>
);

export const CalendarIcon = ({ size = 16, color }) => (
  <Icon size={size} color={color}>
    <Rect x="3" y="4" width="18" height="18" rx="2" />
    <Line x1="16" y1="2" x2="16" y2="6" />
    <Line x1="8" y1="2" x2="8" y2="6" />
    <Line x1="3" y1="10" x2="21" y2="10" />
  </Icon>
);

export const UploadIcon = ({ size = 22, color }) => (
  <Icon size={size} color={color}>
    <Path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
    <Polyline points="17 8 12 3 7 8" />
    <Line x1="12" y1="3" x2="12" y2="15" />
  </Icon>
);

export const LogoutIcon = ({ size = 18, color }) => (
  <Icon size={size} color={color}>
    <Path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
    <Polyline points="16 17 21 12 16 7" />
    <Line x1="21" y1="12" x2="9" y2="12" />
  </Icon>
);

export const MessageIcon = ({ size = 18, color }) => (
  <Icon size={size} color={color}>
    <Path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
  </Icon>
);

export const ShieldIcon = ({ size = 18, color }) => (
  <Icon size={size} color={color}>
    <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </Icon>
);

export const BookIcon = ({ size = 18, color }) => (
  <Icon size={size} color={color}>
    <Path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
    <Path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
  </Icon>
);

export const RefreshIcon = ({ size = 18, color }) => (
  <Icon size={size} color={color}>
    <Polyline points="23 4 23 10 17 10" />
    <Path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" />
  </Icon>
);
