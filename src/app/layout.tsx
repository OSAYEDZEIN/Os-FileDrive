import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ConvexClientProvider from "./ConvexClientProvider";
import { Header } from "./header";
import { Toaster } from "sonner";
import { Footer } from "./footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Os-FileDrive",
  description: "Os-FileDrive is a file storage service that allows you to store and manage your files in the cloud.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className + " min-h-screen bg-gradient-to-br from-teal-500 via-teal-600 to-cyan-700"}>
        <ConvexClientProvider>
          <Toaster />
          <Header />
          {children}
          <Footer />
        </ConvexClientProvider>
      </body>
    </html>
  );
}