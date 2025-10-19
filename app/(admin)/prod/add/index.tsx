import CategoryPicker from "@/components/admin/common/CategoryPicker";
import SubcategoryPicker from "@/components/admin/common/SubcategoryPicker";

import { useAddProductController } from "@/hooks/admin/prod/useAddProductController";
import { Link, useLocalSearchParams } from "expo-router";
import { Eye } from "lucide-react-native";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from "react-native";


export default function AddProductScreen() {
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
} = useAddProductController(initialCatid, initialSubcatid);



  return (
    <View className="flex-1 bg-white px-4 py-2">

{!(catid && subcatid) && (
  <View className="mb-4">
    <Text className="text-xl font-bold text-gray-800 mb-4 text-center">
      ➕ Product
    </Text>

    <Link
      href="/(admin)/prod/view"
      className="bg-blue-600 px-4 py-2 rounded-md flex-row items-center justify-center"
    >
      <Eye color="white" size={18} style={{ marginRight: 6 }} />
      <Text className="text-white font-medium">View Products</Text>
    </Link>
  </View>
)}

     
  <KeyboardAvoidingView
    behavior={Platform.OS === "ios" ? "padding" : undefined}
    style={{ flex: 1 }}
  >
    <ScrollView
      contentContainerStyle={{ paddingHorizontal: 12, paddingVertical: 7 }}
      keyboardShouldPersistTaps="handled"
    >


      <CategoryPicker cats={cats} catid={catid} setCatid={setCatid} />

      <SubcategoryPicker
        subcats={subcats}
        subcatid={subcatid}
        setSubcatid={setSubcatid}
        disabled={!catid}
      />

      {error && <Text className="text-red-600 mt-2">{error}</Text>}

      {catid && subcatid && (
  <>
    <TextInput
      placeholder="Product Name"
      value={name}
      onChangeText={(text) => {
        setNameTouched(true);
        setName(text);
      }}
      className="border border-gray-400 rounded-md px-3 py-2 mt-2 mb-2 bg-white"
    />

    {nameTouched && nameError && (
      <Text className="text-red-600 mb-2">{nameError}</Text>
    )}


    <TextInput
        placeholder="Unique Code"
        value={coder}
        onChangeText={(text) => {
          setCoderTouched(true);
          setCoder(text);
        }}
        className="border border-gray-400 rounded-md px-3 py-2 mt-1 mb-1 bg-white"
      />

      {coderTouched && coderError && (
        <Text className="text-red-600 mb-2">{coderError}</Text>
      )}


      <TextInput
        placeholder="Short Description"
        value={desc}
        onChangeText={setDesc}
        multiline={true}
        numberOfLines={2}
        textAlignVertical="top"
        className="h-16 border border-gray-400 rounded-md px-3 py-2 mt-1 mb-2 bg-white"
      />

      <TextInput
        placeholder="Detailed Description"
        value={dess}
        onChangeText={setDess}
        multiline={true}
        numberOfLines={4}
        textAlignVertical="top"
        className="h-24 border border-gray-400 rounded-md px-3 py-2 mb-2 bg-white"
      />


    <View className="flex-row items-center justify-between mb-4">
      <Text className="font-medium">Visible?</Text>
      <View className="flex-row">
        <Pressable
          onPress={() => setVis("yes")}
          className={`px-4 py-2 rounded-l-md ${vis === "yes" ? "bg-green-600" : "bg-gray-300"}`}
        >
          <Text className="text-white font-medium">Yes</Text>
        </Pressable>
        <Pressable
          onPress={() => setVis("no")}
          className={`px-4 py-2 rounded-r-md ${vis === "no" ? "bg-red-600" : "bg-gray-300"}`}
        >
          <Text className="text-white font-medium">No</Text>
        </Pressable>
      </View>
    </View>

    <Pressable onPress={pickImage} className="bg-blue-500 px-4 py-2 rounded-md mb-3">
      <Text className="text-white text-center font-medium">
        {image ? "✅ Image Selected" : "📷 Pick Image"}
      </Text>
    </Pressable>

    <Pressable onPress={pickFile} className="bg-green-500 px-4 py-2 rounded-md mb-4">
      <Text className="text-white text-center font-medium">
        {file ? "✅ File Selected" : "📄 Pick File"}
      </Text>
    </Pressable>

    <Pressable
      onPress={handleSubmit}
      disabled={loading || !isNameValid || !isCoderValid}
      className={`px-4 py-2 rounded-md ${loading || !isNameValid  || !isCoderValid? "bg-gray-400" : "bg-black"}`}
    >
      <Text className="text-white text-center font-medium">
        {loading ? "Submitting..." : "🚀 Submit"}
      </Text>
    </Pressable>
  </>
)}


</ScrollView>
</KeyboardAvoidingView> 
</View>
  );
}
