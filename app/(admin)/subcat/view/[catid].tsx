import SubcategoryRow from "@/components/admin/subcat/SubcategoryRow";
import SubcatHeader from "@/components/admin/subcat/SubcatHeader";
import SubcatSearch from "@/components/admin/subcat/SubcatSearch";
import SubcatTableHeader from "@/components/admin/subcat/TableHeader";
import { useSubcategoryController } from "@/hooks/admin/subcat/useSubcategoryController";
import { useLocalSearchParams } from "expo-router";
import { FlatList, Text, View } from "react-native";

export default function SubcatViewIndex() {

  const params = useLocalSearchParams();
const initialCatid = params.catid ? Number(params.catid) : null;

  const {
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
    loadMore,
    hasMore,
  } = useSubcategoryController(initialCatid);

  return (
    <View  className="flex-1 bg-yellow-50 ">
      {/* ✅ Static header and search UI — not scrollable */}
      <View className="space-y-4 px-4 pt-4" style={{ zIndex: 1000 }}>
        <SubcatHeader onReload={resetView} addHref="/subcat/add" />
        <SubcatSearch
          value={searchQuery}
          onChange={setSearchQuery}
          onSubmit={resetView}
          cats={cats}
          catid={filterCatid}
          setCatid={setFilterCatid}
        />
        <SubcatTableHeader
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={handleSort}
        />
      </View>

      {/* ✅ Scrollable table rows only */}
      <View style={{ flex: 1, zIndex: 0 , marginBottom:50}}>
        <FlatList
          className="bg-yellow-50"
          contentContainerStyle={{ paddingBottom: 40 }}
          data={subcats}
          keyExtractor={(item) => item.idx.toString()}
          renderItem={({ item }) => (
            <SubcategoryRow item={item} handleDelete={handleDelete} />
          )}
          onEndReached={() => {
            if (hasMore && !loading) loadMore();
          }}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            <View>
              {loading && (
                <Text className="text-center py-4 text-gray-500">Loading more...</Text>
              )}
              {/* ✅ Spacer below FlatList */}
              <View style={{ height: 48 }} />
            </View>
          }
        />
      </View>
    </View>
  );
}
