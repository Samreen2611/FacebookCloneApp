// Search Screen
// Users ko search karo naam se
// Firestore m users collection se data fetch hota hai

import React, { useState } from 'react';
import {
  View, Text, TextInput, FlatList,
  TouchableOpacity, StyleSheet, ActivityIndicator
} from 'react-native';
import {
  collection, query, where,
  getDocs, orderBy, startAt, endAt
} from 'firebase/firestore';
import { db } from '../firebase/config';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function SearchScreen({ navigation }) {
  const [searchText, setSearchText] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false); // Kya search ho chuki hai

  // Search function
  const handleSearch = async () => {
    if (!searchText.trim()) return;

    setLoading(true);
    setSearched(true);

    try {
      // Firestore m naam se search karo
      // startAt/endAt — prefix search (jaise "Sam" dhundho)
      const q = query(
        collection(db, 'users'),
        orderBy('name'),
        startAt(searchText),
        endAt(searchText + '\uf8ff') // '\uf8ff' — Unicode ka last character (prefix match trick)
      );

      const snapshot = await getDocs(q);
      const users = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setResults(users);

    } catch (err) {
      console.log('Search error:', err);
    }

    setLoading(false);
  };

  // Single user result render karo
  const renderUser = ({ item }) => (
    <TouchableOpacity style={styles.userCard}>
      {/* User Avatar */}
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {item.name?.[0]?.toUpperCase()}
        </Text>
      </View>

      {/* User Info */}
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.name}</Text>
        <Text style={styles.userEmail}>{item.email}</Text>
      </View>

      {/* Add Friend Button */}
      <TouchableOpacity style={styles.addBtn}>
        <Text style={styles.addBtnText}>Add Friend</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>

      {/* ---- SEARCH BAR ---- */}
      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color="#65676B" style={{ marginRight: 8 }} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search people..."
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={handleSearch} // Enter press karne pr search
          returnKeyType="search"
        />
        {/* Clear button */}
        {searchText.length > 0 && (
          <TouchableOpacity onPress={() => { setSearchText(''); setResults([]); setSearched(false); }}>
            <Ionicons name="close-circle" size={20} color="#65676B" />
          </TouchableOpacity>
        )}
      </View>

      {/* Search Button */}
      <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
        <Text style={styles.searchBtnText}>Search</Text>
      </TouchableOpacity>

      {/* ---- RESULTS ---- */}
      {loading
        ? <ActivityIndicator style={{ marginTop: 30 }} size="large" color="#1877F2" />
        : (
          <FlatList
            data={results}
            keyExtractor={item => item.id}
            renderItem={renderUser}
            ListEmptyComponent={
              searched
                ? <Text style={styles.noResult}>No users found for "{searchText}"</Text>
                : <Text style={styles.hint}>Search for people by their name</Text>
            }
          />
        )
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F2F5' },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 12,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    elevation: 2,
  },
  searchInput: { flex: 1, fontSize: 15 },
  searchBtn: {
    backgroundColor: '#1877F2',
    marginHorizontal: 12,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: -4,
    marginBottom: 8,
  },
  searchBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 1,
  },
  avatar: {
    width: 50, height: 50,
    borderRadius: 25,
    backgroundColor: '#1877F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: { color: '#fff', fontWeight: 'bold', fontSize: 20 },
  userInfo: { flex: 1 },
  userName: { fontWeight: 'bold', fontSize: 15 },
  userEmail: { color: '#65676B', fontSize: 13 },
  addBtn: {
    backgroundColor: '#E7F3FF',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 6,
  },
  addBtnText: { color: '#1877F2', fontWeight: 'bold' },
  noResult: {
    textAlign: 'center',
    color: '#65676B',
    marginTop: 40,
    fontSize: 15,
  },
  hint: {
    textAlign: 'center',
    color: '#65676B',
    marginTop: 60,
    fontSize: 15,
  },
});