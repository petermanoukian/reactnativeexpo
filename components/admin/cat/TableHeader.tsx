import React from "react";
import { Pressable, Text, View } from "react-native";

type Props = {
  sortField: string;
  sortDirection: string;
  onSort: (field: string) => void;
};

export default function TableHeader({ sortField, sortDirection, onSort }: Props) {
  return (
    <View className="px-4 py-2 bg-gray-100 border-b border-gray-300">
      <View className="flex-row items-center">
        <Pressable
          onPress={() => onSort("id")}
          className="w-[50px] h-[36px] justify-center items-center rounded-md bg-gray-200 mr-2"
        >
          <Text className="text-sm font-bold text-gray-800">
            ID {sortField === "id" ? (sortDirection === "asc" ? "↑" : "↓") : "↑↓"}
          </Text>
        </Pressable>

        <Pressable
          onPress={() => onSort("name")}
          className="flex-1 w-[70px] h-[36px] justify-center items-center rounded-md bg-gray-200 mr-1"
        >
          <Text className="text-sm font-bold text-gray-800">
            Title {sortField === "name" ? (sortDirection === "asc" ? "↑" : "↓") : "↑↓"}
          </Text>
        </Pressable>

        <View className="w-[120px] h-[36px] justify-center">
          <Text className="text-sm font-bold text-gray-600">Image / File</Text>
        </View>
        <View className="w-[100px] h-[36px] justify-center items-center">
          <Text className="text-sm font-bold text-gray-600">Actions</Text>
        </View>
      </View>
    </View>
  );
}
