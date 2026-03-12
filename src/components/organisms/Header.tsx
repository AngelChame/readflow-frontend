import PageTitle from "@/components/molecules/PageTitle";
import UserWidget from "@/components/molecules/UserWidget";
import type { User } from "@/types/api/auth/auth.types";

interface HeaderProps {
  user: User | null;
}

export default function Header({ user }: HeaderProps) {
  return (
    <header className="flex items-center justify-between w-full ">
      <PageTitle />
      <UserWidget name={user?.username ?? "Usuario"} />
    </header>
  );
}
