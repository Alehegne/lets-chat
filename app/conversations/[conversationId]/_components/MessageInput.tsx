"use client";
import React from "react";
import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";

interface MessageInputProps {
  register: UseFormRegister<FieldValues>;
  placeholder?: string;
  id: string;
  errors: FieldErrors<FieldValues>;
  required?: boolean;
  type?: string;
}

const MessageInput: React.FC<MessageInputProps> = ({
  register,
  placeholder,
  id,
  errors,
  required,
  type,
}) => {
  return (
    <div className="relative w-full">
      <input
        type={type}
        autoComplete={id}
        placeholder={placeholder}
        id={id}
        {...register(id, { required })}
        className="
      w-full font-light h-full py-2 px-4 bg-[#c6cad2] dark:bg-gray-600 rounded-full placeholder:text-gray-700 dark:placeholder:text-gray-200 focus:outline-none border-none "
      />
    </div>
  );
};

export default MessageInput;
