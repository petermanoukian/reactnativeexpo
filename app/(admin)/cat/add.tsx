import Constants from "expo-constants";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { Link } from "expo-router";
import { Eye } from 'lucide-react-native';
import { useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";
import { useAuth } from "../../../context/AuthContext";

export default function AddCategory() {
  const { token } = useAuth();
  const [name, setName] = useState("");
  const [image, setImage] = useState<any>(null);
  const [file, setFile] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });
      if (!result.canceled) setImage(result.assets[0]);
    };

    const pickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        setFile({
          uri: asset.uri,
          name: asset.name || "file.bin",
          type: asset.mimeType || "application/octet-stream",
          size: asset.size,
        });

      }
    } catch (error) {
      console.error("Error picking file:", error);
    }
  };


  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert("Validation", "Name is required");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("name", name);

    if (image) {
      formData.append("img", {
        uri: image.uri,
        name: image.fileName || "image.jpg",
        type: image.mimeType || "image/jpeg",
      } as any);
    }

    if (file) {
      formData.append("filer", {
        uri: file.uri, // ✅ use the URI we stored earlier
        name: file.name,
        type: file.type || "application/octet-stream",
      } as any);

      console.log("✅ Appended file:", file);
    }




    try {
      const response = await fetch(
        `${Constants.expoConfig?.extra?.LARAVEL_API_URL}/admin/cat/add`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            //"Content-Type": "multipart/form-data",
          },
          body: formData,
        }
        
      );
      console.log("📦 FormData:", formData);
      const data = await response.json();

      if (response.ok) {
        Alert.alert("✅ Success", "Category added");
        setName("");
        setImage(null);
        setFile(null);
      } else {
        Alert.alert("❌ Error", data.message || "Failed to add category");
      }
    } catch (error: any) {
      Alert.alert("🚨 Network Error", error.message || "Unable to connect");
    } finally {
      setLoading(false);
    }
  };

  return (


    <View className="flex-1 bg-yellow-50 px-4 py-6">
      <Text className="text-xl font-bold text-gray-800 mb-4 text-center">
        ➕ Category
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
        onChangeText={setName}
        className="border border-gray-400 rounded-md px-3 py-2 mt-4 mb-4 bg-white"
      />

      <Pressable onPress={pickImage} className="bg-blue-500 px-4 py-2 rounded-md mb-3">
        <Text className="text-white text-center font-medium">
          {image ? "✅ Image Selected" : "📷 Pick Image"}
        </Text>
      </Pressable>

      <Pressable onPress={pickFile} className="bg-green-500 px-4 py-2 rounded-md mb-4">
        <Text className="text-white text-center font-medium">
          {file ? "✅ File Selected" : "📄 Pick File"}
        </Text>
      </Pressable>

      <Pressable
        onPress={handleSubmit}
        disabled={loading}
        className="bg-black px-4 py-2 rounded-md"
      >
        <Text className="text-white text-center font-medium">
          {loading ? "Submitting..." : "🚀 Submit"}
        </Text>
      </Pressable>
    </View>
  );
}
