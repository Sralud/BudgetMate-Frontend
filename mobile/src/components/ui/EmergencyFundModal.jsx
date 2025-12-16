import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { moderateScale, scale, verticalScale } from '../../utils/responsive';

const COLORS = {
    background: '#141326',
    cardBg: '#1E1C30',
    primary: '#E3823C',
    accent: '#E33C3C',
    text: '#FFFFFF',
    textSecondary: '#D7C7EC',
    yellow: '#FFC107',
    success: '#4CAF50',
};

const EmergencyFundModal = ({
    visible,
    onClose,
    emergencyFundSaved = 0,
    emergencyFundTarget = 10000,
    emergencyProgress = 0,
    onEditGoal,
}) => {
    if (!visible) return null;

    const remainingAmount = Math.max(emergencyFundTarget - emergencyFundSaved, 0);
    const isGoalMet = emergencyProgress >= 100;

    return (
        <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    {/* Gradient Background */}
                    <LinearGradient
                        colors={['#433DA3', '#2B2769', '#19173D']}
                        locations={[0.1, 0.5, 0.9]}
                        style={styles.gradientBg}
                    />

                    {/* Close Button */}
                    <TouchableOpacity style={styles.closeButton} onPress={onClose} activeOpacity={0.7}>
                        <MaterialIcons name="close" size={24} color={COLORS.textSecondary} />
                    </TouchableOpacity>

                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.scrollContent}
                    >
                        {/* Icon */}
                        <View style={styles.iconContainer}>
                            <LinearGradient
                                colors={['rgba(255, 193, 7, 0.2)', 'rgba(227, 130, 60, 0.2)']}
                                style={styles.iconGradient}
                            >
                                <MaterialIcons name="savings" size={40} color={COLORS.yellow} />
                            </LinearGradient>
                        </View>

                        {/* Title */}
                        <Text style={styles.title}>Emergency Fund</Text>

                        {/* Progress Circle */}
                        <View style={styles.progressCircle}>
                            <View style={styles.progressRing}>
                                <LinearGradient
                                    colors={isGoalMet ? ['#4CAF50', '#66BB6A'] : ['#FFC107', '#E3823C']}
                                    style={styles.progressGradient}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                >
                                    <View style={styles.progressInner}>
                                        <Text style={styles.progressPercentage}>{emergencyProgress.toFixed(0)}%</Text>
                                        <Text style={styles.progressLabel}>Complete</Text>
                                    </View>
                                </LinearGradient>
                            </View>
                        </View>

                        {/* Stats */}
                        <View style={styles.statsContainer}>
                            <View style={styles.statRow}>
                                <View style={styles.statItem}>
                                    <Text style={styles.statLabel}>Current Savings</Text>
                                    <Text style={styles.statValue}>₱ {emergencyFundSaved.toLocaleString()}</Text>
                                </View>
                                <View style={styles.divider} />
                                <View style={styles.statItem}>
                                    <Text style={styles.statLabel}>Target Goal</Text>
                                    <Text style={styles.statValue}>₱ {emergencyFundTarget.toLocaleString()}</Text>
                                </View>
                            </View>

                            <View style={styles.remainingContainer}>
                                <MaterialIcons
                                    name={isGoalMet ? 'check-circle' : 'trending-up'}
                                    size={20}
                                    color={isGoalMet ? COLORS.success : COLORS.yellow}
                                />
                                <Text style={styles.remainingLabel}>
                                    {isGoalMet ? 'Goal Achieved!' : 'Remaining'}
                                </Text>
                                <Text style={[styles.remainingValue, isGoalMet && styles.goalMetValue]}>
                                    {isGoalMet ? '🎉' : `₱ ${remainingAmount.toLocaleString()}`}
                                </Text>
                            </View>
                        </View>

                        {/* Motivational Message */}
                        <View style={styles.messageContainer}>
                            <Text style={styles.messageText}>
                                {isGoalMet
                                    ? "Congratulations! You've reached your emergency fund goal. Keep it up!"
                                    : emergencyProgress < 25
                                        ? 'Great start! Every bit counts towards your financial security.'
                                        : emergencyProgress < 50
                                            ? "You're making progress! Keep up the momentum."
                                            : emergencyProgress < 75
                                                ? 'Halfway there! Your future self will thank you.'
                                                : "Almost there! You're so close to reaching your goal!"}
                            </Text>
                        </View>

                        {/* Action Buttons */}
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                style={styles.secondaryButton}
                                onPress={onClose}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.secondaryButtonText}>Close</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.primaryButton}
                                onPress={() => {
                                    onClose();
                                    onEditGoal();
                                }}
                                activeOpacity={0.8}
                            >
                                <LinearGradient
                                    colors={[COLORS.primary, '#E3A23C']}
                                    style={styles.primaryButtonGradient}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                >
                                    <MaterialIcons name="edit" size={18} color={COLORS.text} />
                                    <Text style={styles.primaryButtonText}>Update Goal</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: scale(20),
    },
    modalContainer: {
        width: '100%',
        maxWidth: 400,
        maxHeight: '85%',
        borderRadius: moderateScale(24),
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    gradientBg: {
        ...StyleSheet.absoluteFillObject,
    },
    scrollContent: {
        padding: scale(24),
        paddingTop: verticalScale(40),
    },
    closeButton: {
        position: 'absolute',
        top: verticalScale(12),
        right: scale(12),
        zIndex: 10,
        width: moderateScale(36),
        height: moderateScale(36),
        borderRadius: moderateScale(18),
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconContainer: {
        alignSelf: 'center',
        marginBottom: verticalScale(16),
    },
    iconGradient: {
        width: moderateScale(80),
        height: moderateScale(80),
        borderRadius: moderateScale(40),
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'rgba(255, 193, 7, 0.3)',
    },
    title: {
        fontSize: moderateScale(24),
        fontFamily: 'Poppins-Bold',
        color: COLORS.text,
        textAlign: 'center',
        marginBottom: verticalScale(24),
    },
    progressCircle: {
        alignSelf: 'center',
        marginBottom: verticalScale(24),
    },
    progressRing: {
        width: moderateScale(140),
        height: moderateScale(140),
        borderRadius: moderateScale(70),
        padding: moderateScale(6),
    },
    progressGradient: {
        flex: 1,
        borderRadius: moderateScale(70),
        justifyContent: 'center',
        alignItems: 'center',
    },
    progressInner: {
        width: moderateScale(120),
        height: moderateScale(120),
        borderRadius: moderateScale(60),
        backgroundColor: '#19173D',
        justifyContent: 'center',
        alignItems: 'center',
    },
    progressPercentage: {
        fontSize: moderateScale(32),
        fontFamily: 'Poppins-Bold',
        color: COLORS.text,
    },
    progressLabel: {
        fontSize: moderateScale(12),
        fontFamily: 'Poppins-Regular',
        color: COLORS.textSecondary,
        marginTop: verticalScale(-4),
    },
    statsContainer: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: moderateScale(16),
        padding: scale(16),
        marginBottom: verticalScale(16),
    },
    statRow: {
        flexDirection: 'row',
        marginBottom: verticalScale(16),
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    divider: {
        width: 1,
        backgroundColor: 'rgba(255,255,255,0.1)',
        marginHorizontal: scale(8),
    },
    statLabel: {
        fontSize: moderateScale(12),
        fontFamily: 'Poppins-Regular',
        color: COLORS.textSecondary,
        marginBottom: verticalScale(4),
    },
    statValue: {
        fontSize: moderateScale(16),
        fontFamily: 'Poppins-Bold',
        color: COLORS.text,
    },
    remainingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: verticalScale(12),
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.1)',
        gap: scale(8),
    },
    remainingLabel: {
        fontSize: moderateScale(13),
        fontFamily: 'Poppins-Medium',
        color: COLORS.textSecondary,
    },
    remainingValue: {
        fontSize: moderateScale(16),
        fontFamily: 'Poppins-Bold',
        color: COLORS.yellow,
    },
    goalMetValue: {
        fontSize: moderateScale(20),
    },
    messageContainer: {
        backgroundColor: 'rgba(255, 193, 7, 0.1)',
        borderRadius: moderateScale(12),
        padding: scale(16),
        marginBottom: verticalScale(20),
        borderLeftWidth: 3,
        borderLeftColor: COLORS.yellow,
    },
    messageText: {
        fontSize: moderateScale(13),
        fontFamily: 'Poppins-Regular',
        color: COLORS.textSecondary,
        lineHeight: moderateScale(20),
        textAlign: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: scale(12),
    },
    secondaryButton: {
        flex: 1,
        paddingVertical: verticalScale(14),
        borderRadius: moderateScale(12),
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    secondaryButtonText: {
        fontSize: moderateScale(15),
        fontFamily: 'Poppins-SemiBold',
        color: COLORS.textSecondary,
    },
    primaryButton: {
        flex: 1,
        borderRadius: moderateScale(12),
        overflow: 'hidden',
    },
    primaryButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: verticalScale(14),
        gap: scale(6),
    },
    primaryButtonText: {
        fontSize: moderateScale(15),
        fontFamily: 'Poppins-SemiBold',
        color: COLORS.text,
    },
});

export default EmergencyFundModal;
