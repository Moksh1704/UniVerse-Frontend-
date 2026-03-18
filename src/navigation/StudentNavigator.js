import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../utils/theme';
import {
  HomeIcon, FeedIcon, EventsIcon, NavigateIcon,
  AttendanceIcon, CareerIcon, ProfileIcon,
} from '../components/Icons';

import HomeScreen       from '../screens/student/HomeScreen';
import FeedScreen       from '../screens/student/FeedScreen';
import EventsScreen     from '../screens/student/EventsScreen';
import NavigateScreen   from '../screens/student/NavigateScreen';
import AttendanceScreen from '../screens/student/AttendanceScreen';
import CareerScreen     from '../screens/student/CareerScreen';
import ProfileScreen    from '../screens/student/ProfileScreen';

const Tab = createBottomTabNavigator();

const ACTIVE_COLOR   = Colors.accent;
const INACTIVE_COLOR = 'rgba(255,255,255,0.45)';
const TAB_ICON_SIZE  = 22;

const TabIcon = ({ IconComponent, label, focused }) => (
  <View style={styles.tabIconWrap}>
    <IconComponent size={TAB_ICON_SIZE} color={focused ? ACTIVE_COLOR : INACTIVE_COLOR} />
    <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>{label}</Text>
    {focused && <View style={styles.activeDot} />}
  </View>
);

export default function StudentTabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon IconComponent={HomeIcon} label="Home" focused={focused} /> }}
      />
      <Tab.Screen
        name="Feed"
        component={FeedScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon IconComponent={FeedIcon} label="Feed" focused={focused} /> }}
      />
      <Tab.Screen
        name="Events"
        component={EventsScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon IconComponent={EventsIcon} label="Events" focused={focused} /> }}
      />
      <Tab.Screen
        name="Navigate"
        component={NavigateScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon IconComponent={NavigateIcon} label="Map" focused={focused} /> }}
      />
      <Tab.Screen
        name="Attendance"
        component={AttendanceScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon IconComponent={AttendanceIcon} label="Attend" focused={focused} /> }}
      />
      <Tab.Screen
        name="Career"
        component={CareerScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon IconComponent={CareerIcon} label="Career" focused={focused} /> }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
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
  tabIconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 2,
  },
  tabLabel: {
    fontSize: 9,
    color: INACTIVE_COLOR,
    marginTop: 3,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  tabLabelActive: {
    color: ACTIVE_COLOR,
    fontWeight: '700',
  },
  activeDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: ACTIVE_COLOR,
    marginTop: 2,
  },
});
