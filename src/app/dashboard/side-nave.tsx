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
    <aside className="w-56 flex flex-col gap-4 bg-white/20 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg py-8 px-4 text-white">
      {navItems.map(({ href, label, icon: Icon, active }) => (
        <Link href={href} key={href} className="w-full">
          <Button
            variant={active ? "default" : "ghost"}
            className={clsx(
              "flex gap-3 w-full justify-start items-center transition-colors text-lg font-semibold",
              {
                "pointer-events-none bg-white text-gray-900 shadow-md": active,
                "hover:bg-white/30 hover:text-white": !active,
                "bg-transparent text-white": !active
              }
            )}
          >
            <Icon className="w-6 h-6 text-inherit" />
            {label}
          </Button>
        </Link>
      ))}
    </aside>
  );
}