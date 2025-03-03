import { NextResponse } from "next/server";
import bcrypt from "bcrypt"
import prisma from "@/lib/database/prismaClient";



export async function POST(req:Request) {
    // console.log("req in register",req)
try {
    
    const body =await req.json();

    const {
        name,
        password,
        email
    } = body;

    if(!name || !password || !email){
        return new NextResponse("missing information",{status:400})
    }
    //check if the user already exists
    const existingUser = await prisma.user.findUnique({
        where:{
            email
        }
    });

    if(existingUser){
        return new NextResponse("user already exists,please log in",{status:400})
    }


    const hashedPassword = await bcrypt.hash(password,12);

    const createdUser = await prisma.user.create({
        data:{
            name,
            hashedPassword,
            email
        }
    })

    return NextResponse.json(createdUser)

} catch (error) {
     console.log("errror in registration user",error)

     return new NextResponse("error in registration",{status:500})
}
}