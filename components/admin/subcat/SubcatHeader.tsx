import { Link } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";

type Props = {
  title?: string;
  onReload: () => void;
  addHref: string;
};

export default function SubcatHeader({
  title = "Subcategories",
  onReload,
  addHref,
}: Props) {
  return (
    <View className="flex-row justify-between mb-0 px-4 pt-1 items-center">
      <Text className="text-xl font-bold text-gray-800">{title}</Text>

      <Pressable
        onPress={onReload}
        className="bg-gray-200 px-2 py-1 rounded-md"
      >
        <Text className="text-lg">🔄</Text>
      </Pressable>

      <Link href={addHref} className="bg-blue-600 px-4 py-2 rounded-md">
        <Text className="text-white font-medium">➕</Text>
      </Link>
    </View>
  );
}
