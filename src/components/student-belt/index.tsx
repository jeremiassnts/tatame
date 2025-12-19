import { BELT_COLORS } from "@/src/constants/belts";
import { Box } from "../ui/box";
import { HStack } from "../ui/hstack";
import { VStack } from "../ui/vstack";

interface StudentBeltProps {
    belt: string;
    degree: number;
}

export function StudentBelt({ belt, degree }: StudentBeltProps) {
    // @ts-ignore
    const beltColor = belt ? BELT_COLORS[belt] : "#FFFFFF";
    return (
        <VStack>
            <HStack className="w-[200px] h-[20px] border-[1px] border-neutral-800 rounded-sm mt-2">
                <Box className="flex-1" style={{ backgroundColor: beltColor }} />
                <HStack
                    className={`w-[25%] justify-evenly ${belt === "black" ? "bg-red-800" : "bg-neutral-900"
                        }`}
                >
                    {Array.from({ length: degree ?? 0 }).map((_, index) => (
                        <Box key={index} className="w-[4px] h-full bg-white" />
                    ))}
                </HStack>
                <Box className="w-[5%]" style={{ backgroundColor: beltColor }} />
            </HStack>
        </VStack>
    )
}