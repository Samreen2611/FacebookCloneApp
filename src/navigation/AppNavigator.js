// Updated Navigation — Comments, Search, EditProfile screens bhi add ki hain

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Auth Screens
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';

// Main Screens
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import CreatePostScreen from '../screens/CreatePostScreen';
import CommentsScreen from '../screens/CommentsScreen';
import SearchScreen from '../screens/SearchScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import MessagesScreen from '../screens/MessagesScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// ---- BOTTOM TAB NAVIGATOR ----
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          // Har tab ka icon
          const icons = {
            Home: 'home',
            Search: 'search',
            CreatePost: 'add-circle',
            Profile: 'person',
          };
          return <Ionicons name={icons[route.name]} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#1877F2',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
        tabBarStyle: {
          height: 56,
          paddingBottom: 6,
          elevation: 8, // Android shadow
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen
        name="CreatePost"
        component={CreatePostScreen}
        options={{ title: 'Post' }}
      />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// ---- MAIN STACK NAVIGATOR ----
export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* Auth Flow */}
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />

        {/* Main App (tabs) */}
        <Stack.Screen name="Main" component={MainTabs} />

        {/* Extra screens — tabs k upar open hongi */}
        <Stack.Screen
          name="Comments"
          component={CommentsScreen}
          options={{
            headerShown: true,
            title: 'Comments',
            headerStyle: { backgroundColor: '#fff' },
            headerTintColor: '#1877F2',
          }}
        />
        <Stack.Screen
          name="EditProfile"
          component={EditProfileScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
        name="Messages"
        component={MessagesScreen}
        options={{ headerShown: false }}
        />
        </Stack.Navigator>
        </NavigationContainer>
  );
}