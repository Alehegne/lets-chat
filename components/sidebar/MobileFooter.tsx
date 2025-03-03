"use client";
import useConversation from "@/app/hooks/useConversation";
import useRoutes from "@/app/hooks/useRouter";
import React from "react";
import MobileIte from "./MobileIte";

const MobileFooter = () => {
  const routes = useRoutes();
  const { isOpen } = useConversation();

  if (isOpen) {
    return null;
  }

  return (
    <div
      className="
    fixed
    justify-between
    w-full
    bottom-0
    z-40
    flex
    items-center
    bg-gray-50
    dark:bg-gray-800
    border-t-[1px]
    lg:hidden
    transition-all
    "
    >
      {routes.map((route) => (
        <MobileIte
          key={route.href}
          label={route.label}
          active={route.active}
          icon={route.icon}
          onClick={route.onClick}
          href={route.href}
        />
      ))}
    </div>
  );
};

export default MobileFooter;
