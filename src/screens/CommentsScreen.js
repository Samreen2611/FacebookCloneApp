// Comments Screen
// Kisi post ki comments dekhna aur nai comment add karna
// Firestore m real-time comments update hote hain

import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList, TextInput,
  TouchableOpacity, StyleSheet, KeyboardAvoidingView,
  Platform, ActivityIndicator
} from 'react-native';
import {
  doc, updateDoc, arrayUnion, onSnapshot
} from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function CommentsScreen({ route }) {
  // route.params se post ka data aata hai
  const { postId } = route.params;

  const [comments, setComments] = useState([]); // Comments list
  const [newComment, setNewComment] = useState(''); // Input field
  const [loading, setLoading] = useState(true);

  // Real-time comments fetch karo
  useEffect(() => {
    const postRef = doc(db, 'posts', postId);

    // Post document ko listen karo
    const unsub = onSnapshot(postRef, (snap) => {
      if (snap.exists()) {
        setComments(snap.data().comments || []);
        setLoading(false);
      }
    });

    return unsub; // Cleanup
  }, [postId]);

  // Nai comment add karo
  const handleAddComment = async () => {
    if (!newComment.trim()) return; // Empty comment na ho

    const postRef = doc(db, 'posts', postId);

    // Comment object banao
    const commentObj = {
      userId: auth.currentUser.uid,
      userName: auth.currentUser.displayName,
      text: newComment.trim(),
      createdAt: new Date().toISOString(), // Current time
    };

    // arrayUnion — comments array m add karo
    await updateDoc(postRef, {
      comments: arrayUnion(commentObj)
    });

    setNewComment(''); // Input clear karo
  };

  // Single comment render karo
  const renderComment = ({ item, index }) => (
    <View style={styles.commentCard} key={index}>
      {/* User Avatar */}
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {item.userName?.[0]?.toUpperCase()}
        </Text>
      </View>

      {/* Comment Content */}
      <View style={styles.commentContent}>
        <Text style={styles.commentUser}>{item.userName}</Text>
        <Text style={styles.commentText}>{item.text}</Text>
        <Text style={styles.commentTime}>
          {new Date(item.createdAt).toLocaleTimeString()}
        </Text>
      </View>
    </View>
  );

  if (loading) {
    return <ActivityIndicator style={{ flex: 1 }} size="large" color="#1877F2" />;
  }

  return (
    // KeyboardAvoidingView — keyboard khule toh input upar aaye
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Comments List */}
      <FlatList
        data={comments}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderComment}
        ListEmptyComponent={
          <Text style={styles.noComments}>No comments yet. Be the first!</Text>
        }
      />

      {/* Comment Input Bar */}
      <View style={styles.inputBar}>
        {/* Current User Avatar */}
        <View style={styles.smallAvatar}>
          <Text style={styles.smallAvatarText}>
            {auth.currentUser?.displayName?.[0]?.toUpperCase()}
          </Text>
        </View>

        {/* Text Input */}
        <TextInput
          style={styles.input}
          placeholder="Write a comment..."
          value={newComment}
          onChangeText={setNewComment}
          multiline
        />

        {/* Send Button */}
        <TouchableOpacity onPress={handleAddComment} style={styles.sendBtn}>
          <Ionicons name="send" size={20} color="#1877F2" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F2F5' },
  commentCard: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#fff',
    marginBottom: 1,
  },
  avatar: {
    width: 36, height: 36,
    borderRadius: 18,
    backgroundColor: '#1877F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  avatarText: { color: '#fff', fontWeight: 'bold' },
  commentContent: {
    flex: 1,
    backgroundColor: '#F0F2F5',
    borderRadius: 12,
    padding: 10,
  },
  commentUser: { fontWeight: 'bold', fontSize: 13, marginBottom: 2 },
  commentText: { fontSize: 14, color: '#1C1E21' },
  commentTime: { fontSize: 11, color: '#65676B', marginTop: 4 },
  noComments: {
    textAlign: 'center',
    color: '#65676B',
    marginTop: 40,
    fontSize: 15,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#E4E6EB',
  },
  smallAvatar: {
    width: 32, height: 32,
    borderRadius: 16,
    backgroundColor: '#1877F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  smallAvatarText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
  input: {
    flex: 1,
    backgroundColor: '#F0F2F5',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontSize: 14,
    maxHeight: 80,
  },
  sendBtn: { padding: 8 },
});