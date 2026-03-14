import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ReadFlow",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <section className="auth-container">{children}</section>;
}
