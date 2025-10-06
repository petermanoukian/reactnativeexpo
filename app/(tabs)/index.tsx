import { useRouter } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";

export default function HomePage() {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View className="flex-1 px-4 py-6">
        <View className="flex-row flex-wrap gap-x-1 gap-y-4 mb-6 mt-4">
          <Text className="text-blue font-medium text-center">
            Welcome to React Native Demo with Expo and Laravel 12
          </Text>
        </View>

        <Pressable
          className="bg-blue-600 px-4 py-2 rounded-md items-center justify-center w-[100] self-center"
          onPress={() => router.push("/login")}
        >
          <Text className="text-white font-medium">Login</Text>
        </Pressable>

        <Pressable
          className="bg-purple-600 px-4 py-2 rounded-md items-center justify-center w-[160] self-center mt-4"
          onPress={() => router.push("/(admin)")}
        >
          <Text className="text-white font-medium">Try Private Area</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
