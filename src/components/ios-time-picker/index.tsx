import RNDateTimePicker from "@react-native-community/datetimepicker";
import { formatDate } from "date-fns";
import React, { useState } from "react";
import { Pressable } from "react-native";
import { Button, ButtonText } from "../ui/button";
import { Heading } from "../ui/heading";
import { HStack } from "../ui/hstack";
import { CloseIcon, Icon } from "../ui/icon";
import { Modal, ModalBackdrop, ModalBody, ModalCloseButton, ModalContent, ModalHeader } from "../ui/modal";
import { Text } from "../ui/text";
import { VStack } from "../ui/vstack";

interface IosTimePickerProps {
    setNewDate: (date: Date | undefined) => void;
    placeholder: string;
    error?: string;
    value?: Date;
    label?: string;
    className?: string;
}

export default function IosTimePicker({
    setNewDate,
    placeholder,
    error,
    value,
    label,
    className,
}: IosTimePickerProps) {
    const [date, setDate] = useState<Date | null>(value || null);
    const [isOpen, setIsOpen] = useState(false);

    return (
        <VStack className={className}>
            {label && <Text className="text-white font-bold mb-2 text-md">{label}</Text>}
            <Pressable onPress={() => setIsOpen(true)}>
                <Text
                    className={`w-full bg-neutral-800 p-3 pl-4 pr-4 rounded-md text-md`}
                >
                    {date
                        ? formatDate(date, "HH:mm")
                        : placeholder}
                </Text>
            </Pressable>
            {error && <Text className="text-red-500 text-sm">{error}</Text>}
            <Modal size="lg" isOpen={isOpen}
                onClose={() => {
                    setIsOpen(false);
                }}>
                <ModalBackdrop />
                <ModalContent>
                    <ModalHeader className="mb-4">
                        <Heading size="lg">{placeholder}</Heading>
                        <ModalCloseButton>
                            <Icon as={CloseIcon} />
                        </ModalCloseButton>
                    </ModalHeader>
                    <ModalBody>
                        <RNDateTimePicker
                            display="spinner"
                            timeZoneName={"America/Sao_Paulo"}
                            is24Hour={true}
                            value={date || new Date()}
                            mode="time"
                            onChange={(_, refDate) => {
                                if (refDate) {
                                    setDate(refDate);
                                }
                            }}
                        />
                        <HStack className="gap-2 justify-center items-center">
                            <Button action="secondary" className="rounded-md" onPress={() => {
                                setIsOpen(false)
                                setDate(value || null)
                                setNewDate(value)
                            }}>
                                <ButtonText className="text-white">Cancelar</ButtonText>
                            </Button>
                            <Button className="bg-violet-800 rounded-md" onPress={() => {
                                if (date) {
                                    setNewDate(date)
                                    setDate(date)
                                }
                                setIsOpen(false)
                            }}>
                                <ButtonText className="text-white">Ok</ButtonText>
                            </Button>
                        </HStack>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </VStack>
    );
}
