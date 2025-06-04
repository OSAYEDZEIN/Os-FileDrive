"use client";

import { Button } from "@/components/ui/button";
import { useOrganization, useUser } from "@clerk/nextjs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2, FileTextIcon, GanttChartIcon, ImageIcon } from "lucide-react";
import { Doc } from "../../../../convex/_generated/dataModel";

const formSchema = z.object({
  title: z.string().min(1).max(200),
  file: z
    .custom<FileList>((val) => val instanceof FileList, "Required")
    .refine((files) => files.length > 0, `Required`),
});

export function UploadButton() {
  const organization = useOrganization();
  const user = useUser();
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      file: undefined,
    },
  });

  const fileRef = form.register("file");

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!orgId) return;

    const fileToUpload = values.file[0];
    const fileType = fileToUpload.type;

    // Mapping of MIME types to your Convex file 'type' enum
    const types = {
      "image/png": "image",
      "application/pdf": "pdf",
      "text/csv": "csv",
      "image/jpeg": "image",
      "image/jpg": "image",
      "image/gif": "image",
      "image/webp": "image",
      "image/svg+xml": "image",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
      // Add more as needed, ensuring they match your `fileTypes` union in Convex
    } as Record<string, Doc<"files">["type"]>;

    const typeToUpload = types[fileType];

    // **IMPORTANT VALIDATION:** Check if the file type is supported
    if (!typeToUpload) {
      toast.error(`Unsupported file type: "${fileType}". Please upload a PNG, PDF, CSV, or common image format.`);
      console.error("Attempted to upload unsupported file type:", fileType);
      return; // Stop the submission if the type is not recognized
    }

    // Before starting upload
    toast.dismiss();
    const toastId = toast.loading("Uploading your file...");

    try {
      // 1. Get a signed upload URL from Convex
      const postUrl = await generateUploadUrl();

      // 2. Upload the file directly to Convex storage
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": fileType }, // Use the actual file's MIME type
        body: fileToUpload,
      });

      // Check if the storage upload was successful
      if (!result.ok) {
        throw new Error(`Failed to upload file to Convex storage: ${result.statusText}`);
      }

      const { storageId } = await result.json(); // Get the storage ID from the upload result

      // 3. Call your Convex mutation to record file metadata
      await createFile({
        name: values.title,
        fileId: storageId,
        orgId,
        type: typeToUpload, // Always pass type
      });

      form.reset();

      setIsFileDialogOpen(false);

      toast.success("File uploaded successfully!", { id: toastId, style: { background: "#22c55e", color: "white" } });
    } catch (err) {
      console.error("File upload error:", err);
      toast.error(
        "Something went wrong. Your file could not be uploaded, please try again later.",
        { id: toastId }
      );
    } finally {
      // Dismiss all toasts after a short delay
      setTimeout(() => toast.dismiss(), 1500);
    }
  }

  let orgId: string | undefined = undefined;
  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id;
  }

  const [isFileDialogOpen, setIsFileDialogOpen] = useState(false);

  const createFile = useMutation(api.files.createFile);

  // Add this mapping for file type icons
  const typeIcons = {
    image: <ImageIcon />,
    pdf: <FileTextIcon />,
    docx: <FileTextIcon />, // Use the same icon for docx as for pdf
    csv: <GanttChartIcon />,
  } as Record<Doc<"files">["type"], React.ReactNode>;

  const isPersonal = organization.isLoaded && !organization.organization;

  return (
    <Dialog
      open={isFileDialogOpen}
      onOpenChange={(isOpen) => {
        setIsFileDialogOpen(isOpen);
        form.reset();
      }}
    >
      <DialogTrigger asChild>
      <Button className="bg-white text-gray-900 hover:bg-gray-200 border-none px-6 py-3 rounded-lg transition-colors">Upload File</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mb-8">Upload your File</DialogTitle>
          <DialogDescription>
            {isPersonal
              ? "This file will be accessible only to you."
              : "This file will be accessible by anyone in your organization."}
          </DialogDescription>
        </DialogHeader>

        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="file"
                render={() => (
                  <FormItem>
                    <FormLabel>File</FormLabel>
                    <FormControl>
                      <Input type="file" {...fileRef} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="flex gap-1"
              >
                {form.formState.isSubmitting && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                Submit
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}