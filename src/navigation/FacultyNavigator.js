import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../utils/theme';
import { TimetableIcon, AttendanceIcon, ProfileIcon } from '../components/Icons';

import TimetableScreen          from '../screens/faculty/TimetableScreen';
import FacultyAttendanceScreen  from '../screens/faculty/AttendanceScreen';
import FacultyProfileScreen     from '../screens/faculty/ProfileScreen';

const Tab = createBottomTabNavigator();

const TAB_ICON_SIZE  = 22;
const ACTIVE_COLOR   = Colors.accent;
const INACTIVE_COLOR = 'rgba(255,255,255,0.45)';

const TabIcon = ({ IconComponent, label, focused }) => (
  <View style={styles.tabIconWrap}>
    <IconComponent size={TAB_ICON_SIZE} color={focused ? ACTIVE_COLOR : INACTIVE_COLOR} />
    <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>{label}</Text>
    {focused && <View style={styles.activeDot} />}
  </View>
);

export default function FacultyTabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Timetable"
      screenOptions={{ headerShown: false, tabBarStyle: styles.tabBar, tabBarShowLabel: false }}
    >
      <Tab.Screen
        name="Timetable"
        component={TimetableScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon IconComponent={TimetableIcon} label="Timetable" focused={focused} /> }}
      />
      <Tab.Screen
        name="FacultyAttendance"
        component={FacultyAttendanceScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon IconComponent={AttendanceIcon} label="Attendance" focused={focused} /> }}
      />
      <Tab.Screen
        name="FacultyProfile"
        component={FacultyProfileScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon IconComponent={ProfileIcon} label="Profile" focused={focused} /> }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.primary,
    borderTopWidth: 0,
    height: 68,
    paddingBottom: 6,
    paddingTop: 6,
    elevation: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
  },
  tabIconWrap: { alignItems: 'center', justifyContent: 'center', paddingTop: 2 },
  tabLabel: { fontSize: 9, color: INACTIVE_COLOR, marginTop: 3, fontWeight: '500', letterSpacing: 0.3 },
  tabLabelActive: { color: ACTIVE_COLOR, fontWeight: '700' },
  activeDot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: ACTIVE_COLOR, marginTop: 2 },
});
