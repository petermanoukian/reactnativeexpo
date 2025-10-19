import Constants from "expo-constants";
import { Platform } from "react-native";


export const apiUrl = Constants.expoConfig?.extra?.LARAVEL_API_URL || "";
export const webUrl = Constants.expoConfig?.extra?.LARAVEL_WEB_URL || "";

const expoWebUrl = Constants.expoConfig?.extra?.EXPO_WEB_URL || "";
const expoMobileUrl = Constants.expoConfig?.extra?.EXPO_MOBILE_URL || "";

export const localBaseUrl = Platform.OS === "web" ? expoWebUrl : expoMobileUrl;

export const resolveRoute = (path: string) =>
  `/${path.startsWith("/") ? path.slice(1) : path}`;
