import SideBar from "@/components/sidebar/SideBar";
import getUsers from "../actions/getUsers";
import UsersList from "@/app/users/_components/UsersList";

export default async function UsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const users = await getUsers();

  // console.log("users in users layout", users);
  return (
    <SideBar>
      <UsersList users={users!} />
      <div className="h-full">{children}</div>
    </SideBar>
  );
}
