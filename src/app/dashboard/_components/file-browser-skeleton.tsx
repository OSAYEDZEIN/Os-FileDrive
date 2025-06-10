export function FileBrowserSkeleton() {
  return (
    <div className="animate-pulse p-4">
      <div className="h-8 w-48 bg-gray-200 rounded mb-4"></div>
      <div className="h-12 bg-gray-200 rounded-lg"></div>
      <div className="mt-4 space-y-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-100 rounded-lg"></div>
        ))}
      </div>
    </div>
  );
}
