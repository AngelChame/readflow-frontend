import "./globals.css";
import {Inter} from 'next/font/google'

const inter =  Inter ({
    subsets: ['latin'],
    display: 'swap'
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={inter.className}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}