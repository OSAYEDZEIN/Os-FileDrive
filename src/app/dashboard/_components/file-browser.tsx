"use client";
import { useOrganization, useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { UploadButton } from "./upload-button";
import { FileCard } from "./file-card";
import Image from "next/image";
import { GridIcon, Loader2, RowsIcon } from "lucide-react";
import { SearchBar } from "./search-bar";
import { useState } from "react";
import { DataTable } from "./file-table";
import { columns } from "./columns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Doc } from "../../../../convex/_generated/dataModel";
import { Label } from "@/components/ui/label";

function Placeholder({ deletedOnly, favoritesOnly }: { deletedOnly?: boolean; favoritesOnly?: boolean }) {
  let description = "You have no files, upload one now";
  if (deletedOnly) description = "Trash is empty";
  else if (favoritesOnly) description = "You have no favorite files";
  return (
    <div className="flex flex-col gap-8 w-full items-center mt-24">
      <Image
        alt="an image of a picture and directory icon"
        width="300"
        height="300"
        src="/empty.svg"
      />
      <div className="text-2xl text-white">{description}</div>
      {!deletedOnly && !favoritesOnly && <UploadButton />}
    </div>
  );
}

export function FileBrowser({
  title,
  favoritesOnly,
  deletedOnly,
}: {
  title: string;
  favoritesOnly?: boolean;
  deletedOnly?: boolean;
}) {
  const organization = useOrganization();
  const user = useUser();
  const [query, setQuery] = useState("");
  const [type, setType] = useState<Doc<"files">["type"] | "all">("all");

  let orgId: string | undefined = undefined;
  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id;
  }

  const favorites = useQuery(
    api.files.getAllFavorites,
    orgId ? { orgId } : "skip"
  );

  const files = useQuery(
    api.files.getFiles,
    orgId
      ? {
          orgId,
          type: type === "all" ? undefined : type,
          query,
          favorites: favoritesOnly,
          deletedOnly,
        }
      : "skip"
  );
  const isLoading = files === undefined;

  const modifiedFiles =
    files?.map((file) => ({
      ...file,
      isFavorited: (favorites ?? []).some(
        (favorite) => favorite.fileId === file._id
      ),
    })) ?? [];

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-white">{title}</h1>

        <SearchBar query={query} setQuery={setQuery} />

        <UploadButton />
      </div>

      {deletedOnly && (
        <div className="mb-4 p-3 rounded bg-red-100 text-red-600 border border-red-200 text-sm">
           WARNING: Files in Trash will be permanently deleted after 24 hours.
        </div>
      )}

      <Tabs defaultValue="grid">
        <div className="flex justify-between items-center">
          <TabsList className="mb-2">
            <TabsTrigger value="grid" className="flex gap-2 items-center">
              <GridIcon />
              Grid
            </TabsTrigger>
            <TabsTrigger value="table" className="flex gap-2 items-center">
              <RowsIcon /> Table
            </TabsTrigger>
          </TabsList>

          <div className="flex gap-2 items-center">
            <Label htmlFor="type-select" className="text-white">Type Filter</Label>
            <Select
              value={type}
              onValueChange={(newType) => {
                setType(newType as any);
              }}
            >
              <SelectTrigger id="type-select" className="w-[180px] bg-white/20 text-white border border-white/20">
                <SelectValue className="text-white" />
              </SelectTrigger>
              <SelectContent className="bg-white text-gray-900">
                <SelectItem value="all" className="text-gray-900">All</SelectItem>
                <SelectItem value="image" className="text-gray-900">Image</SelectItem>
                <SelectItem value="csv" className="text-gray-900">CSV</SelectItem>
                <SelectItem value="pdf" className="text-gray-900">PDF</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading && (
          <div className="flex flex-col gap-8 w-full items-center mt-24">
            <Loader2 className="h-32 w-32 animate-spin text-white" />
            <div className="text-2xl text-white">Loading your files...</div>
          </div>
        )}

        <TabsContent value="grid">
          <div className="grid grid-cols-3 gap-4">
            {modifiedFiles?.map((file) => {
              return <FileCard key={file._id} file={file} />;
            })}
          </div>
        </TabsContent>
        <TabsContent value="table">
          <div className="overflow-x-auto min-w-full">
            <DataTable columns={columns} data={modifiedFiles} showUserColumn={!!organization.organization} />
          </div>
        </TabsContent>
      </Tabs>

      {files?.length === 0 && <Placeholder deletedOnly={deletedOnly} favoritesOnly={favoritesOnly} />}
    </div>
  );
}