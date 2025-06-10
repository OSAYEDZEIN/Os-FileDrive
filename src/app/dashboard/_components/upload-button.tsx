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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Doc } from "../../../../convex/_generated/dataModel";

const formSchema = z.object({
  title: z.string().min(1).max(200),
  file: z
    .custom<FileList>((val) => val instanceof FileList, "Required")
    .refine((files) => files.length > 0, `Required`),
});

export function UploadButton({ className }: { className?: string }) {
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

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { ref, ...rest } = form.register("file", {
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      setSelectedFile(e.target.files?.[0] || null);
    },
  });

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
  const isPersonal = organization.isLoaded && !organization.organization;
  
  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id;
    console.log("Current orgId:", orgId, "Personal mode:", isPersonal);
  }

  const [isFileDialogOpen, setIsFileDialogOpen] = useState(false);
  const createFile = useMutation(api.files.createFile);

  return (
    <Dialog open={isFileDialogOpen} onOpenChange={setIsFileDialogOpen}>
      <DialogTrigger asChild>
        <Button 
          className={`bg-gradient-to-r from-cyan-500/20 to-teal-500/20 border border-white/10 text-white hover:bg-gradient-to-r hover:from-cyan-500/30 hover:to-teal-500/30 hover:shadow-lg hover:shadow-cyan-500/20 transition-all ${className || ''}`}
          onClick={() => setIsFileDialogOpen(true)}
        >
          Upload File
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gray-900 border border-white/10 text-white sm:rounded-xl overflow-hidden w-full max-w-md z-[100]">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle className="text-xl font-semibold text-white mb-1">Upload your File</DialogTitle>
          <DialogDescription className="text-gray-300 text-sm">
            {isPersonal
              ? "This file will be accessible only to you."
              : "This file will be accessible by anyone in your organization."}
          </DialogDescription>
        </DialogHeader>

        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                      />
                    </FormControl>
                    <FormMessage className="text-red-400 text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="file"
                render={({ field: { value, onChange, ...field } }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-300">File</FormLabel>
                    <FormControl>
                      <div className="flex flex-col gap-2">
                        <div className="relative group">
                          <div className="relative h-10 w-full">
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="px-4 py-2 bg-white/10 text-white rounded-lg text-sm font-medium whitespace-nowrap">
                                Choose file
                              </div>
                            </div>
                            <Input 
                              type="file" 
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              {...rest}
                              ref={(e) => {
                                ref(e);
                                fileInputRef.current = e;
                              }}
                            />
                          </div>
                          <div className="mt-2 h-10 w-full bg-white/5 rounded-lg flex items-center justify-center text-sm text-gray-400 px-4 truncate">
                            {selectedFile?.name || 'No file chosen'}
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 text-center">
                          Supported formats: PNG, JPG, PDF, CSV, DOCX
                        </p>
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-400 text-xs" />
                  </FormItem>
                )}
              />
              <DialogFooter className="px-6 py-4 border-t border-white/10 mt-4 gap-3 justify-center">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    form.reset();
                    setIsFileDialogOpen(false);
                  }}
                  className="px-6 h-10 rounded-lg border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  className="px-6 h-10 rounded-lg bg-gradient-to-r from-cyan-500/90 to-teal-500/90 hover:from-cyan-500 hover:to-teal-500 transition-all border-0 text-white font-medium"
                >
                  {form.formState.isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    'Upload File'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}