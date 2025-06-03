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
    <header className="sticky top-0 z-20 w-full bg-white/80 backdrop-blur border-b border-gray-200 shadow-sm">
      <nav className="container mx-auto flex items-center justify-between py-3 px-2">
        <Link href="/" className="flex items-center gap-2 text-xl font-semibold text-gray-900">
          <Image src="/logo.png" width={40} height={40} alt="file drive logo" />
          FileDrive
        </Link>
        <div className="flex items-center gap-3">
          <SignedIn>
            <Button variant="outline" size="sm">
              <Link href="/dashboard/files">Your Files</Link>
            </Button>
          </SignedIn>
          <OrganizationSwitcher />
          <UserButton />
          <SignedOut>
            <SignInButton>
              <Button size="sm">Sign In</Button>
            </SignInButton>
          </SignedOut>
        </div>
      </nav>
    </header>
  );
}