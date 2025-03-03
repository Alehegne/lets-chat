import prisma from '@/lib/database/prismaClient';
import bcrypt from 'bcrypt';
import NextAuth, {NextAuthOptions} from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import GithubProvider  from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import Credentials from "next-auth/providers/credentials";




export const authOptions:NextAuthOptions = {

    adapter:PrismaAdapter(prisma),

    providers:[
        GithubProvider({
            clientId:process.env.GITHUB_CLIENT_ID as string,
            clientSecret:process.env.GITHUB_CLIENT_SECRET as string

        }),
        GoogleProvider({
            clientId:process.env.GOOGLE_CLIENT_ID as string,
            clientSecret:process.env.GOOGLE_CLIENT_SECRET as string

        }),
        Credentials({
            name:"Credentials",
            credentials:{
                email:{label:"email",type:"text"},
                password:{label:"password",type:"password"}
            },

            async authorize(credentials){

                //if the credentials is not given
                if(!credentials || !credentials?.email || !credentials?.password){
                   throw new Error("Please provide email and password");
            }
            //if the credentials is given,find the user with the email

            const existingUser = await prisma.user.findUnique({
                where:{
                    email:credentials.email
                }
            });

            if(!existingUser || !existingUser.hashedPassword){
                throw new Error("User not found");
            }
            //check if the password is correct

            const isPasswordMatch = await bcrypt.compare(credentials.password,existingUser.hashedPassword);

            if(!isPasswordMatch){
                throw new Error("Password is incorrect");
            }

            return existingUser;


        }
    })
    ],

 
    debug:process.env.NODE_ENV === "development",

    session:{
        strategy:"jwt",
        
    },
    secret:process.env.NEXTAUTH_SECRET,


}


const handler = NextAuth(authOptions);

export {handler as GET,handler as POST};
