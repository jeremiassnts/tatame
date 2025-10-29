import ActionDialog from "./ui/action-dialog";
import { Dialog, DialogTrigger } from "./ui/dialog";
import { CardAction } from "./card-action";

interface DialogCardActionProps {
  title: string;
  description: string;
  onConfirm: () => void;
  icon: "trash" | "edit" | "x" | "check";
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
