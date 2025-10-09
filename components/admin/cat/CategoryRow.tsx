import { Link } from "expo-router";
import React from "react";
import { Image, Linking, Pressable, Text, View } from "react-native";

type Props = {
  item: {
    idx: number;
    name: string;
    img2?: string;
    filer?: string;
  };
  webUrl: string;
  handleDelete: (id: number) => void;
};

export default function CategoryRow({ item, webUrl , handleDelete}: Props) {
  return (
    <View className="flex-row items-center bg-white rounded-md px-4 py-3 mb-2 border border-gray-300">
      <View className="w-[40px] items-center">
        <Text className="font-bold text-gray-800 text-xs">{item.idx}</Text>
      </View>
      <View className="flex-1 pr-2 w-[130px]">
        <Text className="text-gray-700 font-medium text-sm">{item.name}</Text>
      </View>
      <View className="w-[70px]">
        <View className="flex-row items-center space-x-2 mb-1">
          {item.img2 && (
            <Image
              source={{ uri: `${webUrl}${item.img2}` }}
              style={{ width: 55, height: 40, borderRadius: 4 }}
            />
          )}
        </View>
        {item.filer && (
          <Pressable onPress={() => Linking.openURL(`${webUrl}${item.filer}`)}>
            <Text style={{ fontSize: 21 }} className="text-blue-600 underline">🗂️</Text>
          </Pressable>
        )}
      </View>
      <View className="w-[140px] flex-col space-y-2">
        {/* Category Actions */}
        <View className="flex-row">
          <Link href={`/(admin)/cat/edit/${item.idx}`} className="bg-yellow-500 px-4 py-2 rounded-md flex-1 mr-2">
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
          <Link href={`/admin/subcat/add/${item.idx}`} className="bg-green-700 px-4 py-2 rounded-md flex-1 mr-2">
            <Text className="text-white text-sm text-center">➕</Text>
          </Link>
          <Link href={`/admin/subcat/view/${item.idx}`} className="bg-green-500 px-4 py-2 rounded-md flex-1">
            <Text className="text-white text-sm text-center">👁️</Text>
          </Link>
        </View>

        {/* Product Actions */}
        <View className="flex-row mt-3">
          <Link href={`/admin/product/add/${item.idx}`} className="bg-purple-700 px-4 py-2 rounded-md flex-1 mr-2">
            <Text className="text-white text-sm text-center">➕</Text>
          </Link>
          <Link href={`/admin/product/view/${item.idx}`} className="bg-purple-500 px-4 py-2 rounded-md flex-1">
            <Text className="text-white text-sm text-center">👁️</Text>
          </Link>
        </View>
      </View>
    </View>
  );
}
