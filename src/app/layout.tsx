import { Inter } from "next/font/google";
import "./globals.css";

import { Providers } from "./theme-provider";
import NextTopLoader from "nextjs-toploader";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased`}>
        <Providers>
            <NextTopLoader color="#5B6AEB" showSpinner={false} />
            {children}
        </Providers>
      </body>
    </html>
  );
}