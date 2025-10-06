import { Ionicons } from '@expo/vector-icons';
import { Tabs, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, Image, ScrollView, View } from 'react-native';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuth } from "../../context/AuthContext";


const Banner = () => (
  <View className="w-full h-[140px] items-center justify-center overflow-hidden mt-10 mb-4 bg-neutral-200">
    <Image
      source={require('../../assets/images/main2.jpg')}
      className="max-w-full max-h-full"
      style={{ resizeMode: 'contain' }}
    />
  </View>
);

export default function TabLayout() {


  const { user, loading } = useAuth();
  const router = useRouter();
  const colorScheme = useColorScheme();

    useEffect(() => {
    if (!loading && user) {
      router.replace("/(admin)");
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View className="flex-1 px-4 py-2">
        <Banner />

        <Tabs
          screenOptions={{
            tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
            headerShown: false,
            tabBarButton: HapticTab,
            tabBarStyle: {
              height: 58,
              paddingBottom: 4,
              paddingTop: 4,
              marginBottom: 42, // 🔼 lifts tab bar upward
              borderTopWidth: 0, // optional: remove default border
              elevation: 4, // Android shadow
              shadowColor: '#000', // iOS shadow
              shadowOffset: { width: 0, height: -2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
            },
            tabBarLabelStyle: {
              fontSize: 12,
            },
          }}
        >


          <Tabs.Screen
            name="index"
            options={{
              title: 'Home',
              tabBarIcon: ({ color }) => (
                <IconSymbol size={28} name="house.fill" color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="login"
            options={{
              title: 'Login',
              tabBarIcon: ({ color }) => (
                <Ionicons name="log-in-outline" size={28} color={color} />
              ),
            }}
          />
        </Tabs>
      </View>
    </ScrollView>
  );
}
