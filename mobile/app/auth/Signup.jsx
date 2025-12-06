import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import { api } from "../../src/api/api";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from '../../styles/Signup_styles';

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Error states
  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const router = useRouter();

  // Action: Handle User Registration
  const handleSignUp = () => {
    let valid = true;

    // 1. Validation Logic
    // Using simple "if" statements to check if the inputs are correct

    // Username
    if (!username.trim()) {
      setUsernameError('Username is required');
      valid = false;
    } else {
      setUsernameError('');
    }

    // Email (using a Regex pattern to check format like user@domain.com)
    if (!email.trim()) {
      setEmailError('Email is required');
      valid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      setEmailError('Enter a valid email address');
      valid = false;
    } else {
      setEmailError('');
    }

    // Password Length
    if (!password.trim()) {
      setPasswordError('Password is required');
      valid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      valid = false;
    } else {
      setPasswordError('');
    }

    // Confirm Password (must match the first one)
    if (!confirmPassword.trim()) {
      setConfirmPasswordError('Confirm your password');
      valid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      valid = false;
    } else {
      setConfirmPasswordError('');
    }

    if (!valid || loading) return;

    // 2. Submit to Backend
    const doSignup = async () => {
      setLoading(true);
      try {
        const response = await api.post("/api/auth/signup", {
          username: username,
          email: email,
          password: password,
        });

        const { token, user } = response.data;
        global.authToken = token;

        // 3. Save User Data locally (Auto-Login)
        await AsyncStorage.setItem('userData', JSON.stringify({
          username: user.username || username,
          email: user.email || email,
          name: user.name || username,
          id: user.id
        }));

        console.log("Signed up user:", user);

        // 4. Move to Onboarding (Set budget goals)
        router.replace("/budget/BudgetOnboarding");
      } catch (error) {
        console.log("Signup error:", error?.response?.data || error.message);
        const message = error?.response?.data?.message || "Signup failed";
        alert(message);
      } finally {
        setLoading(false);
      }
    };

    doSignup();
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.upper}>
        <Text style={styles.big}>Create Account</Text>
        <Text style={styles.small}>Sign up to get started!</Text>
      </View>

      <View style={styles.lower}>
        <LinearGradient
          colors={['#E3823C', '#47447D']}
          locations={[0.1, 0.95]}
          style={StyleSheet.absoluteFill}
        />
      </View>

      <View style={styles.box}>
        <Text style={styles.label}>Username</Text>
        <TextInput
          placeholder="Username"
          style={styles.input}
          onChangeText={setUsername}
          value={username}
        />
        {usernameError ? <Text style={styles.error}>{usernameError}</Text> : null}

        <Text style={styles.label}>Email</Text>
        <TextInput
          placeholder="Email"
          keyboardType="email-address"
          style={styles.input}
          onChangeText={setEmail}
          value={email}
        />
        {emailError ? <Text style={styles.error}>{emailError}</Text> : null}

        <Text style={styles.label}>Password</Text>
        <View>
          <TextInput
            placeholder="Password"
            secureTextEntry={!showPassword}
            style={styles.input}
            onChangeText={setPassword}
            value={password}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeIcon}
          >
            <MaterialIcons
              name={showPassword ? 'visibility' : 'visibility-off'}
              size={24}
              color="#555"
            />
          </TouchableOpacity>
        </View>
        {passwordError ? <Text style={styles.error}>{passwordError}</Text> : null}

        <Text style={styles.label}>Confirm Password</Text>
        <View>
          <TextInput
            placeholder="Confirm Password"
            secureTextEntry={!showConfirmPassword}
            style={styles.input}
            onChangeText={setConfirmPassword}
            value={confirmPassword}
          />
          <TouchableOpacity
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            style={styles.eyeIcon}
          >
            <MaterialIcons
              name={showConfirmPassword ? 'visibility' : 'visibility-off'}
              size={24}
              color="#555"
            />
          </TouchableOpacity>
        </View>
        {confirmPasswordError ? <Text style={styles.error}>{confirmPasswordError}</Text> : null}

        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.5 }]}
          onPress={handleSignUp}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Signing up..." : "Sign Up"}
          </Text>
        </TouchableOpacity>

        <Text style={styles.signup}>
          Already have an account?
          <Link style={styles.signUpLink} href="/"> Log in</Link>
        </Text>

        <View style={styles.orContainer}>
          <View style={styles.orLine} />
          <Text style={styles.orText}>Or sign up with</Text>
        </View>

        <TouchableOpacity style={styles.google}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image
              source={require('../../assets/images/googlelogo.png')}
              style={{ width: 25, height: 25 }}
            />
            <Text style={styles.googleText}>Google</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SignUp;
