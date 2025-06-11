"use client";

import { FileBrowser } from "../../_components/file-browser";
import { usePathname, useSearchParams } from 'next/navigation';
import { useOrganization } from "@clerk/nextjs";

export function FileBrowserContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { organization } = useOrganization();
  
  // Create a unique key based on the current route
  const routeKey = `${pathname}?${searchParams.toString()}`;
  
  // Set title based on whether in organization or personal view
  const title = organization?.name ? `${organization.name}'s Files` : 'Your Files';

  return (
    <FileBrowser 
      title={title}
      key={routeKey} // This will force a remount when route changes
    />
  );
}
