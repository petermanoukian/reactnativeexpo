import { useAuth } from "@/context/AuthContext";
import { laraapi } from "@/src/libs/axios";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";

export function useAddSubcategoryController(initialCatid?: number | null) {
  const { token } = useAuth();

  const [cats, setCats] = useState<{ id: number; name: string }[]>([]);
  const [catid, setCatid] = useState<number | null>(initialCatid ?? null);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isNameValid = name.trim().length >= 2;

  const fetchCats = useCallback(async () => {
    try {
      const url = initialCatid
        ? `/admin/subcat/create/${initialCatid}`
        : `/admin/subcat/create`;

        const response = await laraapi.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });


      const { cats, catid } = response.data;
      setCats(cats);
      if (catid) setCatid(catid);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
      setError("⚠️ Unable to load categories");
    }
  }, [initialCatid, token]);


  useEffect(() => {
    fetchCats();
  }, [fetchCats]);

  const handleSubmit = async () => {
    const trimmed = name.trim();
    if (!trimmed || !catid) {
      setError("❌ Both name and category are required");
      return;
    }

    setLoading(true);
    try {
      const response = await laraapi.post(
        "/admin/subcat/add",
        { name: trimmed, catid },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 201) {
        setName("");
        setError(null);
        router.replace("/(admin)/subcat/view");
      } else {
        setError("❌ Failed to add subcategory");
      }
    } catch (err: any) {
      console.error("Submit error:", err);
      setError("🚨 Network error");
    } finally {
      setLoading(false);
    }
  };


const [exists, setExists] = useState(false);

const checkExists = useCallback(async () => {
  const trimmed = name.trim();
  if (!trimmed || !catid) {
    setExists(false);
    return;
  }

  try {
    const response = await laraapi.post(
      "/admin/subcat/check",
      { name: trimmed, catid },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setExists(response.data.exists === true);
  } catch (err) {
    console.error("Existence check failed:", err);
    setExists(false);
  }
}, [name, catid, token]);

useEffect(() => {
  checkExists();
}, [name, catid]);



  return {
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
  };
}
