import { useAuth } from "@/context/AuthContext";
import { laraapi } from "@/src/libs/axios";
import { useCallback, useEffect, useState } from "react";

export function useProdController(initialCatid?: number | null, initialSubcatid?: number | null) {
  const { token } = useAuth();




  const [cats, setCats] = useState<{ id: number; name: string }[]>([]);
  const [subcats, setSubcats] = useState<{ id: number; name: string }[]>([]);

  const [catid, setCatid] = useState<number | null>(initialCatid ?? null);
  const [subcatid, setSubcatid] = useState<number | null>(initialSubcatid ?? null);

  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("id");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const [items, setItems] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

      const { cats, subcats } = response.data;
      setCats(cats);
      setSubcats(subcats);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
      setError("⚠️ Unable to load categories");
    }
  }, [initialCatid, initialSubcatid, token]);

    const fetchSubcats = useCallback(async () => {
      try {
        const url = catid !== null
          ? `/admin/subcats/list/${catid}`
          : `/admin/subcats/list`; // returns all

        const response = await laraapi.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setSubcats(response.data.subcats || []);
      } catch (err) {
        console.error("Failed to fetch subcategories:", err);
        setSubcats([]);
      }
    }, [catid, token]);






    const fetchProducts = useCallback(
      async ({
        mode = "reset",
        page = 1,
        search = "",
        catid = null,
        subcatid = null,
        sortField = "id",
        sortDirection = "desc",
      }: {
        mode?: "reset" | "append";
        page?: number;
        search?: string;
        catid?: number | null;
        subcatid?: number | null;
        sortField?: string;
        sortDirection?: "asc" | "desc";
      }) => {
        if (loading || (mode === "append" && !hasMore)) return;

        setLoading(true);

        try {
          const response = await laraapi.get("/admin/prods/view", {
            params: {
              page,
              limit: 10,
              search,
              catid,
              subcatid,
              sort: sortField,
              direction: sortDirection,
            },
            headers: { Authorization: `Bearer ${token}` },
          });

          const { prods = [] } = response.data;

          if (mode === "reset") {
            setItems(prods);
            setPage(2);
          } else {
            setItems((prev) => [...prev, ...prods]);
            setPage((prev) => prev + 1);
          }

          setHasMore(prods.length === 10);
        } catch (err) {
          console.error("Failed to fetch products:", err);
          setError("❌ Unable to load products");
        } finally {
          setLoading(false);
        }
      },
      [loading, hasMore, token]
    );

    const loadMore = useCallback(() => {
      fetchProducts({
        mode: "append",
        page,
        search,
        catid,
        subcatid,
        sortField,
        sortDirection,
      });
    }, [page, search, catid, subcatid, sortField, sortDirection, fetchProducts]);

    const resetView = useCallback(() => {
      setPage(1);
      setHasMore(true);
      setItems([]);

      fetchProducts({
        mode: "reset",
        page: 1,
        search,
        catid,
        subcatid,
        sortField,
        sortDirection,
      });
    }, [search, catid, subcatid, sortField, sortDirection, fetchProducts]);


    const fullReset = useCallback(() => {
      const defaultSortField = "id";
      const defaultSortDirection: "asc" | "desc" = "desc";

      setCatid(null);
      setSubcatid(null);
      setSearch("");
      setSortField(defaultSortField);
      setSortDirection(defaultSortDirection);
      setPage(1);
      setHasMore(true);
      setItems([]);

      fetchProducts({
        mode: "reset",
        page: 1,
        search: "",
        catid: null,
        subcatid: null,
        sortField: defaultSortField,
        sortDirection: defaultSortDirection,
      });
    }, [fetchProducts]);




    const handleDelete = async (id: number) => {
      try {
        await laraapi.delete(`/admin/prod/delete/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchProducts();
      } catch (err) {
        console.error("Delete failed:", err);
        Alert.alert("❌ Delete Error", "Failed to delete product");
      }
    };



    const handleSort = (field: string) => {
      if (sortField === field) {
        setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
      } else {
        setSortField(field);
        setSortDirection("desc");
      }

      // Delay resetView until state updates settle

    };






    const handleSearchSubmit = () => {
      setPage(1);
      resetView();
    };

    const handleReload = () => {
      fetchProducts();
    };

    useEffect(() => {
      fetchCatsAndSubcats();
    }, [fetchCatsAndSubcats]);

        useEffect(() => {
          fetchSubcats();
        }, [catid, fetchSubcats]);

        useEffect(() => {
          resetView();
        }, [catid, subcatid, search, sortField, sortDirection]);


        /*
        useEffect(() => {
          fetchProducts();
        }, [sortField, sortDirection, page, perPage, search, catid, subcatid, fetchProducts]);
        */


        return {
          cats,
          subcats,
          catid,
          setCatid,
          subcatid,
          setSubcatid,
          search,
          setSearch,
          sortField,
          sortDirection,
          handleSort,
          page,
          setPage,
          perPage,
          setPerPage,
          items,
          total,
          loading,
          error,
          handleDelete,
          handleSearchSubmit,
          handleReload,
          hasMore,
          loadMore,
          resetView,
          fullReset
        };
      }
