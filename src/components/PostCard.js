// PostCard Component
// Har post ki card — news feed m dikhayi jaati hai
// Like button ka functionality bhi isme hai

import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { useNavigation } from '@react-navigation/native'; // Navigation hook

// post — props se aata hai (HomeScreen se)
export default function PostCard({ post }) {
  const navigation = useNavigation(); // Navigation access karo

  // Check karo — kya current user ne already like kiya hai?
  const [liked, setLiked] = useState(
    post.likes?.includes(auth.currentUser?.uid)
  );

  // Likes count state
  const [likesCount, setLikesCount] = useState(post.likes?.length || 0);

  // Like / Unlike function
  const handleLike = async () => {
    // Firestore m post ka reference
    const postRef = doc(db, 'posts', post.id);

    if (liked) {
      // Pehle se liked hai — unlike karo
      // arrayRemove: uid ko likes array se hata do
      await updateDoc(postRef, { likes: arrayRemove(auth.currentUser.uid) });
      setLikesCount(prev => prev - 1);
    } else {
      // Like karo
      // arrayUnion: uid likes array m add karo (duplicate nahi hoga)
      await updateDoc(postRef, { likes: arrayUnion(auth.currentUser.uid) });
      setLikesCount(prev => prev + 1);
    }

    setLiked(!liked); // Toggle liked state
  };

  // Comments screen pr navigate karo
  const goToComments = () => {
    navigation.navigate('Comments', { postId: post.id });
  };

  return (
    <View style={styles.card}>

      {/* ---- POST HEADER (User info) ---- */}
      <View style={styles.header}>
        {/* User Avatar — naam ka pehla harf */}
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {post.userName?.[0]?.toUpperCase()}
          </Text>
        </View>
        <View>
          <Text style={styles.userName}>{post.userName}</Text>
          {/* Post ki date */}
          <Text style={styles.time}>
            {post.createdAt?.toDate?.()?.toLocaleDateString()}
          </Text>
        </View>
      </View>

      {/* ---- POST CONTENT ---- */}
      <Text style={styles.content}>{post.text}</Text>

      {/* Agar post m image hai toh dikhaao */}
      {post.imageUrl
        ? <Image source={{ uri: post.imageUrl }} style={styles.postImage} />
        : null
      }

      {/* ---- STATS (Likes & Comments count) ---- */}
      <View style={styles.stats}>
        <Text style={styles.statsText}>👍 {likesCount}</Text>
        {/* Comments count — click karne pr comments screen */}
        <TouchableOpacity onPress={goToComments}>
          <Text style={styles.statsText}>
            💬 {post.comments?.length || 0} comments
          </Text>
        </TouchableOpacity>
      </View>

      {/* ---- ACTION BUTTONS (Like, Comment, Share) ---- */}
      <View style={styles.actions}>

        {/* Like Button */}
        <TouchableOpacity style={styles.actionBtn} onPress={handleLike}>
          <Ionicons
            name={liked ? 'thumbs-up' : 'thumbs-up-outline'}
            size={20}
            color={liked ? '#1877F2' : '#65676B'} // Liked = blue, nahi = gray
          />
          <Text style={[styles.actionText, liked && { color: '#1877F2' }]}>
            Like
          </Text>
        </TouchableOpacity>

        {/* Comment Button — CommentsScreen pr jao */}
        <TouchableOpacity style={styles.actionBtn} onPress={goToComments}>
          <Ionicons name="chatbubble-outline" size={20} color="#65676B" />
          <Text style={styles.actionText}>Comment</Text>
        </TouchableOpacity>

        {/* Share Button */}
        <TouchableOpacity style={styles.actionBtn}>
          <Ionicons name="arrow-redo-outline" size={20} color="#65676B" />
          <Text style={styles.actionText}>Share</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    marginBottom: 8,
    paddingVertical: 12
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginBottom: 10
  },
  avatar: {
    width: 42, height: 42,
    borderRadius: 21,
    backgroundColor: '#1877F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10
  },
  avatarText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  userName: { fontWeight: 'bold', fontSize: 15 },
  time: { color: '#65676B', fontSize: 12 },
  content: { fontSize: 15, paddingHorizontal: 12, marginBottom: 10, color: '#1C1E21' },
  postImage: { width: '100%', height: 300, resizeMode: 'cover' },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderColor: '#E4E6EB'
  },
  statsText: { color: '#65676B', fontSize: 13 },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 4,
    borderTopWidth: 1,
    borderColor: '#E4E6EB'
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    gap: 6
  },
  actionText: { color: '#65676B', fontSize: 14, fontWeight: '600' },
});