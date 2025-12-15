import { StyleSheet } from 'react-native';
import { scale, verticalScale, moderateScale } from '../../src/utils/responsive';

const COLORS = {
    background: '#141326',
    cardBg: '#433DA3',
    primary: '#E3823C',
    accent: '#E33C3C',
    text: '#FFFFFF',
    textSecondary: '#D7C7EC',
    yellow: '#FFC107',
    inputBg: '#2B2769',
};

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    scrollContent: {
        padding: scale(15),
        paddingBottom: verticalScale(20),
    },

    /** SEARCH BAR */
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1F1C3E',
        paddingHorizontal: scale(12),
        paddingVertical: verticalScale(10),
        borderRadius: moderateScale(12),
        marginTop: verticalScale(10),
        borderWidth: 1,
        borderColor: COLORS.cardBg,
    },
    searchInput: {
        marginLeft: scale(10),
        color: COLORS.text,
        flex: 1,
        fontFamily: 'Poppins-Regular',
    },

    /** JOBS SECTION */
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: verticalScale(24),
        marginBottom: verticalScale(12),
    },
    sectionTitle: {
        fontSize: moderateScale(18),
        fontFamily: 'Poppins-Bold',
        color: COLORS.text,
    },
    seeAllText: {
        fontSize: moderateScale(14),
        fontFamily: 'Poppins-Medium',
        color: COLORS.primary,
    },
    jobsScroll: {
        paddingRight: scale(20),
    },

    /** CATEGORY TABS */
    categoryTab: {
        paddingHorizontal: scale(16),
        paddingVertical: verticalScale(10),
        borderRadius: moderateScale(20),
        backgroundColor: '#1F1C3E',
        marginRight: scale(10),
        borderWidth: 1,
        borderColor: COLORS.cardBg,
    },
    categoryTabActive: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    categoryTabText: {
        fontSize: moderateScale(13),
        fontFamily: 'Poppins-Medium',
        color: COLORS.textSecondary,
    },
    categoryTabTextActive: {
        color: COLORS.text,
        fontFamily: 'Poppins-Bold',
    },

    /** EARNINGS */
    earningsContainer: {
        marginTop: verticalScale(30),
        alignItems: 'center',
    },
    earningsAmount: {
        fontSize: moderateScale(30),
        fontFamily: 'Poppins-Bold',
        color: COLORS.yellow,
    },
    earningsText: {
        fontSize: moderateScale(13),
        color: COLORS.textSecondary,
        marginTop: verticalScale(5),
        fontFamily: 'Poppins-Regular',
    },
    detailsLink: {
        color: COLORS.text,
        fontFamily: 'Poppins-Bold',
    },
    learnMoreBtn: {
        marginTop: verticalScale(12),
        backgroundColor: COLORS.primary,
        paddingVertical: verticalScale(8),
        paddingHorizontal: scale(20),
        borderRadius: moderateScale(12),
        alignItems: 'center',
    },
    learnMoreText: {
        color: '#FFFFFF',
        fontFamily: 'Poppins-Bold',
        fontSize: moderateScale(12),
    },

    /** CHART */
    chartWrapper: {
        marginTop: verticalScale(20),
    },

    /** MODAL STYLES */
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '90%',
        maxHeight: '80%',
        borderRadius: moderateScale(20),
        padding: scale(24),
        overflow: 'hidden',
    },
    gradientFill: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: verticalScale(16),
    },
    modalTitle: {
        fontSize: moderateScale(24),
        fontFamily: 'Poppins-Bold',
        color: COLORS.yellow,
        marginBottom: verticalScale(12),
    },
    modalBadge: {
        backgroundColor: COLORS.yellow,
        alignSelf: 'flex-start',
        paddingHorizontal: scale(12),
        paddingVertical: verticalScale(6),
        borderRadius: moderateScale(10),
        marginBottom: verticalScale(16),
    },
    modalBadgeText: {
        fontFamily: 'Poppins-Bold',
        fontSize: moderateScale(12),
        color: '#000',
    },
    modalSectionTitle: {
        fontSize: moderateScale(18),
        fontFamily: 'Poppins-SemiBold',
        color: COLORS.yellow,
        marginTop: verticalScale(16),
        marginBottom: verticalScale(8),
    },
    modalText: {
        fontSize: moderateScale(14),
        fontFamily: 'Poppins-Regular',
        color: COLORS.text,
        lineHeight: moderateScale(22),
        marginBottom: verticalScale(4),
    },
    closeButton: {
        marginTop: verticalScale(20),
        backgroundColor: COLORS.primary,
        paddingVertical: verticalScale(12),
        borderRadius: moderateScale(12),
        alignItems: 'center',
    },
    closeButtonText: {
        color: COLORS.text,
        fontFamily: 'Poppins-Bold',
        fontSize: moderateScale(16),
    },

    /** INPUT STYLES */
    inputLabel: {
        color: COLORS.text,
        fontSize: moderateScale(14),
        fontFamily: 'Poppins-Medium',
        marginTop: verticalScale(12),
        marginBottom: verticalScale(6),
    },
    input: {
        backgroundColor: COLORS.inputBg,
        color: COLORS.text,
        padding: scale(12),
        borderRadius: moderateScale(12),
        fontSize: moderateScale(16),
        fontFamily: 'Poppins-Regular',
        borderWidth: 1,
        borderColor: '#433DA3',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: verticalScale(24),
    },
    modalBtn: {
        flex: 1,
        paddingVertical: verticalScale(12),
        borderRadius: moderateScale(12),
        alignItems: 'center',
        marginHorizontal: scale(6),
    },
    cancelBtn: {
        backgroundColor: '#433DA3',
    },
    saveBtn: {
        backgroundColor: COLORS.primary,
    },
    modalBtnText: {
        color: '#FFFFFF',
        fontFamily: 'Poppins-Bold',
        fontSize: moderateScale(14),
    },

    /** EMPTY SEARCH STATE */
    emptySearch: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: verticalScale(20),
    },
    emptySearchText: {
        fontSize: moderateScale(14),
        fontFamily: 'Poppins-SemiBold',
        color: COLORS.textSecondary,
    },
});

export { COLORS };
