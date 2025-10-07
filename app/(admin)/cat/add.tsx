import Constants from "expo-constants";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { Link, router } from "expo-router";
import { Eye } from 'lucide-react-native';
import { useEffect, useState } from "react";
import { Alert, Platform, Pressable, Text, TextInput, View } from "react-native";
import { useAuth } from "../../../context/AuthContext";


export default function AddCategory() {
  const { token } = useAuth();
  const [name, setName] = useState("");
  const [image, setImage] = useState<any>(null);
  const [file, setFile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [nameStatus, setNameStatus] = useState<null | "checking" | "exists" | "available">(null);
  const [nameError, setNameError] = useState<string | null>(null);
  const [nameTouched, setNameTouched] = useState(false);
  const isNameValid = name.trim().length >= 2 && nameStatus !== "exists";

  const allowedImageTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif"
  ];

  const allowedFileTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif","application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];




  useEffect(() => {
    const trimmed = name.trim();

    if (trimmed.length === 0) {
      setNameStatus(null);
      setNameError("⚠️ Category name is required");
      return;
    }



    const checkName = async () => {
      setNameStatus("checking");
      setNameError(null);

      try {
        const response = await fetch(`${Constants.expoConfig?.extra?.LARAVEL_API_URL}/admin/cat/check`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name: trimmed }),
        });

        let data = null;
        try {
          const text = await response.text();
          data = text ? JSON.parse(text) : null;
        } catch (e) {
          console.error("❌ Failed to parse JSON:", e);
        }

        if (data?.exists) {
          setNameStatus("exists");
          setNameError("❌ Name already exists");
        } else {
          setNameStatus("available");
          setNameError(null);
        }
      } catch (error) {
        console.error("Name check failed:", error);
        setNameStatus(null);
        setNameError("⚠️ Unable to check name");
      }
    };

    checkName();
  }, [name]);

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

  const normalizedImageType = image?.mimeType?.toLowerCase();
  if (image && !allowedImageTypes.includes(normalizedImageType)) {
    Alert.alert("❌ Invalid Image", "Only JPG, JPEG, PNG, WEBP, and GIF are allowed.");
    setLoading(false);
    return;
  }

  if (file && !allowedFileTypes.includes(file.type)) {
    Alert.alert("❌ Invalid File", "Only Images, text, PDF and Word documents are allowed.");
    setLoading(false);
    return;
  }
  const handleSubmit = async () => {

    if (!name.trim()) {
        setNameStatus(null);
        return;
    }

    if (image && image.size > 20 * 1024 * 1024) {
      Alert.alert("❌ Image Too Large", "Maximum allowed size is 20 MB.");
      setLoading(false);
      return;
    }

    if (file && file.size > 40 * 1024 * 1024) {
      Alert.alert("❌ File Too Large", "Maximum allowed size is 40 MB.");
      setLoading(false);
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("name", name);

    if (image) {
      if (Platform.OS === "web") {
        // Web: use File object
        const response = await fetch(image.uri);
        const blob = await response.blob();
        formData.append("img", new File([blob], image.fileName || "image.jpg", {
          type: image.mimeType || "image/jpeg",
        }));
      } else {
        // Mobile: use uri-based object
        formData.append("img", {
          uri: image.uri,
          name: image.fileName || "image.jpg",
          type: image.mimeType || "image/jpeg",
        } as any);
      }
    }


    if (file) {
      if (Platform.OS === "web") {
        const response = await fetch(file.uri);
        const blob = await response.blob();
        formData.append("filer", new File([blob], file.name, {
          type: file.type || "application/octet-stream",
        }));
      } else {
        formData.append("filer", {
          uri: file.uri,
          name: file.name,
          type: file.type || "application/octet-stream",
        } as any);
      }
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
      
      let data = null;
      try {
        const text = await response.text();
        data = text ? JSON.parse(text) : null;
      } catch (e) {
        console.error("❌ Failed to parse JSON:", e);
      }

      if (response.ok) {
        setName("");
        setImage(null);
        setFile(null);
        setNameTouched(false);
        router.replace("/(admin)/cat");
      } else {
        const errorMessage = data?.message || "❌ Failed to add category. Make sure your files are valid.";
        Alert.alert("❌ Error", errorMessage);
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

      <Pressable onPress={pickFile} className="bg-green-500 px-4 py-2 rounded-md mb-4">
        <Text className="text-white text-center font-medium">
          {file ? "✅ File Selected" : "📄 Pick File"}
        </Text>
      </Pressable>

      <Pressable
        onPress={handleSubmit}
        disabled={loading || !isNameValid}
        className={`px-4 py-2 rounded-md ${loading || !isNameValid ? "bg-gray-400" : "bg-black"}`}
      >
        <Text className="text-white text-center font-medium">
          {loading ? "Submitting..." : "🚀 Submit"}
        </Text>
      </Pressable>


    </View>
  );
}
