import CategoryRow from "@/components/admin/cat/CategoryRow";
import CatHeader from "@/components/admin/cat/CatHeader";
import CatSearch from "@/components/admin/cat/CatSearch";
import TableHeader from "@/components/admin/cat/TableHeader";
import Pagination from "@/components/admin/common/Pagination";
import PerPageSelector from "@/components/admin/common/PerPageSelector";
import { useCategoryController } from "@/hooks/admin/cat/useCategoryController";
import { FlatList, Text, View } from "react-native";

export default function CatIndex() {
const {
  cats,
  page,
  loading,
  sortField,
  sortDirection,
  perPage,
  pagination,
  searchQuery,
  WEB_URL,
  chunkedPages,
  setSearchQuery,
  setPerPage,
  loadPage,
  handleSort,
  resetView,
} = useCategoryController();

  return (
    <View className="flex-1 bg-yellow-50">
      <CatHeader
        onReload={resetView}
        addHref="/(admin)/cat/add"
      />

      {loading && (
        <Text className="text-center text-gray-500 mb-2">⏳ Loading categories...</Text>
      )}

      {!loading && cats.length === 0 ? (
        <Text className="text-center text-gray-500 mt-4">No categories found.</Text>
      ) : (


      <View className="flex-1 pb-[40px]">
        <CatSearch
          value={searchQuery}
          onChange={setSearchQuery}
          onSubmit={() => loadPage(1)}
        />

        <PerPageSelector
          value={perPage}
          options={[5,10,15,25,50,100]}
          onChange={(n) => setPerPage(n)}
        />


        <TableHeader
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={handleSort}
        />

        <FlatList
          contentContainerStyle={{ paddingHorizontal: 4, paddingBottom: 72, marginBottom: 120 }}
          data={cats}
          keyExtractor={(item) => `${item.idx}`}
          renderItem={({ item }) => (
            <CategoryRow item={item} webUrl={WEB_URL} />
          )}
        />

        <Pagination
          currentPage={pagination.current_page}
          lastPage={pagination.last_page}
          chunkSize={5}
          onPageChange={(pageNum) => loadPage(pageNum)}
        />

      </View>
      )}
  </View>
  );
}
