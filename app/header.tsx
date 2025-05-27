'use client';

import {
  OrganizationSwitcher,
  SignInButton,
  SignOutButton,
  UserButton,
  useAuth,
} from '@clerk/nextjs';
import { Button } from '@/components/ui/button';

export function Header() {
  const { isSignedIn } = useAuth();

  return (
    <header className="border-b bg-background text-foreground shadow-sm">
      <div className="container mx-auto flex items-center justify-between py-4">
        <div className="text-xl font-semibold">FileDrive</div>

        <div className="flex items-center gap-4">
          {isSignedIn ? (
            <>
              <OrganizationSwitcher />
              <UserButton />
              <SignOutButton>
                <Button variant="outline">Sign Out</Button>
              </SignOutButton>
            </>
          ) : (
            <SignInButton>
              <Button>Sign In</Button>
            </SignInButton>
          )}
        </div>
      </div>
    </header>
  );
}
