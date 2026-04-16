import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ReadFlow — Admin",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
