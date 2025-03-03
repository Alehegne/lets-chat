"use client";
import CustomModal from "@/components/CustomDialog";
import Input from "@/components/inputs/input";
import Select from "@/components/inputs/Select";
import Button from "@/components/shared/Button";
import { User } from "@prisma/client";
import axios from "axios";
import clsx from "clsx";
import { CldUploadButton } from "next-cloudinary";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";

interface IGroup {
  isOpen: boolean;
  onClose: () => void;
  users: User[];
}

const GroupChatModal: React.FC<IGroup> = ({ isOpen, onClose, users }) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    setValue,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      members: [],
      groupImage: "",
    },
  });

  const members = watch("members");
  const groupImage = watch("groupImage");

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    // console.log("data with image", data);
    setIsLoading(true);
    axios
      .post("/api/conversations", {
        ...data,
        isGroup: true,
      })
      .then(() => {
        router.refresh();
        onClose();
        toast.success("group successfully created!");
      })
      .catch(() => {
        toast.error("something went wrong, pls create again!");
      })
      .finally(() => setIsLoading(false));
  };

  //eslint-disable-next-line
  const handleUpload = (result: any) => {
    const url = result?.info?.secure_url;
    setValue("groupImage", url, {
      shouldValidate: true,
    });
  };
  const handleRemoveImage = () => {
    setValue("groupImage", "");
  };

  console.log("members", members);

  return (
    <CustomModal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="font-semibold text-base leading-7 text-gray-900 dark:text-gray-200">
              Create a group chat
            </h2>
            <p className=" text-sm mt-1 text-gray-800 dark:text-gray-100">
              create a chat with more than 2 people
            </p>
            <div className="mt-10 flex flex-col gap-y-8">
              <Input
                required
                errors={errors}
                label="Group Name"
                id="name"
                register={register}
                type="text"
                disabled={isLoading}
              />
              <Select
                disabled={isLoading}
                label="Group Members"
                options={users.map((user) => ({
                  value: user.id,
                  label: user.name,
                }))}
                value={members}
                onChange={(value) =>
                  setValue("members", value, {
                    shouldValidate: true,
                  })
                }
              />

              <div className="flex flex-col mt-2 gap-1">
                <label className="font-semibold opacity-80">photo</label>
                <div className="flex gap-4 items-center">
                  <CldUploadButton
                    options={{ maxFiles: 1 }}
                    onSuccess={handleUpload}
                    uploadPreset="lets chat"
                    className={clsx(
                      `flex gap-3 items-center`,
                      isLoading && "pointer-events-none"
                    )}
                  >
                    <div className="relative h-[58px]  group w-[58px] rounded-full">
                      <Image
                        src={
                          groupImage || "/assets/images/avatarplaceholder.jpg"
                        }
                        fill
                        sizes="(max-width:48px) 100vw"
                        alt="profile pic"
                        className="rounded-full"
                      />
                    </div>
                    <div className="ml-1">Change</div>
                  </CldUploadButton>

                  {groupImage !== "" && (
                    <Button
                      type="button"
                      danger
                      disabled={isLoading}
                      onClick={handleRemoveImage}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-4 justify-end mt-4">
          <Button
            disabled={isLoading}
            secondary
            onClick={onClose}
            type="button"
          >
            Cancel
          </Button>
          <Button disabled={isLoading} type="submit">
            Create
          </Button>
        </div>
      </form>
    </CustomModal>
  );
};

export default GroupChatModal;
