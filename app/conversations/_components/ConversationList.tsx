"use client";
import useConversation from "@/app/hooks/useConversation";
import { FullConversationType } from "@/types/types";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { MdOutlineGroupAdd } from "react-icons/md";
import ConversationBox from "./ConversationBox";
import GroupChatModal from "./GroupChatModal";
import { User } from "@prisma/client";
import { useSession } from "next-auth/react";
import { pusherClient } from "@/lib/pusher";
import { find } from "lodash";

interface ConversationListProps {
  initialItems: FullConversationType[];
  users: User[];
}

const ConversationList: React.FC<ConversationListProps> = ({
  initialItems,
  users,
}) => {
  const session = useSession();
  const [items, setItems] = useState(initialItems);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const { isOpen, conversationId } = useConversation();

  const pusherKey = useMemo(
    () => session.data?.user?.email,
    [session.data?.user?.email]
  );

  useEffect(() => {
    const handleNewConversation = (data: FullConversationType) => {
      setItems((current) => {
        if (find(current, { id: data.id })) {
          return current;
        }
        return [data, ...current];
      });
    };

    const handleUpdate = (data: FullConversationType) => {
      setItems((current) =>
        current.map((currentConversation) => {
          if (currentConversation.id === data.id) {
            return {
              ...currentConversation,
              messages: data.messages,
            };
          }
          return currentConversation;
        })
      );
    };

    const handleDelete = (conversation: FullConversationType) => {
      setItems((current) =>
        current.filter((item) => item.id !== conversation.id)
      );
      if (conversationId === conversation.id) {
        router.push("/conversations");
      }
    };

    if (!pusherKey) return;
    pusherClient.subscribe(pusherKey);
    pusherClient.bind("conversation:new", handleNewConversation);
    pusherClient.bind("conversation:update", handleUpdate);
    pusherClient.bind("conversation:delete", handleDelete);

    return () => {
      pusherClient.unsubscribe(pusherKey);
      pusherClient.unbind("conversation:new", handleNewConversation);
      pusherClient.unbind("conversation:update", handleUpdate);
    };
  }, [pusherKey, router, conversationId]);
  return (
    <>
      <GroupChatModal
        users={users}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <aside
        className={clsx(
          `
        fixed
        inset-y-0
        pb-20
        lg:pb-0
        lg:left-20
        lg:w-80
        lg:block
        overflow-y-auto
        border-r
        border-gray-200
        dark:border-gray-600
        dark:bg-gray-800
        bg-gray-300
       
        `,
          isOpen ? "hidden" : "block w-full left-0"
        )}
      >
        <div className="px-5 ">
          <div className="flex justify-between items-center mb-4 pt-4">
            <div className="text-2xl dark:text-white font-bold text-neutral-800">
              Messages
            </div>
            <div
              onClick={() => setIsModalOpen(true)}
              className="rounded-full p-2 bg-gray-100 dark:bg-gray-600 text-gray-700 text-2xl dark:text-gray-100 transition  hover:opacity-75 cursor-pointer"
            >
              <MdOutlineGroupAdd size={20} />
            </div>
          </div>

          {items.map((item) => (
            <ConversationBox
              key={item.id}
              data={item}
              selected={item.id === conversationId}
            />
          ))}
        </div>
      </aside>
    </>
  );
};

export default ConversationList;
