"use client";
import useOtherUser from "@/app/hooks/useOtherUser";
import Avatar from "@/components/Avatar";
import { FullConversationType } from "@/types/types";
import clsx from "clsx";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import React, { useCallback, useMemo, useState } from "react";
import AvatarGroup from "@/components/AvatarGroup";

interface ConversationBoxProps {
  selected: boolean;
  data: FullConversationType;
}

// data={item}
//             selected={item.id === conversationId}

const ConversationBox: React.FC<ConversationBoxProps> = ({
  data,
  selected,
}) => {
  const otherUser = useOtherUser(data);
  const session = useSession();
  const router = useRouter();

  const conversationUrl = useMemo(() => `/conversations/${data.id}`, [data.id]);

  const handleClick = useCallback(() => {
    router.push(conversationUrl);
  }, [router, conversationUrl]);

  const lastMessage = useMemo(() => {
    const messages = data.messages || [];
    return messages[messages.length - 1];
  }, [data.messages]);

  const userEmail = useMemo(() => {
    return session.data?.user?.email;
  }, [session.data?.user?.email]);

  const hasSeen = useMemo(() => {
    if (!lastMessage) {
      return [];
    }
    const seenArray = lastMessage.seen || []; //for type checking

    if (!userEmail) {
      return false;
    }

    return seenArray.filter((user) => user.email === userEmail).length !== 0;
  }, [lastMessage, userEmail]);

  const lastMessageText = useMemo(() => {
    if (lastMessage?.image) {
      return "sent an image";
    }
    if (lastMessage?.body) {
      return lastMessage.body;
    }
    return "Started the conversation";
  }, [lastMessage]);

  return (
    <div
      onClick={handleClick!}
      className={clsx(
        `
         w-full active:scale-100 hover:scale-[1.01] relative flex items-center space-x-3 hover:bg-[#b5bbc5] dark:hover:bg-[#2a3447] cursor-pointer rounded-lg transition
        `,
        selected && "bg-[#8d97a5] dark:bg-[#3c4c67]"
      )}
    >
      {data.isGroup ? (
        <AvatarGroup users={data.users} image={data?.groupImage} />
      ) : (
        <Avatar currentUser={otherUser} />
      )}
      <div className="min-w-0 flex-1">
        <div className="focus:outline-none">
          <div className="flex justify-between mb-1 items-center">
            <p className="text-lg font-medium text-opacity-95 text-gray-800 line-clamp-1 dark:text-gray-200">
              {data?.name || otherUser?.name}
            </p>
            {lastMessage?.createdAt && (
              <p className="text-xs text-gray-600 dark:text-gray-300">
                {format(new Date(lastMessage.createdAt), "p")}
              </p>
            )}
          </div>
          <p
            className={clsx(
              `font-light truncate text-sm opacity-65 dark:opacity-80`,
              hasSeen
                ? "text-gray-800 dark:text-gray-200"
                : "text-gray-900 dark:text-gray-200"
            )}
          >
            {lastMessageText}
          </p>
        </div>
      </div>
    </div>
  );
};
// lastMessage?.createdAt
export default ConversationBox;
