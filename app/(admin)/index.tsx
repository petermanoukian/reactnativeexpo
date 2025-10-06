import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { useAuth } from "../../context/AuthContext";

export default function Index() {
  const router = useRouter();
  const { user, logout } = useAuth();

  return (
    <View className="bg-yellow-500 p-4">
      {/* Header block */}
      <View className="h-[120px] items-center justify-center mb-4">
        <Text className="text-xl font-semibold text-center text-black">
          Welcome, {user?.name}
        </Text>

        <Text className="text-md text-center text-blue-800 mt-2">
          Email: {user?.email}
        </Text>

        <Text className="text-md text-center text-black mt-2">
          This is a demo App for Laravel with React Native and Expo
        </Text>
      </View>

      {/* Logout button */}
      <Pressable
        className="bg-red-600 px-4 py-2 rounded-md items-center justify-center w-[80%] self-center"
        onPress={() => {
          logout();
          router.replace("/login"); // ✅ redirect after logout
        }}
      >
        <Text className="text-white font-medium">Logout</Text>
      </Pressable>
    </View>
  );
}
