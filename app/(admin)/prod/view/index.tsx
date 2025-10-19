import ProdHeader from "@/components/admin/prod/ProdHeader";
import ProdRow from "@/components/admin/prod/ProdRow";
import ProdSearch from "@/components/admin/prod/ProdSearch";
import ProdTableHeader from "@/components/admin/prod/TableHeader";
import { useProdController } from "@/hooks/admin/prod/useProdController";
import { useLocalSearchParams } from "expo-router";
import { FlatList, Text, View } from "react-native";

export default function ViewProductScreen() {
  const { categoryId, subcategoryId } = useLocalSearchParams();

  const initialCatid = categoryId ? Number(categoryId) : null;
  const initialSubcatid = subcategoryId ? Number(subcategoryId) : null;

  const {
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
    items,
    loading,
 
    hasMore,
    loadMore,
    handleDelete,
    handleSearchSubmit,

    fullReset
  } = useProdController(initialCatid, initialSubcatid);

  return (
    <View className="flex-1 bg-white">
      <ProdHeader title="Products"  onReload={fullReset} addHref="/(admin)/prod/add" />

      <ProdSearch
        value={search}
        onChange={setSearch}
        onSubmit={handleSearchSubmit}
        cats={cats}
        catid={catid}
        setCatid={setCatid}
        subcats={subcats}
        subcatid={subcatid}
        setSubcatid={setSubcatid}
      />

      <ProdTableHeader sortField={sortField} sortDirection={sortDirection} onSort={handleSort} />

      <View style={{ flex: 1, zIndex: 0, marginBottom: 50 }}>
          <FlatList
            className="bg-white"
            contentContainerStyle={{ paddingHorizontal: 12, paddingVertical: 6, paddingBottom: 40 }}
            data={items}
            keyExtractor={(item, index) => `${item.id}-${index}`}
            renderItem={({ item, index }) => (
              <ProdRow item={{ ...item, idx: index + 1 }} handleDelete={handleDelete} />
            )}
            onEndReached={() => {
              if (hasMore && !loading) loadMore();
            }}
            onEndReachedThreshold={0.5}
            ListEmptyComponent={
              !loading ? (
                <Text className="text-center py-8 text-gray-500">No products found.</Text>
              ) : null
            }
            ListFooterComponent={
              <View>
                {loading && (
                  <Text className="text-center py-4 text-gray-500">Loading more...</Text>
                )}
                <View style={{ height: 48 }} />
              </View>
            }
          />

      </View>

        <View style={{ height: 40 }} />

    </View>
  );
}

