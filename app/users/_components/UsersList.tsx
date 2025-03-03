"use client";
import { User } from "@prisma/client";
import React from "react";
import UserBox from "./UserBox";

interface UsersListProps {
  users: User[];
}

const UsersList: React.FC<UsersListProps> = ({ users }) => {
  return (
    <aside
      style={{
        scrollbarGutter: "thin",
        scrollbarWidth: "none",
        scrollBehavior: "smooth",
        scrollbarColor: "#c5cddb #d7dae0",
      }}
      className="fixed inset-y-0 pb-20 lg:pb-0 bg-gray-300 dark:bg-gray-800 text-gray-800 dark:text-gray-50 lg:left-20 lg:w-80 overflow-y-auto border-r border-gray-200 block w-full left-0"
    >
      <div className="px-5">
        <div className="flex-col">
          <div className="text-2xl font-bold py-4">People</div>
        </div>
        {users?.map((user) => (
          <UserBox key={user.id} user={user} />
        ))}
      </div>
    </aside>
  );
};

export default UsersList;
