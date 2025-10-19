import { useEffect, useState } from "react";
import { Dimensions, View } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";

type Props = {
  subcats: { id: number; name: string }[];
  subcatid: number | null;
  setSubcatid: (id: number | null) => void;
  disabled?: boolean;
};

export default function SubcategoryPicker({
  subcats,
  subcatid,
  setSubcatid,
  disabled = false,
}: Props) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<{ label: string; value: number }[]>([]);
  const [value, setValue] = useState<number | null>(subcatid);

  useEffect(() => {
    setItems([
      { label: "All subcategories", value: -1 },
      ...subcats.map((subcat) => ({ label: subcat.name, value: subcat.id })),
    ]);
  }, [subcats]);

  useEffect(() => {
    const mapped = subcatid === null ? -1 : subcatid;
    if (value !== mapped) {
      setValue(mapped);
    }
  }, [subcatid]);

  useEffect(() => {
    if (value === -1) {
      setSubcatid(null);
    } else if (value !== null) {
      setSubcatid(value);
    }
  }, [value, setSubcatid]);

  const screenHeight = Dimensions.get("window").height;

  return (
    <View
      style={{
        position: "relative",
        zIndex: 1999,
        elevation: 1999,
        maxHeight: 60,
        marginBottom: 14,
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        searchable={true}
        placeholder="🔍 Search subcategory"
        disabled={disabled}
        style={{
          marginBottom: 20,
          marginTop: 15,
          zIndex: 1999,
          elevation: 1999,
        }}
        listItemContainerStyle={{
          paddingVertical: 0,
          minHeight: 26,
          alignItems: "center",
        }}
        listItemLabelStyle={{
          fontSize: 18,
          lineHeight: 22,
          paddingVertical: 0,
          marginVertical: 0,
        }}
        tickIconStyle={{ width: 14, height: 14 }}
        listMode="MODAL"
        modalTitle="Select Subcategory"
        modalAnimationType="fade"
        modalProps={{
          presentationStyle: "overFullScreen",
          transparent: true,
        }}
        modalContentContainerStyle={{
          position: "absolute",
          top: 150,
          backgroundColor: "#fff",
          borderRadius: 12,
          maxHeight: screenHeight * 0.5,
          width: "90%",
          alignSelf: "center",
          paddingVertical: 10,
          paddingHorizontal: 10,
        }}
        scrollViewProps={{
          showsVerticalScrollIndicator: true,
        }}
      />
    </View>
  );
}
