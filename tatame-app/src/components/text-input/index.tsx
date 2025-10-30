import React from "react";
import {
  TextInput as RNTextInput,
  type TextInputProps as RNTextInputProps,
} from "react-native";
import { Input, InputField } from "../ui/input";
import { Text } from "../ui/text";
import { VStack } from "../ui/vstack";

type TextInputProps = RNTextInputProps & {
  label?: string;
  isPassword?: boolean;
  error?: string;
};

const TextInput = React.forwardRef<
  React.ElementRef<typeof RNTextInput>,
  TextInputProps
>(({ label, isPassword, error, ...props }, ref) => {
  return (
    <VStack>
      {label && (
        <Text className="text-white font-bold mb-2 text-md">{label}</Text>
      )}
      <Input className="bg-neutral-800 border-0 h-[45px]">
        <InputField type={isPassword ? "password" : "text"} {...props} />
      </Input>
      {error && <Text className="text-red-500 text-sm">{error}</Text>}
    </VStack>
  );
});

TextInput.displayName = "TextInput";

export { TextInput };
