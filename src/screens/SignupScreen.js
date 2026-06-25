// Signup Screen
// Naya user account banata hai
// Firebase Authentication + Firestore (user data save karna)

import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ActivityIndicator, ScrollView
} from 'react-native';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

export default function SignupScreen({ navigation }) {
  // User ki input ke liye state variables
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
  if (!name || !email || !password) {
    console.log('Please fill all fields');
    return;
  }
  
  setLoading(true);

  try {
    const userCred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCred.user, { displayName: name });
    await setDoc(doc(db, 'users', userCred.user.uid), {
      uid: userCred.user.uid,
      name,
      email,
      photoURL: '',
      bio: '',
      createdAt: new Date(),
    });

    navigation.replace('Main');

  } catch (err) {
    console.log('Signup Failed:', err.message);
  }

  setLoading(false);
};

  return (
    // ScrollView — keyboard open ho toh scroll kar sakein
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.logo}>facebook</Text>
      <Text style={styles.subtitle}>Create a new account</Text>

      {/* Name Input */}
      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
      />

      {/* Email Input */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {/* Password Input */}
      <TextInput
        style={styles.input}
        placeholder="New Password (min 6 characters)"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {/* Signup Button */}
      <TouchableOpacity
        style={styles.signupBtn}
        onPress={handleSignup}
        disabled={loading}
      >
        {loading
          ? <ActivityIndicator color="#fff" />
          : <Text style={styles.signupText}>Sign Up</Text>
        }
      </TouchableOpacity>

      {/* Already have account — Login pr jao */}
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.loginLink}>Already have an account? Log In</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20
  },
  logo: { fontSize: 48, color: '#1877F2', fontWeight: 'bold', marginBottom: 8 },
  subtitle: { fontSize: 18, color: '#333', marginBottom: 24 },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 14,
    marginBottom: 12,
    fontSize: 16
  },
  signupBtn: {
    width: '100%',
    backgroundColor: '#42B72A',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16
  },
  signupText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  loginLink: { color: '#1877F2', fontSize: 15 },
});