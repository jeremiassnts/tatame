import { Text } from "react-native";
import ActionDialog from "./ui/action-dialog";
import { Button } from "./ui/button";
import { Dialog, DialogTrigger } from "./ui/dialog";
import { CardAction } from "./card-action";

interface DialogCardActionProps {
  title: string;
  description: string;
  onConfirm: () => void;
  icon: "trash" | "edit" | "x";
  right: number;
  className?: string;
}

export function DialogCardAction({
  title,
  description,
  onConfirm,
  icon,
  right,
  className,
}: DialogCardActionProps) {
  return (
    <Dialog>
      <ActionDialog
        title={title}
        description={description}
        onConfirm={onConfirm}
      />
      <DialogTrigger asChild>
        <CardAction
          icon={icon}
          onPress={() => {}}
          right={right}
          className={className}
        />
      </DialogTrigger>
    </Dialog>
  );
}
