"use client";
import Input from "@/components/inputs/input";
// import { formFields } from "@/lib/constants/links";
// import { formData } from "@/types/types";
import Image from "next/image";
import React, { useCallback, useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import Button from "@/components/shared/Button";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import AuthSocialButton from "@/components/AuthSocialButton";
import { BsGithub, BsGoogle } from "react-icons/bs";
import axios from "axios";
import toast from "react-hot-toast";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type variant = "LogIn" | "Register";

const SignIn = () => {
  const session = useSession();
  const { theme } = useTheme();
  const [variant, setVariants] = useState<variant>("LogIn");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  //if session is active redirect to home
  useEffect(() => {
    if (session?.status === "authenticated") {
      console.log("authenticated");
      router.push("/users");
    }
  }, [session, router]);

  const toggleVariant = useCallback(() => {
    if (variant === "LogIn") {
      setVariants("Register");
    } else {
      setVariants("LogIn");
    }
  }, [variant]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);

    if (variant === "LogIn") {
      signIn("credentials", {
        ...data,
        redirect: false,
      })
        .then((callback) => {
          // console.log("callback", callback);
          if (callback?.error) {
            // console.log("callback success", callback);

            toast.error("Invalid credentials");
          }
          if (callback?.ok && !callback?.error) {
            // console.log("callback error", callback);

            toast.success("Logged in");
            router.push("/users");
          }
        })
        .catch(() => toast.error("oops! something went wrong"))
        .finally(() => setIsLoading(false));
    }

    if (variant === "Register") {
      axios
        .post("/api/register", data)
        .then(() => {
          toast.success("Account created successfully");
          signIn("credentials", data);
          router.push("/users");
        })
        .catch(() => toast.error("oops! something went wrong"))
        .finally(() => setIsLoading(false));
    }
  };

  const socialAction = (action: string) => {
    setIsLoading(true);

    signIn(action, {
      redirect: false,
    })
      .then((callback) => {
        if (callback?.error) {
          toast.error("Invalid credentials");
        }
        if (callback?.ok && !callback?.error) {
          toast.success("Logged in");
          router.push("/users");
        }
      })
      .catch(() => toast.error("oops! something went wrong"))
      .finally(() => setIsLoading(false));
  };

  return (
    <div className="flex  justify-center  items-center h-screen">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="flex rounded-lg  transition-all flex-col items-center space-y-4 px-2 py-8  md:px-8"
      >
        {theme === "dark" ? (
          <Image
            src="/assets/images/darklogo.png"
            width={90}
            height={90}
            alt="logo"
          />
        ) : (
          <Image
            src="/assets/images/logo.svg"
            width={90}
            height={90}
            alt="logo"
          />
        )}
        <h1 className=" font-semibold text-2xl">Sign in to your account</h1>
        <div className="flex flex-col space-y-4 w-full">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {variant === "Register" && (
              <Input
                label="name"
                id="name"
                type="text"
                register={register}
                errors={errors}
                disabled={isLoading}
              />
            )}
            <Input
              label="Email Address"
              id="email"
              type="email"
              register={register}
              errors={errors}
              disabled={isLoading}
            />
            <Input
              label="password"
              id="password"
              type="password"
              register={register}
              errors={errors}
              disabled={isLoading}
            />
            <Button type="submit" fullWidth disabled={isLoading}>
              {variant === "LogIn" ? "Sign In" : "Register"}
            </Button>
          </form>
        </div>
        <div className="mt-6  w-full">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 " />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 rounded-md dark:bg-gray-800 dark:text-gray-100  text-gray-500">
                Or continue with
              </span>
            </div>
          </div>
          <div className="mt-6 flex gap-2">
            <AuthSocialButton
              onClick={() => socialAction("github")}
              icon={BsGithub}
            />
            <AuthSocialButton
              onClick={() => socialAction("google")}
              icon={BsGoogle}
            />
          </div>
        </div>
        {/* toggle between signin and signup */}
        <div className="flex gap-2 justify-center text-sm mt-6 px-2 text-gray-500">
          <div className="text-gray-600 dark:text-gray-200">
            {variant === "LogIn"
              ? "New to LetsChat?"
              : "Already have an account?"}
          </div>
          <div
            onClick={toggleVariant}
            className="underline cursor-pointer text-gray-600 dark:text-gray-200"
          >
            {variant === "LogIn" ? "Create an account" : "Log in"}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SignIn;

{
  /* <label>Name</label>
          <input className="input" placeholder="john doe" {...register("name")} />
          <label>Email</label>
          <input placeholder="alex@gmail.com" {...register("email")} />
          <label>Password</label>
          <input placeholder="******" {...register("password")} /> */
}
