import { StyleSheet } from 'react-native';
import { scale, verticalScale, moderateScale } from '../../src/utils/responsive';


const COLORS = {
    background: '#141326',
    cardBg: '#2A265C',
    primary: '#E3823C',
    accent: '#E33C3C',
    text: '#FFFFFF',
    textSecondary: '#D7C7EC',
    yellow: '#FFC107',
    success: '#4CAF50',
};

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollView: {
        flex: 1,
    },
    content: {
        padding: scale(20),
        paddingBottom: verticalScale(100),
    },

    // Header
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: verticalScale(24),
    },
    dateText: {
        fontSize: moderateScale(12),
        fontFamily: 'Poppins-Regular',
        color: COLORS.textSecondary,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    greeting: {
        fontSize: moderateScale(24),
        fontFamily: 'Poppins-Bold',
        color: COLORS.text,
    },
    profileButton: {
        padding: scale(4),
    },
    avatarPlaceholder: {
        width: moderateScale(40),
        height: moderateScale(40),
        borderRadius: moderateScale(20),
        backgroundColor: COLORS.cardBg,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.textSecondary,
    },
    avatarText: {
        fontSize: moderateScale(18),
        fontFamily: 'Poppins-Bold',
        color: COLORS.text,
    },
    avatarImage: {
        width: moderateScale(40),
        height: moderateScale(40),
        borderRadius: moderateScale(20),
        backgroundColor: COLORS.cardBg,
    },

    // Actions
    actionRow: {
        flexDirection: 'row',
        gap: scale(16),
        marginBottom: verticalScale(28),
    },
    actionButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: verticalScale(14),
        borderRadius: moderateScale(16),
        gap: scale(8),
    },
    primaryAction: {
        backgroundColor: COLORS.primary,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    secondaryAction: {
        backgroundColor: COLORS.cardBg,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    actionText: {
        fontSize: moderateScale(14),
        fontFamily: 'Poppins-SemiBold',
        color: COLORS.text,
    },

    // Goals
    goalsRow: {
        flexDirection: 'row',
        gap: scale(16),
        marginBottom: verticalScale(24),
    },

    // Sections
    section: {
        marginBottom: verticalScale(24),
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: verticalScale(16),
    },
    sectionTitle: {
        fontSize: moderateScale(18),
        fontFamily: 'Poppins-SemiBold',
        color: COLORS.text,
    },
    linkText: {
        fontSize: moderateScale(14),
        fontFamily: 'Poppins-Medium',
        color: COLORS.primary,
    },
    emptyText: {
        fontSize: moderateScale(14),
        fontFamily: 'Poppins-Regular',
        color: COLORS.textSecondary,
        textAlign: 'center',
        marginTop: verticalScale(8),
    },
});

export { COLORS };
