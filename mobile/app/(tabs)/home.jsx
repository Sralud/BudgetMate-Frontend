import React, { useState, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Modal } from 'react-native';
import { BarChart, LineChart } from 'react-native-chart-kit';
import { useFocusEffect, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { scale, verticalScale, moderateScale, screenWidth } from '../../src/responsive';

const COLORS = {
  background: '#141326',
  cardBg: '#433DA3',
  primary: '#E3823C',
  accent: '#E33C3C',
  text: '#FFFFFF',
  textSecondary: '#D7C7EC',
  yellow: '#FFC107',
};

const Home = () => {
  const [budgetData, setBudgetData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alertVisible, setAlertVisible] = useState(false);
  const [username, setUsername] = useState('Jo');
  const carouselRef = useRef(null);
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      loadBudgetData();
      loadUserData();
    }, [])
  );

  const loadBudgetData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('userBudget');
      if (jsonValue != null) {
        setBudgetData(JSON.parse(jsonValue));
      }
    } catch (e) {
      console.error('Failed to load budget data', e);
    } finally {
      setLoading(false);
    }
  };

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData != null) {
        const user = JSON.parse(userData);
        setUsername(user.name || user.username || 'Jo');
      }
    } catch (e) {
      console.error('Failed to load user data', e);
    }
  };

  const scrollToSlide = (index) => {
    if (carouselRef.current) {
      carouselRef.current.scrollTo({ x: index * (screenWidth - scale(40)), animated: true });
    }
  };

  const goToOnboarding = () => {
    router.push('/BudgetOnboarding');
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!budgetData) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <StatusBar style="light" backgroundColor={COLORS.background} translucent={false} />
        <View style={[styles.container, styles.center]}>
          <MaterialIcons name="account-balance-wallet" size={moderateScale(80)} color={COLORS.yellow} />
          <Text style={styles.noBudgetTitle}>No Budget Data Found</Text>
          <Text style={styles.noBudgetText}>
            Let's set up your budget to start tracking your finances!
          </Text>
          
          <TouchableOpacity 
            style={styles.onboardingButtonWrapper}
            onPress={goToOnboarding}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#E3823C', '#E33C3C']}
              locations={[0.1, 0.95]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.onboardingButton}
            >
              <Text style={styles.onboardingButtonText}>Setup Budget</Text>
              <MaterialIcons name="arrow-forward" size={moderateScale(20)} color={COLORS.text} />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Calculations
  const spendingLabels = budgetData.spendingPreferences.map(p => p.category);
  const spendingValues = budgetData.spendingPreferences.map(p => {
    if (p.fixedAmount) return p.fixedAmount;
    if (p.percentage) return (budgetData.monthlyIncome * p.percentage) / 100;
    return 0;
  });

  // Find Emergency Fund or fallback
  const emergencyFund =
    budgetData.savingsGoals.find(g => g.name.toLowerCase().includes('emergency')) ||
    budgetData.savingsGoals[0] ||
    { name: 'Emergency Fund', currentSavings: 0, targetAmount: 0 };

  // Savings Rate
  const totalSavings = budgetData.savingsGoals.reduce((sum, goal) => sum + (goal.currentSavings || 0), 0);
  const savingsRate = budgetData.monthlyIncome > 0 ? Math.round((totalSavings / budgetData.monthlyIncome) * 100) : 0;

  const chartConfig = {
    backgroundColor: COLORS.cardBg,
    backgroundGradientFrom: COLORS.cardBg,
    backgroundGradientTo: COLORS.cardBg,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(215, 199, 236, ${opacity})`,
    style: { borderRadius: moderateScale(16) },
    barPercentage: 0.7,
    propsForLabels: { fontSize: moderateScale(10), fontFamily: 'Poppins-Regular' },
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar style="light" backgroundColor={COLORS.background} translucent={false} />

      {/* Budget Alert Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={alertVisible}
        onRequestClose={() => setAlertVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <LinearGradient
              colors={['#433DA3', '#2B2769', '#19173D']}
              locations={[0.1, 0.45, 0.75]}
              style={styles.gradientFill}
            />
            <Text style={styles.modalTitle}>Budget Alert!</Text>
            <Text style={styles.modalText}>
              You're approaching your entertainment budget limit. Consider reducing spending in this category.
            </Text>
            <TouchableOpacity onPress={() => setAlertVisible(false)} style={styles.modalButton}>
              <Text style={styles.modalButtonText}>Back</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hi, {username}!</Text>
            <Text style={styles.subtext}>How are you today?</Text>
          </View>
          <TouchableOpacity onPress={() => setAlertVisible(true)}>
            <MaterialIcons name="notifications-none" size={moderateScale(28)} color={COLORS.accent} />
          </TouchableOpacity>
        </View>

        {/* Carousel */}
        <View style={styles.carouselContainer}>
          <ScrollView
            ref={carouselRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
          >
            {/* Slide 1: Monthly Income */}
            <View style={styles.carouselCard}>
              <Text style={styles.cardTitle}>Monthly Income</Text>
              <Text style={styles.amount} adjustsFontSizeToFit numberOfLines={1}>₱ {budgetData.monthlyIncome.toLocaleString()}</Text>
              <View style={styles.row}>
                <Text style={styles.change}>Ready to budget</Text>
                <TouchableOpacity style={styles.actionButton} onPress={() => scrollToSlide(1)}>
                  <Text style={styles.actionButtonText}>See Emergency Fund</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Slide 2: Emergency Fund */}
            <View style={styles.carouselCard}>
              <Text style={styles.cardTitle}>Emergency Fund</Text>
              <Text style={styles.amount} adjustsFontSizeToFit numberOfLines={1}>₱ {emergencyFund.currentSavings.toLocaleString()}</Text>
              <Text style={styles.subtext}>Goal: ₱ {emergencyFund.targetAmount.toLocaleString()}</Text>
              <View style={styles.row}>
                <View />
                <TouchableOpacity style={[styles.actionButton, { backgroundColor: COLORS.primary }]} onPress={() => scrollToSlide(2)}>
                  <Text style={styles.actionButtonText}>See Savings Rate</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Slide 3: Savings Rate */}
            <View style={styles.carouselCard}>
              <Text style={styles.cardTitle}>Savings Rate</Text>
              <Text style={styles.amount} adjustsFontSizeToFit numberOfLines={1}>{savingsRate}%</Text>
              <Text style={styles.subtext}>of Monthly Income</Text>
              <View style={styles.row}>
                <View />
                <TouchableOpacity style={[styles.actionButton, { backgroundColor: COLORS.primary }]} onPress={() => scrollToSlide(0)}>
                  <Text style={styles.actionButtonText}>Back to Monthly Income</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>

        {/* Budget Allocation Chart */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Budget Allocation</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <BarChart
              data={{
                labels: spendingLabels.map(l => l.substring(0, 3)),
                datasets: [{ data: spendingValues }],
              }}
              width={screenWidth - scale(60)}
              height={verticalScale(220)}
              yAxisLabel="₱"
              chartConfig={chartConfig}
              verticalLabelRotation={0}
              showValuesOnTopOfBars
              fromZero
            />
          </ScrollView>
        </View>

        {/* Spending Trend */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Spending Trend</Text>
          <Text style={styles.subtext}>Last 6 months overview</Text>
          <LineChart
            data={{
              labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
              datasets: [{ data: [2000, 4500, 2800, 8000, 9900, 4300] }],
            }}
            width={screenWidth - scale(60)}
            height={verticalScale(220)}
            chartConfig={{
              ...chartConfig,
              color: (opacity = 1) => `rgba(227, 130, 60, ${opacity})`,
            }}
            bezier
            style={{
              marginVertical: verticalScale(8),
              borderRadius: moderateScale(16),
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: scale(20),
  },
  scrollView: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    padding: scale(20),
    paddingBottom: verticalScale(120),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(24),
  },
  greeting: {
    fontSize: moderateScale(24),
    fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
    color: COLORS.text,
  },
  subtext: {
    fontSize: moderateScale(14),
    fontFamily: 'Poppins-Regular',
    color: COLORS.textSecondary,
  },
  text: {
    color: COLORS.text,
    fontSize: moderateScale(16),
    fontFamily: 'Poppins-Regular',
  },
  
  // No Budget Data Styles
  noBudgetTitle: {
    fontSize: moderateScale(24),
    fontFamily: 'Poppins-Bold',
    color: COLORS.text,
    marginTop: verticalScale(24),
    marginBottom: verticalScale(12),
    textAlign: 'center',
  },
  noBudgetText: {
    fontSize: moderateScale(16),
    fontFamily: 'Poppins-Regular',
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: verticalScale(32),
    paddingHorizontal: scale(20),
    lineHeight: verticalScale(24),
  },
  onboardingButtonWrapper: {
    width: '80%',
    borderRadius: moderateScale(12),
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: verticalScale(4) },
    shadowOpacity: 0.3,
    shadowRadius: moderateScale(8),
    elevation: 5,
  },
  onboardingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(16),
    gap: scale(8),
  },
  onboardingButtonText: {
    color: COLORS.text,
    fontSize: moderateScale(18),
    fontFamily: 'Poppins-SemiBold',
  },
  
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: moderateScale(20),
    padding: scale(20),
    marginBottom: verticalScale(20),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: verticalScale(4) },
    shadowOpacity: 0.3,
    shadowRadius: moderateScale(8),
    elevation: 5,
  },
  carouselContainer: {
    height: verticalScale(200),
    marginBottom: verticalScale(20),
  },
  carouselCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: moderateScale(20),
    padding: scale(20),
    width: screenWidth - scale(40),
    marginRight: 0,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: verticalScale(4) },
    shadowOpacity: 0.3,
    shadowRadius: moderateScale(8),
    elevation: 5,
  },
  cardTitle: {
    fontSize: moderateScale(16),
    color: COLORS.yellow,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
    marginBottom: verticalScale(8),
  },
  amount: {
    fontSize: moderateScale(32),
    fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
    color: COLORS.text,
    marginBottom: verticalScale(4),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: verticalScale(12),
  },
  change: {
    color: COLORS.textSecondary,
    fontSize: moderateScale(14),
    fontFamily: 'Poppins-Regular',
  },
  actionButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(8),
    borderRadius: moderateScale(12),
  },
  actionButtonText: {
    color: COLORS.text,
    fontSize: moderateScale(12),
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    borderRadius: moderateScale(20),
    padding: scale(24),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: verticalScale(10) },
    shadowOpacity: 0.5,
    shadowRadius: moderateScale(20),
    elevation: 10,
    overflow: 'hidden',
  },
  gradientFill: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  modalTitle: {
    fontSize: moderateScale(22),
    fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
    color: COLORS.yellow,
    marginBottom: verticalScale(16),
  },
  modalText: {
    fontSize: moderateScale(16),
    fontFamily: 'Poppins-Regular',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: verticalScale(24),
    lineHeight: verticalScale(24),
  },
  modalButton: {
    alignSelf: 'flex-end',
  },
  modalButtonText: {
    color: COLORS.yellow,
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
  },
});

export default Home;