import { Button } from "@/components/ui/button";
import {
  OrganizationSwitcher,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-20 w-full bg-white/10 backdrop-blur-md shadow-md border-b border-white/10">
      <nav className="max-w-6xl mx-auto flex items-center justify-between py-3 px-4">
        <Link href="/" className="flex items-center gap-3 text-2xl font-bold text-white tracking-tight">
          <span className="bg-gradient-to-r from-cyan-400 to-teal-500 bg-clip-text text-transparent">
            <Image src="/logo.png" width={100} height={100} alt="file drive logo" className="rounded-xl" />
          </span>
          {/* FileDrive */}
        </Link>
        <div className="flex items-center gap-3">
          <SignedIn>
            <Button variant="outline" size="sm" className="bg-white/20 border-white/20 text-white hover:bg-white/30">
              <Link href="/dashboard/files">Your Files</Link>
            </Button>
          </SignedIn>
          <OrganizationSwitcher />
          <UserButton />
          <SignedOut>
            <SignInButton>
              <Button size="sm" className="bg-white/20 border-white/20 text-white hover:bg-white/30">Sign In</Button>
            </SignInButton>
          </SignedOut>
        </div>
      </nav>
    </header>
  );
}