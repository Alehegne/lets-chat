import CustomDialog from "@/components/Dialog";
import React from "react";
import { CgDanger } from "react-icons/cg";
import { MdDelete } from "react-icons/md";

interface IDelete {
  onDelete: () => void;
  name: string;
  isLoading?: boolean;
  openDialog?: boolean;
  setOpenDialog?: (open: boolean) => void;
}

const DeleteConfirm: React.FC<IDelete> = ({
  onDelete,
  name,
  isLoading,
  openDialog,
  setOpenDialog,
}) => {
  const deleteTrigger = (
    <MdDelete
      size={40}
      className="hover:scale-105 dark:text-white active:scale-100 transition-all"
    />
  );
  const deleteTitle = (
    <div className="flex items-center gap-4">
      <CgDanger size={40} className="bg-red-700 text-white rounded-full" />
      <h1>Are you absolutely sure?</h1>
    </div>
  );
  const deleteDescription = (
    <>
      {" "}
      This action cannot be undone. This will permanently delete{" "}
      <span className="font-bold"> {name?.toUpperCase()}</span> and remove the
      Chat data from our servers.
    </>
  );

  return (
    <>
      {" "}
      <CustomDialog
        trigger={deleteTrigger}
        title={deleteTitle}
        description={deleteDescription}
        cancel="Cancel"
        confirm="Delete"
        onClick={onDelete}
        isLoading={isLoading}
      />
    </>
  );
};

export default DeleteConfirm;
