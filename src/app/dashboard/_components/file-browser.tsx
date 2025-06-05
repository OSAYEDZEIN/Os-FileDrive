"use client";
import { useOrganization, useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { UploadButton } from "./upload-button";
import { FileCard } from "./file-card";
import Image from "next/image";
import { GridIcon, Loader2, RowsIcon } from "lucide-react";
import { SearchBar } from "./search-bar";
import { useState, useEffect, useRef } from "react";
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
  if (deletedOnly || favoritesOnly) return null;
  
  return (
    <div className="w-full flex justify-center mt-16">
      <UploadButton />
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
  
  const isLoading = files === undefined || !organization.isLoaded || !user.isLoaded;

  const modifiedFiles =
    files?.map((file) => ({
      ...file,
      isFavorited: (favorites ?? []).some(
        (favorite) => favorite.fileId === file._id
      ),
    })) ?? [];

  // Reset state when organization or user changes
  useEffect(() => {
    setQuery("");
    setType("all");
  }, [organization.organization?.id, user.user?.id]);

  return (
    <div key={`${organization.organization?.id}-${user.user?.id}`}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-4xl font-bold text-white">{title}</h1>
        <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <SearchBar query={query} setQuery={setQuery} />
          <div className="w-full sm:w-auto">
            <UploadButton />
          </div>
        </div>
      </div>

      {deletedOnly && (
        <div className="mb-4 p-3 rounded bg-red-100 text-red-600 border border-red-200 text-sm">
           WARNING: Files in Trash will be permanently deleted after 24 hours.
        </div>
      )}

      <Tabs defaultValue="grid" className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <TabsList className="w-full sm:w-auto bg-white/5 border border-white/10 p-1 rounded-lg">
            <TabsTrigger 
              value="grid" 
              className="flex gap-2 items-center px-4 py-2 rounded-md data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:shadow-sm transition-colors"
            >
              <GridIcon className="w-4 h-4" />
              <span>Grid</span>
            </TabsTrigger>
            <TabsTrigger 
              value="table" 
              className="flex gap-2 items-center px-4 py-2 rounded-md data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:shadow-sm transition-colors"
            >
              <RowsIcon className="w-4 h-4" />
              <span>Table</span>
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

        <TabsContent value="grid" className="mt-6">
          {modifiedFiles?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {modifiedFiles.map((file) => (
                <FileCard key={file._id} file={file} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center rounded-xl border-2 border-dashed border-white/20">
              <div className="text-5xl mb-4">📁</div>
              <h3 className="text-lg font-medium text-white mb-1">No files found</h3>
              <p className="text-sm text-gray-400 max-w-md">
                {favoritesOnly 
                  ? "You don't have any favorite files yet."
                  : deletedOnly 
                  ? "Your trash is empty"
                  : "Upload your first file to get started using the button above"}
              </p>
            </div>
          )}
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