import { StyleSheet } from 'react-native';
import { scale, verticalScale, moderateScale } from '../../src/utils/responsive';

const COLORS = {
    background: '#141326',
    cardBg: '#1F1C3E',
    primary: '#E3823C',
    accent: '#E33C3C',
    text: '#FFFFFF',
    textSecondary: '#D7C7EC',
    yellow: '#FFC107',
    inputBg: '#2B2769',
    inputBorder: 'rgba(255,255,255,0.1)',
    success: '#4CAF50',
};

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    scrollView: {
        flex: 1,
    },
    content: {
        paddingHorizontal: scale(20),
        paddingBottom: verticalScale(40),
    },

    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: verticalScale(50),
        paddingBottom: verticalScale(16),
        paddingHorizontal: scale(20),
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    backButton: {
        width: moderateScale(40),
        height: moderateScale(40),
        borderRadius: moderateScale(20),
        backgroundColor: 'rgba(255,255,255,0.05)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        flex: 1,
        fontSize: moderateScale(18),
        fontFamily: 'Poppins-Bold',
        color: COLORS.text,
        textAlign: 'center',
        marginRight: moderateScale(40), // Balance the back button
    },

    // Section
    sectionTitle: {
        fontSize: moderateScale(16),
        fontFamily: 'Poppins-SemiBold',
        color: COLORS.text,
        marginTop: verticalScale(24),
        marginBottom: verticalScale(12),
    },
    sectionCard: {
        backgroundColor: COLORS.cardBg,
        borderRadius: moderateScale(16),
        padding: scale(20),
        marginBottom: verticalScale(16),
    },

    // Account Type Badge
    accountTypeBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,193,7,0.1)',
        paddingHorizontal: scale(12),
        paddingVertical: verticalScale(6),
        borderRadius: moderateScale(20),
        alignSelf: 'flex-start',
        marginBottom: verticalScale(16),
    },
    accountTypeText: {
        fontSize: moderateScale(12),
        fontFamily: 'Poppins-Medium',
        color: COLORS.yellow,
        marginLeft: scale(6),
    },

    // Input
    inputLabel: {
        fontSize: moderateScale(14),
        fontFamily: 'Poppins-Medium',
        color: COLORS.textSecondary,
        marginBottom: verticalScale(8),
    },
    inputWrapper: {
        marginBottom: verticalScale(16),
    },
    input: {
        backgroundColor: COLORS.inputBg,
        borderRadius: moderateScale(12),
        paddingHorizontal: scale(16),
        paddingVertical: verticalScale(14),
        fontSize: moderateScale(15),
        fontFamily: 'Poppins-Regular',
        color: COLORS.text,
        borderWidth: 1,
        borderColor: COLORS.inputBorder,
    },
    inputError: {
        borderColor: COLORS.accent,
    },
    inputDisabled: {
        opacity: 0.5,
    },

    // Error Message
    errorText: {
        fontSize: moderateScale(12),
        fontFamily: 'Poppins-Regular',
        color: COLORS.accent,
        marginTop: verticalScale(4),
    },

    // Success Message
    successMessage: {
        backgroundColor: 'rgba(76,175,80,0.1)',
        borderRadius: moderateScale(12),
        padding: scale(16),
        marginBottom: verticalScale(16),
        flexDirection: 'row',
        alignItems: 'center',
    },
    successText: {
        fontSize: moderateScale(14),
        fontFamily: 'Poppins-Medium',
        color: COLORS.success,
        marginLeft: scale(8),
        flex: 1,
    },

    // Info Text
    infoText: {
        fontSize: moderateScale(13),
        fontFamily: 'Poppins-Regular',
        color: COLORS.textSecondary,
        marginTop: verticalScale(8),
        lineHeight: moderateScale(20),
    },

    // Save Button
    saveButtonWrapper: {
        marginTop: verticalScale(24),
        borderRadius: moderateScale(12),
        overflow: 'hidden',
    },
    saveButton: {
        paddingVertical: verticalScale(16),
        alignItems: 'center',
        justifyContent: 'center',
    },
    saveButtonDisabled: {
        opacity: 0.5,
    },
    saveButtonText: {
        fontSize: moderateScale(16),
        fontFamily: 'Poppins-Bold',
        color: COLORS.text,
    },

    // Avatar Section
    avatarSection: {
        alignItems: 'center',
        paddingVertical: verticalScale(12),
    },
    avatarPreview: {
        width: moderateScale(120),
        height: moderateScale(120),
        borderRadius: moderateScale(60),
        backgroundColor: COLORS.inputBg,
        borderWidth: 3,
        borderColor: COLORS.yellow,
        overflow: 'hidden',
        marginBottom: verticalScale(16),
    },
    avatarImage: {
        width: '100%',
        height: '100%',
    },
    randomizeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,193,7,0.1)',
        paddingHorizontal: scale(16),
        paddingVertical: verticalScale(10),
        borderRadius: moderateScale(20),
        borderWidth: 1,
        borderColor: COLORS.yellow,
    },
    randomizeText: {
        fontSize: moderateScale(14),
        fontFamily: 'Poppins-Medium',
        color: COLORS.yellow,
        marginLeft: scale(8),
    },

    gradientBtn: {
        ...StyleSheet.absoluteFillObject,
    },

    // Loading
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export { COLORS };
