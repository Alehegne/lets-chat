import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../components/ui/alertDialog";
import React from "react";

interface IDialog {
  trigger: React.ReactNode;
  title: React.ReactNode;
  description: React.ReactNode;
  cancel?: React.ReactNode;
  confirm?: React.ReactNode;
  onClick: () => void;
  isLoading?: boolean;
}

const CustomDialog: React.FC<IDialog> = ({
  trigger,
  title,
  description,
  cancel,
  confirm,
  isLoading,
  onClick,
}) => {
  console.log("isloading", isLoading);
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>{cancel}</AlertDialogCancel>
          <AlertDialogAction disabled={isLoading} onClick={onClick}>
            {confirm}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CustomDialog;
