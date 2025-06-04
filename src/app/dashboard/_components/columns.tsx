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
    <div className="flex items-center justify-center w-full h-full">
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
    header: () => (
      <div className="flex flex-col items-center">
        <span>Type</span>
      </div>
    ),
    cell: ({ row }) => <div className="flex flex-col items-center w-full h-full"><FileTypeCell type={row.original.type} /></div>,
  },
  {
    header: "User",
    cell: ({ row }) => {
      return <UserCell userId={row.original.userId} />;
    },
  },
  {
    accessorKey: "_creationTime",
    header: () => <span className="pl-2">Uploaded On</span>,
    cell: ({ row }) => {
      return (
        <div className="flex items-center h-full w-full pl-2">
          <span className="text-gray-400 text-xs">
            {formatRelative(new Date(row.original._creationTime), new Date())}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "actions",
    header: () => (
      <div className="flex flex-col items-center">
        <span>Actions</span>
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex flex-col items-center w-full h-full">
        <FileCardActions
          file={row.original}
          isFavorited={row.original.isFavorited}
        />
      </div>
    ),
  },
];