"use client";

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
import { FileIcon, User, Upload, LogIn } from "lucide-react";
import { useOrganization, useOrganizationList } from "@clerk/nextjs";
import { useRouter, usePathname } from "next/navigation";
import { HeaderUploadButton } from "./dashboard/_components/header-upload-button";
import { cn } from "@/lib/utils";

export function Header() {
  const { organization } = useOrganization();
  const { setActive } = useOrganizationList();
  const router = useRouter();

  const handleBackToPersonal = async () => {
    try {
      // Switch to personal workspace by setting active organization to null
      if (setActive) {
        await setActive({ organization: null });
        // Refresh the page to update the UI
        router.refresh();
      }
    } catch (error) {
      console.error('Error switching to personal account:', error);
    }
  };
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith('/dashboard');

  return (
    <header className="sticky top-0 z-50 w-full bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-b border-white/10 shadow-lg">
      <nav className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative w-auto h-12">
              <Image 
                src="/01.png" 
                alt="FileDrive" 
                width={48}
                height={48}
                className="object-contain h-full w-auto"
                priority
              />
            </div>
            <span className="text-xl font-semibold bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
              FileDrive
            </span>
          </Link>

          {/* Navigation Items */}
          <div className="flex items-center space-x-3">
            <SignedIn>
              <Button 
                asChild
                variant="ghost"
                className={cn(
                  "group flex items-center gap-2 text-white/90 hover:text-white hover:bg-white/10 px-4 py-2 rounded-lg transition-all duration-200",
                  isDashboard && "bg-white/10"
                )}
              >
                <Link href="/dashboard/files" className="flex items-center">
                  <FileIcon className="w-5 h-5 mr-1.5 text-cyan-400 group-hover:scale-110 transition-transform" />
                  <span>Dashboard</span>
                </Link>
              </Button>
              
              <HeaderUploadButton />
              
              <div className="hidden md:flex items-center space-x-2">
                {organization && (
                  <Button 
                    variant="ghost"
                    className="group flex items-center gap-2 text-white/90 hover:text-white hover:bg-white/10 px-4 py-2 rounded-lg transition-all duration-200"
                    onClick={handleBackToPersonal}
                  >
                    <User className="w-5 h-5 text-cyan-400 mr-1.5 group-hover:scale-110 transition-transform" />
                    <span>Personal</span>
                  </Button>
                )}
                <OrganizationSwitcher 
                  hidePersonal={true}
                  appearance={{
                    elements: {
                      organizationSwitcherTrigger: `bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 flex items-center gap-2 h-9 ${organization ? 'bg-white/10' : ''} hover:shadow-md hover:shadow-cyan-500/20`
                    }
                  }}
                />
              </div>
              
              <div className="ml-1">
                <UserButton 
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      userButtonAvatarBox: "w-9 h-9 border-2 border-cyan-400/50 hover:border-cyan-400 transition-all",
                      userButtonPopoverCard: "bg-gray-800 border border-gray-700 shadow-xl shadow-cyan-500/10",
                      userPreviewMainIdentifier: "text-white",
                      userPreviewSecondaryIdentifier: "text-gray-400"
                    }
                  }}
                />
              </div>
            </SignedIn>
            
            <SignedOut>
              <SignInButton mode="modal">
                <Button 
                  size="sm" 
                  className="bg-gradient-to-r from-cyan-500 to-teal-500 text-white hover:from-cyan-600 hover:to-teal-600 shadow-md hover:shadow-lg transition-all duration-200 px-4 py-2 rounded-lg"
                >
                  Sign In
                </Button>
              </SignInButton>
            </SignedOut>
          </div>
        </div>
      </nav>
    </header>
  );
}