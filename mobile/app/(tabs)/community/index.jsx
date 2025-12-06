import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale } from '../../../src/utils/responsive';
import { useFocusEffect, useRouter } from 'expo-router';
import { api } from '../../../src/api/api';
import { styles, COLORS } from './styles';

const CATEGORIES = [
    { id: 'all', label: 'All', color: COLORS.yellow },
    { id: 'budgeting', label: 'Budgeting', color: COLORS.yellow },
    { id: 'savings', label: 'Savings', color: COLORS.primary },
    { id: 'side-hustles', label: 'Side Hustles', color: COLORS.yellow },
    { id: 'mental-health', label: 'Mental Health', color: COLORS.text },
];

const Community = () => {
    const router = useRouter();
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useFocusEffect(
        useCallback(() => {
            loadPosts();
        }, [])
    );

    // Action: Fetch Posts from Backend
    // Connects to /api/posts to get the latest community discussions
    const loadPosts = async () => {
        try {
            const response = await api.get('/api/posts');
            setPosts(response.data);
        } catch (error) {
            console.error('Error loading posts:', error);
            Alert.alert('Error', 'Failed to load posts');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        loadPosts();
    };

    // Filter posts based on selected category
    const filteredPosts = selectedCategory === 'all'
        ? posts
        : posts.filter(post =>
            post.category.toLowerCase() === selectedCategory.toLowerCase() ||
            post.category.toLowerCase().replace(' ', '-') === selectedCategory
        );

    const handleLike = async (postId) => {
        try {
            const response = await api.post(`/api/posts/${postId}/like`);
            // Update the post in the list
            setPosts(prevPosts =>
                prevPosts.map(post =>
                    post._id === postId ? response.data : post
                )
            );
        } catch (error) {
            console.error('Error liking post:', error);
            Alert.alert('Error', 'Failed to like post');
        }
    };

    const handleComment = async (post) => {
        Alert.prompt(
            'Add Comment',
            `Comment on "${post.title}"`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Post',
                    onPress: async (text) => {
                        if (!text || !text.trim()) return;

                        try {
                            const response = await api.post(`/api/posts/${post._id}/comment`, {
                                text: text.trim()
                            });
                            setPosts(prevPosts =>
                                prevPosts.map(p =>
                                    p._id === post._id ? response.data : p
                                )
                            );
                            Alert.alert('Success', 'Comment posted!');
                        } catch (error) {
                            console.error('Error posting comment:', error);
                            Alert.alert('Error', 'Failed to post comment');
                        }
                    }
                }
            ],
            'plain-text'
        );
    };

    const handleShare = (post) => {
        Alert.alert(
            'Share Post',
            `Share "${post.title}" with your friends?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Share',
                    onPress: () => {
                        Alert.alert('Shared!', 'Post shared successfully!');
                    }
                }
            ]
        );
    };

    const handlePostClick = (post) => {
        const commentsText = post.comments.length > 0
            ? `\n\nComments (${post.comments.length}):\n` +
            post.comments.slice(0, 3).map(c => `• ${c.text}`).join('\n')
            : '';

        Alert.alert(
            post.title,
            `${post.content}${commentsText}\n\nPosted by ${post.user?.username || 'Unknown'}`,
            [{ text: 'Close', style: 'cancel' }]
        );
    };

    const getTimeAgo = (dateString) => {
        const now = new Date();
        const postDate = new Date(dateString);
        const diffMs = now - postDate;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMins < 60) return `${diffMins}m`;
        if (diffHours < 24) return `${diffHours}h`;
        return `${diffDays}d`;
    };

    return (
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
            <StatusBar style="light" backgroundColor={COLORS.background} translucent={false} />

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
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>Communities</Text>
                    <Text style={styles.subtitle}>Connect with others on their financial journey</Text>
                </View>

                {/* Category Filter Pills */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.categoriesContainer}
                    contentContainerStyle={styles.categoriesContent}
                >
                    {CATEGORIES.map((category) => (
                        <TouchableOpacity
                            key={category.id}
                            style={[
                                styles.categoryPill,
                                selectedCategory === category.id && styles.categoryPillActive,
                            ]}
                            onPress={() => setSelectedCategory(category.id)}
                        >
                            <Text
                                style={[
                                    styles.categoryText,
                                    selectedCategory === category.id && styles.categoryTextActive,
                                ]}
                            >
                                {category.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Posts */}
                <View style={styles.postsContainer}>
                    {filteredPosts.length > 0 ? (
                        filteredPosts.map((post) => {
                            const isLiked = post.likes && post.likes.some(like => like === global.userId);
                            const categoryColor = CATEGORIES.find(c =>
                                c.label.toLowerCase() === post.category.toLowerCase()
                            )?.color || COLORS.yellow;

                            return (
                                <TouchableOpacity
                                    key={post._id}
                                    style={styles.postCard}
                                    onPress={() => handlePostClick(post)}
                                >
                                    {/* User Info */}
                                    <View style={styles.postHeader}>
                                        <View style={styles.avatar} />
                                        <View style={styles.postHeaderText}>
                                            <View style={styles.titleRow}>
                                                <Text style={styles.postTitle} numberOfLines={1}>
                                                    {post.title}
                                                </Text>
                                                <View style={[styles.categoryBadge, { backgroundColor: categoryColor }]}>
                                                    <Text style={styles.categoryBadgeText}>{post.category}</Text>
                                                </View>
                                            </View>
                                            <Text style={styles.postMeta}>
                                                {post.user?.username || 'Anonymous'} · {getTimeAgo(post.createdAt)}
                                            </Text>
                                        </View>
                                    </View>

                                    {/* Post Content */}
                                    <Text style={styles.postContent} numberOfLines={2}>
                                        {post.content}
                                    </Text>

                                    {/* Engagement Metrics */}
                                    <View style={styles.postFooter}>
                                        <TouchableOpacity
                                            style={styles.engagementItem}
                                            onPress={() => handleComment(post)}
                                        >
                                            <MaterialIcons name="chat-bubble-outline" size={moderateScale(18)} color={COLORS.textSecondary} />
                                            <Text style={styles.engagementText}>{post.comments?.length || 0}</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={styles.engagementItem}
                                            onPress={() => handleLike(post._id)}
                                        >
                                            <MaterialIcons
                                                name={isLiked ? "favorite" : "favorite-border"}
                                                size={moderateScale(18)}
                                                color={isLiked ? COLORS.accent : COLORS.textSecondary}
                                            />
                                            <Text style={[
                                                styles.engagementText,
                                                isLiked && { color: COLORS.accent }
                                            ]}>{post.likes?.length || 0}</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={styles.engagementItem}
                                            onPress={() => handleShare(post)}
                                        >
                                            <MaterialIcons name="share" size={moderateScale(18)} color={COLORS.textSecondary} />
                                        </TouchableOpacity>
                                    </View>
                                </TouchableOpacity>
                            );
                        })
                    ) : (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyStateText}>No posts in this category yet</Text>
                            <Text style={styles.emptyStateSubtext}>Be the first to post!</Text>
                        </View>
                    )}
                </View>
            </ScrollView>

            {/* Floating Action Button */}
            <TouchableOpacity
                style={styles.fab}
                onPress={() => router.push('/CreatePost')}
                activeOpacity={0.8}
            >
                <MaterialIcons name="add" size={moderateScale(28)} color={COLORS.text} />
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default Community;