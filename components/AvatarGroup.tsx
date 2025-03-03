"use client";

import { User } from "@prisma/client";
import Image from "next/image";
import React from "react";

interface IAvatar {
  users: User[];
  image?: string;
  showModal?: () => void;
}

const AvatarGroup: React.FC<IAvatar> = ({ users, image, showModal }) => {
  const userSlices = users.slice(0, 3);
  const positionMap = {
    0: "top-0 left-[12px]",
    1: "left-0 bottom-1",
    2: "bottom-1 right-0",
  };

  return (
    <div className="relative">
      <div
        onClick={showModal}
        className="relative cursor-pointer flex items-center justify-center rounded-full  h-11 w-11"
      >
        {image ? (
          <Image src={image} fill alt="avatar" className="rounded-full" />
        ) : (
          userSlices.map((user, index) => (
            <div
              key={user.id}
              className={`absolute overflow-hidden inline-block w-[21px] h-[21px] rounded-full ${
                positionMap[index as keyof typeof positionMap]
              }`}
            >
              <Image
                src={user.image || "/assets/images/avatarplaceholder.jpg"}
                fill
                alt="group photo"
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AvatarGroup;
