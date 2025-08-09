import { Input } from "./ui/input";

interface PostalCodeProps {
  onChange: (value: string) => void;
  placeholder: string;
  name: string;
}

export default function PostalCode({
  onChange,
  placeholder,
  name,
}: PostalCodeProps) {
  function onPostalCodeChange(text: string) {
    const onlyNumbers = text.replace(/\D/g, "");
    if (onlyNumbers.length != 8) {
      return;
    }
    onChange(text);
  }
  return (
    <Input
      className={`font-sora text-[14px] bg-neutral-800 mt-1`}
      aria-labelledby={name}
      onChangeText={onPostalCodeChange}
      placeholder={placeholder}
      keyboardType="numeric"
    />
  );
}
