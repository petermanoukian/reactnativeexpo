import { useEditCategoryController } from "@/hooks/admin/cat/useEditCategoryController";
import { Link } from "expo-router";
import { Eye } from "lucide-react-native";
import { Image, Linking, Pressable, Text, TextInput, View } from "react-native";

export default function EditCategory() {
  const {
    name,
    setName,
    nameTouched,
    setNameTouched,
    nameError,
    isNameValid,
    image,
    file,
    loading,
    pickImage,
    pickFile,
    handleSubmit,
    existingImagePath,
    existingFileName,
    webUrl,
  } = useEditCategoryController();

  

  return (
    <View className="flex-1 bg-yellow-50 px-4 py-6">
      <Text className="text-xl font-bold text-gray-800 mb-4 text-center">
        ✏️ Edit Category
      </Text>

      <Link
        href="/(admin)/cat"
        className="bg-blue-600 px-4 py-2 rounded-md flex-row items-center"
      >
        <Eye color="white" size={18} style={{ marginRight: 6 }} />
        <Text className="text-white font-medium">Categories</Text>
      </Link>

      <TextInput
        placeholder="Category Name"
        value={name}
        onChangeText={(text) => {
          setNameTouched(true);
          setName(text);
        }}
        className="border border-gray-400 rounded-md px-3 py-2 mt-4 mb-4 bg-white"
      />

      {nameTouched && nameError && (
        <Text className="text-red-600 mb-2">{nameError}</Text>
      )}

      <Pressable onPress={pickImage} className="bg-blue-500 px-4 py-2 rounded-md mb-3">
        <Text className="text-white text-center font-medium">
          {image ? "✅ Image Selected" : "📷 Pick Image"}
        </Text>
      </Pressable>

      {existingImagePath && !image && (
        <Image
          source={{ uri: `${webUrl}${existingImagePath}` }}
          style={{ width: 100, height: 70, borderRadius: 6, marginBottom: 8 }}
        />
      )}

      <Pressable onPress={pickFile} className="bg-green-500 px-4 py-2 rounded-md mb-4">
        <Text className="text-white text-center font-medium">
          {file ? "✅ File Selected" : "📄 Pick File"}
        </Text>
      </Pressable>

      {existingFileName && !file && (
        <Pressable onPress={() => Linking.openURL(`${webUrl}${existingFileName}`)}>
          <Text className="text-blue-600 underline text-center mb-4 text-base">🗂️ View Existing File</Text>
        </Pressable>
      )}

      <Pressable
        onPress={handleSubmit}
        disabled={loading || !isNameValid}
        className={`px-4 py-2 rounded-md ${loading || !isNameValid ? "bg-gray-400" : "bg-black"}`}
      >
        <Text className="text-white text-center font-medium">
          {loading ? "Updating..." : "🚀 Update"}
        </Text>
      </Pressable>
    </View>
  );
}
