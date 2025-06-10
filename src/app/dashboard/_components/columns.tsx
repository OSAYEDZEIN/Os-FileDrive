"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Doc, Id } from "../../../../convex/_generated/dataModel";
import { formatDistanceToNow } from "date-fns";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FileCardActions } from "./file-actions";
import { FileText, Image as ImageIcon, FileSpreadsheet, FileArchive, FileCode, FileAudio, FileVideo } from "lucide-react";
import { cn } from "@/lib/utils";

function UserCell({ userId }: { userId: Id<"users"> }) {
  const userProfile = useQuery(api.users.getUserProfile, {
    userId: userId,
  });
  
  return (
    <div className="flex items-center gap-2 group">
      <Avatar className="w-6 h-6 border">
        <AvatarImage src={userProfile?.image} className="object-cover" />
        <AvatarFallback className="bg-muted text-xs">
          {userProfile?.name?.charAt(0).toUpperCase() || 'U'}
        </AvatarFallback>
      </Avatar>
      <span className="text-sm text-foreground/80 group-hover:text-foreground transition-colors truncate">
        {userProfile?.name || 'Unknown User'}
      </span>
    </div>
  );
}

function FileTypeCell({ type, size = 'md' }: { type: Doc<"files">["type"], size?: 'sm' | 'md' }) {
  const iconClass = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';
  
  const icons: Record<string, React.ReactNode> = {
    image: <ImageIcon className={`${iconClass} text-blue-500`} />,
    pdf: <FileText className={`${iconClass} text-red-500`} />,
    csv: <FileSpreadsheet className={`${iconClass} text-emerald-500`} />,
    docx: <FileText className={`${iconClass} text-blue-400`} />,
    zip: <FileArchive className={`${iconClass} text-amber-500`} />,
    code: <FileCode className={`${iconClass} text-purple-500`} />,
    audio: <FileAudio className={`${iconClass} text-pink-500`} />,
    video: <FileVideo className={`${iconClass} text-rose-500`} />,
  };

  const typeLabels: Record<string, string> = {
    image: 'Image',
    pdf: 'PDF',
    csv: 'Spreadsheet',
    docx: 'Document',
    zip: 'Archive',
    code: 'Code',
    audio: 'Audio',
    video: 'Video',
  };

  return (
    <div className="flex items-center gap-2">
      <div className={cn(
        "flex items-center justify-center rounded-lg p-1.5",
        "bg-muted/50 border border-border"
      )}>
        {icons[type] || <FileText className={`${iconClass} text-gray-400`} />}
      </div>
      {size === 'md' && (
        <span className="text-sm text-foreground/80">
          {typeLabels[type] || 'File'}
        </span>
      )}
    </div>
  );
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export const columns: ColumnDef<
  Doc<"files"> & { url: string | null; isFavorited: boolean; size?: number }
>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const file = row.original;
      return (
        <div className="flex items-center gap-3 group">
          <FileTypeCell type={file.type} size="sm" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-medium text-foreground group-hover:text-primary transition-colors truncate">
                {file.name}
              </span>
            </div>
            {file.size !== undefined && (
              <div className="text-xs text-muted-foreground mt-0.5">
                {formatFileSize(file.size)}
              </div>
            )}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => (
      <FileTypeCell type={row.original.type} />
    ),
  },
  {
    id: "user",
    header: "Uploaded By",
    cell: ({ row }) => <UserCell userId={row.original.userId} />,
  },
  {
    accessorKey: "_creationTime",
    header: "Uploaded",
    cell: ({ row }) => {
      const date = new Date(row.original._creationTime);
      return (
        <div className="text-sm text-foreground/80">
          {formatDistanceToNow(date, { addSuffix: true })}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => (
      <div className="flex justify-end">
        <FileCardActions
          file={row.original}
          isFavorited={row.original.isFavorited}
          className="opacity-0 group-hover:opacity-100 transition-opacity"
        />
      </div>
    ),
  },
];