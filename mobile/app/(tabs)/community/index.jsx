import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, Alert, RefreshControl, Modal, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale, scale, verticalScale } from '../../../src/utils/responsive';
import { useFocusEffect, useRouter } from 'expo-router';
import { api } from '../../../src/api/api';
import { styles, COLORS } from '../../styles/communityStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserAvatar } from '../../../src/utils/avatar';
import * as Clipboard from 'expo-clipboard';

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

    // Comment Modal State
    const [commentModalVisible, setCommentModalVisible] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [commentText, setCommentText] = useState('');
    const [commentLoading, setCommentLoading] = useState(false);

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
            // Optional: Don't show alert for every like error to avoid spamming user if it's just connectivity
        }
    };

    const openCommentModal = (post) => {
        setSelectedPost(post);
        setCommentText('');
        setCommentModalVisible(true);
    };

    const submitComment = async () => {
        if (!commentText.trim()) return;

        setCommentLoading(true);
        try {
            const response = await api.post(`/api/posts/${selectedPost._id}/comment`, {
                text: commentText.trim()
            });

            setPosts(prevPosts =>
                prevPosts.map(p =>
                    p._id === selectedPost._id ? response.data : p
                )
            );

            setCommentModalVisible(false);
            setCommentText('');
            setSelectedPost(null);
            Alert.alert('Success', 'Comment posted!');
        } catch (error) {
            console.error('Error posting comment:', error);
            Alert.alert('Error', 'Failed to post comment');
        } finally {
            setCommentLoading(false);
        }
    };

    const handleShare = async (post) => {
        try {
            // Create a shareable link with post ID
            // Format: budgetmate://community/post/{postId}
            const shareLink = `budgetmate://community/post/${post._id}`;
            await Clipboard.setStringAsync(shareLink);
            Alert.alert('Link Copied!', 'Post link copied to clipboard. Share it with your friends!');
        } catch (error) {
            console.error('Error sharing:', error);
            Alert.alert('Error', 'Failed to copy link to clipboard');
        }
    };

    const handlePostClick = (post) => {
        router.push({
            pathname: '/PostDetails',
            params: { post: JSON.stringify(post) }
        });
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
                                        <View style={styles.avatar}>
                                            <Image
                                                source={{
                                                    uri: getUserAvatar({
                                                        avatarSeed: post.user?.avatarSeed,
                                                        email: post.user?.email,
                                                        name: post.user?.name || post.user?.username
                                                    })
                                                }}
                                                style={styles.avatarImage}
                                                resizeMode="cover"
                                            />
                                        </View>
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
                                            onPress={() => openCommentModal(post)}
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

            {/* Comment Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={commentModalVisible}
                onRequestClose={() => setCommentModalVisible(false)}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={{ flex: 1 }}
                >
                    <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
                        <View style={{ backgroundColor: COLORS.cardBg, padding: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
                                <Text style={{ color: COLORS.text, fontSize: 18, fontFamily: 'Poppins-SemiBold' }}>
                                    Add Comment
                                </Text>
                                <TouchableOpacity onPress={() => setCommentModalVisible(false)}>
                                    <MaterialIcons name="close" size={24} color={COLORS.textSecondary} />
                                </TouchableOpacity>
                            </View>

                            <Text style={{ color: COLORS.textSecondary, marginBottom: 10 }}>
                                Replying to <Text style={{ color: COLORS.primary }}>{selectedPost?.title}</Text>
                            </Text>

                            <TextInput
                                style={{
                                    backgroundColor: COLORS.background,
                                    color: COLORS.text,
                                    borderRadius: 12,
                                    padding: 15,
                                    minHeight: 100,
                                    textAlignVertical: 'top',
                                    marginBottom: 15,
                                    fontFamily: 'Poppins-Regular'
                                }}
                                placeholder="What are your thoughts?"
                                placeholderTextColor={COLORS.textSecondary}
                                multiline
                                autoFocus
                                value={commentText}
                                onChangeText={setCommentText}
                            />

                            <TouchableOpacity
                                style={{
                                    backgroundColor: COLORS.primary,
                                    padding: 15,
                                    borderRadius: 12,
                                    alignItems: 'center',
                                    opacity: commentLoading || !commentText.trim() ? 0.7 : 1
                                }}
                                onPress={submitComment}
                                disabled={commentLoading || !commentText.trim()}
                            >
                                <Text style={{ color: COLORS.text, fontFamily: 'Poppins-Bold', fontSize: 16 }}>
                                    {commentLoading ? 'Posting...' : 'Post Comment'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        </SafeAreaView>
    );
};

export default Community;