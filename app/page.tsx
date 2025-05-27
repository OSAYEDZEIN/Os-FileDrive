"use client";

import { Button } from "@/components/ui/button";

import { 
  SignedIn,
  SignedOut, 
  SignInButton, 
  SignOutButton, 
  useOrganization,
  useUser
} from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function Home() {
  const organization = useOrganization();
  const user = useUser();

  // Fixed the TypeScript syntax error here
  let orgId: string | undefined = undefined;
  if(organization.isLoaded && user.isLoaded){
    orgId = organization.organization?.id ?? user.user?.id;
  }

  // Use 'skip' instead of undefined to match the expected parameter type
  const files = useQuery(api.files.getFiles, orgId ? { orgId } : "skip");
  const createFile = useMutation(api.files.createFile);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {files?.map((file) => {
        return <div key={file._id}>
          {file.name}
        </div>;
      })}
      
      <Button 
        className="bg-[#0f1729] text-black hover:bg-[#1a2540] px-6"
        onClick={() => {
          if(!orgId) return;
          createFile({
            name: "hello world",
            orgId,
          });
        }}
      >
        Click Me
      </Button>
    </main>
  );
}
