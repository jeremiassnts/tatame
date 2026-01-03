import { Card } from "../ui/card";
import { Heading } from "../ui/heading";
import { HStack } from "../ui/hstack";
import { VStack } from "../ui/vstack";
import { DeleteDialog } from "./delete-dialog";
import { SignOutDialog } from "./sign-out-dialog";

export function AccountSection() {
    return (
        <Card className="w-full border-2 border-neutral-800 mt-4 bg-neutral-900">
            <HStack className="justify-between items-center mb-4">
                <Heading size="xs" className="text-neutral-400">Conta</Heading>
            </HStack>
            <VStack className="gap-2">
                <SignOutDialog />
                <DeleteDialog />
            </VStack>
        </Card>
    )
}