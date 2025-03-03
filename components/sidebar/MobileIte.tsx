"use client";
import clsx from "clsx";
import Link from "next/link";
import React from "react";
import { IconType } from "react-icons";

interface MobileProps {
  label: string;
  href: string;
  icon: IconType;
  active?: boolean;
  onClick?: () => void;
}

const MobileIte: React.FC<MobileProps> = ({
  label,
  href,
  icon: Icon,
  active,
  onClick,
}) => {
  const handleClick = () => {
    if (onClick) {
      return onClick();
    }
  };

  return (
    <Link
      href={href}
      onClick={handleClick}
      className={clsx(
        `
        group
        flex
        gap-x-3
        text-sm
        leading-6
        font-semibold
        w-full
        justify-center
        p-4
        text-gray-600
        hover:text-black
        hover:bg-gray-400
        dark:text-gray-200
        dark:hover:text-gray-100
        dark:bg-gray-600
        `,
        active && "bg-gray-400 rounded-sm dark:bg-gray-400"
      )}
    >
      <Icon className={clsx(active && "text-xl")} />
      <label className="sr-only">{label}</label>
    </Link>
  );
};

export default MobileIte;
