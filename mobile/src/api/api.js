// ===== API Configuration =====
// This file sets up the connection to our backend server (API).
// It handles the URL configuration and automatically adds the user's token to requests.

import axios from "axios";
import { Platform } from "react-native";
import Constants from "expo-constants";

// Get backend URLs from app.config.js (environment variables)
const {
  WEB_API_URL,
  IOS_API_URL,
  ANDROID_API_URL,
  DEFAULT_API_URL,
} = Constants.expoConfig.extra;

// Select the correct URL based on the device we are running on
const baseURL = Platform.select({
  web: WEB_API_URL,      // Browser
  ios: IOS_API_URL,      // iPhone Simulator/Device
  android: ANDROID_API_URL, // Android Emulator/Device
  default: DEFAULT_API_URL,
});

console.log("API baseURL =", baseURL);

// Create the Axios instance (our HTTP client)
export const api = axios.create({
  baseURL,
});

// --- Interceptors ---
// These run automatically before every request or after every response.

// Request Interceptor: Adds the user's token to the request headers
api.interceptors.request.use((config) => {
  // If we have a token stored globally, attach it
  if (global.authToken) {
    config.headers.Authorization = `Bearer ${global.authToken}`;
  }
  return config;
});

// Response Interceptor: Handles global errors
api.interceptors.response.use(
  (response) => response, // Return successful responses as is
  (error) => {
    if (error.response?.status === 400) {
      // Log validation errors (like "Invalid password") from the backend
      console.error("Validation Error:", error.response.data.message);
    }
    return Promise.reject(error);
  }
);