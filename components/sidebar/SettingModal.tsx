"use client";
import { User } from "@prisma/client";
import React, { useState } from "react";
import Input from "../inputs/input";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import Button from "../shared/Button";
import { CldUploadButton } from "next-cloudinary";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Image from "next/image";
import clsx from "clsx";
import CustomModal from "../CustomDialog";

interface ISetting {
  currentUser: User;
  isOpen: boolean;
  onClose: () => void;
}

const SettingModal: React.FC<ISetting> = ({ currentUser, isOpen, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: currentUser.name,
      image: currentUser.image,
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    // console.log(data);
    setIsLoading(true);

    // console.log("profilinfo", data);
    axios
      .post("/api/settings", data)

      .then(() => {
        toast.success("successfully updated!");
        router.refresh();
        onClose();
      })
      .catch(() => toast.error("something went wrong!"))
      .finally(() => setIsLoading(false));
  };

  const image = watch("image");
  //eslint-disable-next-line
  const handleUpload = (result: any) => {
    const url = result?.info?.secure_url;
    setValue("image", url, {
      shouldValidate: true,
    });
  };

  const handleRemoveImage = () => {
    setValue("image", "");
  };
  return (
    <CustomModal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col relative">
        <div className="flex flex-col">
          <h1 className="font-semibold">Profile</h1>
          <p className="opacity-70 font-light text-gray-900 dark:text-gray-200">
            Edit your profile
          </p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col">
            <Input
              label="Name"
              id="name"
              type="text"
              disabled={isLoading}
              register={register}
              errors={errors}
              required
            />
          </div>
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
                      image ||
                      currentUser.image ||
                      "/assets/images/avatarplaceholder.jpg"
                    }
                    fill
                    sizes="(max-width:48px) 100vw"
                    alt="profile pic"
                    className="rounded-full"
                  />
                </div>
                <div className="ml-1">Change</div>
              </CldUploadButton>

              {image !== "" && (
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
          <div className="flex mt-2 justify-end w-full">
            <div className="flex gap-4">
              <Button disabled={isLoading} secondary onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving" : "Save"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </CustomModal>
  );
};

export default SettingModal;
