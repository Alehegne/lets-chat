import React from "react";
import { IconType } from "react-icons";
import { clsx } from "clsx";
import Link from "next/link";

interface DesktopItemProps {
  label: string;
  href: string;
  icon: IconType;
  active?: boolean;
  onClick?: () => void;
}

const DesktopItem = ({
  label,
  href,
  icon: Icon,
  active,
  onClick,
}: DesktopItemProps) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <li onClick={handleClick}>
      <Link
        href={href}
        className={clsx(
          `
          flex
           group
           gap-x-3
           rounded-md
           p-3
           text-sm
           leading-6
           font-semibold
           text-gray-500
           hover:text-black
           hover:bg-gray-100
           transition-all
           dark:text-gray-300
           dark:bg-gray-800
           dark:hover:bg-gray-600
           hover:scale-[1.01]
           active:scale-0.8
          `,
          active && "bg-gray-200 text-black dark:bg-gray-600 dark:text-white"
        )}
      >
        <Icon className="h-6 w-4 shrink-0" />
        <span className="sr-only">{label}</span>
      </Link>
    </li>
  );
};

export default DesktopItem;
