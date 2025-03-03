import prisma from "@/lib/database/prismaClient"


const getMessages = async(conversationId:string) => {
 

    try {

        const messages = await prisma.message.findMany({
            where:{
                conversationId:conversationId
            },
            include:{
                sender:true,
                seen:true
            },
            orderBy:{
                createdAt:"asc"
            }
        });

        return messages
        
    } catch (error) {
        console.log("error in getMessages", error)
        return null
    }
}

export default getMessages
