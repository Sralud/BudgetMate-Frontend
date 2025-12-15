import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { scale, verticalScale, moderateScale } from '../utils/responsive';

const COLORS = {
    cardBg: '#433DA3', // Purple from screenshot
    primary: '#E3823C', // Orange button
    yellow: '#FFC107', // Yellow tags/badges
    text: '#FFFFFF',
    textSecondary: '#D7C7EC',
};

const JobCard = ({ job, onPress, style }) => {
    return (
        <View style={[styles.card, style]}>
            {/* OnlineJobs.ph Source Badge */}
            {job.source === 'onlinejobs.ph' && (
                <View style={styles.sourceBadge}>
                    <Text style={styles.sourceBadgeText}>OnlineJobs.ph</Text>
                </View>
            )}

            <View style={styles.badge}>
                <Text style={styles.badgeText}>{job.difficulty}</Text>
            </View>

            <Text style={styles.cardTitle}>{job.title}</Text>
            <Text style={styles.cardDesc}>{job.description}</Text>

            <View style={styles.cardDetails}>
                <Text style={styles.detailText}>{job.payRange}</Text>
                <Text style={styles.detailText}>{job.timeCommitment}</Text>
            </View>

            <View style={styles.tagRow}>
                {job.tags.map((tag, index) => (
                    <Text key={index} style={styles.tag}>{tag}</Text>
                ))}
            </View>

            <TouchableOpacity
                style={styles.learnMoreBtn}
                activeOpacity={0.8}
                onPress={() => onPress(job)}
            >
                <Text style={styles.learnMoreText}>Learn More</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: COLORS.cardBg,
        width: scale(200), // Fixed width for horizontal scrolling
        padding: scale(16),
        borderRadius: moderateScale(24),
        marginRight: scale(16),
    },
    sourceBadge: {
        backgroundColor: '#4CAF50', // Green for OnlineJobs.ph
        alignSelf: 'flex-start',
        paddingHorizontal: scale(10),
        paddingVertical: verticalScale(4),
        borderRadius: moderateScale(10),
        marginBottom: verticalScale(8),
    },
    sourceBadgeText: {
        fontFamily: 'Poppins-Bold',
        fontSize: moderateScale(9),
        color: '#FFF',
    },
    badge: {
        backgroundColor: COLORS.yellow,
        alignSelf: 'flex-start',
        paddingHorizontal: scale(12),
        paddingVertical: verticalScale(4),
        borderRadius: moderateScale(12),
        marginBottom: verticalScale(12),
    },
    badgeText: {
        fontFamily: 'Poppins-Bold',
        fontSize: moderateScale(10),
        color: '#000',
    },
    cardTitle: {
        fontSize: moderateScale(18),
        fontFamily: 'Poppins-Bold',
        color: COLORS.text,
        marginBottom: verticalScale(4),
    },
    cardDesc: {
        fontSize: moderateScale(12),
        fontFamily: 'Poppins-Regular',
        color: COLORS.textSecondary,
        marginBottom: verticalScale(12),
        lineHeight: verticalScale(18),
    },
    cardDetails: {
        marginBottom: verticalScale(12),
    },
    detailText: {
        color: COLORS.textSecondary,
        fontFamily: 'Poppins-Regular',
        fontSize: moderateScale(12),
        marginBottom: verticalScale(2),
    },
    tagRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: scale(8),
        rowGap: verticalScale(8),
        marginBottom: verticalScale(16),
    },
    tag: {
        backgroundColor: COLORS.yellow,
        color: '#000',
        paddingHorizontal: scale(10),
        paddingVertical: verticalScale(6),
        fontSize: moderateScale(10),
        borderRadius: moderateScale(10),
        fontFamily: 'Poppins-Bold',
        overflow: 'hidden',
        textAlign: 'center',
        textAlignVertical: 'center',
        height: verticalScale(28),
        lineHeight: moderateScale(16),
    },
    learnMoreBtn: {
        backgroundColor: COLORS.primary,
        paddingVertical: verticalScale(10),
        borderRadius: moderateScale(16),
        alignItems: 'center',
        width: '100%',
    },
    learnMoreText: {
        color: '#FFFFFF',
        fontFamily: 'Poppins-Bold',
        fontSize: moderateScale(14),
    },
});

export default JobCard;
