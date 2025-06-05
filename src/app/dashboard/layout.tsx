import { SideNav } from "./side-nave";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="w-full min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="w-full max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row gap-12">
          <div className="md:w-56 lg:w-64 shrink-0">
            <SideNav />
          </div>
          <div className="flex-1 min-w-0">
            <div className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 shadow-xl p-8 sm:p-10 lg:p-12 min-h-[calc(100vh-8rem)] transition-all duration-200">
              {children}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}