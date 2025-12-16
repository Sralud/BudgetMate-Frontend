import React, { useState, useCallback } from "react";
import { SafeAreaView, View, ScrollView, Image, Text, TouchableOpacity, Modal, Alert } from "react-native";
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { moderateScale } from '../../../src/utils/responsive';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useRouter } from 'expo-router';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { api } from '../../../src/api/api';
import { styles, COLORS } from '../../styles/profileStyles';
import { getUserAvatar } from '../../../src/utils/avatar';
import EmergencyFundModal from '../../../src/components/ui/EmergencyFundModal';

const MenuItem = ({ icon, label, value, onPress, isDestructive = false }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
    <View style={styles.menuIconWrapper}>
      <MaterialIcons name={icon} size={moderateScale(22)} color={isDestructive ? COLORS.accent : COLORS.yellow} />
    </View>
    <View style={styles.menuContent}>
      <Text style={[styles.menuLabel, isDestructive && styles.destructiveLabel]}>{label}</Text>
      {value && <Text style={styles.menuValue}>{value}</Text>}
    </View>
    <MaterialIcons name="chevron-right" size={moderateScale(24)} color={COLORS.textSecondary} />
  </TouchableOpacity>
);

export default function Profile() {
  const [username, setUsername] = useState('User');
  const [email, setEmail] = useState('');
  const [avatarSeed, setAvatarSeed] = useState('');
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [emergencyFundModalVisible, setEmergencyFundModalVisible] = useState(false);
  const router = useRouter();

  const [budgetData, setBudgetData] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  // Action: Load All Profile Data
  // Uses Promise.all to fetch User Data, Budget Settings, and Expenses in parallel.
  // This is faster than awaiting them one by one.
  const loadData = async () => {
    try {
      await Promise.all([
        loadUserData(),   // Name, Email
        loadBudgetData(), // Savings Goals
        loadExpenses(),   // Transaction History
      ]);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData != null) {
        const user = JSON.parse(userData);
        setUsername(user.name || user.username || 'User');
        setEmail(user.email || '');
        setAvatarSeed(user.avatarSeed || '');
      }
    } catch (e) {
      console.error('Failed to load user data', e);
    }
  };

  const loadBudgetData = async () => {
    try {
      const savedData = await AsyncStorage.getItem('userBudget');
      if (savedData != null) {
        setBudgetData(JSON.parse(savedData));
      }
    } catch (error) {
      console.error('Failed to load budget data', error);
    }
  };

  const loadExpenses = async () => {
    try {
      const response = await api.get('/api/expenses');
      setExpenses(response.data);
    } catch (error) {
      console.error('Failed to load expenses', error);
    }
  };

  // --- Calculations ---
  // Emergency Fund
  const emergencyFundTarget = budgetData?.emergencyFundGoal || 10000;
  const emergencyFundSaved = expenses
    .filter(item => item.category === 'Savings')
    .reduce((sum, item) => sum + item.amount, 0);
  const emergencyProgress = Math.min(Math.round((emergencyFundSaved / emergencyFundTarget) * 100), 100);

  const handleLogout = () => {
    setLogoutModalVisible(true);
  };

  const confirmLogout = async () => {
    try {
      await AsyncStorage.removeItem('userData');
      await AsyncStorage.removeItem('userBudget');
      global.authToken = null;
      setLogoutModalVisible(false);
      router.replace('/');
    } catch (error) {
      console.error('Failed to log out', error);
      setLogoutModalVisible(false);
    }
  };

  const cancelLogout = () => {
    setLogoutModalVisible(false);
  };

  const handlePersonalInfo = () => {
    router.push('/profile/PersonalInfo');
  };

  const handleSettings = () => {
    router.push('/budget/EditBudget');
  };

  const handleEmergencyFundClick = () => {
    setEmergencyFundModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar style="light" backgroundColor={COLORS.background} translucent={false} />

      {/* Emergency Fund Modal */}
      <EmergencyFundModal
        visible={emergencyFundModalVisible}
        onClose={() => setEmergencyFundModalVisible(false)}
        emergencyFundSaved={emergencyFundSaved}
        emergencyFundTarget={emergencyFundTarget}
        emergencyProgress={emergencyProgress}
        onEditGoal={() => router.push('/budget/EditBudget')}
      />

      {/* Custom Logout Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={logoutModalVisible}
        onRequestClose={cancelLogout}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <LinearGradient
              colors={['#433DA3', '#2B2769', '#19173D']}
              locations={[0.1, 0.45, 0.75]}
              style={styles.gradientFill}
            />
            <Text style={styles.modalTitle}>Log Out</Text>
            <Text style={styles.modalText}>Are you sure you want to log out?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelButtonWrapper} onPress={cancelLogout}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.logoutConfirmWrapper} onPress={confirmLogout}>
                <LinearGradient
                  colors={['#E33C3C', '#E3823C']}
                  style={styles.gradientBtn}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                />
                <Text style={styles.logoutConfirmText}>Log Out</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Header Profile Card */}
        <View style={styles.headerCard}>
          <LinearGradient
            colors={['#433DA3', '#2B2769']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.headerGradient}
          />
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: getUserAvatar({ avatarSeed, email, name: username }) }}
              style={styles.avatarImage}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.name}>{username}</Text>
          <Text style={styles.email}>{email}</Text>
        </View>

        {/* Menu Section */}
        <View style={styles.menuContainer}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.menuGroup}>
            <MenuItem
              icon="person"
              label="Personal Information"
              onPress={handlePersonalInfo}
            />
            <MenuItem
              icon="settings"
              label="Budget Settings"
              onPress={handleSettings}
            />
          </View>

          <Text style={styles.sectionTitle}>Finance</Text>
          <View style={styles.menuGroup}>
            <MenuItem
              icon="savings"
              label="Emergency Fund"
              value={`${emergencyProgress}%`}
              onPress={handleEmergencyFundClick}
            />
          </View>

          <Text style={styles.sectionTitle}>More</Text>
          <View style={styles.menuGroup}>
            <MenuItem
              icon="help"
              label="Help & Support"
              onPress={() => Alert.alert('Coming Soon')}
            />
          </View>
        </View>

        {/* Log out Button */}
        <TouchableOpacity style={styles.logoutButtonWrapper} activeOpacity={0.7} onPress={handleLogout}>
          <LinearGradient
            colors={[COLORS.accent, COLORS.primary]}
            style={styles.logoutButton}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.logoutText}>Log out</Text>
          </LinearGradient>
        </TouchableOpacity>

        <Text style={styles.versionText}>BudgetMate v1.0.0</Text>

      </ScrollView>
    </SafeAreaView>
  );
}