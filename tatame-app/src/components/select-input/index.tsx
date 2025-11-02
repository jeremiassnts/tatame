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

type SelectInputProps = {
  placeholder?: string;
  options: { label: string; value: string }[];
};

export function SelectInput({ placeholder, options }: SelectInputProps) {
  return (
    <Select className="bg-neutral-800 rounded-md">
      <SelectTrigger variant="outline" size="md" className="border-0 h-[40px]">
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
  );
}
