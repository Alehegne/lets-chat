import getCurrentUser from "@/app/actions/getUser";
import prisma from "@/lib/database/prismaClient";
import { pusherServer } from "@/lib/pusher";
import { NextResponse } from "next/server";

interface IProps{
    conversationId: string;
}

export async function POST(req:Request,{params}:{params:Promise<IProps>}){
 
    
    try {
        const currentUser = await getCurrentUser();
    
        if(!currentUser?.email || !currentUser.id){
            return new NextResponse("Unauthorized", {status:401});
        }
        const {conversationId} =await params;

        //find the existing conversation
        const conversation = await prisma.conversation.findUnique({
            where:{
                id:conversationId,
            },
            include:{
                messages:{
                    include:{
                        seen:true,
                    }
                }
            }
        });
        if(!conversation){
            return new NextResponse("invalid id",{status:400});
        }

        //get the last message
        const lastMessage = conversation.messages[conversation.messages.length-1];

        if(!lastMessage){
            return NextResponse.json(conversation)
        };
        //update the seen list

        const updatedMessage = await prisma.message.update({
            where:{
                id:lastMessage.id,
            },
            include:{
                seen:true,
                sender:true,

            },
            data:{
                seen:{
                    connect:{
                        id:currentUser.id,
                    }
                }
            }
        });
        //updated conversation realtime
        await pusherServer.trigger(currentUser.email,"conversation:update",{
            id:conversationId,
            messages:[updatedMessage]
        })

        if(lastMessage.seenIds.indexOf(currentUser.id) !==-1){
          return NextResponse.json(conversation);
        }
       await pusherServer.trigger(conversationId,"message:update",
         updatedMessage
       );

        return NextResponse.json(updatedMessage);
        
    } catch (error) {
        console.log("error in seen route",error);
        return new NextResponse("Internal Server Error",{status
        :500});
    }
    
}

