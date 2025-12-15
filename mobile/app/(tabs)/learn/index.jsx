import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, RefreshControl, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ResourceCard from '../../../src/components/ResourceCard';
import { fetchArticles } from '../../../src/api/api';
import { styles, COLORS } from '../../styles/learnStyles';

const Learn = () => {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);

    // Check if user is admin directly from the user object
    const isAdmin = user?.role === 'admin';

    // Load articles from API
    const loadArticles = async () => {
        try {
            setError(null);
            const data = await fetchArticles();
            setArticles(data.articles || []);
        } catch (err) {
            console.error('Error loading articles:', err);
            setError('Failed to load articles. Please try again.');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    // Load user data from AsyncStorage
    const loadUser = async () => {
        try {
            const userDataStr = await AsyncStorage.getItem('userData');
            if (userDataStr) {
                const userData = JSON.parse(userDataStr);
                setUser(userData);
            }
        } catch (error) {
            console.error('Error loading user data:', error);
        }
    };

    useEffect(() => {
        loadUser();
        loadArticles();
    }, []);

    // Handle pull-to-refresh
    const onRefresh = () => {
        setRefreshing(true);
        loadArticles();
    };

    // Navigate to admin panel
    const navigateToAdminPanel = () => {
        router.push('/admin-panel');
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <StatusBar style="light" backgroundColor={COLORS.background} />
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                    <Text style={styles.loadingText}>Loading articles...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="light" backgroundColor={COLORS.background} />

            <View style={styles.header}>
                <Text style={styles.title}>Financial Resources</Text>
                <Text style={styles.subtitle}>Curated articles to help you grow.</Text>
            </View>

            {/* Error Message */}
            {error && (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            )}

            {/* Articles List */}
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={COLORS.primary}
                        colors={[COLORS.primary]}
                    />
                }
            >
                {articles.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <MaterialIcons name="article" size={64} color={COLORS.textSecondary} />
                        <Text style={styles.emptyText}>No articles available yet.</Text>
                        {isAdmin && (
                            <Text style={styles.emptySubtext}>
                                Tap the + button to add your first article!
                            </Text>
                        )}
                    </View>
                ) : (
                    articles.map((item) => (
                        <ResourceCard
                            key={item._id}
                            title={item.title}
                            description={item.description}
                            url={item.url}
                            iconName={item.iconName}
                            color={item.color}
                        />
                    ))
                )}
            </ScrollView>

            {/* Admin FAB (Floating Action Button) */}
            {isAdmin && (
                <TouchableOpacity
                    style={styles.fab}
                    onPress={navigateToAdminPanel}
                    activeOpacity={0.8}
                >
                    <MaterialIcons name="admin-panel-settings" size={28} color="#FFFFFF" />
                </TouchableOpacity>
            )}
        </SafeAreaView>
    );
};

export default Learn;

