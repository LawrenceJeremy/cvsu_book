import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BookOpen, Plus } from "lucide-react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CvSU Bacoor Library",
  description:
    "Efficiently organize, track, and manage books, borrowers, and transactions with an easy-to-use library management solution. Automate cataloging, monitor inventory, handle book lending and returns, and generate reports to streamline daily library operations and improve user experience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <nav className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50 sticky top-0 z-40">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            {/* Left: Logo / Brand */}
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-500/10 ring-1 ring-emerald-500/40">
                <Avatar>
                  <AvatarImage src="/icon.ico" />
                </Avatar>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold tracking-tight ">
                  Cavite state University Bacoor
                </span>
                <span className="text-[11px] ">
                  Library
                </span>
              </div>
            </Link>

            {/* Right: Links + CTA */}
            <div className="flex items-center gap-3">
              <Link href="/add-book">
                <Button
                  size="sm"
                  className="flex items-center gap-1 rounded-full border border-emerald-500/60 bg-emerald-500/10 px-3 text-[11px] font-medium text-emerald-300 shadow-sm shadow-emerald-900/40 transition hover:bg-emerald-500/30 hover:text-emerald-50 hover:shadow-emerald-700/60"
                >
                  <Plus className="h-3.5 w-3.5" />
                  New book
                </Button>
              </Link>
            </div>
          </div>
        </nav>

        {children}
        <Toaster />
      </body>
    </html>
  );
}
