import { Picker, PickerProps } from "@react-native-picker/picker";
import Icon from "@react-native-vector-icons/feather";
import { Text, View } from "react-native";

export interface FormSelectItem {
  label: string;
  value: string;
}
interface FormSelectProps {
  items: FormSelectItem[];
  label: string;
  placeholder: string;
  viewClassName?: string | undefined;
  enabled?: boolean
  loading?: boolean
}
export default function FormSelect(props: FormSelectProps & PickerProps) {
  const { items, placeholder, label, viewClassName, enabled = true, loading = false } = props;
  return (
    <View className={`bg-neutral-800 rounded-md ${viewClassName} relative`}>
      {loading && <Text className="text-neutral-400 text-[16px] pl-5 pr-5 pt-4 pb-4">Carregando...</Text>}
      {!loading && <Picker
        aria-labelledby={label}
        className="flex-1"
        style={{
          color: "rgb(163 163 163)",
        }}
        enabled={enabled}
        {...props}
      >
        <Picker.Item label={placeholder} value={null} />
        {items.map((item) => (
          <Picker.Item key={item.value} label={item.label} value={item.value} />
        ))}
      </Picker>}
    </View>
  );
}
