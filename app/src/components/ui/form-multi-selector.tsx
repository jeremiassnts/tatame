import { useState } from "react";
import { View } from "react-native";
import MultiSelect from "react-native-multiple-select";
import colors from "tailwindcss/colors";

export interface FormMultiSelectorItem {
  label: string;
  value: string;
}
interface FormMultiSelectorProps {
  items: FormMultiSelectorItem[];
  placeholder: string;
  onSelectedItemsChange: (items: FormMultiSelectorItem[]) => void;
}
export default function FormMultiSelector({
  items,
  placeholder,
  onSelectedItemsChange,
}: FormMultiSelectorProps) {
  const [selectedItems, setSelectedItems] = useState<FormMultiSelectorItem[]>(
    []
  );

  function handleSelectedItemsChange(items: FormMultiSelectorItem[]) {
    setSelectedItems(items);
    onSelectedItemsChange(items);
  }

  return (
    <MultiSelect
      hideTags
      items={items}
      uniqueKey="value"
      ref={(component) => {}}
      onSelectedItemsChange={handleSelectedItemsChange}
      selectedItems={selectedItems}
      selectText={placeholder}
      searchInputPlaceholderText={placeholder}
      altFontFamily="Sora-Regular"
      displayKey="label"
      submitButtonText="Confirmar"
      styleInputGroup={{
        backgroundColor: colors.neutral[800],
        borderRadius: 5,
        padding: 5,
      }}
      fontFamily="Sora-Regular"
      itemFontFamily="Sora-Regular"
      fontSize={16}
      selectedItemFontFamily="Sora-Regular"
      itemFontSize={16}
      styleItemsContainer={{
        backgroundColor: colors.neutral[800],
      }}
      textColor={colors.neutral[400]}
      selectedItemTextColor={colors.neutral[400]}
      itemTextColor={colors.neutral[400]}
      selectedItemIconColor={colors.neutral[400]}
      tagRemoveIconColor={colors.neutral[400]}
      submitButtonColor={colors.purple[500]}
      styleIndicator={{
        backgroundColor: colors.neutral[800],
      }}
      styleTextDropdownSelected={{
        backgroundColor: colors.neutral[800],
      }}
      styleTextDropdown={{
        color: colors.neutral[400],
      }}
      styleRowList={{
        backgroundColor: colors.neutral[800],
      }}
      styleDropdownMenu={{
        backgroundColor: colors.neutral[800],
        padding: 5,
        borderRadius: 5,
        height: 50,
        paddingLeft: 10,
        paddingRight: 10,
      }}
      styleDropdownMenuSubsection={{
        backgroundColor: colors.neutral[800],
      }}
    />
  );
}
