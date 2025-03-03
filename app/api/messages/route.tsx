import getCurrentUser from "@/app/actions/getUser";
import prisma from "@/lib/database/prismaClient";
import { pusherServer } from "@/lib/pusher";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser?.id || !currentUser.email) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const body = await req.json();
  const { message, conversationId, image } = body;

  if (!conversationId) {
    return new NextResponse("Bad Request", { status: 400 });
  }

  const newMessage = await prisma.message.create({
    data: {
      body: message,
      image: image,
      conversation: {
        connect: {
          id: conversationId,
        },
      },
      sender: {
        connect: {
          id: currentUser.id,
        },
      },
      seen: {
        connect: {
          id: currentUser.id,
        },
      },
    },
    include: {
      seen: true,
      sender: true,
    },
  });

  const updatedConversation = await prisma.conversation.update({
    where: {
      id: conversationId,
    },
    data: {
      lastMessageAt: new Date(),
      messages: {
        connect: {
          id: newMessage.id,
        },
      },
    },
    include: {
      users: true,
      messages: {
        include: {
          seen: true,
        },
      },
    },
  });

  //sending real time to each conversation id
  await pusherServer.trigger(conversationId, "messages:new", newMessage); //.trigger("channel","event","data")

  const lastMessage =
    updatedConversation.messages[updatedConversation.messages.length - 1];

  //to show the last message in a sidebar,sending to each user
  updatedConversation.users.map((user) => {
    pusherServer.trigger(user.email!, "conversation:update", {
      id: conversationId,
      messages: lastMessage,
    });
  });

  return NextResponse.json(newMessage);

  //check if the user is part of the conversation
}
