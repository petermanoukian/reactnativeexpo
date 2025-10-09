import { useAuth } from "@/context/AuthContext";
import Constants from "expo-constants";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Platform } from "react-native";

export function useEditCategoryController() {
  const { id } = useLocalSearchParams();
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
    "image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"
  ];

  const allowedFileTypes = [
    ...allowedImageTypes,
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ];

  // ✅ Load existing category
  useEffect(() => {
    const loadCategory = async () => {
      try {
        const response = await fetch(`${Constants.expoConfig?.extra?.LARAVEL_API_URL}/admin/cat/edit/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        const text = await response.text();
        const data = text ? JSON.parse(text) : null;

        if (data?.name) setName(data.name);
      } catch (error) {
        Alert.alert("❌ Error", "Failed to load category");
      }
    };

    if (id) loadCategory();
  }, [id]);

  // ✅ Check name uniqueness
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
        const response = await fetch(`${Constants.expoConfig?.extra?.LARAVEL_API_URL}/admin/cat/checkedit`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name: trimmed, id }),
        });

        const text = await response.text();
        const data = text ? JSON.parse(text) : null;

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

      if (!result.canceled && result.assets?.length > 0) {
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
    const trimmed = name.trim();
    if (!trimmed) {
      setNameStatus(null);
      return;
    }

    const normalizedImageType = image?.mimeType?.toLowerCase();
    if (image && !allowedImageTypes.includes(normalizedImageType)) {
      Alert.alert("❌ Invalid Image", "Only JPG, JPEG, PNG, WEBP, and GIF are allowed.");
      return;
    }

    if (file && !allowedFileTypes.includes(file.type)) {
      Alert.alert("❌ Invalid File", "Only Images, text, PDF and Word documents are allowed.");
      return;
    }

    if (image && image.size > 20 * 1024 * 1024) {
      Alert.alert("❌ Image Too Large", "Maximum allowed size is 20 MB.");
      return;
    }

    if (file && file.size > 40 * 1024 * 1024) {
      Alert.alert("❌ File Too Large", "Maximum allowed size is 40 MB.");
      return;
    }

    /*
    console.log("🚀 Submitting category update:");
    console.log("Name:", trimmed);
    console.log("Image:", image);
    console.log("File:", file);
*/

    setLoading(true);
    const formData = new FormData();
    formData.append("name", trimmed);

    if (image) {
      if (Platform.OS === "web") {
        const response = await fetch(image.uri);
        const blob = await response.blob();
        formData.append("img", new File([blob], image.fileName || "image.jpg", {
          type: image.mimeType || "image/jpeg",
        }));
      } else {
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
      const response = await fetch(`${Constants.expoConfig?.extra?.LARAVEL_API_URL}/admin/cat/update/${id}`, {
        method: "POST", // or PUT if Laravel accepts it
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: formData,
      });

      const text = await response.text();
      const data = text ? JSON.parse(text) : null;

      if (response.ok) {
        setName("");
        setImage(null);
        setFile(null);
        setNameTouched(false);
        router.replace("/(admin)/cat");
      } else {
        const errorMessage = data?.message || "❌ Failed to update category.";
        Alert.alert("❌ Error", errorMessage);
      }
    } catch (error: any) {
      Alert.alert("🚨 Network Error", error.message || "Unable to connect");
    } finally {
      setLoading(false);
    }
  };

  return {
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
  };
}
