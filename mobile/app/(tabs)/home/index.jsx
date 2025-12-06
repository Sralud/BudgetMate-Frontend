import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { api } from '../../../src/api/api';
import HeroCard from '../../../src/components/budget/HeroCard';
import GoalCard from '../../../src/components/budget/GoalCard';
import SpendingChart from '../../../src/components/budget/SpendingChart';
import TransactionCard from '../../../src/components/expense/TransactionCard';
import { styles, COLORS } from './styles';

const Home = () => {
  const router = useRouter();
  const [budgetData, setBudgetData] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [username, setUsername] = useState('Friend');

  // useFocusEffect runs whenever this screen comes into focus
  // Think of it like "useEffect" but specifically for navigation
  useFocusEffect(
    useCallback(() => {
      loadData(); // Reload data every time we visit the Home tab
    }, [])
  );

  // Action: Fetch all necessary data for the dashboard
  const loadData = async () => {
    try {
      // Run all fetch requests in parallel for speed
      await Promise.all([
        loadBudgetData(), // Income & Goals
        loadUserData(),   // Name & Profile
        loadExpenses()    // Transaction History
      ]);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const loadBudgetData = async () => {
    try {
      // 1. Try local storage first (Offline support)
      const savedData = await AsyncStorage.getItem('userBudget');
      if (savedData != null) {
        setBudgetData(JSON.parse(savedData));
      }

      // 2. Always fetch from backend (Stale-While-Revalidate)
      try {
        const response = await api.get('/api/budget');
        if (response.data) {
          const backendData = response.data;
          // Save to local storage for next time
          await AsyncStorage.setItem('userBudget', JSON.stringify(backendData));
          setBudgetData(backendData);
        }
      } catch (apiError) {
        console.log('No budget data on backend or offline:', apiError.message);
      }
    } catch (error) {
      console.error('Failed to load budget data', error);
    }
  };

  const loadUserData = async () => {
    try {
      const savedUserData = await AsyncStorage.getItem('userData');
      if (savedUserData != null) {
        const userObject = JSON.parse(savedUserData);
        setUsername(userObject.name || userObject.username || 'Friend');
      }
    } catch (error) {
      console.error('Failed to load user data', error);
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

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  // --- Calculations ---
  const monthlyIncome = budgetData?.monthlyIncome || 0;

  // Calculate total spent (excluding Savings)
  const totalSpent = expenses
    .filter(item => item.category !== 'Savings')
    .reduce((sum, item) => sum + item.amount, 0);

  // Calculate Emergency Fund (sum of Savings category)
  const emergencyFundSaved = expenses
    .filter(item => item.category === 'Savings')
    .reduce((sum, item) => sum + item.amount, 0);

  const availableBalance = monthlyIncome - totalSpent - emergencyFundSaved;
  const spendPercentage = monthlyIncome > 0 ? ((totalSpent + emergencyFundSaved) / monthlyIncome) * 100 : 0;

  // Calculate Actual Savings Rate
  const actualSavingsRate = monthlyIncome > 0
    ? ((monthlyIncome - totalSpent) / monthlyIncome) * 100
    : 0;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar style="light" backgroundColor={COLORS.background} translucent={false} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.dateText}>{new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })}</Text>
            <Text style={styles.greeting}>Hi, {username}</Text>
          </View>
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => router.push('/(tabs)/profile')}
          >
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>{username.charAt(0).toUpperCase()}</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Hero Card: The main "Health Bar" of your budget */}
        <HeroCard
          availableBalance={availableBalance}
          spendPercentage={spendPercentage}
          totalUsed={totalSpent + emergencyFundSaved}
          monthlyIncome={monthlyIncome}
        />

        {/* Quick Actions */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[styles.actionButton, styles.primaryAction]}
            onPress={() => router.push('/budget/AddExpense')}
            activeOpacity={0.8}
          >
            <MaterialIcons name="add" size={24} color={COLORS.text} />
            <Text style={styles.actionText}>Add Expense</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.secondaryAction]}
            onPress={() => router.push('/budget/ExpenseHistory')}
            activeOpacity={0.8}
          >
            <MaterialIcons name="history" size={24} color={COLORS.textSecondary} />
            <Text style={[styles.actionText, { color: COLORS.textSecondary }]}>History</Text>
          </TouchableOpacity>
        </View>

        {/* Financial Goals Row */}
        <View style={styles.goalsRow}>
          {/* Emergency Fund Card */}
          <GoalCard
            title="Emergency Fund"
            amount={`₱ ${emergencyFundSaved.toLocaleString()}`}
            target={`Goal: ₱ ${budgetData?.emergencyFundGoal?.toLocaleString() || '0'}`}
            iconName="savings"
            iconColor={COLORS.yellow}
            iconBgColor="rgba(255, 193, 7, 0.15)"
          />

          {/* Savings Rate Card */}
          <GoalCard
            title="Savings Rate"
            amount={`${actualSavingsRate.toFixed(1)}%`}
            target={`Target: ${budgetData?.targetSavingsRate || 0}%`}
            iconName="trending-up"
            iconColor={COLORS.success}
            iconBgColor="rgba(76, 175, 80, 0.15)"
          />
        </View>

        {/* Analytics Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Spending Overview</Text>
          </View>
          <SpendingChart expenses={expenses} />
        </View>

        {/* Recent Transactions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <TouchableOpacity onPress={() => router.push('/budget/ExpenseHistory')}>
              <Text style={styles.linkText}>View All</Text>
            </TouchableOpacity>
          </View>

          {expenses.length > 0 ? (
            expenses.slice(0, 3).map((item) => (
              <TransactionCard key={item._id} item={item} />
            ))
          ) : (
            <Text style={styles.emptyText}>No recent transactions</Text>
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;