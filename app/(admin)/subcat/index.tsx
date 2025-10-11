import { Text, View } from "react-native";

export default function CreateSubcategoryIndex() {
  console.log("✅ /subcat/create route matched");

  return (
    <View className="flex-1 items-center justify-center bg-green-100">
      <Text className="text-green-800 font-bold text-xl">🟢 Create Subcategory Index</Text>
    </View>
  );
}
