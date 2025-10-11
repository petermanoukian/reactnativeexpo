// src/libs/axios.ts
import axios from 'axios';
import Constants from 'expo-constants';

const { LARAVEL_API_URL, LARAVEL_WEB_URL } = Constants.expoConfig?.extra || {};

// Laravel API (token injected per request if needed)
export const laraapi = axios.create({
  baseURL: LARAVEL_API_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

// Laravel Web (token injected per request if needed)
export const laraweb = axios.create({
  baseURL: LARAVEL_WEB_URL,
  headers: {
    Accept: 'text/html',
  },
});
