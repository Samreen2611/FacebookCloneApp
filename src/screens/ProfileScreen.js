// Profile Screen
// Current user ki info aur unki posts dikhata hai
// Logout functionality bhi yahan hai

import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet,
  TouchableOpacity, FlatList, Alert
} from 'react-native';
import { signOut } from 'firebase/auth';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import PostCard from '../components/PostCard';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function ProfileScreen({ navigation }) {
  const [posts, setPosts] = useState([]);
  const user = auth.currentUser; // Current logged in user

  // Sirf is user ki posts fetch karo
  useEffect(() => {
    // where clause — sirf apni posts
    const q = query(
      collection(db, 'posts'),
      where('userId', '==', user.uid) // Current user ki posts
    );

    // Real-time listener
    const unsubscribe = onSnapshot(q, snapshot => {
      setPosts(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    return unsubscribe; // Cleanup
  }, []);

  // Logout function
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await signOut(auth);            // Firebase se logout
            navigation.replace('Login');    // Login screen pr jao
          }
        }
      ]
    );
  };

  // ---- PROFILE HEADER ----
  const Header = () => (
    <View>
      {/* Cover Photo (blue background) */}
      <View style={styles.coverPhoto} />

      {/* Profile Info Section */}
      <View style={styles.profileSection}>
        {/* Profile Avatar */}
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.displayName?.[0]?.toUpperCase()}
          </Text>
        </View>

        <Text style={styles.name}>{user?.displayName}</Text>
        <Text style={styles.email}>{user?.email}</Text>
      

        {/* Edit Profile Button */}
        <TouchableOpacity
          style={[styles.logoutBtn, { backgroundColor: '#1877F2', marginBottom: 8 }]}
          onPress={() => navigation.navigate('EditProfile')}
        >
          <Ionicons name="create-outline" size={18} color="#fff" />
          <Text style={styles.logoutText}>Edit Profile</Text>
        </TouchableOpacity>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={18} color="#fff" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Posts Count Stats */}
      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={styles.statNum}>{posts.length}</Text>
          <Text style={styles.statLabel}>Posts</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Your Posts</Text>
    </View>
  );

  return (
    // FlatList — posts + header sab ek saath scroll hoga
    <FlatList
      data={posts}
      keyExtractor={item => item.id}
      renderItem={({ item }) => <PostCard post={item} />}
      ListHeaderComponent={Header}
      style={{ backgroundColor: '#F0F2F5' }}
    />
  );
}

const styles = StyleSheet.create({
  coverPhoto: {
    height: 180,
    backgroundColor: '#1877F2' // Facebook blue cover
  },
  profileSection: {
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingBottom: 16
  },
  avatar: {
    width: 100, height: 100,
    borderRadius: 50,
    backgroundColor: '#42B72A',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -50,              // Cover photo ke upar aaye
    borderWidth: 4,
    borderColor: '#fff'          // White border
  },
  avatarText: { color: '#fff', fontWeight: 'bold', fontSize: 40 },
  name: { fontSize: 22, fontWeight: 'bold', marginTop: 8 },
  email: { color: '#65676B', marginBottom: 12 },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E41E3F', // Red logout button
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 6,
    gap: 6
  },
  logoutText: { color: '#fff', fontWeight: 'bold' },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    marginTop: 8
  },
  stat: { alignItems: 'center', flex: 1 },
  statNum: { fontSize: 20, fontWeight: 'bold' },
  statLabel: { color: '#65676B' },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    padding: 16,
    backgroundColor: '#fff',
    marginTop: 8
  },
});