import { useAuth } from "@/context/AuthContext";
import { laraapi } from "@/src/libs/axios";
import { useCallback, useEffect, useState } from "react";
import { Alert, Platform } from "react-native";

export function useSubcategoryController(initialCatid?: number | null) {
  const { token } = useAuth();

  const [subcats, setSubcats] = useState<any[]>([]);
  const [cats, setCats] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [sortField, setSortField] = useState("id");
  const [sortDirection, setSortDirection] = useState("desc");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCatid, setFilterCatid] = useState<number | null>(initialCatid ?? null);
  
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // 🔁 Reset pagination when filters change
  useEffect(() => {
    setPage(1);
    setHasMore(true);
    setSubcats([]);
  }, [sortField, sortDirection, searchQuery, filterCatid]);

  const loadSubcats = useCallback(async () => {
    if (!hasMore && page > 1) return;

    setLoading(true);
    try {
      //const routeCatid = initialCatid ? `/${initialCatid}` : "";
      const routeCatid = filterCatid ? `/${filterCatid}` : "";
      const response = await laraapi.get(
        `/admin/subcats/view${routeCatid}?page=${page}&sort=${sortField}&direction=${sortDirection}&search=${encodeURIComponent(
          searchQuery
        )}${filterCatid ? `&catid=${filterCatid}` : ""}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { subcats: newSubcats, cats: dropdownCats, meta } = response.data;

      if (Array.isArray(newSubcats)) {
        setSubcats((prev) => (page === 1 ? newSubcats : [...prev, ...newSubcats]));
        setHasMore(meta?.current_page < meta?.last_page);
      }

      if (Array.isArray(dropdownCats)) setCats(dropdownCats);
    } catch (error) {
      console.error("❌ Error loading subcategories:", error);
    } finally {
      setLoading(false);
    }
  }, [
    initialCatid,
    token,
    sortField,
    sortDirection,
    searchQuery,
    filterCatid,
    page,
    hasMore,
  ]);

  useEffect(() => {
    loadSubcats();
  }, [loadSubcats, page]);

  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleDelete = async (id: number) => {
    const confirmDelete = async () => {
      try {
        const response = await laraapi.delete(`/admin/subcat/delete/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          console.log("✅ Deleted successfully");
          resetView();
        } else {
          console.error("❌ Delete failed:", response.data);
        }
      } catch (error) {
        console.error("🔥 Error deleting:", error);
      }
    };

    if (Platform.OS === "web") {
      const confirmed = window.confirm("Are you sure you want to delete this subcategory?");
      if (confirmed) await confirmDelete();
    } else {
      Alert.alert("Confirm Delete", "Are you sure?", [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: confirmDelete },
      ]);
    }
  };

  const resetView = () => {
    setSearchQuery("");
    setSortField("id");
    setSortDirection("desc");
    //setFilterCatid(initialCatid ?? null);
    setFilterCatid(null);
  };

  const loadMore = () => {
    if (hasMore && !loading) setPage((prev) => prev + 1);
  };

  return {
    subcats,
    cats,
    loading,
    sortField,
    sortDirection,
    searchQuery,
    filterCatid,
    setSearchQuery,
    setFilterCatid,
    handleSort,
    resetView,
    handleDelete,
    page,
    hasMore,
    loadMore,
  };
}
