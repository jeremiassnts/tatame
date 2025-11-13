import {
  Select,
  SelectTrigger,
  SelectInput as UISelectInput,
  SelectIcon,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectItem,
} from "@/src/components/ui/select";
import { ChevronDownIcon } from "@/src/components/ui/icon";
import { VStack } from "../ui/vstack";
import { Text } from "../ui/text";

type SelectInputProps = {
  placeholder?: string;
  options: { label: string; value: string }[];
  error?: string;
  onValueChange?: (value: string) => void;
  selectedValue?: string;
  disabled?: boolean;
};

export function SelectInput({
  placeholder,
  options,
  error,
  onValueChange,
  selectedValue,
  disabled,
}: SelectInputProps) {
  return (
    <VStack>
      <Select
        className="bg-neutral-800 rounded-md"
        onValueChange={onValueChange}
        selectedValue={selectedValue}
      >
        <SelectTrigger
          variant="outline"
          size="md"
          className="border-0 h-[40px] justify-between"
          disabled={disabled}
        >
          <UISelectInput placeholder={placeholder} />
          <SelectIcon className="mr-3" as={ChevronDownIcon} />
        </SelectTrigger>
        <SelectPortal>
          <SelectBackdrop />
          <SelectContent>
            <SelectDragIndicatorWrapper>
              <SelectDragIndicator />
            </SelectDragIndicatorWrapper>
            {options.map((option) => (
              <SelectItem
                key={option.value}
                label={option.label}
                value={option.value}
              />
            ))}
          </SelectContent>
        </SelectPortal>
      </Select>
      {error && <Text className="text-red-500 text-sm">{error}</Text>}
    </VStack>
  );
}
