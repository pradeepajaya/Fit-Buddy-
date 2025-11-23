import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../contexts/ThemeContext';
import type { ThemeMode } from '../contexts/ThemeContext';

interface UserProfile {
  name: string;
  email: string;
  age: string;
  weight: string;
  height: string;
  goal: string;
}

const ProfileScreen = () => {
  const { theme, themeMode, setThemeMode, isDark } = useTheme();
  const [profile, setProfile] = useState<UserProfile>({
    name: 'Fitness Buddy',
    email: 'buddy@fitbuddy.com',
    age: '25',
    weight: '70',
    height: '175',
    goal: 'Build muscle and stay fit',
  });
  
  const [editMode, setEditMode] = useState(false);
  const [showThemeModal, setShowThemeModal] = useState(false);
  
  // Settings state
  const [waterReminders, setWaterReminders] = useState(true);
  const [exerciseReminders, setExerciseReminders] = useState(true);
  const [weeklyReports, setWeeklyReports] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    loadProfile();
    loadSettings();
  }, []);

  const loadProfile = async () => {
    try {
      const stored = await AsyncStorage.getItem('userProfile');
      if (stored) {
        setProfile(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const loadSettings = async () => {
    try {
      const settings = await AsyncStorage.getItem('appSettings');
      if (settings) {
        const parsed = JSON.parse(settings);
        setWaterReminders(parsed.waterReminders ?? true);
        setExerciseReminders(parsed.exerciseReminders ?? true);
        setWeeklyReports(parsed.weeklyReports ?? true);
        setSoundEnabled(parsed.soundEnabled ?? true);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const saveProfile = async () => {
    try {
      await AsyncStorage.setItem('userProfile', JSON.stringify(profile));
      setEditMode(false);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'Failed to save profile');
    }
  };

  const saveSettings = async (key: string, value: boolean) => {
    try {
      const settings = {
        waterReminders,
        exerciseReminders,
        weeklyReports,
        soundEnabled,
        [key]: value,
      };
      await AsyncStorage.setItem('appSettings', JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const handleThemeChange = (mode: ThemeMode) => {
    setThemeMode(mode);
    setShowThemeModal(false);
  };

  const stats = [
    { label: 'Workouts', value: '24', icon: 'barbell', gradient: ['#3b82f6', '#2563eb'] },
    { label: 'Streak', value: '12d', icon: 'flame', gradient: ['#f97316', '#ef4444'] },
    { label: 'Calories', value: '3.2k', icon: 'fitness', gradient: ['#10b981', '#059669'] },
    { label: 'Water', value: '15L', icon: 'water', gradient: ['#06b6d4', '#0891b2'] },
  ];

  const styles = createStyles(theme);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.themeButton}
            onPress={() => setShowThemeModal(true)}
          >
            <Icon name={isDark ? 'moon' : 'sunny'} size={24} color={theme.primary} />
          </TouchableOpacity>
          <Text style={styles.title}>Profile</Text>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => (editMode ? saveProfile() : setEditMode(true))}
          >
            <Icon
              name={editMode ? 'checkmark' : 'create'}
              size={24}
              color={theme.primary}
            />
          </TouchableOpacity>
        </View>

        {/* Profile Card */}
        <LinearGradient
          colors={['#3b82f6', '#8b5cf6']}
          style={styles.profileCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.avatarContainer}>
            <LinearGradient
              colors={['#ffffff', '#e0e7ff']}
              style={styles.avatar}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Icon name="person" size={48} color="#3b82f6" />
            </LinearGradient>
            <TouchableOpacity style={styles.avatarEditButton}>
              <Icon name="camera" size={16} color="#ffffff" />
            </TouchableOpacity>
          </View>
          <Text style={styles.profileName}>{profile.name}</Text>
          <Text style={styles.profileEmail}>{profile.email}</Text>
        </LinearGradient>

        {/* Quick Stats */}
        <View style={styles.statsGrid}>
          {stats.map((stat, index) => (
            <LinearGradient
              key={index}
              colors={stat.gradient}
              style={styles.statCard}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Icon name={stat.icon} size={24} color="#ffffff" />
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </LinearGradient>
          ))}
        </View>

        {/* Profile Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          
          <View style={styles.infoCard}>
            <View style={styles.infoItem}>
              <View style={styles.infoLeft}>
                <View style={styles.infoIcon}>
                  <Icon name="person-outline" size={20} color={theme.primary} />
                </View>
                <Text style={styles.infoLabel}>Full Name</Text>
              </View>
              {editMode ? (
                <TextInput
                  style={styles.infoInput}
                  value={profile.name}
                  onChangeText={(text) => setProfile({ ...profile, name: text })}
                  placeholder="Enter name"
                  placeholderTextColor={theme.textTertiary}
                />
              ) : (
                <Text style={styles.infoValue}>{profile.name}</Text>
              )}
            </View>

            <View style={styles.divider} />

            <View style={styles.infoItem}>
              <View style={styles.infoLeft}>
                <View style={styles.infoIcon}>
                  <Icon name="mail-outline" size={20} color={theme.primary} />
                </View>
                <Text style={styles.infoLabel}>Email</Text>
              </View>
              {editMode ? (
                <TextInput
                  style={styles.infoInput}
                  value={profile.email}
                  onChangeText={(text) => setProfile({ ...profile, email: text })}
                  placeholder="Enter email"
                  placeholderTextColor={theme.textTertiary}
                  keyboardType="email-address"
                />
              ) : (
                <Text style={styles.infoValue}>{profile.email}</Text>
              )}
            </View>

            <View style={styles.divider} />

            <View style={styles.infoItem}>
              <View style={styles.infoLeft}>
                <View style={styles.infoIcon}>
                  <Icon name="calendar-outline" size={20} color={theme.primary} />
                </View>
                <Text style={styles.infoLabel}>Age</Text>
              </View>
              {editMode ? (
                <TextInput
                  style={styles.infoInput}
                  value={profile.age}
                  onChangeText={(text) => setProfile({ ...profile, age: text })}
                  placeholder="Age"
                  placeholderTextColor={theme.textTertiary}
                  keyboardType="numeric"
                />
              ) : (
                <Text style={styles.infoValue}>{profile.age} years</Text>
              )}
            </View>

            <View style={styles.divider} />

            <View style={styles.infoItem}>
              <View style={styles.infoLeft}>
                <View style={styles.infoIcon}>
                  <Icon name="fitness-outline" size={20} color={theme.primary} />
                </View>
                <Text style={styles.infoLabel}>Weight</Text>
              </View>
              {editMode ? (
                <TextInput
                  style={styles.infoInput}
                  value={profile.weight}
                  onChangeText={(text) => setProfile({ ...profile, weight: text })}
                  placeholder="Weight"
                  placeholderTextColor={theme.textTertiary}
                  keyboardType="numeric"
                />
              ) : (
                <Text style={styles.infoValue}>{profile.weight} kg</Text>
              )}
            </View>

            <View style={styles.divider} />

            <View style={styles.infoItem}>
              <View style={styles.infoLeft}>
                <View style={styles.infoIcon}>
                  <Icon name="resize-outline" size={20} color={theme.primary} />
                </View>
                <Text style={styles.infoLabel}>Height</Text>
              </View>
              {editMode ? (
                <TextInput
                  style={styles.infoInput}
                  value={profile.height}
                  onChangeText={(text) => setProfile({ ...profile, height: text })}
                  placeholder="Height"
                  placeholderTextColor={theme.textTertiary}
                  keyboardType="numeric"
                />
              ) : (
                <Text style={styles.infoValue}>{profile.height} cm</Text>
              )}
            </View>

            <View style={styles.divider} />

            <View style={styles.infoItem}>
              <View style={styles.infoLeft}>
                <View style={styles.infoIcon}>
                  <Icon name="trophy-outline" size={20} color={theme.primary} />
                </View>
                <Text style={styles.infoLabel}>Goal</Text>
              </View>
              {editMode ? (
                <TextInput
                  style={[styles.infoInput, { flex: 1, textAlign: 'right' }]}
                  value={profile.goal}
                  onChangeText={(text) => setProfile({ ...profile, goal: text })}
                  placeholder="Your goal"
                  placeholderTextColor={theme.textTertiary}
                  multiline
                />
              ) : (
                <Text style={[styles.infoValue, { flex: 1, textAlign: 'right' }]}>
                  {profile.goal}
                </Text>
              )}
            </View>
          </View>
        </View>

        {/* Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          
          <View style={styles.settingsCard}>
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: '#dbeafe' }]}>
                  <Icon name="notifications" size={20} color="#3b82f6" />
                </View>
                <View style={styles.settingTextContainer}>
                  <Text style={styles.settingTitle}>Water Reminders</Text>
                  <Text style={styles.settingDescription}>Get reminded to drink water</Text>
                </View>
              </View>
              <Switch
                value={waterReminders}
                onValueChange={(value) => {
                  setWaterReminders(value);
                  saveSettings('waterReminders', value);
                }}
                trackColor={{ false: theme.border, true: theme.primary }}
                thumbColor="#ffffff"
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: '#fed7aa' }]}>
                  <Icon name="barbell" size={20} color="#f97316" />
                </View>
                <View style={styles.settingTextContainer}>
                  <Text style={styles.settingTitle}>Exercise Reminders</Text>
                  <Text style={styles.settingDescription}>Daily workout notifications</Text>
                </View>
              </View>
              <Switch
                value={exerciseReminders}
                onValueChange={(value) => {
                  setExerciseReminders(value);
                  saveSettings('exerciseReminders', value);
                }}
                trackColor={{ false: theme.border, true: theme.primary }}
                thumbColor="#ffffff"
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: '#d1fae5' }]}>
                  <Icon name="stats-chart" size={20} color="#10b981" />
                </View>
                <View style={styles.settingTextContainer}>
                  <Text style={styles.settingTitle}>Weekly Reports</Text>
                  <Text style={styles.settingDescription}>Get progress summaries</Text>
                </View>
              </View>
              <Switch
                value={weeklyReports}
                onValueChange={(value) => {
                  setWeeklyReports(value);
                  saveSettings('weeklyReports', value);
                }}
                trackColor={{ false: theme.border, true: theme.primary }}
                thumbColor="#ffffff"
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: '#e9d5ff' }]}>
                  <Icon name="volume-high" size={20} color="#8b5cf6" />
                </View>
                <View style={styles.settingTextContainer}>
                  <Text style={styles.settingTitle}>Sound Effects</Text>
                  <Text style={styles.settingDescription}>Play sounds for actions</Text>
                </View>
              </View>
              <Switch
                value={soundEnabled}
                onValueChange={(value) => {
                  setSoundEnabled(value);
                  saveSettings('soundEnabled', value);
                }}
                trackColor={{ false: theme.border, true: theme.primary }}
                thumbColor="#ffffff"
              />
            </View>
          </View>
        </View>

        {/* More Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>More</Text>
          
          <View style={styles.menuCard}>
            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuLeft}>
                <View style={[styles.menuIcon, { backgroundColor: '#dbeafe' }]}>
                  <Icon name="shield-checkmark" size={20} color="#3b82f6" />
                </View>
                <Text style={styles.menuText}>Privacy Policy</Text>
              </View>
              <Icon name="chevron-forward" size={20} color={theme.textTertiary} />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuLeft}>
                <View style={[styles.menuIcon, { backgroundColor: '#fed7aa' }]}>
                  <Icon name="document-text" size={20} color="#f97316" />
                </View>
                <Text style={styles.menuText}>Terms of Service</Text>
              </View>
              <Icon name="chevron-forward" size={20} color={theme.textTertiary} />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuLeft}>
                <View style={[styles.menuIcon, { backgroundColor: '#d1fae5' }]}>
                  <Icon name="help-circle" size={20} color="#10b981" />
                </View>
                <Text style={styles.menuText}>Help & Support</Text>
              </View>
              <Icon name="chevron-forward" size={20} color={theme.textTertiary} />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuLeft}>
                <View style={[styles.menuIcon, { backgroundColor: '#e9d5ff' }]}>
                  <Icon name="information-circle" size={20} color="#8b5cf6" />
                </View>
                <Text style={styles.menuText}>About</Text>
              </View>
              <Icon name="chevron-forward" size={20} color={theme.textTertiary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton}>
          <LinearGradient
            colors={['#ef4444', '#dc2626']}
            style={styles.logoutGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Icon name="log-out-outline" size={24} color="#ffffff" />
            <Text style={styles.logoutText}>Log Out</Text>
          </LinearGradient>
        </TouchableOpacity>

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Theme Selection Modal */}
      <Modal
        visible={showThemeModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowThemeModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowThemeModal(false)}
        >
          <View style={styles.themeModal}>
            <Text style={styles.themeModalTitle}>Choose Theme</Text>
            
            <TouchableOpacity
              style={[
                styles.themeOption,
                themeMode === 'light' && styles.themeOptionActive,
              ]}
              onPress={() => handleThemeChange('light')}
            >
              <Icon
                name="sunny"
                size={24}
                color={themeMode === 'light' ? theme.primary : theme.textSecondary}
              />
              <Text
                style={[
                  styles.themeOptionText,
                  themeMode === 'light' && styles.themeOptionTextActive,
                ]}
              >
                Light
              </Text>
              {themeMode === 'light' && (
                <Icon name="checkmark-circle" size={24} color={theme.primary} />
              )}
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity
              style={[
                styles.themeOption,
                themeMode === 'dark' && styles.themeOptionActive,
              ]}
              onPress={() => handleThemeChange('dark')}
            >
              <Icon
                name="moon"
                size={24}
                color={themeMode === 'dark' ? theme.primary : theme.textSecondary}
              />
              <Text
                style={[
                  styles.themeOptionText,
                  themeMode === 'dark' && styles.themeOptionTextActive,
                ]}
              >
                Dark
              </Text>
              {themeMode === 'dark' && (
                <Icon name="checkmark-circle" size={24} color={theme.primary} />
              )}
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity
              style={[
                styles.themeOption,
                themeMode === 'system' && styles.themeOptionActive,
              ]}
              onPress={() => handleThemeChange('system')}
            >
              <Icon
                name="phone-portrait"
                size={24}
                color={themeMode === 'system' ? theme.primary : theme.textSecondary}
              />
              <Text
                style={[
                  styles.themeOptionText,
                  themeMode === 'system' && styles.themeOptionTextActive,
                ]}
              >
                System Default
              </Text>
              {themeMode === 'system' && (
                <Icon name="checkmark-circle" size={24} color={theme.primary} />
              )}
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.text,
  },
  themeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
    elevation: 4,
    shadowColor: theme.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  avatarEditButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#ffffff',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    width: '48%',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 2,
    shadowColor: theme.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.text,
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: theme.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.border,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  infoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  infoIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: theme.textSecondary,
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    color: theme.text,
    fontWeight: '500',
  },
  infoInput: {
    fontSize: 14,
    color: theme.text,
    fontWeight: '500',
    padding: 8,
    minWidth: 100,
    textAlign: 'right',
  },
  divider: {
    height: 1,
    backgroundColor: theme.borderLight,
  },
  settingsCard: {
    backgroundColor: theme.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.border,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 15,
    color: theme.text,
    fontWeight: '600',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 12,
    color: theme.textSecondary,
  },
  menuCard: {
    backgroundColor: theme.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.border,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuText: {
    fontSize: 15,
    color: theme.text,
    fontWeight: '500',
  },
  logoutButton: {
    marginHorizontal: 20,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: theme.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  logoutGradient: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: theme.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  themeModal: {
    backgroundColor: theme.card,
    borderRadius: 20,
    padding: 20,
    width: '100%',
    maxWidth: 400,
    elevation: 10,
    shadowColor: theme.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  themeModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  themeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 12,
  },
  themeOptionActive: {
    opacity: 1,
  },
  themeOptionText: {
    flex: 1,
    fontSize: 16,
    color: theme.textSecondary,
    fontWeight: '500',
  },
  themeOptionTextActive: {
    color: theme.text,
    fontWeight: '600',
  },
});

export default ProfileScreen;
