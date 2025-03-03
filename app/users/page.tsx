// import { getServerSession } from "next-auth";
import React from "react";
// import { authOptions } from "../api/auth/[...nextauth]/route";
import EmptyState from "@/components/EmptyState";

const Users = async () => {
  return (
    <div className="hidden  lg:block  pl-80 h-full">
      <EmptyState />
    </div>
  );
};

export default Users;
