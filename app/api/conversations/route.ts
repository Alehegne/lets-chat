import getCurrentUser from "@/app/actions/getUser";
import prisma from "@/lib/database/prismaClient";
import { pusherServer } from "@/lib/pusher";
import { NextResponse } from "next/server";


export async function POST(req:Request){
   
    try {

        const user = await getCurrentUser();
        const body = await req.json();
        const {
         userId,
         isGroup,
         name,
         members,
         groupImage
        } = body;

        //user is not logged in
        if(!user?.id || !user?.email){
            return new NextResponse('unauthorized', {status:401});
        }

        if(isGroup && (!name || !members || members.length < 2)){
            return new NextResponse('invalid data', {status:400});

        }

        if(isGroup){
         const newConversation = await prisma.conversation.create({
            data:{
               name,
               isGroup,
               groupImage,
               users:{
                  connect:[
                    ...members.map((member:{value:string})=>({
                        id:member.value
                    })),
                    {
                        id:user.id
                    }
                  ]
               }
            },
            include:{
                users:true
            }
         });

        //for each member of the group, send a pusher notification in the newConversation channel
         newConversation.users.forEach(async(member)=>{
            if(member.email){
                await pusherServer.trigger(member.email!,"conversation:new",newConversation);

            }
         })

        
         return NextResponse.json(newConversation);
        }

        
        const existingConversations = await prisma.conversation.findMany({
            where:{
                /*
                // Database record:
                { userIds: ["userA", "userB"] }
                // Query:
                { userIds: { equals: ["userB", "userA"] } } ❌ No match
                { OR: [ { userIds: { equals: ["userA", "userB"] } }, { userIds: { equals: ["userB", "userA"] } } ] } ✅ Matches

                 */
                OR:[
                    {
                        userIds:{
                            equals:[user.id, userId]
                        }
                    },
                    {
                        userIds:{
                            equals:[userId, user.id]
                        }
                    }
                ]
            }
        });

        const singleConversation = existingConversations[0];
        if(singleConversation){
            return NextResponse.json(singleConversation);
        }

        const newConversation = await prisma.conversation.create({
            data:{
                users:{
                    connect:[
                        {
                            id:user.id
                        },
                        {
                            id:userId
                        }
                    ]
                }
            },
            include:{
                users:true
            }
        });

        newConversation.users.map(async(user)=>{
            if(user.email){
                await pusherServer.trigger(user.email,"conversation:new",newConversation);
            }
        });
        return NextResponse.json(newConversation);



        
    } catch (error) {
   console.log("error in the conversation api", error);
        return new NextResponse('internal server error', {status:500});
        
    }
}

// model Conversation {
//     id            String   @id @default(auto()) @map("_id") @db.ObjectId
//     createdAt     DateTime @default(now())
//     lastMessageAt DateTime @default(now())
//     name          String?
//     isGroup       Boolean  @default(false)
  
//     messageIds String[]  @db.ObjectId
//     messages   Message[]
  
//     userIds String[] @db.ObjectId
//     users   User[]   @relation(fields: [userIds], references: [id])
  
//     @@index([createdAt]) // Sorting conversations by date will be much faster
//   }