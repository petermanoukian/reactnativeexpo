// app/(admin)/subcat/edit/[id].tsx

import CategoryPicker from "@/components/admin/common/CategoryPicker";
import { useEditSubcategoryController } from "@/hooks/admin/subcat/useEditSubcategoryController";
import { Link, useLocalSearchParams } from "expo-router";
import { Eye } from "lucide-react-native";
import { Pressable, Text, TextInput, View } from "react-native";

export default function EditSubcategory() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const numericId = id ? Number(id) : 0;

  const {
    cats,
    catid,
    setCatid,
    name,
    setName,
    isNameValid,
    loading,
    error,
    handleSubmit,
    exists,
    checkExists
  } = useEditSubcategoryController(numericId);

  return (
    <View className="flex-1 bg-yellow-50 px-4 py-6">
      <Text className="text-xl font-bold text-gray-800 mb-4 text-center">
        ✏️ Edit Subcategory
      </Text>

      <Link
        href="/(admin)/subcat/view"
        className="bg-blue-600 px-4 py-2 rounded-md flex-row items-center"
      >
        <Eye color="white" size={18} style={{ marginRight: 6 }} />
        <Text className="text-white font-medium">Subcategories</Text>
      </Link>

      <CategoryPicker cats={cats} catid={catid} setCatid={setCatid} />

<TextInput
  placeholder="Subcategory Name"
  value={name}
  onChangeText={(text) => {
    setName(text);
    checkExists(); // ← now triggered only when user types
  }}
  className="border border-gray-400 rounded-md px-3 py-2 mb-4 bg-white"
/>


      {error && <Text className="text-red-600 mb-2">{error}</Text>}

      {exists && (
        <Text className="text-orange-600 mb-2">
          ⚠️ Subcategory already exists for this category
        </Text>
      )}

      <Pressable
        onPress={handleSubmit}
        disabled={loading || !isNameValid || !catid}
        className={`px-4 py-2 rounded-md ${
          loading || !isNameValid || !catid ? "bg-gray-400" : "bg-black"
        }`}
      >
        <Text className="text-white text-center font-medium">
          {loading ? "Updating..." : "💾 Update"}
        </Text>
      </Pressable>
    </View>
  );
}
