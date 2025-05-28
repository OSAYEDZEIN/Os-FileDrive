import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { Doc, Id } from "@/convex/_generated/dataModel";
import { Download, Trash2 as DeleteIcon, TrashIcon, MoreVertical, ImageIcon, FileTextIcon, GanttChartIcon, StarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { DropdownMenuItem, DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import { ReactNode, useState } from "react";
import { useMutation } from "convex/react"; 
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import Image from "next/image";
      
function FileCardActions({ file }: { file: Doc<"files"> }) {
  const deleteFile = useMutation(api.files.deleteFile);
  const toggleFavorite = useMutation(api.files.toggleFavorite);
    const[isComfirmOpen,setIsComfirmOpen]=useState(false)
    return(
        
        <>
        <AlertDialog open={isComfirmOpen}onOpenChange={setIsComfirmOpen}>
    <AlertDialogTrigger>Open</AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone. This will permanently delete your account
        and remove your data from our servers.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction
        onClick={async () => {
          await deleteFile({ fileId: file._id });
          toast("File deleted", {
            description: "Your file has been deleted"
          });
        }}
      >
        Continue
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
    </AlertDialog>

        <DropdownMenu>
  <DropdownMenuTrigger><MoreVertical/>
  </DropdownMenuTrigger>
  <DropdownMenuItem 
  onClick={() => {
    toggleFavorite({fileId: file._id})
    }}
    className="flex gap-2  items-center">
        <StarIcon className="w-4 h-4"/>Favorite
        </DropdownMenuItem>
  <DropdownMenuSeparator />

  <DropdownMenuContent>
    <DropdownMenuItem 
    className="flex gap-2 text-red-500 items-center">
        <TrashIcon className="w-4 h-4"/>Delete
        </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
        </>
    )
}


function getFileUrl(fileId: Id<"_storage">) {
  return `${process.env.NEXT_PUBLIC_BASE_URL}/api/storage/${fileId}`;
}



  export function FileCard({file}:{file:Doc<"files">}){
    const typeIcons = {
      "image": <ImageIcon/>,
      "pdf": <FileTextIcon/>,
      "csv": <GanttChartIcon/>
    } as Record<Doc<"files"> ["type"] , ReactNode>;
    return(
        <Card>
  <CardHeader className="relative">
    <CardTitle className="flex gap-2">
    <div className="flex justify-center ">{typeIcons[file.type]}</div>
      {file.name} </CardTitle>
    <div className="absolute right-2 top-2">
        <FileCardActions file={file} />
        </div>
    {/* <CardDescription>Card Description</CardDescription> */}
  </CardHeader>
  <CardContent className= "h[200px] flex justify-center items-center">
    {
      file.type === "image" && (
        <img
          alt={file.name}
          width="200"
          height="100"
          src={getFileUrl(file.fileId)}
        />
      )
    }
    {file.type === "csv" && <GanttChartIcon className="w-20 h-20"/> }
    {file.type === "pdf" && <FileTextIcon className="w-20 h-20"/> }
  </CardContent>
  <CardFooter className="flex justify-center">
    <Button onClick={() =>{
      // open a new tab the file location on convex
      window.open(getFileUrl(file.fileId), "_blank");
    }}>Download</Button>
    </CardFooter>
</Card>

    )
  }
