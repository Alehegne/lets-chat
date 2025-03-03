"use client";
import gsap from "gsap";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { BsToggleOff, BsToggleOn } from "react-icons/bs";

const ThemeChanger = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // When mounted on client, now we can show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    gsap.to("body", {
      backgroundColor: theme === "dark" ? "#000" : "#fff",
      color: theme === "dark" ? "#fff" : "#000",
      duration: 0.5,
    });
  }, [theme]);

  if (!mounted) {
    return null;
  }

  return (
    <button
      className="fixed flex items-center justify-center hover:scale-105 w-[60px] h-[60px] rounded-full active:scale-100 transition-all  text-gray-950 -top-0 md:top-2 right-3 z-40 bg-gray-300 dark:bg-gray-800 "
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {theme === "dark" ? (
        <BsToggleOn fill="white" size={40} />
      ) : (
        <BsToggleOff fill="black" size={40} />
      )}
      <p className="sr-only">toggle theme</p>
    </button>
  );
};

export default ThemeChanger;
