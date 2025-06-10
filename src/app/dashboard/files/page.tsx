import { Suspense } from 'react';
import { FileBrowserSkeleton } from "../_components/file-browser-skeleton";
import { FileBrowserContent } from "./_components/file-browser-content";

export default function FilesPage() {
  return (
    <div>
      <Suspense fallback={<FileBrowserSkeleton />}>
        <FileBrowserContent />
      </Suspense>
    </div>
  );
}