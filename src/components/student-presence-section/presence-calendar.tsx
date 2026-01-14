import { Days } from "@/src/constants/date";
import { addDays, endOfMonth, format, startOfMonth } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useEffect, useState } from "react";
import { StudentPresenceSectionData } from ".";
import { Button, ButtonText } from "../ui/button";
import { Grid, GridItem } from "../ui/grid";
import { Heading } from "../ui/heading";
import { HStack } from "../ui/hstack";
import { Modal, ModalBackdrop, ModalBody, ModalContent, ModalHeader } from "../ui/modal";
import { Text } from "../ui/text";
import { VStack } from "../ui/vstack";

export function PresenceCalendar() {
    const [isOpen, setIsOpen] = useState(false)
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1)
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
    const [days, setDays] = useState<StudentPresenceSectionData[]>([])

    function formatDate(date: Date) {
        return format(date, "MMMM", {
            locale: ptBR
        })
    }
    const [label, setLabel] = useState(formatDate(new Date(currentYear, currentMonth - 1)))

    function handleOpenCalendar() {
        setCurrentMonth(new Date().getMonth() + 1)
        setCurrentYear(new Date().getFullYear())
        setLabel(formatDate(new Date(currentYear, currentMonth - 1)))
        setIsOpen(true)
    }

    function handleCloseCalendar() {
        setIsOpen(false)
    }

    useEffect(() => {
        const start = startOfMonth(new Date(currentYear, currentMonth - 1))
        const end = endOfMonth(start)

        const tempDays: StudentPresenceSectionData[] = []
        for (let current = start; current <= end; current = addDays(current, 1)) {
            tempDays.push({
                date: current.getDate(),
                weekDay: format(current, "EEEE", { locale: ptBR }).toUpperCase(),
                isPresent: false,
                duration: 0
            })
        }

        setDays(tempDays)
    }, [currentMonth, currentYear])

    return (
        <VStack>
            <Button variant="link" size="sm" onPress={handleOpenCalendar}>
                <ButtonText>Ver mais</ButtonText>
            </Button>
            <Modal isOpen={isOpen} onClose={handleCloseCalendar} size="full">
                <ModalBackdrop />
                <ModalContent>
                    <ModalHeader>
                        <Heading size="lg">Frequência</Heading>
                    </ModalHeader>
                    <ModalBody className="pr-4">
                        <HStack className="justify-start items-center gap-2 py-4">
                            <Text className="capitalize text-lg">{label}</Text>
                            <Text className="font-bold text-lg">{currentYear}</Text>
                        </HStack>
                        <Grid className="gap-4" _extra={{ className: 'grid-cols-7' }}>
                            {Days.map(day => (
                                <GridItem key={day.value} _extra={{ className: 'col-span-1' }}>
                                    <Text className="font-bold text-md" >{day.label.slice(0, 3)}</Text>
                                </GridItem>
                            ))}
                            {days.map(day => (
                                <GridItem key={day.date} _extra={{ className: 'col-span-1 bg-neutral-600' }}>
                                    <Text className="font-bold text-md" >{day.date}</Text>
                                </GridItem>
                            ))}
                        </Grid>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </VStack>
    )
}