// Home Screen — News Feed
// Firestore se real-time posts fetch karke dikhata hai
// Create Post bar + Tab navigation bhi yahan hai

import React, { useEffect, useState } from 'react';// usestate is used to store the data.useeffect perform specific action to the tasks.
import {
  View, Text, FlatList, StyleSheet,
  TouchableOpacity, ActivityIndicator
} from 'react-native';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import PostCard from '../components/PostCard';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function HomeScreen({ navigation }) {
  const [posts, setPosts] = useState([]);       // Posts ki list
  const [loading, setLoading] = useState(true); // Pehli baar loading

  // Component mount hone par posts fetch karo
  useEffect(() => {
    // Query: posts collection, latest pehle (createdAt descending)
    const q = query(
      collection(db, 'posts'),
      orderBy('createdAt', 'desc') // Nai posts pehle
    );

    // onSnapshot — real-time listener
    // Jab bhi Firestore m change ho, yeh automatically chalega
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,      // Document ID
        ...doc.data()    // Baaki sab data
      }));
      setPosts(data);
      setLoading(false);
    });

    // Cleanup — jab screen unmount ho toh listener hata do
    return unsubscribe;
  }, []);

  // ---- HEADER COMPONENT (Create Post bar) ----
  const ListHeader = () => (
    <View>
      {/* TOP NAVBAR */}
      <View style={styles.navbar}>
        <Text style={styles.logo}>facebook</Text>
        <View style={styles.navIcons}>
          <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.navigate('Search')}>
            <Ionicons name="search" size={22} color="#1C1E21" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="chatbubble-ellipses" size={22} color="#1C1E21" />
          </TouchableOpacity>
        </View>
      </View>

      {/* CREATE POST BAR */}
      <View style={styles.createPost}>
        {/* User Avatar */}
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {auth.currentUser?.displayName?.[0]?.toUpperCase()}
          </Text>
        </View>
        {/* Post input — press karo toh CreatePost screen khule */}
        <TouchableOpacity
          style={styles.postInput}
          onPress={() => navigation.navigate('CreatePost')}
        >
          <Text style={styles.postPlaceholder}>What's on your mind?</Text>
        </TouchableOpacity>
      </View>

      {/* POST TYPE BUTTONS (Live, Photo, Feeling) */}
      <View style={styles.postActions}>
        <TouchableOpacity style={styles.postAction}>
          <Ionicons name="videocam" size={18} color="#F02849" />
          <Text style={styles.postActionText}>Live</Text>
        </TouchableOpacity>

        <View style={styles.separator} />

        <TouchableOpacity
          style={styles.postAction}
          onPress={() => navigation.navigate('CreatePost')}
        >
          <Ionicons name="image" size={18} color="#45BD62" />
          <Text style={styles.postActionText}>Photo</Text>
        </TouchableOpacity>

        <View style={styles.separator} />

        <TouchableOpacity style={styles.postAction}>
          <Ionicons name="happy" size={18} color="#F7B928" />
          <Text style={styles.postActionText}>Feeling</Text>
        </TouchableOpacity>
      </View>

      {/* Divider — navbar aur feed k beech */}
      <View style={styles.divider} />
    </View>
  );

  // Agar pehli baar load ho raha hai — spinner dikhaao
  if (loading) {
    return <ActivityIndicator style={{ flex: 1 }} size="large" color="#1877F2" />;
  }

  return (
    <View style={styles.container}>
      {/* FlatList — efficiently posts render karta hai */}
      <FlatList
        data={posts}
        keyExtractor={item => item.id}           // Unique key har item ke liye
        renderItem={({ item }) => <PostCard post={item} />} // Har post ko PostCard m dikhao
        ListHeaderComponent={ListHeader}          // Upar create post bar
        showsVerticalScrollIndicator={false}
        style={{ backgroundColor: '#F0F2F5' }}   // Facebook gray background
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F2F5' },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 10
  },
  logo: { fontSize: 28, color: '#1877F2', fontWeight: 'bold' },
  navIcons: { flexDirection: 'row', gap: 8 },
  iconBtn: {
    backgroundColor: '#E4E6EB',
    borderRadius: 20,
    padding: 8
  },
  createPost: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 8
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
  postInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E4E6EB',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 10
  },
  postPlaceholder: { color: '#65676B', fontSize: 15 },
  postActions: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 8
  },
  postAction: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6
  },
  postActionText: { fontWeight: '600', color: '#65676B' },
  separator: { width: 1, backgroundColor: '#E4E6EB' },
  divider: { height: 8, backgroundColor: '#F0F2F5' },
});