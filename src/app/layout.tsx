import { Navbar } from "@/components/Navbar";
import { site } from "@/siteConfig";
import "@/styles/globals.css";
import { Toaster } from "@/components/ui/toaster";

import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: site.name,
  description: site.description,
  icons: [{ rel: "icon", url: "/notebook.svg" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable}`} suppressHydrationWarning>
        <Navbar />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
