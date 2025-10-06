import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function CatIndex() {
  return (
    <View className="flex-1 bg-yellow-50 px-1 py-4">
      {/* Header */}
        <View className="flex-row  justify-between mb-4 px-4">
          <Text className="text-xl font-bold text-gray-800">
            🐾 Categories 
          </Text>

          <Link
            href="/(admin)/cat/add"
            className="bg-blue-600 px-4 py-2 rounded-md"
          >
            <Text className="text-white font-medium">➕  Category</Text>
          </Link>
        </View>

    </View>
  );
}
