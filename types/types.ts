import { Conversation, Message, User } from "@prisma/client";

export type formData = {
    name: string;
    email: string;
    password: string;
}

export interface USER {
    id:string,
    name?:string,
    email?:string,
    emailVerified?:string,
    image?:string,
    hashedPassword?:string,
    createdAt?:Date,
    updatedAt?:Date,
    role?:"ADMIN" | "USER",
    conversationIds?:string[],
    conversations?:CONVERSATION[],
    seenMessageIds?:string[],
    seenMessages?:MESSAGE[],
    accounts?:ACCOUNT[],
    messages?:MESSAGE[]


}



interface ACCOUNT {
    id:string,
    userId:string,
    type:"EMAIL" | "GOOGLE" | "FACEBOOK" | "GITHUB",
    provider:string,
    providerAccountId:string,
    refreshToken?:string,
    accessToken?:string,
    expiresAt?:string,
    tokenType:"BEARER" | "JWT",
    scope?:string,
    idToken?:string,
    sessionState?:string,
    user:USER

}

interface CONVERSATION {
    id:string,
    createdAt:Date,
    lastMessageAt:Date,
    name?:string,
    isGroup:boolean,
    messageIds:string[],
    messages:MESSAGE[],
    userIds:string[],
    users:USER[]
}

interface MESSAGE {
    id:string,
    body?:string,
    createdAt:Date,
    image?:string,
    seenIds:string[],
    seen:USER[],
    conversationId:string,
    conversation:CONVERSATION,
    senderId:string,
    sender:USER
}



export type FullMessageType = Message & {
     sender: User;
     seen:User[]
}

export type FullConversationType =Conversation & {
    users:User[];
    messages:FullMessageType[];
}