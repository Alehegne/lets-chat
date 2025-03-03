"use client";
import useRoutes from "@/app/hooks/useRouter";
import React, { useState } from "react";
import DesktopItem from "./DesktopItem";
import { User } from "@prisma/client";
import Avatar from "../Avatar";
import SettingModal from "./SettingModal";

interface DesktopSideBar {
  currentUser: User;
}

const DesktopSideBar: React.FC<DesktopSideBar> = ({ currentUser }) => {
  const routes = useRoutes();
  const [isOpen, setIsOpen] = useState(false);
  console.log("user", currentUser);
  return (
    <>
      <SettingModal
        currentUser={currentUser}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
      <div
        className="
          hidden

          lg:fixed
          lg:inset-y-0
          lg:left-0
          lg:z-40
          lg:w-20
          xl:px-6
          lg:flex
          lg:flex-col
          lg:items-center
          justify-between
          
          lg:border-r-[1px]
          lg:bg-gray-300
          lg:dark:bg-gray-900
          lg:border-gray-200
          lg:dark:border-gray-900
          text-gray-800
          dark:text-gray-50
        
          lg:pb-4

              "
      >
        <nav className="flex flex-col justify-between">
          <ul role="list" className="flex flex-col items-center space-y-1">
            {routes.map((item) => (
              <DesktopItem
                key={item.href}
                label={item.label}
                href={item.href}
                icon={item.icon}
                active={item.active}
                onClick={item.onClick}
              />
            ))}
          </ul>
        </nav>
        <nav className="mt-4 flex flex-col justify-between items-center">
          <div
            onClick={() => setIsOpen(true)}
            className="cursor-pointer hover:opacity-75 transition"
          >
            <Avatar currentUser={currentUser!} />
          </div>
        </nav>
      </div>
    </>
  );
};

export default DesktopSideBar;
