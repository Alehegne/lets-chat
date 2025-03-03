import type { Metadata } from "next";
import "./globals.css";
import NextThemeProvider from "@/app/context/nextThemeProvider";
import ThemeChanger from "@/components/shared/ThemeToggler";
import ToasterContext from "./context/ToasterContext";
import AuthContext from "./context/AuthContext";

export const metadata: Metadata = {
  title: "lets chat",
  description: "lets chat",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AuthContext>
          <NextThemeProvider>
            <ThemeChanger />
            {children}
            <ToasterContext />
          </NextThemeProvider>
        </AuthContext>
      </body>
    </html>
  );
}
