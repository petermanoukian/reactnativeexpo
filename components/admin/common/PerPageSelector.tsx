import React from "react";
import { Pressable, Text, View } from "react-native";

type Props = {
  value: number;
  options?: number[];
  onChange: (n: number) => void;
};

export default function PerPageSelector({
  value,
  options = [5, 10, 20, 50, 100],
  onChange,
}: Props) {
  return (
    <View className="px-4 pt-2">
      <View className="flex-row items-center space-x-2">
        {options.map((n) => (
          <Pressable
            key={`per-${n}`}
            onPress={() => onChange(n)}
            className={`px-5 mr-2 py-1 rounded-md ${
              value === n ? "bg-blue-600" : "bg-gray-300"
            }`}
          >
            <Text className="text-white text-sm font-medium">{n}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
