"use client";
import Avatar from "@/components/Avatar";
import { FullMessageType } from "@/types/types";
import clsx from "clsx";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { format } from "date-fns";
import Image from "next/image";
import { BiCheckDouble } from "react-icons/bi";
import ImageModal from "@/components/ImageModal";

interface MessageBoxProps {
  data: FullMessageType;
  isLast: boolean;
  isGroup?: boolean;
}

const MessageBox: React.FC<MessageBoxProps> = ({ data, isLast, isGroup }) => {
  const session = useSession();
  const isOwn = session?.data?.user?.email === data.sender.email;
  const [showImageModal, setShowImageModal] = useState<boolean>(false);

  const seenList = (data.seen || [])
    .filter((user) => user.email !== data.sender.email)
    .map((user) => {
      if (user.email === session?.data?.user?.email) {
        return;
      }
      return user.name;
    })
    .join(",");

  const isMoreThanOne = seenList.split(",").length > 1;

  const container = clsx("flex gap-3 p-4", isOwn && "justify-end");
  const avatar = clsx(isOwn && "order-2");
  const body = clsx("flex flex-col gap-2", isOwn && "items-end");
  const message = clsx(
    "text-sm w-fit overflow-hidden",
    isOwn ? "bg-sky-500 text-white dark:text-gray-700" : "bg-gray-100",
    data.image ? "rounded-md p-0" : "rounded-full px-3 py-2"
  );

  return (
    <>
      <ImageModal
        isOpen={showImageModal}
        image={data.image}
        onClose={() => setShowImageModal(false)}
      />
      <div className={container}>
        <div className={avatar}>
          <Avatar currentUser={data.sender} />
        </div>
        <div className={body}>
          <div className="flex items-center gap-1">
            <div className="text-xs text-gray-400">{data.sender.name}</div>
            <div className="text-xs text-gray-400">
              {format(new Date(data.createdAt), "p")}
            </div>
          </div>
          <div className={message}>
            {data.image ? (
              <Image
                onClick={() => setShowImageModal(true)}
                alt="image"
                height={288}
                width={288}
                src={data.image}
                className="object-cover cursor-pointer hover:scale-110 transition translate"
              />
            ) : (
              <div>{data.body}</div>
            )}
          </div>
          {!isGroup && isOwn && seenList.length > 0 && (
            <BiCheckDouble
              size={16}
              className="font-light text-gray-50 pt-0 "
            />
          )}

          {isGroup && seenList.length > 0 && (
            <div className="text-xs text-gray-100 dark:text-gray-200 font-light">
              {seenList} {isMoreThanOne ? "have" : "has"} seen this message
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MessageBox;
