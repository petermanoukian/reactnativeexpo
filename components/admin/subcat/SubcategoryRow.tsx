import { Link } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";

type Props = {
  item: {
    idx: number;
    name: string;
    cat: {
      name: string;
      id:number;
    };
  };
  handleDelete: (id: number) => void;
};

export default function SubcategoryRow({ item, handleDelete }: Props) {
  return (
    <View className="flex-row items-center bg-white rounded-md px-4 py-3 mb-2 border border-gray-300">
      <View className="w-[40px] items-center">
        <Text className="font-bold text-gray-800 text-xs">{item.idx}</Text>
      </View>

      <View className="flex-1 pr-2 w-[130px]">
        <Text className="text-gray-700 font-medium text-sm">{item.name}</Text>
      </View>

      <View className="w-[120px] items-center">
        <Text className="text-gray-600 text-sm font-medium">{item.cat.name}</Text>
      </View>

      <View className="w-[140px] flex-col space-y-2">
        {/* Category Actions */}
        <View className="flex-row">
          <Link href={`/(admin)/subcat/edit/${item.idx}`} className="bg-yellow-500 px-4 py-2 rounded-md flex-1 mr-2">
            <Text className="text-white text-sm text-center">✏️</Text>
          </Link>
          <Pressable
            onPress={() => handleDelete(item.idx)}
            style={{ backgroundColor: '#dc2626', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 6, flex: 1 }}
          >
            <Text style={{ color: 'white', fontSize: 14, textAlign: 'center' }}>🗑️</Text>
          </Pressable>
        </View>

        {/* Subcategory Actions */}
        <View className="flex-row mt-3">
          <Link href={`/subcat/add/${item.cat.id}`} className="bg-green-700 px-4 py-2 rounded-md flex-1 mr-2">
            <Text className="text-white text-sm text-center">➕ </Text>
          </Link>

        </View>

        {/* Product Actions */}
        <View className="flex-row mt-3">
          <Link href={`/(admin)/product/add/${item.idx}`} className="bg-purple-700 px-4 py-2 rounded-md flex-1 mr-2">
            <Text className="text-white text-sm text-center">➕</Text>
          </Link>
          <Link href={`/(admin)/product/view/${item.idx}`} className="bg-purple-500 px-4 py-2 rounded-md flex-1">
            <Text className="text-white text-sm text-center">👁️</Text>
          </Link>
        </View>
      </View>
    </View>
  );
}
