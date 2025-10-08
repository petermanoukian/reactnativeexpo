import Constants from "expo-constants";
import { Link } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { FlatList, Image, Linking, Pressable, Text, TextInput, View } from "react-native";
import { useAuth } from "../../../context/AuthContext";


export default function CatIndex() {
  const [cats, setCats] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();
  const WEB_URL = Constants.expoConfig?.extra?.LARAVEL_WEB_URL;
  const LARAVEL_API_URL = Constants.expoConfig?.extra?.LARAVEL_API_URL;
  const [sortField, setSortField] = useState("id");
  const [sortDirection, setSortDirection] = useState("desc");
  const [perPage, setPerPage] = useState(10);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const chunkedPages = [];
  const chunkSize = 5;

  for (let i = 0; i < pagination.last_page; i += chunkSize) {
    const chunk = Array.from({ length: Math.min(chunkSize, pagination.last_page - i) }, (_, j) => i + j + 1);
    chunkedPages.push(chunk);
  }

  const loadPage = useCallback(async (pageNumber: number) => 
  {
    setLoading(true);
    try 
    {
const response = await fetch(`${LARAVEL_API_URL}/admin/cats/view?page=${pageNumber}&sort=${sortField}&direction=${sortDirection}&search=${encodeURIComponent(searchQuery)}&per_page=${perPage}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          });

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
      } 
      catch (error) 
      {
          console.error("❌ Page fetch error:", error);
      } 
      finally {
        setLoading(false);
      }
  }, [sortField, sortDirection, token, , searchQuery, perPage, LARAVEL_API_URL]);

  useEffect(() => {

  }, [page]);

  useEffect(() => 
  {
    loadPage(1);
  }, []);

  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection(prev => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    setCats([]);
    setPage(1); // reset pagination
  };


  useEffect(() => {
    loadPage(1);
  }, [sortField, sortDirection, perPage, loadPage]);

  const resetView = () => {
    setSearchQuery("");
    setSortField("id");
    setSortDirection("desc");
    setPerPage(10);
    setPage(1);
    setCats([]);
    loadPage(1);
  };




  return (
    <View className="flex-1 bg-yellow-50">
      <View className="flex-row justify-between mb-4 px-4 pt-4">
        <Text className="text-xl font-bold text-gray-800"> Categories</Text>
        <Pressable
          onPress={resetView}
          className="bg-gray-200 px-2 py-1 rounded-md"
        >
          <Text className="text-lg">🔄</Text>
        </Pressable>

        <Link href="/(admin)/cat/add" className="bg-blue-600 px-4 py-2 rounded-md">
          <Text className="text-white font-medium">➕ </Text>
        </Link>
      </View>

      {loading && (
        <Text className="text-center text-gray-500 mb-2">⏳ Loading categories...</Text>
      )}

      {!loading && cats.length === 0 ? (
        <Text className="text-center text-gray-500 mt-4">No categories found.</Text>
      ) : (




        <View className="flex-1 pb-[40px]">


          <View className="px-4 pt-2">
            <View className="bg-white rounded-md border border-gray-300 px-3 py-1">
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="🔍 Search categories..."
                className="text-base text-gray-800 py-1"
                returnKeyType="search"
                onSubmitEditing={() => loadPage(1)}
              />
            </View>
          </View>

          <View className="px-4 pt-2">
            <View className="flex-row items-center space-x-2">
         
              {[5, 10, 20 , 50, 100].map((n) => (
                <Pressable
                  key={`per-${n}`}
                  onPress={() => setPerPage(n)}
                  className={`px-5 mr-2 py-1 rounded-md ${perPage === n ? 'bg-blue-600' : 'bg-gray-300'}`}
                >
                  <Text className="text-white text-sm font-medium">{n}</Text>
                </Pressable>
              ))}
            </View>
          </View>


          <View className="px-4 py-2 bg-gray-100 border-b border-gray-300">
            <View className="flex-row items-center">
             <Pressable
                onPress={() => handleSort("id")}
                className="w-[50px] h-[36px] justify-center items-center rounded-md bg-gray-200 mr-2"
              >
                <Text className="text-sm font-bold text-gray-800">
                  ID {sortField === "id" ? (sortDirection === "asc" ? "↑" : "↓") : "↑↓"}
                </Text>
              </Pressable>

              <Pressable
                onPress={() => handleSort("name")}
                className="flex-1 w-[70px] h-[36px] justify-center items-center rounded-md bg-gray-200 mr-1"
              >
                <Text className="text-sm font-bold text-gray-800">
                  Title {sortField === "name" ? (sortDirection === "asc" ? "↑" : "↓") : "↑↓"}
                </Text>
              </Pressable>


              <View className="w-[120px] h-[36px] justify-center">
                <Text className="text-sm font-bold text-gray-600">Image / File</Text>
              </View>
              <View className="w-[100px] h-[36px] justify-center items-center">
                <Text className="text-sm font-bold text-gray-600">Actions</Text>
              </View>
            </View>
          </View>

          <FlatList
            contentContainerStyle={{ paddingHorizontal: 4, paddingBottom: 72, marginBottom: 120 }}
            data={cats}
            keyExtractor={(item) => `${item.idx}`}
            renderItem={({ item }) => (
              <View className="flex-row items-center bg-white rounded-md px-4 py-3 mb-2 border border-gray-300">
                <View className="w-[40px] items-center">
                  <Text className="font-bold text-gray-800 text-xs">#{item.idx}</Text>
                </View>
                <View className="flex-1 pr-2">
                  <Text className="text-gray-700 font-medium text-sm">{item.name}</Text>
                </View>
                <View className="w-[120px]">
                  <View className="flex-row items-center space-x-2 mb-1">
                    {item.img2 && (
                      <Image
                        source={{ uri: `${WEB_URL}${item.img2}` }}
                        style={{ width: 60, height: 40, borderRadius: 4 }}
                      />
                    )}
                  </View>
                  {item.filer && (
                    <Pressable onPress={() => Linking.openURL(`${WEB_URL}${item.filer}`)}>
                      <Text style={{ fontSize: 21 }} className="text-blue-600 underline">🗂️</Text>
                    </Pressable>
                  )}
                </View>
                <View className="w-[140px] flex-col space-y-2">
                  {/* Category Actions */}
                  <View className="flex-row">
                    <Link href={`/admin/cat/edit/${item.idx}`} className="bg-yellow-500 px-4 py-2 rounded-md flex-1 mr-2">
                      <Text className="text-white text-sm text-center">✏️</Text>
                    </Link>
                    <Link href={`/admin/cat/delete/${item.idx}`} className="bg-red-600 px-4 py-2 rounded-md flex-1">
                      <Text className="text-white text-sm text-center">🗑️</Text>
                    </Link>
                  </View>

                  {/* Subcategory Actions */}
                  <View className="flex-row mt-3">
                    <Link href={`/admin/subcat/add/${item.idx}`} className="bg-green-700 px-4 py-2 rounded-md flex-1 mr-2">
                      <Text className="text-white text-sm text-center">➕</Text>
                    </Link>
                    <Link href={`/admin/subcat/view/${item.idx}`} className="bg-green-500 px-4 py-2 rounded-md flex-1">
                      <Text className="text-white text-sm text-center">👁️</Text>
                    </Link>
                  </View>

                  {/* Product Actions */}
                  <View className="flex-row mt-3">
                    <Link href={`/admin/product/add/${item.idx}`} className="bg-purple-700 px-4 py-2 rounded-md flex-1 mr-2">
                      <Text className="text-white text-sm text-center">➕</Text>
                    </Link>
                    <Link href={`/admin/product/view/${item.idx}`} className="bg-purple-500 px-4 py-2 rounded-md flex-1">
                      <Text className="text-white text-sm text-center">👁️</Text>
                    </Link>
                  </View>
                </View>


              </View>
            )}
          />

        {pagination.last_page > 1 && (
          <View className="mt-4 mb-12">
            {chunkedPages.map((row, rowIndex) => (
              <View key={`row-${rowIndex}`} className="flex-row justify-center space-x-2 mb-2 ">
                {row.map((pageNum) => (
                  <Pressable
                    key={`page-${pageNum}`}
                    onPress={() => loadPage(pageNum)}
                    className={`px-6 mr-2 py-2 rounded-md ${pagination.current_page === pageNum ? 'bg-blue-600' : 'bg-gray-300'}`}
                  >
                    <Text className="text-white text-sm font-medium">{pageNum}</Text>
                  </Pressable>
                ))}
              </View>
            ))}
          </View>
        )}

        </View>
      )}
    </View>
  );
}
