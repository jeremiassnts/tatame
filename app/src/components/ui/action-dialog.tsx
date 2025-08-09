import { Text } from "react-native";
import { Button } from "./button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./dialog";

interface ActionDialogProps {
  title: string;
  description: string;
  onConfirm: () => void;
}

export default function ActionDialog({
  title,
  description,
  onConfirm,
}: ActionDialogProps) {
  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <DialogClose asChild>
          <Button onPress={onConfirm}>
            <Text className="text-neutral-950 text-[14px] font-sora">
              Confirmar
            </Text>
          </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  );
}
