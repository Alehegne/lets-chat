import prisma from "@/lib/database/prismaClient";
import getCurrentUser from "./getUser";

export default async function getConversations() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return [];
  }

  try {
    const conversations = await prisma.conversation.findMany({
      orderBy: {
        lastMessageAt: "desc",
      },
      where: {
        userIds: {
          has: currentUser.id,
        },
      },
      include: {
        users: true,
        messages: {
          include: {
            sender: true,
            seen: true,
          },
        },
      },
    });

    return conversations;
  } catch (error) {
    console.log("error in getConversations", error);
    return [];
  }
}
