import {create} from "zustand"
import getMessages from "../actions/getMessages"


const useMessages = create((set) => ({
    messages: [],
    fetchMessage: async (id:string) =>{
        const response = await getMessages(id);
        set({messages: response})
    },

    addMessage:(message)=>(state)=>({
        messages:[...state.conversations,message]
    })
}))

export default useMessages