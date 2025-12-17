import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, TextInput, Alert, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../src/api/api';
import { COLORS } from './styles/communityStyles';
import { getUserAvatar } from '../src/utils/avatar';

const PostDetails = () => {
    const router = useRouter();
    const params = useLocalSearchParams();
    const [post, setPost] = useState(params.post ? JSON.parse(params.post) : null);
    const [commentText, setCommentText] = useState('');
    const [loading, setLoading] = useState(false);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [userRole, setUserRole] = useState('user');
    const [editingCommentId, setEditingCommentId] = useState(null);

    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = async () => {
        try {
            const userData = await AsyncStorage.getItem('userData');
            if (userData) {
                const { id, role } = JSON.parse(userData);
                setCurrentUserId(id);
                setUserRole(role || 'user');
            } else if (global.userId) {
                setCurrentUserId(global.userId);
            }
        } catch (error) {
            console.error('Error loading user data:', error);
        }
    };

    const handleBack = () => {
        router.back();
    };

    const handleLike = async () => {
        if (!post) return;
        try {
            const response = await api.post(`/api/posts/${post._id}/like`);
            setPost(response.data);
        } catch (error) {
            console.error('Error liking post:', error);
            Alert.alert('Error', 'Failed to like post');
        }
    };

    const submitComment = async () => {
        if (!commentText.trim()) return;

        setLoading(true);
        try {
            if (editingCommentId) {
                // Update existing comment
                const response = await api.put(`/api/posts/${post._id}/comment/${editingCommentId}`, {
                    text: commentText.trim()
                });
                setPost(response.data);
                Alert.alert('Success', 'Comment updated');
            } else {
                // Create new comment
                const response = await api.post(`/api/posts/${post._id}/comment`, {
                    text: commentText.trim()
                });
                setPost(response.data);
            }

            setCommentText('');
            setEditingCommentId(null);
        } catch (error) {
            console.error('Error submitting comment:', error);
            Alert.alert('Error', 'Failed to submit comment');
        } finally {
            setLoading(false);
        }
    };

    const handleDeletePost = () => {
        Alert.alert(
            'Delete Post',
            'Are you sure you want to delete this post?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await api.delete(`/api/posts/${post._id}`);
                            Alert.alert('Deleted', 'Post deleted successfully', [
                                { text: 'OK', onPress: () => router.push('/(tabs)/community') }
                            ]);
                        } catch (error) {
                            console.error('Error deleting post:', error);
                            Alert.alert('Error', 'Failed to delete post');
                        }
                    }
                }
            ]
        );
    };

    const handleEditPost = () => {
        router.push({
            pathname: '/CreatePost',
            params: { post: JSON.stringify(post) }
        });
    };

    const handleDeleteComment = (commentId) => {
        Alert.alert(
            'Delete Comment',
            'Are you sure you want to delete this comment?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const response = await api.delete(`/api/posts/${post._id}/comment/${commentId}`);
                            setPost(response.data);
                            Alert.alert('Deleted', 'Comment deleted successfully');
                        } catch (error) {
                            console.error('Error deleting comment:', error);
                            Alert.alert('Error', 'Failed to delete comment');
                        }
                    }
                }
            ]
        );
    };

    const handleStartEditComment = (comment) => {
        setCommentText(comment.text);
        setEditingCommentId(comment._id);
    };

    const handleCancelEditComment = () => {
        setCommentText('');
        setEditingCommentId(null);
    };

    if (!post) {
        return (
            <SafeAreaView style={styles.container}>
                <Text style={{ color: COLORS.text, textAlign: 'center', marginTop: 20 }}>Post not found</Text>
            </SafeAreaView>
        );
    }

    const isLiked = post.likes && currentUserId && post.likes.includes(currentUserId);
    const isPostOwner = currentUserId && post.user?._id === currentUserId;
    const canDeletePost = isPostOwner || userRole === 'admin';

    return (
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
            <StatusBar style="light" backgroundColor={COLORS.background} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                    <MaterialIcons name="arrow-back" size={24} color={COLORS.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle} numberOfLines={1}>Post Details</Text>

                {canDeletePost ? (
                    <View style={{ flexDirection: 'row' }}>
                        {isPostOwner && (
                            <TouchableOpacity onPress={handleEditPost} style={{ padding: 8 }}>
                                <MaterialIcons name="edit" size={24} color={COLORS.primary} />
                            </TouchableOpacity>
                        )}
                        <TouchableOpacity onPress={handleDeletePost} style={{ padding: 8 }}>
                            <MaterialIcons name="delete" size={24} color={COLORS.accent} />
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={{ width: 24 }} />
                )}
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={{ flex: 1 }}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
            >
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    {/* Post Content */}
                    <View style={styles.card}>
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
                            <View>
                                <Text style={styles.username}>{post.user?.username || 'Anonymous'}</Text>
                                <Text style={styles.meta}>
                                    {new Date(post.createdAt).toLocaleDateString()} · {post.category}
                                </Text>
                            </View>
                        </View>

                        <Text style={styles.title}>{post.title}</Text>
                        <Text style={styles.body}>{post.content}</Text>

                        <View style={styles.actions}>
                            <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
                                <MaterialIcons
                                    name={isLiked ? "favorite" : "favorite-border"}
                                    size={24}
                                    color={isLiked ? COLORS.accent : COLORS.textSecondary}
                                />
                                <Text style={[styles.actionText, isLiked && { color: COLORS.accent }]}>
                                    {post.likes?.length || 0} Likes
                                </Text>
                            </TouchableOpacity>
                            <View style={styles.actionButton}>
                                <MaterialIcons name="chat-bubble-outline" size={24} color={COLORS.textSecondary} />
                                <Text style={styles.actionText}>{post.comments?.length || 0} Comments</Text>
                            </View>
                        </View>
                    </View>

                    {/* Comments Section */}
                    <Text style={styles.sectionTitle}>Comments</Text>

                    {post.comments && post.comments.length > 0 ? (
                        post.comments.map((comment, index) => {
                            const isCommentOwner = currentUserId && comment.user?._id === currentUserId;
                            const canDeleteComment = isCommentOwner || userRole === 'admin';

                            return (
                                <View key={index} style={styles.commentCard}>
                                    <View style={styles.commentHeader}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                                            <View style={styles.commentAvatar}>
                                                <Image
                                                    source={{
                                                        uri: getUserAvatar({
                                                            avatarSeed: comment.user?.avatarSeed,
                                                            email: comment.user?.email,
                                                            name: comment.user?.name || comment.user?.username
                                                        })
                                                    }}
                                                    style={styles.avatarImage}
                                                    resizeMode="cover"
                                                />
                                            </View>
                                            <Text style={styles.commentUser}>
                                                {comment.user ? (comment.user.username || comment.user.name) : 'User'}
                                            </Text>
                                        </View>

                                        {/* Comment Actions */}
                                        <View style={{ flexDirection: 'row' }}>
                                            {isCommentOwner && (
                                                <TouchableOpacity
                                                    onPress={() => handleStartEditComment(comment)}
                                                    style={{ padding: 4, marginRight: 8 }}
                                                >
                                                    <MaterialIcons name="edit" size={18} color={COLORS.textSecondary} />
                                                </TouchableOpacity>
                                            )}
                                            {canDeleteComment && (
                                                <TouchableOpacity
                                                    onPress={() => handleDeleteComment(comment._id)}
                                                    style={{ padding: 4 }}
                                                >
                                                    <MaterialIcons name="delete" size={18} color={COLORS.accent} />
                                                </TouchableOpacity>
                                            )}
                                        </View>
                                    </View>
                                    <Text style={styles.commentText}>{comment.text}</Text>
                                </View>
                            );
                        })
                    ) : (
                        <Text style={styles.emptyComments}>No comments yet. Be the first!</Text>
                    )}
                </ScrollView>

                {/* Comment Input */}
                <View style={styles.footer}>
                    {editingCommentId && (
                        <TouchableOpacity onPress={handleCancelEditComment} style={{ marginRight: 10 }}>
                            <MaterialIcons name="close" size={24} color={COLORS.accent} />
                        </TouchableOpacity>
                    )}
                    <TextInput
                        style={styles.input}
                        placeholder={editingCommentId ? "Update your comment..." : "Write a comment..."}
                        placeholderTextColor={COLORS.textSecondary}
                        value={commentText}
                        onChangeText={setCommentText}
                        multiline
                    />
                    <TouchableOpacity
                        style={[styles.sendButton, (!commentText.trim() || loading) && { opacity: 0.5 }]}
                        onPress={submitComment}
                        disabled={!commentText.trim() || loading}
                    >
                        <MaterialIcons name={editingCommentId ? "check" : "send"} size={24} color="#FFF" />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#2C2B3E',
        justifyContent: 'space-between'
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontFamily: 'Poppins-SemiBold',
        color: COLORS.text,
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 80,
    },
    card: {
        backgroundColor: COLORS.cardBg,
        borderRadius: 16,
        padding: 16,
        marginBottom: 24,
    },
    postHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.primary,
        marginRight: 12,
        overflow: 'hidden',
    },
    avatarImage: {
        width: '100%',
        height: '100%',
    },
    username: {
        fontSize: 16,
        fontFamily: 'Poppins-SemiBold',
        color: COLORS.text,
    },
    meta: {
        fontSize: 12,
        color: COLORS.textSecondary,
    },
    title: {
        fontSize: 20,
        fontFamily: 'Poppins-Bold',
        color: COLORS.yellow,
        marginBottom: 8,
    },
    body: {
        fontSize: 16,
        color: COLORS.text,
        lineHeight: 24,
        marginBottom: 16,
    },
    actions: {
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.1)',
        paddingTop: 12,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 24,
    },
    actionText: {
        marginLeft: 6,
        color: COLORS.textSecondary,
        fontSize: 14,
    },
    sectionTitle: {
        fontSize: 18,
        fontFamily: 'Poppins-SemiBold',
        color: COLORS.text,
        marginBottom: 12,
    },
    commentCard: {
        backgroundColor: '#2C2B3E',
        padding: 12,
        borderRadius: 12,
        marginBottom: 12,
    },
    commentHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    commentAvatar: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: COLORS.primary,
        marginRight: 8,
        overflow: 'hidden',
    },
    commentUser: {
        fontSize: 14,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    commentText: {
        fontSize: 14,
        color: COLORS.text,
    },
    emptyComments: {
        color: COLORS.textSecondary,
        fontStyle: 'italic',
        textAlign: 'center',
        marginTop: 10,
    },
    footer: {
        flexDirection: 'row',
        padding: 12,
        backgroundColor: '#2C2B3E',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        backgroundColor: COLORS.background,
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 10,
        color: COLORS.text,
        maxHeight: 100,
        marginRight: 12,
    },
    sendButton: {
        backgroundColor: COLORS.primary,
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export default PostDetails;
