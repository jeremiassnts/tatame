import {
  Toast,
  ToastDescription,
  ToastTitle,
  useToast as _useToast,
} from "@/src/components/ui/toast";

export function useToast() {
  const toast = _useToast();

  function showErrorToast(title: string, message: string) {
    const newId = Math.random();
    toast.show({
      id: newId.toString(),
      placement: "top",
      duration: 5000,
      render: ({ id }) => {
        const uniqueToastId = "toast-" + id;
        return (
          <Toast nativeID={uniqueToastId} action="error" variant="outline">
            <ToastTitle>{title}</ToastTitle>
            <ToastDescription>{message}</ToastDescription>
          </Toast>
        );
      },
    });
  }

  return {
    showErrorToast,
  };
}
