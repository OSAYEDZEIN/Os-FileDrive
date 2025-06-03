"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Doc, Id } from "../../../../convex/_generated/dataModel";
import { formatRelative } from "date-fns";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FileCardActions } from "./file-actions";
import { FileTextIcon, GanttChartIcon, ImageIcon } from "lucide-react";
import Image from "next/image";

function UserCell({ userId }: { userId: Id<"users"> }) {
  const userProfile = useQuery(api.users.getUserProfile, {
    userId: userId,
  });
  return (
    <div className="flex gap-2 text-xs text-gray-700 w-40 items-center">
      <Avatar className="w-6 h-6">
        <AvatarImage src={userProfile?.image} />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      {userProfile?.name}
    </div>
  );
}

function FileTypeCell({ type }: { type: Doc<"files">["type"] }) {
  const icons: Record<string, React.ReactNode> = {
    image: <ImageIcon className="w-5 h-5 text-gray-900" />,
    pdf: <FileTextIcon className="w-5 h-5 text-gray-900" />,
    csv: <GanttChartIcon className="w-5 h-5 text-gray-900" />,
  };
  return (
    <div className="flex items-center justify-center">
      {icons[type] || <FileTextIcon className="w-5 h-5 text-gray-400" />}
    </div>
  );
}

export const columns: ColumnDef<
  Doc<"files"> & { url: string | null; isFavorited: boolean }
>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <span className="font-semibold text-gray-900">{row.original.name}</span>
    ),
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => <FileTypeCell type={row.original.type} />,
  },
  {
    header: "User",
    cell: ({ row }) => {
      return <UserCell userId={row.original.userId} />;
    },
  },
  {
    header: "Uploaded On",
    cell: ({ row }) => {
      return (
        <span className="text-gray-500 text-sm">
          {formatRelative(new Date(row.original._creationTime), new Date())}
        </span>
      );
    },
  },
  {
    header: "Actions",
    cell: ({ row }) => {
      return (
        <div className="flex justify-center">
          <FileCardActions
            file={row.original}
            isFavorited={row.original.isFavorited}
          />
        </div>
      );
    },
  },
];