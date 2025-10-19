import { Link } from "expo-router";
import React from "react";
import { Alert, Pressable, Text, View } from "react-native";

type Props = {
  item: {
    id: number;
    name: string;
    catid: number;
    subcatid: number;
    prodcat: {
      id: number;
      name: string;
    };
    prodsubcat: {
      id: number;
      name: string;
    };
  };
  handleDelete: (id: number) => void;
};

export default function ProdRow({ item, handleDelete }: Props) {
  return (
    <View className="bg-white rounded-md px-4 py-3 mb-2 border border-gray-300">
  {/* Row 1: ID, Name, Category */}
  <View className="flex-row items-center mb-1">
    <View className="w-[50px] items-center">
      <Text className="font-bold text-gray-800 text-xs">{item.id}</Text>
    </View>

    <View className="flex-1 pr-2 w-[130px]">
      <Text className="text-gray-700 font-medium text-sm">{item.name}</Text>
    </View>

    <View className="w-[120px] items-center">
      <Text className="text-gray-600 text-sm font-medium">{item.prodcat.name}</Text>
    </View>
  </View>


    <View className="border-t border-gray-200 my-1" />

  {/* Row 2: Subcategory + Actions */}
  <View className="flex-row items-center">
    <View className="w-[120px] items-center">
      <Text className="text-gray-600 text-sm font-medium">{item.prodsubcat.name}</Text>
    </View>

    <View className="flex-row space-x-2 ml-auto">
      <Link href={`/(admin)/prod/edit/${item.id}`} className="bg-yellow-500 px-5 py-2 rounded-md mr-2">
        <Text className="text-white text-sm text-center">✏️</Text>
      </Link>

      <Pressable
        onPress={() => {
          Alert.alert(
            "Confirm Delete",
            `Are you sure you want to delete "${item.name}"?`,
            [
              { text: "Cancel", style: "cancel" },
              {
                text: "Delete",
                style: "destructive",
                onPress: () => handleDelete(item.id),
              },
            ]
          );
        }}
        style={{
          backgroundColor: '#dc2626',
          paddingVertical: 8,
          paddingHorizontal: 12,
          borderRadius: 6,
          marginRight: 4,
        }}
      >
        <Text style={{ color: 'white', fontSize: 14, textAlign: 'center' }}>🗑️</Text>
      </Pressable>


      <Link
        href={{
          pathname: "/(admin)/prod/add",
          params: {
            categoryId: item.catid,
            subcategoryId: item.subcatid,
          },
        }}
        className="bg-green-700 px-3 py-2 rounded-md"
      >
        <Text className="text-white text-sm text-center">➕</Text>
      </Link>
    </View>
  </View>
</View>

  );
}
