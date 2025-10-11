import CategoryPicker from "@/components/admin/common/CategoryPicker";
import React from "react";
import { TextInput, View } from "react-native";

type Props = {
  value: string;
  onChange: (text: string) => void;
  onSubmit: () => void;
  cats: { id: number; name: string }[];
  catid: number | null;
  setCatid: (id: number) => void;
};

export default function SubcatSearch({
  value,
  onChange,
  onSubmit,
  cats,
  catid,
  setCatid,
}: Props) {
  return (
    <View className="px-4 pt-2 " style={{ zIndex: 1000 }}>
      <CategoryPicker cats={cats} catid={catid} setCatid={setCatid} />
      <View className="bg-white rounded-md border border-gray-300 px-3 py-1 mb-2">
        <TextInput
          value={value}
          onChangeText={onChange}
          placeholder="🔍 Search subcategories..."
          className="text-base text-gray-800 py-1"
          returnKeyType="search"
          onSubmitEditing={onSubmit}
        />
      </View>

      
    </View>
  );
}
