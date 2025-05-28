import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { Doc } from "@/convex/_generated/dataModel";
import { Download, Trash2 as DeleteIcon, TrashIcon, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
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
import { useState } from "react";
import { useMutation } from "convex/react"; 
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
      
function FileCardActions({ file }: { file: Doc<"files"> }) {
  const deleteFile = useMutation(api.files.deleteFile);
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
  <DropdownMenuTrigger><MoreVertical/></DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem className="flex gap-2 text-red-500 items-center">
        <TrashIcon className="w-4 h-4"/>Delete</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
        </>
    )
}
  export function FileCard({file}:{file:Doc<"files">}){
    return(
        <Card>
  <CardHeader className="relative">
    <CardTitle>{file.name} </CardTitle>
    <div className="absolute right-2 top-2">
        <FileCardActions file={file} />
        </div>
    {/* <CardDescription>Card Description</CardDescription> */}
  </CardHeader>
  <CardContent>
    <p>Card Content</p>
  </CardContent>
  <CardFooter>
    <p>Card Footer</p>
    <Button>
        <Download className="w-4 h-4" />
    </Button>
  </CardFooter>
</Card>

    )
  }
