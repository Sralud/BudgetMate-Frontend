import React, { useState, useCallback } from 'react';
import {
    SafeAreaView,
    View,
    ScrollView,
    Image,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { moderateScale } from '../../src/utils/responsive';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useRouter } from 'expo-router';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { api } from '../../src/api/api';
import { styles, COLORS } from './PersonalInfoStyles';
import { getUserAvatar, generateRandomSeed } from '../../src/utils/avatar';

export default function PersonalInfo() {
    const router = useRouter();

    // User data
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [avatarSeed, setAvatarSeed] = useState('');
    const [accountType, setAccountType] = useState('email'); // 'email' or 'google'

    // Password fields
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // UI states
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Password visibility
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Load user data when screen is focused
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
                setName(user.name || user.username || '');
                setEmail(user.email || '');
                setAvatarSeed(user.avatarSeed || '');
                // Check if user has googleId to determine account type
                setAccountType(user.googleId ? 'google' : 'email');
            }
        } catch (e) {
            console.error('Failed to load user data', e);
            setError('Failed to load user data');
        } finally {
            setLoading(false);
        }
    };

    // Validate email format
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // Randomize avatar
    const handleRandomizeAvatar = () => {
        const newSeed = generateRandomSeed();
        setAvatarSeed(newSeed);
    };

    // Handle profile update (name and email)
    const handleSaveProfile = async () => {
        setError('');
        setSuccessMessage('');

        // Validation
        if (!name.trim()) {
            setError('Name is required');
            return;
        }

        if (!email.trim()) {
            setError('Email is required');
            return;
        }

        if (!validateEmail(email)) {
            setError('Please enter a valid email address');
            return;
        }

        setSaving(true);

        try {
            const response = await api.put('/api/auth/update-profile', {
                name: name.trim(),
                email: email.trim(),
                avatarSeed: avatarSeed,
            });

            // Update local storage with new user data
            const userData = await AsyncStorage.getItem('userData');
            if (userData) {
                const user = JSON.parse(userData);
                user.name = response.data.user.name;
                user.email = response.data.user.email;
                user.avatarSeed = response.data.user.avatarSeed;
                await AsyncStorage.setItem('userData', JSON.stringify(user));
            }

            setSuccessMessage('Profile updated successfully!');

            // Clear success message after 3 seconds
            setTimeout(() => {
                setSuccessMessage('');
            }, 3000);
        } catch (err) {
            console.error('Profile update error:', err);
            setError(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    // Handle password change
    const handleChangePassword = async () => {
        setPasswordError('');
        setSuccessMessage('');

        // Validation
        if (!currentPassword || !newPassword || !confirmPassword) {
            setPasswordError('All password fields are required');
            return;
        }

        if (newPassword.length < 6) {
            setPasswordError('New password must be at least 6 characters');
            return;
        }

        if (newPassword !== confirmPassword) {
            setPasswordError('New passwords do not match');
            return;
        }

        setSaving(true);

        try {
            await api.put('/api/auth/change-password', {
                currentPassword,
                newPassword,
                confirmPassword,
            });

            // Clear password fields
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');

            setSuccessMessage('Password changed successfully!');

            // Clear success message after 3 seconds
            setTimeout(() => {
                setSuccessMessage('');
            }, 3000);
        } catch (err) {
            console.error('Password change error:', err);
            setPasswordError(err.response?.data?.message || 'Failed to change password');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <StatusBar style="light" backgroundColor={COLORS.background} />
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={COLORS.yellow} />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
            <StatusBar style="light" backgroundColor={COLORS.background} translucent={false} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={moderateScale(24)} color={COLORS.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Personal Information</Text>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.content}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Success Message */}
                    {successMessage ? (
                        <View style={styles.successMessage}>
                            <Ionicons name="checkmark-circle" size={moderateScale(20)} color={COLORS.success} />
                            <Text style={styles.successText}>{successMessage}</Text>
                        </View>
                    ) : null}

                    {/* Account Type */}
                    <View style={styles.accountTypeBadge}>
                        <MaterialIcons
                            name={accountType === 'google' ? 'g-translate' : 'email'}
                            size={moderateScale(16)}
                            color={COLORS.yellow}
                        />
                        <Text style={styles.accountTypeText}>
                            {accountType === 'google' ? 'Google Account' : 'Email Account'}
                        </Text>
                    </View>

                    {/* Avatar Section */}
                    <Text style={styles.sectionTitle}>Profile Picture</Text>
                    <View style={styles.sectionCard}>
                        <View style={styles.avatarSection}>
                            <View style={styles.avatarPreview}>
                                <Image
                                    source={{ uri: getUserAvatar({ avatarSeed, email, name }) }}
                                    style={styles.avatarImage}
                                    resizeMode="contain"
                                />
                            </View>
                            <TouchableOpacity
                                style={styles.randomizeButton}
                                onPress={handleRandomizeAvatar}
                                disabled={saving}
                            >
                                <MaterialIcons name="refresh" size={moderateScale(20)} color={COLORS.yellow} />
                                <Text style={styles.randomizeText}>Randomize Avatar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Profile Information Section */}
                    <Text style={styles.sectionTitle}>Profile Information</Text>
                    <View style={styles.sectionCard}>
                        {/* Name Input */}
                        <View style={styles.inputWrapper}>
                            <Text style={styles.inputLabel}>Name</Text>
                            <TextInput
                                style={[styles.input, error && !name.trim() && styles.inputError]}
                                value={name}
                                onChangeText={setName}
                                placeholder="Enter your name"
                                placeholderTextColor="rgba(255,255,255,0.3)"
                                editable={!saving}
                            />
                        </View>

                        {/* Email Input */}
                        <View style={styles.inputWrapper}>
                            <Text style={styles.inputLabel}>Email</Text>
                            <TextInput
                                style={[styles.input, error && !validateEmail(email) && styles.inputError]}
                                value={email}
                                onChangeText={setEmail}
                                placeholder="Enter your email"
                                placeholderTextColor="rgba(255,255,255,0.3)"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                editable={!saving}
                            />
                        </View>

                        {/* Error Message */}
                        {error ? <Text style={styles.errorText}>{error}</Text> : null}

                        {/* Save Profile Button */}
                        <TouchableOpacity
                            style={[styles.saveButtonWrapper, saving && styles.saveButtonDisabled]}
                            activeOpacity={0.7}
                            onPress={handleSaveProfile}
                            disabled={saving}
                        >
                            <LinearGradient
                                colors={[COLORS.primary, '#E3A23C']}
                                style={styles.gradientBtn}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                            />
                            <View style={styles.saveButton}>
                                {saving ? (
                                    <ActivityIndicator size="small" color={COLORS.text} />
                                ) : (
                                    <Text style={styles.saveButtonText}>Save Profile</Text>
                                )}
                            </View>
                        </TouchableOpacity>
                    </View>

                    {/* Change Password Section - Only for email users */}
                    {accountType === 'email' && (
                        <>
                            <Text style={styles.sectionTitle}>Change Password</Text>
                            <View style={styles.sectionCard}>
                                {/* Current Password */}
                                <View style={styles.inputWrapper}>
                                    <Text style={styles.inputLabel}>Current Password</Text>
                                    <View style={{ position: 'relative' }}>
                                        <TextInput
                                            style={[styles.input, passwordError && !currentPassword && styles.inputError]}
                                            value={currentPassword}
                                            onChangeText={setCurrentPassword}
                                            placeholder="Enter current password"
                                            placeholderTextColor="rgba(255,255,255,0.3)"
                                            secureTextEntry={!showCurrentPassword}
                                            editable={!saving}
                                        />
                                        <TouchableOpacity
                                            style={{
                                                position: 'absolute',
                                                right: moderateScale(12),
                                                top: moderateScale(14),
                                            }}
                                            onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                                        >
                                            <Ionicons
                                                name={showCurrentPassword ? 'eye-off' : 'eye'}
                                                size={moderateScale(20)}
                                                color={COLORS.textSecondary}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                {/* New Password */}
                                <View style={styles.inputWrapper}>
                                    <Text style={styles.inputLabel}>New Password</Text>
                                    <View style={{ position: 'relative' }}>
                                        <TextInput
                                            style={[styles.input, passwordError && newPassword.length < 6 && styles.inputError]}
                                            value={newPassword}
                                            onChangeText={setNewPassword}
                                            placeholder="Enter new password"
                                            placeholderTextColor="rgba(255,255,255,0.3)"
                                            secureTextEntry={!showNewPassword}
                                            editable={!saving}
                                        />
                                        <TouchableOpacity
                                            style={{
                                                position: 'absolute',
                                                right: moderateScale(12),
                                                top: moderateScale(14),
                                            }}
                                            onPress={() => setShowNewPassword(!showNewPassword)}
                                        >
                                            <Ionicons
                                                name={showNewPassword ? 'eye-off' : 'eye'}
                                                size={moderateScale(20)}
                                                color={COLORS.textSecondary}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                    <Text style={styles.infoText}>Must be at least 6 characters</Text>
                                </View>

                                {/* Confirm Password */}
                                <View style={styles.inputWrapper}>
                                    <Text style={styles.inputLabel}>Confirm New Password</Text>
                                    <View style={{ position: 'relative' }}>
                                        <TextInput
                                            style={[
                                                styles.input,
                                                passwordError && newPassword !== confirmPassword && styles.inputError,
                                            ]}
                                            value={confirmPassword}
                                            onChangeText={setConfirmPassword}
                                            placeholder="Confirm new password"
                                            placeholderTextColor="rgba(255,255,255,0.3)"
                                            secureTextEntry={!showConfirmPassword}
                                            editable={!saving}
                                        />
                                        <TouchableOpacity
                                            style={{
                                                position: 'absolute',
                                                right: moderateScale(12),
                                                top: moderateScale(14),
                                            }}
                                            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                        >
                                            <Ionicons
                                                name={showConfirmPassword ? 'eye-off' : 'eye'}
                                                size={moderateScale(20)}
                                                color={COLORS.textSecondary}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                {/* Password Error Message */}
                                {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

                                {/* Change Password Button */}
                                <TouchableOpacity
                                    style={[styles.saveButtonWrapper, saving && styles.saveButtonDisabled]}
                                    activeOpacity={0.7}
                                    onPress={handleChangePassword}
                                    disabled={saving}
                                >
                                    <LinearGradient
                                        colors={[COLORS.accent, COLORS.primary]}
                                        style={styles.gradientBtn}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                    />
                                    <View style={styles.saveButton}>
                                        {saving ? (
                                            <ActivityIndicator size="small" color={COLORS.text} />
                                        ) : (
                                            <Text style={styles.saveButtonText}>Change Password</Text>
                                        )}
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </>
                    )}

                    {/* Info for Google users */}
                    {accountType === 'google' && (
                        <View style={styles.sectionCard}>
                            <Text style={styles.infoText}>
                                You're signed in with Google. Password management is handled through your Google account.
                            </Text>
                        </View>
                    )}
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
