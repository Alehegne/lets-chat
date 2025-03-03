"use client";

import { User } from "@prisma/client";
import Image from "next/image";
import React from "react";

interface AvatarProps {
  currentUser: User;
  showModal?: () => void;
}

const Avatar: React.FC<AvatarProps> = ({ currentUser, showModal }) => {
  // console.log("image", currentUser?.image);
  return (
    <div className="relative">
      <div
        onClick={showModal}
        className="relative cursor-pointer inline-block rounded-full overflow-hidden h-9 w-9 md:h-11 md:w-11"
      >
        <Image
          src={currentUser?.image || "/assets/images/avatarplaceholder.jpg"}
          fill
          alt="avatar"
        />
      </div>
      <span className="bg-green-500 block ring-2 ring-white  top-0 w-2 h-2 md:h-3 md:w-3 rounded-full absolute right-0" />
    </div>
  );
};

export default Avatar;
