// src/api.js
import axios from "axios";
import { Platform } from "react-native";

// Choose the correct baseURL depending on where the app is running
const baseURL = Platform.select({
  web: "http://localhost:5000",     // Expo Web (browser)
  ios: "http://localhost:5000",     // iOS simulator
  android: "http://10.0.2.2:5000",  // Android emulator
  default: "http://localhost:5000",
});

console.log("API baseURL =", baseURL);

export const api = axios.create({
  baseURL,
});

api.interceptors.request.use((config) => {
  if (global.authToken) {
    config.headers.Authorization = `Bearer ${global.authToken}`;
  }
  return config;
});
