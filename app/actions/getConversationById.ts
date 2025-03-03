import prisma from "@/lib/database/prismaClient";
import getCurrentUser from "./getUser"



const getConversationById = async(conversationId:string) => {
 
    try {

        const currentUser = await getCurrentUser();
        if(!currentUser) return null

        const conversation = await prisma.conversation.findUnique({
            where:{
                id:conversationId
            },
            include:{
                users:true,
            }
        });

        return conversation  
    } catch (error) {
        console.log("error in getConversationById", error)
        return null
    }
}

export default getConversationById