import React from "react";
import { TextInput, View } from "react-native";

type Props = {
  value: string;
  onChange: (text: string) => void;
  onSubmit: () => void;
};

export default function CatSearch({ value, onChange, onSubmit }: Props) {
  return (
    <View className="px-4 pt-2">
      <View className="bg-white rounded-md border border-gray-300 px-3 py-1">
        <TextInput
          value={value}
          onChangeText={onChange}
          placeholder="🔍 Search categories..."
          className="text-base text-gray-800 py-1"
          returnKeyType="search"
          onSubmitEditing={onSubmit}
        />
      </View>
    </View>
  );
}
