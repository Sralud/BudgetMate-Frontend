import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image } from 'react-native';
import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import { api } from "../src/api";
import AsyncStorage from '@react-native-async-storage/async-storage';

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

  const handleSignUp = () => {
    let valid = true;

    // Username
    if (!username.trim()) {
      setUsernameError('Username is required');
      valid = false;
    } else {
      setUsernameError('');
    }

    // Email
    if (!email.trim()) {
      setEmailError('Email is required');
      valid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      setEmailError('Enter a valid email address');
      valid = false;
    } else {
      setEmailError('');
    }

    // Password
    if (!password.trim()) {
      setPasswordError('Password is required');
      valid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      valid = false;
    } else {
      setPasswordError('');
    }

    // Confirm Password
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
    
        // Save user data to AsyncStorage
        await AsyncStorage.setItem('userData', JSON.stringify({
          username: user.username || username,
          email: user.email || email,
          name: user.name || username,
          id: user.id
        }));

        console.log("Signed up user:", user);
        console.log("Saved to AsyncStorage:", username);

        router.replace("/BudgetOnboarding");
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
              source={require('../assets/images/googlelogo.png')}
              style={{ width: 25, height: 25 }}
            />
            <Text style={styles.googleText}>Google</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#141326',
  },

  upper: { 
    flex: 1, 
    alignItems: 'center' 
  },

  lower: { 
    flex: 1 
  },

  box: {
    width: '90%',
    backgroundColor: '#ffffff',
    borderRadius: 30,
    padding: 20,
    position: 'absolute',
    top: 150,
    alignSelf: 'center',
  },

  big: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: '600',
    textAlign: 'center',
    position: 'absolute',
    top: 75,
  },

  small: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '400',
    textAlign: 'center',
    position: 'absolute',
    top: 120,
  },

  label: { 
    marginBottom: 5, 
    fontWeight: '500' 
  },

  input: {
    borderWidth: 1,
    borderColor: '#969696',
    borderRadius: 8,
    padding: 10,
    paddingRight: 45,
    fontSize: 16,
    marginBottom: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 10,
  },

  eyeIcon: { 
    position: 'absolute', 
    right: 8, 
    top: '10%', 
    padding: 5 
  },

  button: {
    backgroundColor: '#1300BC',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 10,
  },

  buttonText: { 
    color: '#fff', 
    fontWeight: '600', 
    fontSize: 16 
  },

  error: {
    color: 'red',
    fontSize: 12,
    marginBottom: 5,
  },

  signup: { 
    textAlign: 'center', 
    color: '#555' 
  },

  signUpLink: { 
    color: '#0000EE', 
    fontWeight: '600' 
  },

  orContainer: {
    marginVertical: 15,
    alignItems: 'center',
    position: 'relative',
  },

  orLine: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#ccc',
  },

  orText: {
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    color: '#555',
    fontSize: 14,
  },

  google: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#969696',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 10,
  },

  googleText: { 
    marginLeft: 10, 
    fontSize: 18, 
    fontWeight: '500' 
  },
});

export default SignUp;
