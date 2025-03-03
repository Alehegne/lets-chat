import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


//eslint-disable-next-line
export function handleError(error: any) {

  if(error instanceof Error){
    console.error(error.message)
    throw new Error(error.message)
  }else{
    console.error(error)
    throw new Error(error)
  }


}
