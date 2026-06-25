// Edit Profile Screen
// User apna naam aur bio update kar sakta hai
// Firestore users collection update hoti hai

import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, ActivityIndicator, ScrollView
} from 'react-native';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { auth, db } from '../firebase/config';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function EditProfileScreen({ navigation }) {
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true); // Data load ho raha hai

  // Screen khulne par existing data fetch karo
  useEffect(() => {
    const fetchUserData = async () => {
      const userRef = doc(db, 'users', auth.currentUser.uid);
      const snap = await getDoc(userRef);

      if (snap.exists()) {
        const data = snap.data();
        setName(data.name || '');
        setBio(data.bio || '');
      }
      setFetching(false);
    };

    fetchUserData();
  }, []);

  // Profile update karo
  const handleUpdate = async () => {
    if (!name.trim()) {
      return Alert.alert('Error', 'Name cannot be empty');
    }

    setLoading(true);

    try {
      // Firebase Auth profile update karo
      await updateProfile(auth.currentUser, { displayName: name });

      // Firestore document update karo
      const userRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userRef, {
        name: name.trim(),
        bio: bio.trim(),
      });

      Alert.alert('Success', 'Profile updated!');
      navigation.goBack(); // Wapis profile pr jao

    } catch (err) {
      Alert.alert('Error', err.message);
    }

    setLoading(false);
  };

  // Data load ho raha ho toh spinner
  if (fetching) {
    return <ActivityIndicator style={{ flex: 1 }} size="large" color="#1877F2" />;
  }

  return (
    <ScrollView style={styles.container}>

      {/* ---- HEADER ---- */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#1C1E21" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* ---- AVATAR PREVIEW ---- */}
      <View style={styles.avatarSection}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {name?.[0]?.toUpperCase() || '?'}
          </Text>
        </View>
        <Text style={styles.changePhoto}>Change Profile Photo</Text>
      </View>

      {/* ---- FORM ---- */}
      <View style={styles.form}>

        {/* Name Field */}
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter your name"
        />

        {/* Bio Field */}
        <Text style={styles.label}>Bio</Text>
        <TextInput
          style={[styles.input, styles.bioInput]}
          value={bio}
          onChangeText={setBio}
          placeholder="Write something about yourself..."
          multiline
          maxLength={150} // Bio 150 chars tak
        />
        {/* Character count */}
        <Text style={styles.charCount}>{bio.length}/150</Text>

      </View>

      {/* Save Button */}
      <TouchableOpacity
        style={styles.saveBtn}
        onPress={handleUpdate}
        disabled={loading}
      >
        {loading
          ? <ActivityIndicator color="#fff" />
          : <Text style={styles.saveBtnText}>Save Changes</Text>
        }
      </TouchableOpacity>

    </ScrollView>
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
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderColor: '#E4E6EB',
  },
  avatar: {
    width: 90, height: 90,
    borderRadius: 45,
    backgroundColor: '#1877F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  avatarText: { color: '#fff', fontWeight: 'bold', fontSize: 36 },
  changePhoto: { color: '#1877F2', fontWeight: '600', fontSize: 15 },
  form: { padding: 16 },
  label: {
    fontSize: 13,
    color: '#65676B',
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E4E6EB',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
  },
  bioInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  charCount: {
    textAlign: 'right',
    color: '#65676B',
    fontSize: 12,
    marginTop: 4,
  },
  saveBtn: {
    backgroundColor: '#1877F2',
    margin: 16,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});