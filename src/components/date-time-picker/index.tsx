import RNDateTimePicker from "@react-native-community/datetimepicker";
import { formatDate } from "date-fns";
import React, { useState } from "react";
import { Pressable } from "react-native";
import { Text } from "../ui/text";

interface DateTimePickerProps {
  setNewDate: (date: Date | undefined) => void;
  placeholder: string;
  error?: string;
  mode?: "date" | "time";
  className?: string;
  value?: Date;
  label?: string;
}

export default function DateTimePicker({
  setNewDate,
  placeholder,
  error,
  mode = "date",
  className,
  value,
  label,
}: DateTimePickerProps) {
  const [date, setDate] = useState<Date | null>(value || null);
  const [show, setShow] = useState(false);

  return (
    <Pressable onPress={() => setShow(true)} className={className}>
      {label && (
        <Text className="text-white font-bold mb-2 text-md">{label}</Text>
      )}
      <Text
        className={`w-full bg-neutral-800 p-3 pl-4 pr-4 rounded-md text-md`}
      >
        {date
          ? mode === "date"
            ? formatDate(date, "dd/MM/yyyy")
            : formatDate(date, "HH:mm")
          : placeholder}
      </Text>
      {React.useMemo(() => {
        return (
          show && (
            <RNDateTimePicker
              display={mode === "time" ? "spinner" : "default"}
              maximumDate={new Date()}
              minimumDate={new Date(1950, 0, 1)}
              timeZoneName={"America/Sao_Paulo"}
              locale="pt-BR"
              is24Hour={true}
              value={date || new Date()}
              mode={mode}
              onChange={(_, refDate) => {
                if (refDate) {
                  setDate(refDate);
                  setNewDate(refDate);
                  setShow(false);
                }
              }}
            />
          )
        );
      }, [show])}
      {error && <Text className="text-red-500 text-sm">{error}</Text>}
    </Pressable>
  );
}
