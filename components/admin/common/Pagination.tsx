import React from "react";
import { Pressable, Text, View } from "react-native";

type Props = {
  currentPage: number;
  lastPage: number;
  chunkSize?: number;
  onPageChange: (page: number) => void;
};

export default function Pagination({
  currentPage,
  lastPage,
  chunkSize = 5,
  onPageChange,
}: Props) {
  const chunkedPages: number[][] = [];

  for (let i = 0; i < lastPage; i += chunkSize) {
    const chunk = Array.from(
      { length: Math.min(chunkSize, lastPage - i) },
      (_, j) => i + j + 1
    );
    chunkedPages.push(chunk);
  }

  if (lastPage <= 1) return null;

  return (
    <View className="mt-4 mb-12">
      {chunkedPages.map((row, rowIndex) => (
        <View key={`row-${rowIndex}`} className="flex-row justify-center space-x-2 mb-2">
          {row.map((pageNum) => (
            <Pressable
              key={`page-${pageNum}`}
              onPress={() => onPageChange(pageNum)}
              className={`px-6 mr-2 py-2 rounded-md ${
                currentPage === pageNum ? "bg-blue-600" : "bg-gray-300"
              }`}
            >
              <Text className="text-white text-sm font-medium">{pageNum}</Text>
            </Pressable>
          ))}
        </View>
      ))}
    </View>
  );
}
