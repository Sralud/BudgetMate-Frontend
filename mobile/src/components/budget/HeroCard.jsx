import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { scale, verticalScale, moderateScale } from '../../utils/responsive';

// Theme Colors
const COLORS = {
    background: '#141326',
    cardBg: '#2A265C',
    primary: '#E3823C',
    accent: '#E33C3C',
    text: '#FFFFFF',
    textSecondary: '#D7C7EC',
    success: '#4CAF50',
};

/**
 * HeroCard Component
 * Displays the main financial status ("Health Bar") at the top of the Home screen.
 * 
 * Props:
 * - availableBalance: Money left to spend (Income - Spending)
 * - spendPercentage: How much of the income is used (0-100)
 * - totalUsed: Total amount spent/saved
 * - monthlyIncome: The total budget limit
 */
const HeroCard = ({ availableBalance, spendPercentage, totalUsed, monthlyIncome }) => {
    return (
        <LinearGradient
            colors={['#433DA3', '#1F1B4A']} // Purple/Blue gradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroCard}
        >
            <View style={styles.heroHeader}>
                <Text style={styles.heroLabel}>Available Balance</Text>
                <MaterialIcons name="account-balance-wallet" size={20} color={COLORS.textSecondary} />
            </View>

            {/* Display the balance elegantly */}
            <Text style={styles.heroAmount}>₱ {availableBalance.toLocaleString()}</Text>

            {/* Visual Budget Bar */}
            <View style={styles.budgetProgress}>
                <View style={styles.progressBackground}>
                    {/* The colored bar width is dynamic based on spending */}
                    {/* If spending > 90%, it turns RED (accent). Otherwise GREEN (success) */}
                    <View style={[styles.progressFill, {
                        width: `${Math.min(spendPercentage, 100)}%`,
                        backgroundColor: spendPercentage > 90 ? COLORS.accent : COLORS.success
                    }]} />
                </View>
                <View style={styles.progressLabels}>
                    <Text style={styles.progressLabelText}>Used: ₱{totalUsed.toLocaleString()}</Text>
                    <Text style={styles.progressLabelText}>Budget: ₱{monthlyIncome.toLocaleString()}</Text>
                </View>
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    heroCard: {
        borderRadius: moderateScale(24),
        padding: scale(24),
        marginBottom: verticalScale(24),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
    },
    heroHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: verticalScale(12),
    },
    heroLabel: {
        fontSize: moderateScale(14),
        fontFamily: 'Poppins-Medium',
        color: COLORS.textSecondary,
    },
    heroAmount: {
        fontSize: moderateScale(36),
        fontFamily: 'Poppins-Bold',
        color: COLORS.text,
        marginBottom: verticalScale(20),
    },
    budgetProgress: {
        gap: verticalScale(8),
    },
    progressBackground: {
        height: verticalScale(8),
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: moderateScale(4),
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: moderateScale(4),
    },
    progressLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    progressLabelText: {
        fontSize: moderateScale(12),
        fontFamily: 'Poppins-Regular',
        color: COLORS.textSecondary,
    },
});

export default HeroCard;
