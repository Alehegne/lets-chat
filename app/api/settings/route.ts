import getCurrentUser from "@/app/actions/getUser";
import prisma from "@/lib/database/prismaClient";
import {  NextResponse } from "next/server";

export async function POST(req:Request) {

    try {
        const body = await req.json();
        const {
            name,
            image
        } = body;
        const currentUser = await getCurrentUser();
        if(!currentUser?.id || !currentUser?.email){
            return new NextResponse("unauthorized",{status:401})
        }
    
    
        //update the user model
    
        const updatedUserInfo = await prisma.user.update({
            where:{
                id:currentUser.id
            },
            data:{
                name:name || currentUser.name,
                image:image
            }
        })
    
        return NextResponse.json(updatedUserInfo);
        
    } catch (error) {
        console.log("error inside settings",error)
        return new NextResponse("internal server error",{status:500})
    }


}