import PusherServer from "pusher";
import PusherClient from "pusher-js";


export const pusherServer = new PusherServer({
    appId:process.env.NEXT_PUBLIC_PUSHER_APP_ID!,
    key:process.env.NEXT_PUBLIC_PUSHER_KEY!,
    secret:process.env.NEXT_PUBLIC_PUSHER_SECRET!,
    cluster:"mt1",
    useTLS:true

})

export const pusherClient = new PusherClient(
    process.env.NEXT_PUBLIC_PUSHER_KEY!,{
       cluster:'mt1'
    }
)

// pusherServer.trigger("channel","event",{message:"hello"})//this will trigger

// // trigger(
// //     channel: string | Array<string>,
// //     event: string,
// //     data: any,
// //     params?: Pusher.TriggerParams
// //   ): Promise<Response>
