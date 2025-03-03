"use client";
import useConversation from "@/app/hooks/useConversation";
import axios from "axios";
import React from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { HiPhoto } from "react-icons/hi2";
import MessageInput from "./MessageInput";
import { CldUploadButton } from "next-cloudinary";
import { HiPaperAirplane } from "react-icons/hi";

const Form = () => {
  const { conversationId } = useConversation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FieldValues>({
    defaultValues: {
      message: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    console.log("dataform", data);
    setValue("message", "", { shouldValidate: true });
    axios.post(`/api/messages`, {
      ...data,
      conversationId,
    });
  };

  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleUpload = (result: any) => {
    console.log("url", result?.info?.secure_url);

    axios.post("/api/messages", {
      image: result?.info?.secure_url,
      conversationId,
    });
  };

  return (
    <div
      className="
   p-4 bg-gray-300 dark:bg-[#4f5969] border-t flex items-center gap-2 lg:gap-4 w-full
   "
    >
      <CldUploadButton
        options={{ maxFiles: 1 }}
        onSuccess={handleUpload}
        uploadPreset="lets chat"
      >
        <HiPhoto size={32} className="text-sky-500" />
      </CldUploadButton>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex items-center gap-2 lg:gap-4 w-full"
      >
        <MessageInput
          register={register}
          placeholder="Type a message"
          id="message"
          errors={errors}
          required
          type="text"
        />
        <button
          type="submit"
          className="rounded-full p-2 bg-sky-500 transition-all"
        >
          <HiPaperAirplane
            size={18}
            className="text-white hover:scale-125 active:scale-100 transition-all"
          />
        </button>
      </form>
    </div>
  );
};

export default Form;
