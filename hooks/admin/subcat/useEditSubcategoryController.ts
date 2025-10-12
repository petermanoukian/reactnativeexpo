// hooks/admin/subcat/useEditSubcategoryController.ts

import { useAuth } from "@/context/AuthContext";
import { laraapi } from "@/src/libs/axios";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";

export function useEditSubcategoryController(id: number) {
  const { token } = useAuth();

  const [cats, setCats] = useState<{ id: number; name: string }[]>([]);
  const [catid, setCatid] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exists, setExists] = useState(false);
  const [ready, setReady] = useState(false);

  const isNameValid = name.trim().length >= 2;

  const fetchInitialData = useCallback(async () => {
    try {
      const response = await laraapi.get(`/admin/subcat/edit/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const { row, cats } = response.data;
      setCats(cats);
      setName(row.name);
      setCatid(row.catid);
    } catch (err) {
      console.error("Failed to fetch subcategory:", err);
      setError("⚠️ Unable to load subcategory");
    }
  }, [id, token]);

    useEffect(() => {
    fetchInitialData().then(() => setReady(true));
    }, [fetchInitialData]);


  const checkExists = useCallback(async () => {
    const trimmed = name.trim();
    if (!trimmed || !catid || !id) {
      setExists(false);
      return;
    }

    try {
      const response = await laraapi.post(
        "/admin/subcat/checkedit",
        { name: trimmed, catid, id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setExists(response.data.exists === true);
    } catch (err) {
      console.error("Existence check failed:", err);
      setExists(false);
    }
  }, [name, catid, id, token]);

useEffect(() => {
  if (!ready) return;
  checkExists();
}, [checkExists, ready, id, name, catid]);



  const handleSubmit = async () => {
    const trimmed = name.trim();
    if (!trimmed || !catid || !id) {
      setError("❌ All fields are required");
      return;
    }

    setLoading(true);
    try {
      const response = await laraapi.post(
        `/admin/subcat/update/${id}`,
        { name: trimmed, catid },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        setError(null);
        router.replace("/(admin)/subcat/view");
      } else {
        setError("❌ Failed to update subcategory");
      }
    } catch (err: any) {
      console.error("Update error:", err);
      setError("🚨 Network error");
    } finally {
      setLoading(false);
    }
  };

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
    checkExists
  };
}
