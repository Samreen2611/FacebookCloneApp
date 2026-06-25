// Login Screen
// User apna email aur password dal ke login karta hai
// Firebase Authentication use hoti hai

import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet,  ActivityIndicator
} from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth'; // Firebase login function
import { auth } from '../firebase/config';

export default function LoginScreen({ navigation }) {
  // State variables — user ki input store karte hain
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // Button pr loading show karne ke liye

  // Login button press hone par yeh function chalta hai
  const handleLogin = async () => {
    // Validation — fields empty nahi honi chahiye
    if (!email || !password) {
      console.log('Error', 'Please fill all fields');
    }

    setLoading(true); // Loading start karo

    try {
      // Firebase se login attempt karo
      await signInWithEmailAndPassword(auth, email, password);
      // Agar successful — Main screen pr jao
      navigation.replace('Main');
    } catch (err) {
      // Agar error — user ko batao
      console.log('Login Failed', err.message);
    }

    setLoading(false); // Loading band karo
  };

  return (
    <View style={styles.container}>
      {/* Facebook Logo */}
      <Text style={styles.logo}>facebook</Text>

      {/* Email Input */}
      <TextInput
        style={styles.input}
        placeholder="Email or phone number"
        value={email}
        onChangeText={setEmail}       // Jaise type karo, state update hoti hai
        keyboardType="email-address"
        autoCapitalize="none"         // Email lowercase ho
      />

      {/* Password Input */}
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry              // Password dots m dikhe
      />

      {/* Login Button */}
      <TouchableOpacity
        style={styles.loginBtn}
        onPress={handleLogin}
        disabled={loading}           // Loading m button disable ho
      >
        {/* Agar loading ho toh spinner, warna text */}
        {loading
          ? <ActivityIndicator color="#fff" />
          : <Text style={styles.loginText}>Log In</Text>
        }
      </TouchableOpacity>

      <Text style={styles.forgot}>Forgot password?</Text>

      {/* Divider line */}
      <View style={styles.divider} />

      {/* Signup Button */}
      <TouchableOpacity
        style={styles.signupBtn}
        onPress={() => navigation.navigate('Signup')} // Signup screen pr jao
      >
        <Text style={styles.signupText}>Create new account</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20
  },
  logo: {
    fontSize: 48,
    color: '#1877F2',        // Facebook blue
    fontWeight: 'bold',
    marginBottom: 30
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 14,
    marginBottom: 12,
    fontSize: 16
  },
  loginBtn: {
    width: '100%',
    backgroundColor: '#1877F2',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12
  },
  loginText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  forgot: { color: '#1877F2', marginBottom: 20 },
  divider: { width: '100%', height: 1, backgroundColor: '#ddd', marginBottom: 20 },
  signupBtn: {
    backgroundColor: '#42B72A',   // Green button
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '60%'
  },
  signupText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});