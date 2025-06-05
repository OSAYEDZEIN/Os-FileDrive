"use client";

import { FileBrowser } from "../_components/file-browser";
import { usePathname, useSearchParams } from 'next/navigation';

export default function FilesPage() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Create a unique key based on the current route
  const routeKey = `${pathname}?${searchParams.toString()}`;

  return (
    <div>
      <FileBrowser 
        title="Your Files" 
        key={routeKey} // This will force a remount when route changes
      />
    </div>
  );
}