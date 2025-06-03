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
    <aside className="w-48 flex flex-col gap-2 bg-white border border-gray-200 rounded-xl shadow-sm py-6 px-2">
      {navItems.map(({ href, label, icon: Icon, active }) => (
        <Link href={href} key={href}>
          <Button
            variant={active ? "default" : "ghost"}
            className={clsx(
              "flex gap-2 w-full justify-start items-center transition-colors",
              {
                "pointer-events-none": active,
                "hover:bg-gray-200": !active,
              }
            )}
          >
            <Icon className="w-5 h-5 text-inherit" />
            {label}
          </Button>
        </Link>
      ))}
    </aside>
  );
}