"use client";

import { Button } from "@/components/ui/button";
import clsx from "clsx";
import { FileIcon, StarIcon, TrashIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function SideNav() {
  const pathname = usePathname();

  const navItems = [
    {
      href: "/dashboard/files",
      label: "All Files",
      icon: FileIcon,
      active: pathname.includes("/dashboard/files"),
    },
    {
      href: "/dashboard/favorites",
      label: "Favorites",
      icon: StarIcon,
      active: pathname.includes("/dashboard/favorites"),
    },
    {
      href: "/dashboard/trash",
      label: "Trash",
      icon: TrashIcon,
      active: pathname.includes("/dashboard/trash"),
    },
  ];

  return (
    <aside className="w-full md:w-60 lg:w-72 flex-shrink-0">
      <div className="sticky top-6 flex flex-col gap-3 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl shadow-lg p-4 text-white">
        <div className="px-2 py-4 mb-2">
          <h2 className="text-xl font-bold text-white">FileDrive</h2>
          <p className="text-sm text-white/60">Your workspace</p>
        </div>
        
        <div className="flex flex-col gap-1">
          {navItems.map(({ href, label, icon: Icon, active }) => (
            <Link href={href} key={href} className="w-full">
              <Button
                variant={active ? "default" : "ghost"}
                className={clsx(
                  "flex gap-3 w-full justify-start items-center transition-all text-base font-medium",
                  {
                    "bg-gradient-to-r from-cyan-500/20 to-teal-500/20 border border-white/10 text-white shadow-lg hover:shadow-cyan-500/20": active,
                    "hover:bg-white/10 hover:text-white text-white/80": !active,
                    "bg-transparent": !active,
                    "h-12 rounded-xl": true
                  }
                )}
              >
                <Icon className={clsx("w-5 h-5", {
                  "text-cyan-400": active,
                  "text-white/60 group-hover:text-white": !active
                })} />
                <span>{label}</span>
              </Button>
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}