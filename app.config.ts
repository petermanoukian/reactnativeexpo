// app.config.ts
import 'dotenv/config';

export default {
  expo: {
    name: "LaravelReactExpo",
    slug: "native-expo",
    extra: {
      LARAVEL_API_URL: process.env.LARAVEL_API_URL,
      LARAVEL_WEB_URL: process.env.LARAVEL_WEB_URL,
            EXPO_WEB_URL: process.env.EXPO_WEB_URL,
      EXPO_MOBILE_URL: process.env.EXPO_MOBILE_URL,
    },
  },
};
