import { Stack, useRouter } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useAuth, useAuthGuard } from "../../context/AuthContext";

const Banner = () => (
  <View className="w-full h-[40px] items-center justify-center overflow-hidden mt-10 mb-4" style={styles.banner}>
    <Image
      source={require('../../assets/images/main5.jpg')}
      className="max-w-full max-h-full"
      style={{ resizeMode: 'contain' }}
    />
  </View>
);

export default function AdminLayout() {
  const { user, loading } = useAuthGuard();
  const { logout } = useAuth();
  const router = useRouter();

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!user) return null;

  return (
    <View className="flex-1">
      {/* Scrollable header zone */}
      <View style={{ height: 190, paddingHorizontal: 16, paddingTop: 4 }}>
        <Banner />

        <Pressable
          className="bg-red-600 px-4 py-2 rounded-md items-center justify-center w-[100] self-center"
          onPress={logout}
        >
          <Text className="text-white font-medium">Logout</Text>
        </Pressable>

        <View className="flex-row flex-wrap gap-x-1 gap-y-4 mb-6 mt-4">
          <Pressable onPress={() => router.replace("/(admin)/cat")}>
            <Text className="text-blue-600 font-medium">Categories</Text>
          </Pressable>
          <Text className="text-blue-600 font-medium">|</Text>
          <Pressable onPress={() => router.replace("/(admin)/subcat/view")}>
            <Text className="text-blue-600 font-medium">SubCategories</Text>
          </Pressable>



        </View>
      </View>


      {/* Routed screen zone */}
      <View className="flex-1">
        <Stack screenOptions={{ headerShown: false }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#ebebeb',
  },
});
