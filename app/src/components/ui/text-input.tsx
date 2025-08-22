import {
  Text,
  TextInput as RNTextInput,
  View,
  type TextInputProps as RNTextInputProps,
} from "react-native";
import { Input } from "./input";
import { Label } from "./label";
import { UseFormRegisterReturn } from "react-hook-form";
import ErrorLabel from "./error-label";
import { RefAttributes } from "react";

interface TextInputProps {
  label?: string;
  name: string;
  error?: string;
  viewClassName?: string | undefined;
  register?: UseFormRegisterReturn<any>;
}

export default function TextInput(
  props: TextInputProps & RNTextInputProps & RefAttributes<RNTextInput>
) {
  const { label, name, error, viewClassName } = props;
  if (!props.register) props.register = {} as UseFormRegisterReturn<any>;
  return (
    <View className={viewClassName}>
      {label && (
        <Label
          className="font-sora-bold text-[14px] text-white"
          nativeID={name}
        >
          {label}
        </Label>
      )}
      <Input
        {...props}
        {...props.register}
        className="font-sora text-[14px] bg-neutral-800 text-neutral-400"
        aria-labelledby={name}
      />
      <ErrorLabel error={error} />
    </View>
  );
}
