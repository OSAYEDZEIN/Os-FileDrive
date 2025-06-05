"use client";

import { Button } from "@/components/ui/button";
import { useOrganization, useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { Loader2, UploadCloud } from "lucide-react";
import { Doc } from "../../../../convex/_generated/dataModel";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  title: z.string().min(1).max(200),
  file: z
    .custom<FileList>((val) => val instanceof FileList, "Required")
    .refine((files) => files.length > 0, `Required`),
});

export function HeaderUploadButton() {
  const organization = useOrganization();
  const user = useUser();
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const [isFileDialogOpen, setIsFileDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      file: undefined,
    },
  });

  let orgId: string | undefined = undefined;
  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id;
  }

  const createFile = useMutation(api.files.createFile);
  const isPersonal = organization.isLoaded && !organization.organization;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!orgId) return;
    setIsUploading(true);

    const fileToUpload = values.file[0];
    const fileType = fileToUpload.type;

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
    } as Record<string, Doc<"files">["type"]>;

    const typeToUpload = types[fileType];

    if (!typeToUpload) {
      toast.error(`Unsupported file type: "${fileType}". Please upload a PNG, PDF, CSV, or common image format.`);
      console.error("Attempted to upload unsupported file type:", fileType);
      setIsUploading(false);
      return;
    }

    const toastId = toast.loading("Uploading your file...");

    try {
      const postUrl = await generateUploadUrl();
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": fileType },
        body: fileToUpload,
      });

      if (!result.ok) {
        throw new Error(`Failed to upload file: ${result.statusText}`);
      }

      const { storageId } = await result.json();

      await createFile({
        name: values.title,
        fileId: storageId,
        orgId,
        type: typeToUpload,
      });

      form.reset();
      setIsFileDialogOpen(false);
      toast.success("File uploaded successfully!", { 
        id: toastId, 
        style: { background: "#22c55e", color: "white" } 
      });
    } catch (err) {
      console.error("File upload error:", err);
      toast.error(
        "Something went wrong. Your file could not be uploaded, please try again later.",
        { id: toastId }
      );
    } finally {
      setIsUploading(false);
      setTimeout(() => toast.dismiss(), 1500);
    }
  }

  return (
    <Dialog open={isFileDialogOpen} onOpenChange={setIsFileDialogOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost"
          className="group flex items-center gap-2 text-white/90 hover:text-white hover:bg-white/10 px-4 py-2 rounded-lg transition-all duration-200"
        >
          <UploadCloud className="w-5 h-5 text-teal-400" />
          <span>Upload</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gray-900 border border-white/10 text-white sm:rounded-xl overflow-hidden w-full max-w-md z-[100]">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-xl font-semibold text-white mb-1">Upload your File</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 px-6 pb-6">
          <p className="text-gray-300 text-sm -mt-4 mb-2">
            {isPersonal
              ? "This file will be accessible only to you."
              : "This file will be accessible by anyone in your organization."}
          </p>
          
          <Form {...form}>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-300">Title</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        className="bg-white/5 border-white/10 text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent"
                        placeholder="Enter file name"
                        disabled={isUploading}
                      />
                    </FormControl>
                    <FormMessage className="text-red-400 text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="file"
                render={({ field: { onChange, value, ...field } }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-300">File</FormLabel>
                    <FormControl>
                      <Input 
                        type="file"
                        className="block w-full text-sm text-gray-400
                          file:mr-4 file:py-2 file:px-4
                          file:rounded-md file:border-0
                          file:text-sm file:font-semibold
                          file:bg-teal-500/20 file:text-teal-400
                          hover:file:bg-teal-500/30
                          cursor-pointer
                          bg-white/5 border border-white/10
                          file:cursor-pointer
                          disabled:opacity-50"
                        disabled={isUploading}
                        {...field}
                        onChange={(e) => {
                          onChange(e.target.files);
                        }}
                      />
                    </FormControl>
                    <FormMessage className="text-red-400 text-xs" />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsFileDialogOpen(false)}
                  disabled={isUploading}
                  className="bg-gray-800/50 text-gray-300 border-gray-600 hover:bg-gray-700/50 hover:text-white"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isUploading}
                  className="bg-gradient-to-r from-cyan-500 to-teal-500 text-white hover:from-cyan-600 hover:to-teal-600"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    'Upload File'
                  )}
                </Button>
              </div>
            </div>
          </Form>
        </form>
      </DialogContent>
    </Dialog>
  );
}
