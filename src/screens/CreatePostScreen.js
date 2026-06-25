// Create Post Screen — Without Image Upload
// User sirf text post kar sakta hai

import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, ActivityIndicator
} from 'react-native';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function CreatePostScreen({ navigation }) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePost = async () => {
    if (!text.trim()) {
      return Alert.alert('Error', 'Kuch likho pehle!');
    }
    setLoading(true);
    try {
      // Firestore m post save karo
      await addDoc(collection(db, 'posts'), {
        text,
        imageUrl: null,
        userId: auth.currentUser.uid,
        userName: auth.currentUser.displayName,
        likes: [],
        comments: [],
        createdAt: serverTimestamp(),
      });
      navigation.navigate('Home');
    } catch (err) {
      Alert.alert('Error', err.message);
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={26} color="#1C1E21" />
        </TouchableOpacity>
        <Text style={styles.title}>Create Post</Text>
        <TouchableOpacity style={styles.postBtn} onPress={handlePost} disabled={loading}>
          {loading
            ? <ActivityIndicator color="#fff" size="small" />
            : <Text style={styles.postBtnText}>Post</Text>
          }
        </TouchableOpacity>
      </View>

      <View style={styles.userRow}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {auth.currentUser?.displayName?.[0]?.toUpperCase()}
          </Text>
        </View>
        <Text style={styles.userName}>{auth.currentUser?.displayName}</Text>
      </View>

      <TextInput
        style={styles.input}
        placeholder="What's on your mind?"
        multiline
        value={text}
        onChangeText={setText}
        autoFocus
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', padding: 16,
    borderBottomWidth: 1, borderColor: '#E4E6EB'
  },
  title: { fontSize: 18, fontWeight: 'bold' },
  postBtn: {
    backgroundColor: '#1877F2',
    paddingHorizontal: 20, paddingVertical: 8, borderRadius: 6
  },
  postBtnText: { color: '#fff', fontWeight: 'bold' },
  userRow: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  avatar: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: '#1877F2', alignItems: 'center',
    justifyContent: 'center', marginRight: 12
  },
  avatarText: { color: '#fff', fontWeight: 'bold', fontSize: 20 },
  userName: { fontWeight: 'bold', fontSize: 16 },
  input: {
    paddingHorizontal: 16, fontSize: 18,
    minHeight: 150, textAlignVertical: 'top'
  },
});