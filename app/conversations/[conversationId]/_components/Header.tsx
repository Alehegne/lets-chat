"use client";
import useOtherUser from "@/app/hooks/useOtherUser";
import Avatar from "@/components/Avatar";
import { Conversation, User } from "@prisma/client";
import Link from "next/link";
import React, { useMemo, useState } from "react";
import { HiChevronLeft } from "react-icons/hi";
import { HiEllipsisHorizontal } from "react-icons/hi2";
import ProfileDrawer from "./ProfileDrawer";
import clsx from "clsx";
import AvatarGroup from "@/components/AvatarGroup";
import ImageModal from "@/components/ImageModal";

interface HeaderProps {
  conversation: Conversation & {
    users: User[];
  };
}

const Header: React.FC<HeaderProps> = ({ conversation }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showModalImage, setShowModalImage] = useState(false);

  const otherUser = useOtherUser(conversation);

  const statusText = useMemo(() => {
    if (conversation.isGroup) {
      return `${conversation.users.length} members`;
    }

    return "Active now";
  }, [conversation]);

  console.log("showModaImage", showModalImage);

  return (
    <>
      {showModalImage && (
        <ImageModal
          isOpen={showModalImage}
          onClose={() => setShowModalImage(false)}
          image={
            conversation.isGroup ? conversation.groupImage : otherUser.image
          }
        />
      )}
      <div
        className={clsx(
          drawerOpen &&
            "h-screen fixed inset-0 z-[46] w-full bg-black bg-opacity-85"
        )}
      />

      <ProfileDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        data={conversation}
      />
      <div className="w-full bg-gray-300 dark:bg-gray-800 flex border-b-[1px] sm:px-4 py-3 px-4 lg:px-6 justify-between items-center shadow-lg ">
        <div className="flex gap-3 items-center">
          <Link
            href="/conversations"
            className="lg:hidden block text-sky-500 dark:text-white transition cursor-pointer"
          >
            <HiChevronLeft size={32} />
          </Link>
          {conversation.isGroup ? (
            <AvatarGroup
              users={conversation.users}
              image={conversation.groupImage}
              showModal={() => setShowModalImage(true)}
            />
          ) : (
            <Avatar
              showModal={() => setShowModalImage(true)}
              currentUser={otherUser}
            />
          )}
          <div className="flex flex-col">
            <div className="font-semibold opacity-85">
              {conversation?.name || otherUser?.name}
            </div>
            <div className="text-sm font-light text-gray-700 dark:text-gray-300">
              {statusText}
            </div>
          </div>
        </div>
        <HiEllipsisHorizontal
          size={40}
          onClick={() => setDrawerOpen((prev) => !prev)}
          className="text-black z-40 mr-20 cursor-pointer dark:text-white hover:scale-105 active:scale-100 transition-all dark:hover:text-gray-200"
        />
      </div>
    </>
  );
};

export default Header;
