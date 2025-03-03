import prisma from "@/lib/database/prismaClient";
import { getSession } from "./getSession";


export default async function getUsers() {

    const session = await getSession();

    console.log("session in getuser", session);

    if(!session?.user?.email){
        return null;
    }

    try {

        const users = await prisma.user.findMany({
            orderBy:{
                createdAt:'desc',
            },
            where:{
                NOT:{
                    email:session.user.email
                }
            }

        })

        return users;
        
    } catch (error) {
        console.log("error", error);
        return null;
    }
}