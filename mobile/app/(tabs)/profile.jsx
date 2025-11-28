import React, { useState, useCallback } from "react";
import { 
    SafeAreaView, 
    View, 
    ScrollView, 
    Image, 
    Text, 
    TouchableOpacity, 
    StyleSheet,
    Dimensions,
    Modal 
} from "react-native";
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { scale, verticalScale, moderateScale } from '../../src/responsive';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useRouter } from 'expo-router';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// --- Color Palette (Matching Community.jsx) ---
const COLORS = {
    background: '#141326',
    cardBg: '#433DA3',
    primary: '#E3823C',
    accent: '#E33C3C',
    text: '#FFFFFF',
    textSecondary: '#D7C7EC',
    yellow: '#FFC107',
};

// --- Custom Component for Circular Progress ---
const CircleProgress = ({ percent, target, saved }) => {
  return (
    <View style={circleStyles.wrapper}>
      <View style={circleStyles.circlePlaceholder}>
        <View style={[circleStyles.progressArc, { transform: [{ rotateZ: `${(percent * 3.6) - 90}deg` }] }]} />
        <Text style={circleStyles.percentText}>{percent}%</Text>
      </View>
      <Text style={circleStyles.infoText}>Target: ₱{target.toLocaleString()}</Text>
      <Text style={circleStyles.infoText}>Saved: ₱{saved.toLocaleString()}</Text>
    </View>
  );
};

