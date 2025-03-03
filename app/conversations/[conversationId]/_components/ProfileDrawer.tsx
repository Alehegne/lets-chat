"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Conversation, User } from "@prisma/client";
import clsx from "clsx";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import useOtherUser from "@/app/hooks/useOtherUser";
import { format, formatDate } from "date-fns";
import { IoIosClose } from "react-icons/io";
import Avatar from "@/components/Avatar";

import axios from "axios";
import useConversation from "@/app/hooks/useConversation";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import DeleteConfirm from "./DeleteConfirm";
import AvatarGroup from "@/components/AvatarGroup";
import { CiLocationArrow1 } from "react-icons/ci";

interface ProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  data: Conversation & {
    users: User[];
  };
}

const ProfileDrawer: React.FC<ProfileDrawerProps> = ({
  isOpen,
  onClose,
  data,
}) => {
  const otherUser = useOtherUser(data);
  const { conversationId } = useConversation();
  const [isLoading, setIsLoading] = useState(false);
  const [send, setSend] = useState(false);
  const router = useRouter();
  //just to delay the closing of the dialog
  const joinedDate = useMemo(() => {
    return format(new Date(data.createdAt), "PP");
  }, [data.createdAt]);
  const title = useMemo(() => {
    return data?.name || otherUser?.name;
  }, [data.name, otherUser.name]);

  const statusText = useMemo(() => {
    if (data.isGroup) {
      return `${data.users.length} members`;
    }
    return "Active";
  }, [data.users.length, data.isGroup]);

  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [onClose]);

  const onDelete = useCallback(() => {
    setIsLoading(true);
    console.log("wait, deleting...");
    axios
      .delete(`/api/conversations/${conversationId}`)
      .then(() => {
        toast.success("successfully deleted!");
        router.push("/conversations");
        router.refresh();
      })
      .catch(() => toast.error("something went wrong!"))
      .finally(() => {
        setIsLoading(false);
      });
  }, [conversationId, router]);

  //create a private conversations
  const handleClick = useCallback(
    (userId: string) => {
      setSend(true);
      setIsLoading(true);

      axios
        .post(`/api/conversations`, {
          userId: userId,
        })
        .then((data) => {
          router.push(`/conversations/${data.data.id}`);
        })
        .catch((error) => {
          toast.error("something went wrong!");
          console.error("error in the userBox conversations", error);
        })
        .finally(() => {
          setIsLoading(false);
          setSend(false);
        });
    },
    [router]
  );

  return (
    <>
      <AnimatePresence>
        <motion.div
          ref={drawerRef}
          initial={{ x: "100%" }}
          animate={{ x: isOpen ? 0 : "100%" }}
          exit={{ x: "100%" }}
          transition={{ duration: 0.1 }}
          className={clsx(
            "fixed  right-0 h-full w-[80%] md:w-1/2 lg:w-1/3  inset-y-0 top-[69px] md:top-[74px] bg-gray-300 border-l-2  shadow-gray-900 dark:bg-gray-800 z-[49] shadow-lg",
            isOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          <div className="w-full h-full p-4">
            <div className="flex flex-col gap-4 items-center pl-8 pr-2">
              <div className="w-full flex justify-end items-center">
                <div className="bg-gray-200 h-7 w-7 flex items-center justify-center rounded-full hover:bg-gray-100 dark:bg-gray-500 dark:hover:bg-gray-600">
                  <IoIosClose
                    onClick={onClose}
                    size={40}
                    className="text-gray-900 hover:scale-105 active:scale-100 dark:text-gray-300"
                  />
                </div>
              </div>
              <div className="flex flex-col w-full justify-center items-center">
                <div className="flex flex-col items-center">
                  {data.isGroup ? (
                    <AvatarGroup users={data.users} />
                  ) : (
                    <Avatar currentUser={otherUser} />
                  )}
                  <h3 className="font-semibold text-xl">{title}</h3>
                  <p className="text-xs font-light text-opacity-80">
                    {statusText}
                  </p>
                  {data.isGroup && (
                    <span className="text-sm font-normal opacity-75">
                      Created at: {formatDate(new Date(data.createdAt), "PPPP")}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-col w-full justify-center items-center">
                <div className="flex flex-col items-center">
                  <DeleteConfirm
                    isLoading={isLoading}
                    onDelete={onDelete}
                    name={otherUser.name!}
                  />
                  <p className="opacity-65 font-normal">Delete</p>
                </div>
              </div>
              {data.isGroup && (
                <div className="w-full flex flex-col">
                  <h1 className="font-medium text-sm text-gray-800 mb-8 dark:text-gray-200">
                    Group Members
                  </h1>
                  <div className="flex  w-full border-b-2 border-b-gray-800/12 py-2 mb-2">
                    <div
                      style={{ scrollbarWidth: "none" }}
                      className="w-1/2 overflow-hidden"
                    >
                      <h1 className="leading-7 font-semibold text-sm">Name</h1>
                    </div>
                    <div
                      style={{ scrollbarWidth: "none" }}
                      className="w-1/2 overflow-hidden"
                    >
                      <p className="leading-7 font-semibold text-sm">Email</p>
                    </div>
                  </div>
                  <div
                    style={{ scrollbarWidth: "thin", scrollbarColor: "gray" }}
                    className="overflow-y-scroll w-full h-[270px]"
                  >
                    {data.users.map((user) => (
                      <div
                        onClick={() => handleClick(user.id)}
                        key={user.id}
                        className="flex group relative gap-2 hover:bg-gray-200 dark:hover:bg-gray-700 p-2 rounded-sm hover:scale-[1.001] transition-all cursor-pointer"
                      >
                        <div
                          style={{ scrollbarWidth: "none" }}
                          className="w-1/2 overflow-scroll "
                        >
                          <h1 className="leading-7">{user.name}</h1>
                        </div>
                        <div
                          style={{ scrollbarWidth: "none" }}
                          className="w-1/2 overflow-scroll"
                        >
                          <p className="leading-7">{user.email}</p>
                        </div>
                        <AnimatePresence>
                          <div className="hidden absolute  h-full left-[40%] transition-all top-[25%] group-hover:flex">
                            <motion.div
                              initial={{ y: 10, x: 0 }}
                              whileInView={{ y: 0, x: send ? 1000 : 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <CiLocationArrow1
                                size={32}
                                className="text-blue-700 dark:text-white"
                              />
                            </motion.div>
                          </div>
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {!data.isGroup && (
                <>
                  <div className="flex w-full flex-col">
                    <dl>
                      <dt className="opacity-80 text-sm">Email</dt>
                      <dd className="font-semibold opacity-75">
                        {otherUser.email}
                      </dd>
                    </dl>
                  </div>
                  <div className="border-t-2 w-full border-gray-600 border-opacity-50 dark:border-gray-500" />
                  <div className="flex w-full flex-col">
                    <dl>
                      <dt className="opacity-80 text-sm">Joined</dt>
                      <time
                        datatype={joinedDate}
                        className="font-semibold opacity-75"
                      >
                        {joinedDate}
                      </time>
                    </dl>
                  </div>
                </>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  );
};

export default ProfileDrawer;
