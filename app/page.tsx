"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
  useOrganization,
  useUser
} from "@clerk/nextjs";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { z } from "zod"
import { title } from "process";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useState } from "react";
import { toast, Toaster } from "sonner";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  title: z.string().min(1).max(200),
  file: z.custom<File | null>(
    (val) => val instanceof File || val === null,
    { message: "Required" }
  ),
});

export default function Home() {
  const organization = useOrganization();
  const user = useUser();
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      file: null,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    console.log(values.file)
    if (!values.file) return;
    const postUrl = await generateUploadUrl();

    const result = await fetch(postUrl, {
      method: "POST",
      headers: { "Content-Type": values.file.type },
      body: values.file,
    });
    const { storageId } = await result.json();
    if (!orgId) return;
   
    try{
      await createFile({
        name: values.title,
        fileId: storageId,
        orgId,
      });
      form.reset();

      setIsFileDialogOpen(false);

      toast.success("File uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload file");
    }


    form.reset();

    setIsFileDialogOpen(false);

    toast("File Uploaded", {
      description: "Now everyone can see your file"
    });
  }

  let orgId: string | undefined = undefined;
  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id;
  }
  
  const [isFileDialogOpen, setIsFileDialogOpen] = useState(false);

  const files = useQuery(api.files.getFiles, orgId ? { orgId } : "skip");
  const createFile = useMutation(api.files.createFile);

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 dark:from-background dark:to-gray-900 flex flex-col items-center py-12 px-2">
      <div className="w-full max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-primary drop-shadow-sm">Your Files</h1>
          <Dialog open={isFileDialogOpen} onOpenChange={(isOpen) => {
            setIsFileDialogOpen(isOpen);
            form.reset();
          }}>
            <DialogTrigger asChild>
              <Button
                className="bg-gradient-to-r from-primary to-accent text-white px-6 py-2 rounded-lg shadow-md hover:scale-105 transition-transform"
                onClick={() => {
                  if (!orgId) return;
                }}
              >
                <span className="font-semibold tracking-wide">Upload File</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md w-full rounded-xl shadow-xl">
              <DialogHeader>
                <DialogTitle className="mb-2 text-2xl font-bold text-primary">Upload Your File</DialogTitle>
                <DialogDescription className="mb-4 text-muted-foreground">
                  Select a file and give it a title. Your file will be visible to your organization.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter file title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="file"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>File</FormLabel>
                        <FormControl>
                          <Input 
                            type="file" 
                            onChange={(e) => field.onChange(e.target.files?.[0])}
                            onBlur={field.onBlur}
                            name={field.name}
                            ref={field.ref}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button 
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  className="flex gap-2 ">
                    {form.formState.isSubmitting&& (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    )}
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
        <div className="mt-8 space-y-4">
          {files?.length === 0 && (
            <div className="text-center text-muted-foreground py-8">No files uploaded yet.</div>
          )}
          {files?.map((file) => (
            <div
              key={file._id}
              className="flex items-center justify-between p-4 bg-white dark:bg-card rounded-lg card-shadow border hover:shadow-lg transition-shadow group"
            >
              <div className="flex flex-col">
                <span className="font-medium text-lg text-primary group-hover:underline">{file.name}</span>
                {/* Add more file info here if needed */}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="ml-4 group-hover:bg-accent group-hover:text-primary"
                onClick={() => {
                  // Add download or view functionality here
                }}
              >
                View
              </Button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}