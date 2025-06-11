import { Doc, Id } from "../../../../convex/_generated/dataModel";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  FileIcon,
  MoreVertical,
  StarHalf,
  StarIcon,
  TrashIcon,
  UndoIcon,
  Share2Icon,
  ArrowDownToLine,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Protect } from "@clerk/nextjs";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function FileCardActions({
  file,
  isFavorited,
  className,
}: {
  file: Doc<"files"> & { url: string | null };
  isFavorited: boolean;
  className?: string;
}) {
  const deleteFile = useMutation(api.files.deleteFile);
  const restoreFile = useMutation(api.files.restoreFile);
  const toggleFavorite = useMutation(api.files.toggleFavorite);
  const me = useQuery(api.users.getMe);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  return (
    <>
      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent className="bg-gray-900 border border-white/10 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Are you sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-300">
              This file will be deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent hover:bg-white/10 border-white/10 text-white hover:text-white">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                await deleteFile({
                  fileId: file._id,
                });
                toast("File deleted.", { 
                  style: { 
                    background: "#ef4444", 
                    color: "white",
                    border: '1px solid #ef4444/20',
                    backdropFilter: 'blur(10px)'
                  } 
                });
              }}
              className="bg-gradient-to-r from-red-500/90 to-red-600/90 hover:from-red-500 hover:to-red-600 transition-all border-0 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button 
            className={cn(
              "p-1.5 rounded-full hover:bg-accent/50 transition-colors focus:outline-none",
              className
            )}
          >
            <MoreVertical className="w-4 h-4 text-foreground/70" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          className="bg-gray-900 border border-white/10 backdrop-blur-lg shadow-xl min-w-[180px] p-1.5 rounded-xl overflow-hidden"
          align="end"
        >
          <DropdownMenuItem
            onClick={() => {
              if (!file.url) return;
              window.open(file.url, "_blank");
            }}
            className="flex gap-2 items-center px-3 py-2 text-sm rounded-lg cursor-pointer text-gray-200 hover:bg-white/10 focus:bg-white/10 focus:text-white"
          >
            <ArrowDownToLine className="w-4 h-4" />
            <span>Download</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => {
              if (!file.url) return;
              navigator.clipboard.writeText(file.url);
              toast.success("File link copied to clipboard!");
            }}
            className="flex gap-2 items-center px-3 py-2 text-sm rounded-lg cursor-pointer text-gray-200 hover:bg-white/10 focus:bg-white/10 focus:text-white"
          >
            <Share2Icon className="w-4 h-4" />
            <span>Share</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => {
              toggleFavorite({
                fileId: file._id,
              });
            }}
            className="flex gap-2 items-center px-3 py-2 text-sm rounded-lg cursor-pointer text-gray-200 hover:bg-white/10 focus:bg-white/10 focus:text-white"
          >
            {isFavorited ? (
              <>
                <StarIcon className="w-4 h-4 text-yellow-400" fill="#eab308" />
                <span>Unfavorite</span>
              </>
            ) : (
              <>
                <StarHalf className="w-4 h-4 text-gray-300" />
                <span>Favorite</span>
              </>
            )}
          </DropdownMenuItem>

          <Protect
            condition={(check) => {
              return (
                check({
                  role: "org:admin",
                }) || file.userId === me?._id
              );
            }}
            fallback={<></>}
          >
            <DropdownMenuSeparator className="bg-white/10 my-1" />
            <DropdownMenuItem
              onClick={() => {
                if (file.shouldDelete) {
                  restoreFile({
                    fileId: file._id,
                  });
                } else {
                  setIsConfirmOpen(true);
                }
              }}
              className={
                file.shouldDelete
                  ? "group flex gap-2 items-center px-3 py-2 text-sm rounded-lg cursor-pointer text-green-400 hover:bg-white/10 focus:bg-white/10 focus:text-green-300"
                  : "group flex gap-2 items-center px-3 py-2 text-sm rounded-lg cursor-pointer text-red-400 hover:bg-red-500/10 hover:text-red-300 focus:bg-red-500/10 focus:text-red-300"
              }
            >
              {file.shouldDelete ? (
                <>
                  <UndoIcon className="w-4 h-4" />
                  <span>Restore</span>
                </>
              ) : (
                <>
                  <TrashIcon className="w-4 h-4 text-red-400 group-hover:text-red-300" />
                  <span>Delete</span>
                </>
              )}
            </DropdownMenuItem>
          </Protect>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}