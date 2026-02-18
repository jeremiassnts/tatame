import { useStripeHook } from "@/src/api/stripe/use-stripe-hook";
import { useUsers } from "@/src/api/users/use-users";
import { queryClient } from "@/src/lib/react-query";
import { useState } from "react";
import { Button, ButtonSpinner, ButtonText } from "../ui/button";
import { Heading } from "../ui/heading";
import { CloseIcon, Icon } from "../ui/icon";
import {
    Modal,
    ModalBackdrop,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
} from "../ui/modal";
import { Text } from "../ui/text";
import { VStack } from "../ui/vstack";

interface CancelButtonProps {
    plan: string;
    subscriptionId: string;
    userId: number;
}
export function CancelButton({
    plan,
    subscriptionId,
    userId,
}: CancelButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const stripeApi = useStripeHook();
    const { update } = useUsers();
    const deleteSubscription = stripeApi.subscriptions.delete;

    async function handleDeleteSubscription() {
        await deleteSubscription.mutateAsync({
            subscriptionId,
        });
        await update.mutateAsync({
            id: userId,
            subscription_id: null,
            customer_id: null,
            plan: "free",
        });
        queryClient.invalidateQueries({
            queryKey: ["subscription-by-id"],
        });
        queryClient.invalidateQueries({
            queryKey: ["subscription-by-customer-id"],
        });
        queryClient.invalidateQueries({
            queryKey: ["user-profile"],
        });
        setIsOpen(false);
    }

    function handleClose() {
        setIsOpen(false);
    }

    return (
        <VStack className="w-full">
            <Button onPress={() => setIsOpen(true)} action="secondary">
                <ButtonText>Cancelar plano</ButtonText>
            </Button>
            <Modal size="lg" isOpen={isOpen} onClose={handleClose}>
                <ModalBackdrop />
                <ModalContent>
                    <ModalHeader className="mb-4">
                        <Heading size="lg">Cancelar plano {plan.toUpperCase()}</Heading>
                        <ModalCloseButton>
                            <Icon as={CloseIcon} />
                        </ModalCloseButton>
                    </ModalHeader>
                    <ModalBody>
                        <Text>
                            Você tem certeza que deseja cancelar o plano {plan.toUpperCase()}?
                        </Text>
                    </ModalBody>
                    <ModalFooter>
                        <Button action="secondary" onPress={handleClose}>
                            <ButtonText>Não</ButtonText>
                        </Button>
                        <Button
                            variant="solid"
                            size="md"
                            onPress={handleDeleteSubscription}
                            disabled={deleteSubscription.isPending}
                            className={`${deleteSubscription.isPending ? "opacity-50" : "opacity-100"}`}
                        >
                            {deleteSubscription.isPending ? (
                                <ButtonSpinner />
                            ) : (
                                <ButtonText>Sim, cancelar plano</ButtonText>
                            )}
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </VStack>
    );
}
