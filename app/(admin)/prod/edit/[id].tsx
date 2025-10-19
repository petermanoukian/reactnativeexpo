import CategoryPicker from "@/components/admin/common/CategoryPicker";
import SubcategoryPicker from "@/components/admin/common/SubcategoryPicker";
import { useEditProductController } from "@/hooks/admin/prod/useEditProductController";
import { useLocalSearchParams } from "expo-router";
import { Image, KeyboardAvoidingView, Linking, Platform, Pressable, ScrollView, Text, TextInput, View } from "react-native";

export default function EditProductScreen() {
  const { id } = useLocalSearchParams();
  const idx = id ? Number(id) : 0;

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
    existingLargeImagePath,
    existingThumbImagePath,
    existingFileName,
    webUrl,
  } = useEditProductController(idx);

  return (
    <View className="flex-1 bg-white px-4 py-2">


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

              {existingThumbImagePath && !image && (
                <Pressable onPress={() => Linking.openURL(`${webUrl}${existingLargeImagePath}`)}>
                  <Image
                    source={{ uri: `${webUrl}${existingThumbImagePath}` }}
                    style={{ width: 100, height: 50, borderRadius: 6, marginBottom: 8 }}
                  />
                </Pressable>
              )}

              <Pressable onPress={pickFile} className="bg-green-500 px-4 py-2 rounded-md mb-2">
                <Text className="text-white text-center font-medium">
                  {file ? "✅ File Selected" : "📄 Pick File"}
                </Text>
              </Pressable>

              {existingFileName && !file && (
                <Pressable onPress={() => Linking.openURL(`${webUrl}${existingFileName}`)}>
                  <Text style={{ fontSize: 30 }} className="text-blue-600 underline text-center mb-3">🗂️</Text>
                </Pressable>
              )}
              <Pressable
                onPress={handleSubmit}
                disabled={loading || !isNameValid || !isCoderValid}
                className={`px-4 py-2 rounded-md ${loading || !isNameValid || !isCoderValid ? "bg-gray-400" : "bg-black"}`}
              >
                <Text className="text-white text-center font-medium">
                  {loading ? "Updating..." : "💾 Save Changes"}
                </Text>
              </Pressable>

              <View
                style={{
                  height: 15,
                  // or use tailwind: bg-gray-300
                  marginTop: 12,
                  marginBottom: 26,
                }}
              />
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>


    </View>
  );
}
