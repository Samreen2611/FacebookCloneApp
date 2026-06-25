// Messages Screen
// Registered users ki list dikhata hai jinhe message kiya ja sakta hai
// (Abhi simple list hai — actual chat baad mein add ho sakta hai)

import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, ActivityIndicator
} from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function MessagesScreen({ navigation }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      const snapshot = await getDocs(collection(db, 'users'));
      const data = snapshot.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .filter(u => u.id !== auth.currentUser?.uid); // Apna naam list mein na aaye
      setUsers(data);
      setLoading(false);
    };
    fetchUsers();
  }, []);

  const renderUser = ({ item }) => (
    <TouchableOpacity style={styles.row}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {item.name?.[0]?.toUpperCase()}
        </Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.preview}>Tap to start chatting</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#65676B" />
    </TouchableOpacity>
  );

  if (loading) {
    return <ActivityIndicator style={{ flex: 1 }} size="large" color="#1877F2" />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#1C1E21" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Messages</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={users}
        keyExtractor={item => item.id}
        renderItem={renderUser}
        ListEmptyComponent={
          <Text style={styles.empty}>No users yet</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#E4E6EB',
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#F0F2F5',
  },
  avatar: {
    width: 48, height: 48,
    borderRadius: 24,
    backgroundColor: '#1877F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  name: { fontWeight: 'bold', fontSize: 15 },
  preview: { color: '#65676B', fontSize: 13, marginTop: 2 },
  empty: { textAlign: 'center', color: '#65676B', marginTop: 40, fontSize: 15 },
});