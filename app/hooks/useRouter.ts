"use client";
import { usePathname } from "next/navigation"
import useConversation from "./useConversation";
import { useMemo } from "react";
import { signOut } from "next-auth/react";
import { HiChat, HiUser, HiCog } from "react-icons/hi";
import { HiArrowLeftOnRectangle } from "react-icons/hi2";



const useRoutes = () => {

    const pathName = usePathname();

    const {conversationId} = useConversation();

    const routes = useMemo(()=>[
        {
            label:"Chat",
            href:"/conversations",
            icon:HiChat,
            active:pathName === '/conversations' || !!conversationId
        },
        {
            label:"Users",
            href:"/users",
            icon:HiUser,
            active:pathName === '/users'
        },
        {
            label:"Settings",
            href:"/settings",
            icon:HiCog,
            active:pathName === '/settings'
        },
        {
            label:"Logout",
            href:"#",
            onClick:()=>signOut(),
            icon:HiArrowLeftOnRectangle,
            
        }
        
    ],[pathName,conversationId])

    return routes;
}

export default useRoutes;