import getCurrentUser from "@/app/actions/getUser";
import prisma from "@/lib/database/prismaClient";
import { pusherServer } from "@/lib/pusher";
import { NextResponse } from "next/server";

interface IDelete{
    conversationId:string
}

export async function DELETE(req:Request,{params}:{params:Promise<IDelete>}){


    try {

        const currentUser = await getCurrentUser();
        const conversationId = (await params).conversationId;
    
        if(!currentUser?.email || !currentUser.id){
            return new NextResponse("unauthorized!",{status:401})
        }

        //find the existing conversation
        const existingConversations = await prisma.conversation.findUnique({
            where:{
                id:conversationId
            },
            include:{
                 users:true
            }
        });
        
        if(!existingConversations) {
            return new NextResponse("invalid id",{status:404})
        };
    
        //delete the conv from db
    
        const deletedUser = await prisma.conversation.delete({
            where:{
                id:conversationId,
                userIds:{//only the user from can delete
                    hasSome:[currentUser.id]
                }
            }
        });

        await pusherServer.trigger(currentUser.email!,"conversation:delete",existingConversations);
    
        return NextResponse.json(deletedUser);
        
    } catch (error) {
        console.log("error in deleting route",error);

        return new NextResponse("internal server error",{status:500})
    }
 

}