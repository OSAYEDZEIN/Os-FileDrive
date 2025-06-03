import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatRelative } from "date-fns";

import { Doc } from "../../../../convex/_generated/dataModel";
import { FileTextIcon, GanttChartIcon, ImageIcon, DownloadIcon, Share2Icon } from "lucide-react";
import { ReactNode, useState, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import Image from "next/image";
import { FileCardActions } from "./file-actions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { toast } from "sonner";

function CSVPreview({ url }: { url: string }) {
  const [rows, setRows] = useState<string[][]>([]);
  useEffect(() => {
    fetch(url)
      .then((res) => res.text())
      .then((text) => {
        const lines = text.split("\n").slice(0, 10);
        const parsed = lines.map((line) => line.split(","));
        setRows(parsed);
      });
  }, [url]);
  if (!rows.length) return <div className="text-gray-500">Loading preview...</div>;
  return (
    <div className="overflow-x-auto max-h-96 w-full">
      <table className="min-w-full text-left border border-gray-200 rounded">
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b last:border-b-0">
              {row.map((cell, j) => (
                <td key={j} className="px-2 py-1 text-xs text-gray-700">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TextPreview({ url }: { url: string }) {
  const [content, setContent] = useState<string>("");
  useEffect(() => {
    fetch(url)
      .then((res) => res.text())
      .then(setContent);
  }, [url]);
  if (!content) return <div className="text-gray-500">Loading preview...</div>;
  return (
    <pre className="bg-gray-50 rounded p-4 max-h-96 overflow-auto text-xs text-gray-800 border border-gray-200 whitespace-pre-wrap">
      {content}
    </pre>
  );
}

export function FileCard({
  file,
}: {
  file: Doc<"files"> & { isFavorited: boolean; url: string | null };
}) {
  const userProfile = useQuery(api.users.getUserProfile, {
    userId: file.userId,
  });
  const [open, setOpen] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  const typeIcons = {
    image: <ImageIcon className="text-gray-900" />,
    pdf: <FileTextIcon className="text-gray-900" />,
    csv: <GanttChartIcon className="text-gray-900" />,
  } as Record<Doc<"files">["type"], ReactNode>;

  const handleDownload = () => {
    if (file.url) {
      const a = document.createElement("a");
      a.href = file.url;
      a.download = file.name;
      a.target = "_blank";
      a.click();
    }
  };

  const handleShare = () => {
    if (file.url) {
      navigator.clipboard.writeText(file.url);
      setShareCopied(true);
      toast.success("File link copied to clipboard!");
      setTimeout(() => setShareCopied(false), 1500);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <Card
          className="transition-all duration-200 hover:shadow-lg hover:border-gray-300 bg-white cursor-pointer"
          onDoubleClick={() => setOpen(true)}
        >
          <CardHeader className="relative">
            <CardTitle className="flex gap-2 text-base font-semibold text-gray-900">
              <div className="flex justify-center">{typeIcons[file.type]}</div>{" "}
              {file.name}
            </CardTitle>
            <div className="absolute top-2 right-2">
              <FileCardActions isFavorited={file.isFavorited} file={file} />
            </div>
          </CardHeader>
          <CardContent className="h-[200px] flex justify-center items-center">
            {file.type === "image" && file.url && (
              <Image alt={file.name} width="200" height="100" src={file.url} />
            )}
            {file.type === "csv" && <GanttChartIcon className="w-20 h-20 text-gray-300" />}
            {file.type === "pdf" && <FileTextIcon className="w-20 h-20 text-gray-300" />}
          </CardContent>
          <CardFooter className="items-center px-8 [.border-t]:pt-6 flex justify-between">
            <div className="flex gap-2 text-xs text-gray-500 w-40 items-center">
              <Avatar className="w-6 h-6">
                <AvatarImage src={userProfile?.image} />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              {userProfile?.name}
            </div>
            <div className="flex gap-2 text-xs text-gray-400">
              Uploaded on {formatRelative(new Date(file._creationTime), new Date())}
            </div>
          </CardFooter>
        </Card>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{file.name}</DialogTitle>
          </DialogHeader>
          <div className="flex gap-3 mb-4">
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors text-sm font-medium"
            >
              <DownloadIcon className="w-4 h-4" /> Download
            </button>
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              <Share2Icon className="w-4 h-4" /> {shareCopied ? "Copied!" : "Share"}
            </button>
          </div>
          {file.type === "image" && file.url ? (
            <div className="flex justify-center items-center">
              <img src={file.url} alt={file.name} className="rounded-lg max-h-[60vh] object-contain" style={{ width: 400, height: 300 }} />
            </div>
          ) : file.type === "pdf" && file.url ? (
            <div className="w-full h-[60vh] flex justify-center items-center">
              <iframe
                src={file.url}
                title={file.name}
                className="w-full h-full rounded border"
                style={{ minHeight: 400 }}
              />
            </div>
          ) : file.type === "csv" && file.url ? (
            <CSVPreview url={file.url} />
          ) : file.url && /\.(txt|md|json|js|ts|css|html|log)$/i.test(file.name) ? (
            <TextPreview url={file.url} />
          ) : (
            <div className="flex flex-col items-center gap-4 py-8">
              {file.type === "pdf" && <FileTextIcon className="w-16 h-16 text-gray-400" />}
              {file.type === "csv" && <GanttChartIcon className="w-16 h-16 text-gray-400" />}
              <span className="text-gray-600">Preview not available for this file type.</span>
            </div>
          )}
          <DialogClose className="mt-4 px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium">Close</DialogClose>
        </DialogContent>
      </Dialog>
    </>
  );
}