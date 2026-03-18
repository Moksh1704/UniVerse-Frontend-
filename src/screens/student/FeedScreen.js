import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, ScrollView, StyleSheet, RefreshControl, TouchableOpacity,
  TextInput, Modal, KeyboardAvoidingView, Platform, Alert, ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Radius, Shadows } from '../../utils/theme';
import { Avatar, Card, EmptyState, Loader, Divider } from '../../components/UI';
import { ScreenHeader } from '../../components/ScreenHeader';
import { useAuth } from '../../hooks/useAuth';
import { timeAgo } from '../../utils/helpers';
import { MOCK_FEED_POSTS, mockFetch, mockPost } from '../../utils/mockData';
import { HeartIcon, CommentIcon, SendIcon, TrashIcon } from '../../components/Icons';

export default function FeedScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [newPostText, setNewPostText] = useState('');
  const [postLoading, setPostLoading] = useState(false);
  const [showNewPost, setShowNewPost] = useState(false);
  const [commentPost, setCommentPost] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);

  const fetchFeed = useCallback(async () => {
    try {
      const res = await mockFetch(MOCK_FEED_POSTS);
      setPosts(res.data || []);
    } catch (e) {
      // silently handle
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchFeed(); }, [fetchFeed]);

  const onRefresh = () => { setRefreshing(true); fetchFeed(); };

  const handleLike = async (postId) => {
    setPosts(prev => prev.map(p =>
      p.id === postId
        ? { ...p, liked: !p.liked, likes_count: p.liked ? p.likes_count - 1 : p.likes_count + 1 }
        : p
    ));
    // Optimistic — no server call needed in mock mode
  };

  const handleDelete = (postId) => {
    Alert.alert('Delete Post', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive', onPress: async () => {
          await mockPost({ success: true }, 500);
          setPosts(prev => prev.filter(p => p.id !== postId));
        }
      }
    ]);
  };

  const handleCreatePost = async () => {
    if (!newPostText.trim()) return;
    setPostLoading(true);
    await mockPost({}, 800);
    const newPost = {
      id: Date.now(),
      author_id: user?.id,
      author_name: user?.name || 'You',
      author_email: user?.email,
      content: newPostText.trim(),
      likes_count: 0,
      liked: false,
      created_at: new Date().toISOString(),
      comments: [],
    };
    setPosts(prev => [newPost, ...prev]);
    setNewPostText('');
    setShowNewPost(false);
    setPostLoading(false);
  };

  const handleAddComment = async () => {
    if (!commentText.trim() || !commentPost) return;
    setCommentLoading(true);
    await mockPost({}, 700);
    const newComment = {
      id: Date.now(),
      author_name: user?.name || 'You',
      content: commentText.trim(),
      created_at: new Date().toISOString(),
    };
    setPosts(prev => prev.map(p =>
      p.id === commentPost.id
        ? { ...p, comments: [...(p.comments || []), newComment] }
        : p
    ));
    setCommentPost(prev => prev ? { ...prev, comments: [...(prev.comments || []), newComment] } : prev);
    setCommentText('');
    setCommentLoading(false);
  };

  const PostCard = ({ post }) => {
    const isOwner = post.author_id === user?.id || post.author_email === user?.email;
    const comments = post.comments || [];
    return (
      <View style={styles.postCard}>
        {/* Author row */}
        <View style={styles.postHeader}>
          <Avatar name={post.author_name || 'User'} size={40} />
          <View style={styles.postAuthorInfo}>
            <Text style={styles.postAuthorName}>{post.author_name || 'Unknown'}</Text>
            <Text style={styles.postTime}>{timeAgo(post.created_at)}</Text>
          </View>
          {isOwner && (
            <TouchableOpacity onPress={() => handleDelete(post.id)} style={styles.deleteBtn}>
              <TrashIcon size={16} color={Colors.error} />
            </TouchableOpacity>
          )}
        </View>

        {/* Content */}
        <Text style={styles.postContent}>{post.content}</Text>

        {/* Actions */}
        <View style={styles.postActions}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => handleLike(post.id)}>
            <HeartIcon size={18} color={post.liked ? '#DC2626' : Colors.textSecondary} filled={post.liked} />
            <Text style={[styles.actionCount, post.liked && { color: '#DC2626' }]}>
              {post.likes_count || 0}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={() => setCommentPost(post)}>
            <CommentIcon size={18} color={Colors.textSecondary} />
            <Text style={styles.actionCount}>{comments.length}</Text>
          </TouchableOpacity>
        </View>

        {/* Comments preview */}
        {comments.length > 0 && (
          <View style={styles.commentsPreview}>
            <Divider style={{ marginBottom: 8 }} />
            {comments.slice(0, 2).map((c, i) => (
              <View key={i} style={styles.commentRow}>
                <Text style={styles.commentAuthor}>{c.author_name || 'User'}</Text>
                <Text style={styles.commentText}> {c.content}</Text>
              </View>
            ))}
            {comments.length > 2 && (
              <TouchableOpacity onPress={() => setCommentPost(post)}>
                <Text style={styles.viewMore}>View all {comments.length} comments</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <ScreenHeader title="Campus Feed" subtitle="Stay connected" />

      {loading ? <Loader /> : (
        <ScrollView
          contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 90 }]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
          }
        >
          {posts.length === 0
            ? <EmptyState message="No posts yet" subMessage="Be the first to post!" />
            : posts.map(p => <PostCard key={p.id} post={p} />)
          }
        </ScrollView>
      )}

      {/* FAB */}
      <TouchableOpacity
        style={[styles.fab, { bottom: insets.bottom + 80 }]}
        onPress={() => setShowNewPost(true)}
        activeOpacity={0.85}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      {/* New Post Modal */}
      <Modal visible={showNewPost} animationType="slide" transparent>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalOverlay}
        >
          <View style={[styles.modalSheet, { paddingBottom: insets.bottom + 16 }]}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>New Post</Text>
            <TextInput
              style={styles.postInput}
              value={newPostText}
              onChangeText={setNewPostText}
              placeholder="What's on your mind?"
              placeholderTextColor={Colors.textSecondary}
              multiline
              numberOfLines={4}
              autoFocus
            />
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowNewPost(false)}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.postBtn, (!newPostText.trim() || postLoading) && { opacity: 0.5 }]}
                onPress={handleCreatePost}
                disabled={!newPostText.trim() || postLoading}
              >
                {postLoading
                  ? <ActivityIndicator color={Colors.primary} size="small" />
                  : <Text style={styles.postBtnText}>Post</Text>
                }
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Comment Modal */}
      <Modal visible={!!commentPost} animationType="slide" transparent>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalOverlay}
        >
          <View style={[styles.modalSheet, { paddingBottom: insets.bottom + 16, maxHeight: '70%' }]}>
            <View style={styles.modalHandle} />
            <View style={styles.modalTitleRow}>
              <Text style={styles.modalTitle}>Comments</Text>
              <TouchableOpacity onPress={() => setCommentPost(null)}>
                <Text style={styles.closeBtn}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.commentsList} showsVerticalScrollIndicator={false}>
              {(commentPost?.comments || []).length === 0
                ? <EmptyState message="No comments yet" />
                : (commentPost?.comments || []).map((c, i) => (
                  <View key={i} style={styles.commentItem}>
                    <Avatar name={c.author_name || 'U'} size={32} />
                    <View style={styles.commentBubble}>
                      <Text style={styles.commentAuthorName}>{c.author_name}</Text>
                      <Text style={styles.commentContent}>{c.content}</Text>
                    </View>
                  </View>
                ))
              }
            </ScrollView>
            <View style={styles.commentInputRow}>
              <TextInput
                style={styles.commentInput}
                value={commentText}
                onChangeText={setCommentText}
                placeholder="Write a comment..."
                placeholderTextColor={Colors.textSecondary}
              />
              <TouchableOpacity
                style={[styles.sendBtn, (!commentText.trim() || commentLoading) && { opacity: 0.5 }]}
                onPress={handleAddComment}
                disabled={!commentText.trim() || commentLoading}
              >
                {commentLoading
                  ? <ActivityIndicator color={Colors.textWhite} size="small" />
                  : <SendIcon size={18} color={Colors.textWhite} />
                }
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 16 },
  postCard: {
    backgroundColor: Colors.background,
    borderRadius: Radius.md,
    padding: 16,
    marginBottom: 12,
    borderWidth: 0.5,
    borderColor: Colors.border,
    ...Shadows.card,
  },
  postHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  postAuthorInfo: { flex: 1, marginLeft: 10 },
  postAuthorName: { fontSize: 14, fontWeight: '700', color: Colors.primary },
  postTime: { fontSize: 12, color: Colors.textSecondary, marginTop: 1 },
  deleteBtn: { padding: 4 },
  deleteText: { fontSize: 16 },
  postContent: { fontSize: 14, color: Colors.textPrimary, lineHeight: 21, marginBottom: 12 },
  postActions: { flexDirection: 'row', gap: 16 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  actionIcon: { fontSize: 18 },
  actionIconActive: {},
  actionCount: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary },
  commentsPreview: { marginTop: 10 },
  commentRow: { flexDirection: 'row', marginBottom: 5 },
  commentAuthor: { fontSize: 12, fontWeight: '700', color: Colors.primary },
  commentText: { fontSize: 12, color: Colors.textPrimary, flex: 1 },
  viewMore: { fontSize: 12, color: Colors.accent, fontWeight: '600', marginTop: 4 },
  fab: {
    position: 'absolute',
    right: 20,
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.strong,
  },
  fabText: { fontSize: 28, color: Colors.primary, fontWeight: '300', lineHeight: 32 },
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.4)' },
  modalSheet: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
  },
  modalHandle: {
    width: 40, height: 4, backgroundColor: Colors.border,
    borderRadius: 2, alignSelf: 'center', marginBottom: 16,
  },
  modalTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  modalTitle: { fontSize: 18, fontWeight: '800', color: Colors.primary },
  closeBtn: { fontSize: 18, color: Colors.textSecondary, padding: 4 },
  postInput: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: 14,
    fontSize: 15,
    color: Colors.textPrimary,
    minHeight: 100,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
  },
  modalActions: { flexDirection: 'row', gap: 12 },
  cancelBtn: {
    flex: 1, paddingVertical: 13, borderRadius: Radius.md,
    borderWidth: 1.5, borderColor: Colors.border, alignItems: 'center',
  },
  cancelBtnText: { fontSize: 15, fontWeight: '600', color: Colors.textSecondary },
  postBtn: {
    flex: 1, paddingVertical: 13, borderRadius: Radius.md,
    backgroundColor: Colors.accent, alignItems: 'center',
  },
  postBtnText: { fontSize: 15, fontWeight: '700', color: Colors.primary },
  commentsList: { maxHeight: 300, marginBottom: 12 },
  commentItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12, gap: 10 },
  commentBubble: {
    flex: 1, backgroundColor: Colors.surface, borderRadius: Radius.md,
    padding: 10, borderWidth: 0.5, borderColor: Colors.border,
  },
  commentAuthorName: { fontSize: 12, fontWeight: '700', color: Colors.primary, marginBottom: 3 },
  commentContent: { fontSize: 13, color: Colors.textPrimary },
  commentInputRow: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  commentInput: {
    flex: 1, backgroundColor: Colors.surface, borderRadius: Radius.full,
    paddingHorizontal: 16, paddingVertical: 10, fontSize: 14,
    color: Colors.textPrimary, borderWidth: 1, borderColor: Colors.border,
  },
  sendBtn: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center',
  },
  sendBtnText: { fontSize: 18, color: Colors.accent, fontWeight: '700' },
});
