"use client";
import clsx from "clsx";
import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";

interface InputProps {
  label: string;
  id: string;
  type?: string;
  required?: boolean;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors<FieldValues>;
  disabled?: boolean;
}
// register: UseFormRegister<TFieldValues>;

const Input: React.FC<InputProps> = ({
  label,
  id,
  type = "text",
  required,
  register,
  errors,
  disabled = false,
}) => {
  return (
    <div className="mt-6">
      <label
        className="block text-sm font-medium leading-6 text-gray-800 dark:text-white"
        htmlFor={id}
      >
        {label}
      </label>
      <div className="mt-2">
        <input
          type={type}
          id={id}
          autoComplete={id}
          disabled={disabled}
          {...register(id, { required })}
          className={clsx(
            `
          form-input
          block
          w-full
          rounded-md
          border-0
          scroll-py-1.5
          shadow-sm
          ring-1
          text-gray-800
          dark:text-gray-200
          bg-gray-100
          dark:bg-gray-800
          ring-inset
          ring-gray-300
          placeholder:text-gray-400
          focus:ring-2
          focus:ring-inset
          focus:ring-sky-600
          sm:text-sm
          
          sm:leading-6`,
            errors[id] && "focus:ring-red-500",
            disabled && "opacity-50 cursor-default"
          )}
        />
      </div>
    </div>
  );
};

export default Input;

// "use client";
// // register: UseFormRegister<TFieldValues>;

// export default function Input({ field, register, checkPasswordStrength }) {
//   return (
//     <input
//       className="input"
//       placeholder={field.placeholder}
//       {...register(field.name, {
//         required: `${field.name} is required`,
//         onChange: (e) => {
//           if (field.name === "password") {
//             return checkPasswordStrength(e.target.value);
//           }
//         },
//         pattern:
//           field.name === "email"
//             ? {
//                 value: /^[a-zA-Z0-9]+@[0-9a-zA-Z]+\.[A-Za-z]{2,}$/g,
//                 message: "Invalid email address",
//               }
//             : field.name === "name"
//             ? {
//                 value: /[0-9A-Za-z]+$/g,
//                 message: "Invalid name",
//               }
//             : undefined,
//         minLength:
//           field.name === "password"
//             ? {
//                 value: 4,
//                 message: "Password must be at least 6 characters",
//               }
//             : {
//                 value: 2,
//                 message: "Name must be at least 2 characters",
//               },
//       })}
//     />
//   );
// }
