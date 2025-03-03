import getConversationById from "@/app/actions/getConversationById";
import getMessages from "@/app/actions/getMessages";
import EmptyState from "@/components/EmptyState";
import React from "react";
import Header from "./_components/Header";
import Body from "./_components/Body";
import Form from "./_components/Form";

const EachPage = async ({
  params,
}: {
  params: Promise<{ conversationId: string }>;
}) => {
  const conversationId = (await params).conversationId;

  const conversation = await getConversationById(conversationId);
  const messages = await getMessages(conversationId);

  console.log("messagesNow", messages);

  if (!conversation) {
    return (
      <div className="lg:pl-80 h-full">
        <div className="flex flex-col h-full">
          <EmptyState />
        </div>
      </div>
    );
  }

  return (
    <div className="lg:pl-80 h-full">
      <div className="h-full flex flex-col">
        <Header conversation={conversation} />
        <Body initialMessages={messages} isGroup={conversation.isGroup} />
        <Form />
      </div>
    </div>
  );
};

export default EachPage;
