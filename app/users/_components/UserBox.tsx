import Avatar from "@/components/Avatar";
import LoadingModal from "@/components/LoadingModal";
import { User } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useCallback } from "react";

interface UserProps {
  user: User;
}

const UserBox: React.FC<UserProps> = ({ user }) => {
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  const handleClick = useCallback(() => {
    setLoading(true);

    axios
      .post(`/api/conversations`, {
        userId: user.id,
      })
      .then((data) => {
        router.push(`/conversations/${data.data.id}`);
      })
      .catch((error) => {
        console.error("error in the userBox conversations", error);
      })
      .finally(() => setLoading(false));
  }, [user, router]);

  return (
    <>
      {loading && <LoadingModal />}
      <div
        onClick={handleClick}
        className="w-full mb-2 relative flex items-center  space-x-3  shadow-md shadow-gray-500 dark:shadow-gray-800 dark:ring-2 dark:ring-gray-700 p-3 hover:bg-gray-400/35 dark:hover:bg-gray-700/60 rounded-lg transition cursor-pointer"
      >
        <Avatar currentUser={user} />
        <div className="min-w-0 flex-1">
          <div className="focus:outline-none">
            <div className="flex justify-between items-center mb-1">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-50">
                {user.name}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserBox;
