import { useAuth } from "@/context/AuthContext";
import { apiUrl, webUrl } from "@/src/config/env";
import { useCallback, useEffect, useState } from "react";
import { Alert, Platform } from 'react-native';

export function useCategoryController() {
  const [cats, setCats] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [sortField, setSortField] = useState("id");
  const [sortDirection, setSortDirection] = useState("desc");
  const [perPage, setPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
  });

  const { token } = useAuth();


  const loadPage = useCallback(async (pageNumber: number) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${apiUrl}/admin/cats/view?page=${pageNumber}&sort=${sortField}&direction=${sortDirection}&search=${encodeURIComponent(searchQuery)}&per_page=${perPage}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      const rawText = await response.text();
      const data = rawText ? JSON.parse(rawText) : null;

      if (Array.isArray(data?.data)) {
        setCats(data.data);
        setPagination({
          current_page: data.current_page,
          last_page: data.last_page,
        });
        setPage(pageNumber);
      }
    } catch (error) {
      console.error("❌ Page fetch error:", error);
    } finally {
      setLoading(false);
    }
  }, [sortField, sortDirection, token, searchQuery, perPage]);

  // }, [sortField, sortDirection, token, searchQuery, perPage, apiUrl]);

  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    setCats([]);
    setPage(1);
  };


  const handleDelete = async (id: number) => {
    const confirmDelete = async () => {
      try {
        const response = await fetch(`${apiUrl}/admin/cat/delete/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          console.log('✅ Deleted successfully');
          resetView(); // 🔁 Reload after delete
        } else {
          console.error('❌ Delete failed:', await response.text());
        }
      } catch (error) {
        console.error('🔥 Error deleting:', error);
      }
    };

    if (Platform.OS === 'web') {
      const confirmed = window.confirm('Are you sure you want to delete this item?');
      if (confirmed) await confirmDelete();
    } else {
      Alert.alert(
        'Confirm Delete',
        'Are you sure you want to delete this item?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Delete', style: 'destructive', onPress: confirmDelete },
        ]
      );
    }
  };




  const resetView = () => {
    setSearchQuery("");
    setSortField("id");
    setSortDirection("desc");
    setPerPage(10);
    setPage(1);
    setCats([]);
    loadPage(1);
  };

  useEffect(() => {
    loadPage(1);
  }, []);

  useEffect(() => {
    loadPage(1);
  }, [sortField, sortDirection, perPage, loadPage]);

  const chunkSize = 5;
  const chunkedPages: number[][] = [];
  for (let i = 0; i < pagination.last_page; i += chunkSize) {
    const chunk = Array.from(
      { length: Math.min(chunkSize, pagination.last_page - i) },
      (_, j) => i + j + 1
    );
    chunkedPages.push(chunk);
  }

  return {
    cats,
    page,
    loading,
    sortField,
    sortDirection,
    perPage,
    pagination,
    searchQuery,
     webUrl,
    chunkedPages,
    setSearchQuery,
    setPerPage,
    loadPage,
    handleSort,
    resetView,
    handleDelete
  };
}
