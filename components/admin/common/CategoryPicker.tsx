import { useEffect, useState } from "react";
import { Dimensions, View } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";

type Props = {
  cats: { id: number; name: string }[];
  catid: number | null;
  setCatid: (id: number | null) => void;
};

export default function CategoryPicker({ cats, catid, setCatid }: Props) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<{ label: string; value: number }[]>([]);
  const [value, setValue] = useState<number | null>(catid);

  useEffect(() => {
    setItems([
      { label: "All categories", value: -1 },
      ...cats.map((cat) => ({ label: cat.name, value: cat.id })),
    ]);
  }, [cats]);

useEffect(() => {
  const mapped = catid === null ? -1 : catid;
  if (value !== mapped) {
    setValue(mapped);
  }
}, [catid]);


  useEffect(() => {
    if (value === -1) {
      setCatid(null);
    } else if (value !== null) {
      setCatid(value);
    }
  }, [value, setCatid]);

  const screenHeight = Dimensions.get("window").height;

  return (
<View
  style={{
    position: "relative", // ✅ anchor point
    zIndex: 2000,
    elevation: 2000,
    maxHeight: 60,
    marginBottom: 14,
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
        placeholder="🔍 Search category"
        style={{
          marginBottom: 20,
          marginTop: 15,
          zIndex: 2000,
          elevation: 2000,
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
        modalTitle="Select Category"
        modalAnimationType="fade"
        modalProps={{
          presentationStyle: "overFullScreen",
          transparent: true,
        }}
        modalContentContainerStyle={{
          position: "absolute", // ✅ detach from screen top
          top: 150,               // ✅ push below dropdown trigger
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
