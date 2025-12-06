import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { api } from '../api/api';

/**
 * Custom hook for authentication
 * @returns {object} Auth state and methods
 */
export const useAuth = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();

    // Load user data on mount (when the app starts)
    useEffect(() => {
        loadUserData();
    }, []);

    // Helper: Checks if we are already logged in by looking at local storage
    const loadUserData = async () => {
        try {
            // Check if 'userData' exists in the phone's storage
            const userData = await AsyncStorage.getItem('userData');
            if (userData) {
                const parsedUser = JSON.parse(userData);
                setUser(parsedUser); // Set the user state
                setIsAuthenticated(true); // Mark as logged in
            }
        } catch (error) {
            console.error('Error loading user data:', error);
        } finally {
            setLoading(false); // Done loading, whether success or fail
        }
    };

    // Action: Log in the user with email/password
    const login = async (credentials) => {
        try {
            // Send request to backend
            const response = await api.post('/api/auth/login', credentials);
            const { token, user: userData } = response.data;

            // 1. Store the token globally for API calls
            global.authToken = token;

            // 2. Save user info permanently on the device
            await AsyncStorage.setItem('userData', JSON.stringify(userData));

            // 3. Update the app state
            setUser(userData);
            setIsAuthenticated(true);

            return { success: true, user: userData };
        } catch (error) {
            console.error('Login error:', error);
            return {
                success: false,
                error: error?.response?.data?.message || 'Login failed',
            };
        }
    };

    const signup = async (userData) => {
        try {
            const response = await api.post('/api/auth/signup', userData);
            const { token, user: newUser } = response.data;

            // Store token
            global.authToken = token;

            // Save user data
            await AsyncStorage.setItem('userData', JSON.stringify(newUser));

            setUser(newUser);
            setIsAuthenticated(true);

            return { success: true, user: newUser };
        } catch (error) {
            console.error('Signup error:', error);
            return {
                success: false,
                error: error?.response?.data?.message || 'Signup failed',
            };
        }
    };

    // Action: Log out and clear all data
    const logout = async () => {
        try {
            // 1. Remove user info and budget data from storage
            await AsyncStorage.multiRemove(['userData', 'userBudget']);

            // 2. Clear the global token
            global.authToken = null;

            // 3. Reset state
            setUser(null);
            setIsAuthenticated(false);

            // 4. Send user back to Login screen
            router.replace('/auth/Login');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const updateUser = async (updates) => {
        try {
            const updatedUser = { ...user, ...updates };
            await AsyncStorage.setItem('userData', JSON.stringify(updatedUser));
            setUser(updatedUser);
            return { success: true };
        } catch (error) {
            console.error('Update user error:', error);
            return { success: false, error: 'Failed to update user' };
        }
    };

    return {
        user,
        loading,
        isAuthenticated,
        login,
        signup,
        logout,
        updateUser,
    };
};

export default useAuth;