export default function Profile() {
  const [username, setUsername] = useState('User');
  const [email, setEmail] = useState('');
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const router = useRouter();

  const targetAmount = 10000;
  const savedAmount = 6500;
  const progressPercent = Math.round((savedAmount / targetAmount) * 100);

  useFocusEffect(
    useCallback(() => {
      loadUserData();
    }, [])
  );

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData != null) {
        const user = JSON.parse(userData);
        setUsername(user.name || user.username || 'User');
        setEmail(user.email || '');
      }
    } catch (e) {
      console.error('Failed to load user data', e);
    }
  };

  const handleLogout = () => {
    setLogoutModalVisible(true);
  };

  const confirmLogout = async () => {
    try {
      // Clear all user data from AsyncStorage
      await AsyncStorage.removeItem('userData');
      await AsyncStorage.removeItem('userBudget');
      
      // Clear auth token
      global.authToken = null;
      
      console.log("User logged out successfully");
      
      // Close modal and navigate to login screen
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

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar style="light" backgroundColor={COLORS.background} translucent={false} />
      
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
            <Text style={styles.modalText}>
              Are you sure you want to log out?
            </Text>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.cancelButtonWrapper}
                onPress={cancelLogout}
                activeOpacity={0.8}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.logoutConfirmWrapper}
                onPress={confirmLogout}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#E33C3C', '#E3823C']}
                  locations={[0.1, 0.95]}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  style={styles.gradientBtn}
                />
                <Text style={styles.logoutConfirmText}>Log Out</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.avatarWrapper}>
            <Image 
              source={{uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/N2yyWBWpxG/oi83aoen_expires_30_days.png"}} 
              style={styles.avatarImage} 
              resizeMode="contain"
            />
          </View>
          <Text style={styles.name}>{username}</Text>
          <Text style={styles.email}>{email}</Text>
          <Text style={styles.quote}>"Budgeting is the key to financial freedom"</Text>
        </View>

        {/* Personal Info Button */}
        <TouchableOpacity style={styles.buttonRow} activeOpacity={0.7}>
          <Text style={styles.buttonLabel}>Personal Info</Text>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        {/* Goals + Emergency Fund Row */}
        <View style={styles.row}>
          <View style={[styles.card, styles.myGoalCard]}>
            <Text style={styles.cardTitle}>My Goal</Text>
            <Text style={styles.cardSubtitle}>"Dream Car"</Text>
          </View>

          <View style={[styles.card, styles.emergencyCard]}>
            <Text style={styles.cardTitleEmergency}>  Emergency {'\n'}        Fund</Text>
            <CircleProgress
              percent={progressPercent}
              target={targetAmount}
              saved={savedAmount}
            />
          </View>
        </View>

        {/* Settings Button */}
        <TouchableOpacity style={styles.buttonRow} activeOpacity={0.7}>
          <Text style={styles.buttonLabel}>Settings and Preferences</Text>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        {/* Log out Button */}
        <TouchableOpacity style={styles.logoutButtonWrapper} activeOpacity={0.7} onPress={handleLogout}>
          <LinearGradient
            colors={[COLORS.accent, COLORS.primary]}
            style={styles.logoutButton}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
          >
            <Text style={styles.logoutText}>Log out</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const circleStyles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    flex: 1, 
    justifyContent: 'center', 
  },
  circlePlaceholder: {
    width: moderateScale(60),
    height: moderateScale(60),
    borderRadius: moderateScale(30),
    backgroundColor: 'transparent',
    borderWidth: moderateScale(5),
    borderColor: 'rgba(255,255,255,0.15)', 
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: verticalScale(8),
    overflow: 'hidden',
  },
  progressArc: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: moderateScale(30),
    borderWidth: moderateScale(5),
    borderColor: 'transparent',
    borderTopColor: COLORS.yellow,
    borderRightColor: COLORS.yellow,
  },
  percentText: {
    fontSize: moderateScale(15),
    fontFamily: 'Poppins-Bold',
    color: COLORS.text,
  },
  infoText: {
    fontSize: moderateScale(11),
    fontFamily: 'Poppins-Regular',
    color: COLORS.text,
    textAlign: "center",
    lineHeight: moderateScale(16),
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(50),
    paddingBottom: verticalScale(50),
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
  },

  header: {
    alignItems: "center",
    marginBottom: verticalScale(32),
  },

  avatarWrapper: {
    width: moderateScale(100),
    height: moderateScale(100),
    borderRadius: moderateScale(50),
    marginBottom: verticalScale(20),
    backgroundColor: COLORS.background,
    borderWidth: moderateScale(3),
    borderColor: COLORS.yellow,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '70%',
    height: '70%',
    tintColor: COLORS.yellow,
  },

  name: {
    fontSize: moderateScale(24),
    fontFamily: 'Poppins-Bold',
    color: COLORS.yellow,
    marginBottom: verticalScale(4),
  },

  email: {
    fontSize: moderateScale(14),
    fontFamily: 'Poppins-Regular',
    color: COLORS.textSecondary,
    marginBottom: verticalScale(8),
  },

  quote: {
    fontSize: moderateScale(13),
    fontFamily: 'Poppins-Regular',
    color: COLORS.textSecondary,
    textAlign: "center",
  },

  // --- Buttons (Personal Info, Settings) ---
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.yellow,
    paddingVertical: verticalScale(16),
    paddingHorizontal: scale(20),
    borderRadius: moderateScale(12),
    marginBottom: verticalScale(16),
  },

  buttonLabel: {
    color: COLORS.text,
    fontSize: moderateScale(15),
    fontFamily: 'Poppins-Medium',
  },

  arrow: {
    color: COLORS.text,
    fontSize: moderateScale(20),
    fontFamily: 'Poppins-Regular',
  },

  // --- Cards ---
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: verticalScale(20),
    gap: scale(12),
  },

  card: {
    flex: 1,
    backgroundColor: COLORS.cardBg,
    padding: scale(16),
    borderRadius: moderateScale(16),
    minHeight: verticalScale(160),
  },
  
  myGoalCard: {
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  
  emergencyCard: {
    justifyContent: 'flex-start',
    alignItems: 'center',
  },

  cardTitle: {
    color: COLORS.yellow,
    fontSize: moderateScale(16),
    fontFamily: 'Poppins-SemiBold',
    marginBottom: verticalScale(12),
  },
  
  cardTitleEmergency: {
    color: COLORS.yellow,
    fontSize: moderateScale(16),
    fontFamily: 'Poppins-SemiBold',
    marginBottom: verticalScale(1),
  },

  cardSubtitle: {
    color: COLORS.text,
    fontSize: moderateScale(15),
    fontFamily: 'Poppins-Medium',
    textAlign: 'center',
  },

  // --- Logout Button ---
  logoutButtonWrapper: {
    marginTop: verticalScale(4),
    borderRadius: moderateScale(12),
    overflow: 'hidden',
  },
  
  logoutButton: {
    paddingVertical: verticalScale(15),
    borderRadius: moderateScale(12),
    alignItems: "center",
  },
  
  logoutText: {
    color: COLORS.text,
    fontSize: moderateScale(15),
    fontFamily: 'Poppins-SemiBold',
  },

  // --- Custom Logout Modal ---
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
    fontSize: moderateScale(24),
    fontFamily: 'Poppins-Bold',
    color: COLORS.yellow,
    marginBottom: verticalScale(12),
  },
  
  modalText: {
    fontSize: moderateScale(16),
    fontFamily: 'Poppins-Regular',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: verticalScale(24),
    lineHeight: verticalScale(24),
  },
  
  modalButtons: {
    flexDirection: 'row',
    gap: scale(12),
    width: '100%',
  },
  
  cancelButtonWrapper: {
    flex: 1,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: COLORS.textSecondary,
    borderRadius: moderateScale(12),
    paddingVertical: verticalScale(12),
    alignItems: 'center',
  },
  
  cancelButtonText: {
    color: COLORS.text,
    fontSize: moderateScale(15),
    fontFamily: 'Poppins-SemiBold',
  },
  
  logoutConfirmWrapper: {
    flex: 1,
    borderRadius: moderateScale(12),
    overflow: 'hidden',
    position: 'relative',
  },
  
  gradientBtn: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  
  logoutConfirmText: {
    color: COLORS.text,
    fontSize: moderateScale(15),
    fontFamily: 'Poppins-SemiBold',
    paddingVertical: verticalScale(14),
    textAlign: 'center',
    zIndex: 1,
  },
});