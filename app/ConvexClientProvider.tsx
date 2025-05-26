"use client";

import { useAuth } from "@clerk/nextjs";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ReactNode } from "react";
import { ClerkProvider } from "@clerk/nextjs";

// Create the Convex client
const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  // Get the publishable key from environment variables
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  
  if (!publishableKey) {
    console.error("Missing NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY environment variable");
  }
  
  return (
    <ClerkProvider publishableKey={publishableKey!}>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        {children}
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}
