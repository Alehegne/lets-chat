"use client";
import React, { useEffect, useRef, useState } from "react";
import { FullMessageType } from "@/types/types";
import useConversation from "@/app/hooks/useConversation";
import MessageBox from "./MessageBox";
import axios from "axios";
import { pusherClient } from "@/lib/pusher";
import { find } from "lodash";

interface BodyProps {
  initialMessages: FullMessageType[] | null;
  isGroup?: boolean;
}

const Body: React.FC<BodyProps> = ({ initialMessages, isGroup }) => {
  const [messages, setMessages] = useState(initialMessages);
  const bottomRef = useRef<HTMLDivElement>(null);

  const { conversationId } = useConversation();

  //add the current user to the seen list

  useEffect(() => {
    axios.post(`/api/conversations/${conversationId}/seen`);
  }, [conversationId]);

  useEffect(() => {
    const messageHandler = (message: FullMessageType) => {
      axios.post(`/api/conversations/${conversationId}/seen`);
      setMessages((current) => {
        if (find(current, { id: message.id })) {
          return current;
        }
        return [...current!, message];
      });
      bottomRef.current?.scrollIntoView();
    };
    const handleMessageFinal = (newMessage: FullMessageType) => {
      setMessages((current) =>
        (current ?? []).map((currentMessage) => {
          if (currentMessage.id === newMessage.id) {
            console.log("returning new message");
            return newMessage;
          }
          return currentMessage;
        })
      );
    };

    bottomRef.current?.scrollIntoView();
    pusherClient.subscribe(conversationId); //connect to the channel
    pusherClient.bind("messages:new", messageHandler); //bind to the events
    pusherClient.bind("message:update", handleMessageFinal);

    return () => {
      pusherClient.unsubscribe(conversationId);
      pusherClient.unbind("messages:new", messageHandler);
      pusherClient.unbind("message:update", handleMessageFinal);
    };
  }, [conversationId, messages]);

  return (
    <div
      style={{
        scrollbarWidth: "none",
        // backgroundImage: "url(/assets/images/bgImage.png)",
      }}
      className="flex-1 bg-gray-600 dark:bg-gray-900  bg-[url(/assets/images/bg4.jpg)] bg-center  bg-cover bg  overflow-y-auto"
    >
      {messages &&
        messages.map((message, index) => (
          <MessageBox
            key={index}
            data={message}
            isGroup={isGroup}
            isLast={index === messages.length - 1}
          />
        ))}
      <div ref={bottomRef} className="pt-24" />
    </div>
  );
};

export default Body;
