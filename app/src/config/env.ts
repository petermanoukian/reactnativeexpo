import Constants from "expo-constants";

export const apiUrl = Constants.expoConfig?.extra?.LARAVEL_API_URL || "";
export const webUrl = Constants.expoConfig?.extra?.LARAVEL_WEB_URL || "";
