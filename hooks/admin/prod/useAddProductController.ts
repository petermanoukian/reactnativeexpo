import { useAuth } from "@/context/AuthContext";
import { laraapi } from "@/src/libs/axios";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Alert, Platform } from "react-native";

export function useAddProductController(initialCatid?: number | null, initialSubcatid?: number | null) {
  const { token } = useAuth();

  const [cats, setCats] = useState<{ id: number; name: string }[]>([]);
  const [subcats, setSubcats] = useState<{ id: number; name: string }[]>([]);

  const [catid, setCatid] = useState<number | null>(initialCatid ?? null);
  const [subcatid, setSubcatid] = useState<number | null>(initialSubcatid ?? null);

  const [name, setName] = useState("");
  const [coder, setCoder] = useState("");
  const [desc, setDesc] = useState("");
  const [dess, setDess] = useState("");
  const [vis, setVis] = useState<"yes" | "no">("yes");

  const [image, setImage] = useState<any>(null);
  const [file, setFile] = useState<any>(null);

  const [loading, setLoading] = useState(false);
  const [nameTouched, setNameTouched] = useState(false);
  const [coderTouched, setCoderTouched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [nameExists, setNameExists] = useState(false); // ✅ name uniqueness flag
  const [codeExists, setCodeExists] = useState(false); // ✅ code uniqueness flag

  const isNameValid = name.trim().length >= 2 && !nameExists;
  const nameError = !name.trim()
    ? ""
    : name.trim().length < 2
    ? ""
    : nameExists
    ? "❌ Name already exists"
    : null;

  const isCoderValid = coder.trim().length >= 2 && !codeExists;
  const coderError = !coder.trim()
    ? ""
    : coder.trim().length < 2
    ? ""
    : codeExists
    ? "❌ Code already exists"
    : null;






  const allowedImageTypes = [
    "image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"
  ];

  const allowedFileTypes = [
    ...allowedImageTypes,
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ];

  const fetchCatsAndSubcats = useCallback(async () => {
    try {
      const url =
        initialCatid && initialSubcatid
          ? `/admin/prod/create/${initialCatid}/${initialSubcatid}`
          : initialCatid
          ? `/admin/prod/create/${initialCatid}`
          : `/admin/prod/create`;

      const response = await laraapi.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const { cats, subcats, catid: resolvedCatid, subcatid: resolvedSubcatid } = response.data;

      setCats(cats);
      setSubcats(subcats);
      if (resolvedCatid) setCatid(resolvedCatid);
      if (resolvedSubcatid) setSubcatid(resolvedSubcatid);
    } catch (err) {
      console.error("Failed to fetch product creation data:", err);
      setError("⚠️ Unable to load categories or subcategories");
    }
  }, [initialCatid, initialSubcatid, token]);

  const fetchSubcats = useCallback(async () => {
    if (!catid) {
      setSubcats([]);
      return;
    }

    try {
      const response = await laraapi.get(`/admin/subcats/list/${catid}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSubcats(response.data.subcats || []);
    } catch (err) {
      console.error("Failed to fetch subcategories:", err);
      setSubcats([]);
    }
  }, [catid, token]);

  useEffect(() => {
    fetchCatsAndSubcats();
  }, [fetchCatsAndSubcats]);

  useEffect(() => {
    if (catid !== initialCatid) {
      fetchSubcats();
    }
  }, [catid, initialCatid, fetchSubcats]);

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


  async function checkProductNameExists(name: string, catid: number | null, subcatid: number | null, token: string): Promise<boolean> {
  if (!name.trim() || !catid || !subcatid) return false;

  try {
    const response = await laraapi.post(
      "/admin/prod/check",
      { name: name.trim(), catid, subcatid },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data.exists === true;
  } catch (err) {
    console.error("Product name check failed:", err);
    return false;
  }
}

async function checkProductCodeExists(coder: string, token: string): Promise<boolean> {
  if (!coder.trim()) return false;

  try {
    const response = await laraapi.post(
      "/admin/prod/checkcode",
      { coder: coder.trim() },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data.exists === true;
  } catch (err) {
    console.error("Product code check failed:", err);
    return false;
  }
}


useEffect(() => {
  const timeout = setTimeout(async () => {
    if (name.trim().length >= 2 && catid && subcatid) {
      const exists = await checkProductNameExists(name, catid, subcatid, token);
      setNameExists(exists);
    } else {
      setNameExists(false);
    }
  }, 500); // wait 0.5s after last keystroke

  return () => clearTimeout(timeout);
}, [name, catid, subcatid, token]);



  useEffect(() => {
    const runCodeCheck = async () => {
      if (coder.trim().length >= 2) {
        const exists = await checkProductCodeExists(coder, token);
        setCodeExists(exists);
      } else {
        setCodeExists(false);
      }
    };

    runCodeCheck();
  }, [coder, token]);


  const handleSubmit = async () => {
    const trimmed = name.trim();
    const trimmed2 = coder.trim();
    if (!trimmed || !trimmed2 || !catid || !subcatid) {
      setError("❌ All fields are required");
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

    setLoading(true);
    const formData = new FormData();
    formData.append("name", trimmed);
    formData.append("coder", trimmed2);
    formData.append("desc", desc.trim());
    formData.append("dess", dess.trim());
    formData.append("vis", vis);
    formData.append("catid", String(catid));
    formData.append("subcatid", String(subcatid));

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
      const response = await laraapi.post("/admin/prod/add", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
        },
          transformRequest: (data) => data, // ✅ prevent Axios from stringifying
      });



      if (response.status === 201) {
        setName("");
        setDesc("");
        setDess("");
        setVis("yes");
        setImage(null);
        setFile(null);
        setNameTouched(false);
        router.replace("/(admin)/prod/view");
      } else {
        Alert.alert("❌ Error", "Failed to add product");
      }
    } catch (error: any) {
      Alert.alert("🚨 Network Error", error.message || "Unable to connect");
    } finally {
      setLoading(false);
    }
  };

  return {
    cats,
    subcats,
    catid,
    setCatid,
    subcatid,
    setSubcatid,
    name,
    setName,
    coder,
    setCoder,
    nameTouched,
    setNameTouched,
    coderTouched, 
    setCoderTouched,
    nameError,
    isNameValid,
    coderError,
    isCoderValid,
    nameExists,       
    codeExists,
    desc,
    setDesc,
    dess,
    setDess,
    vis,
    setVis,
    image,
    file,
    loading,
    pickImage,
    pickFile,
    handleSubmit,
    error,
  };
}
