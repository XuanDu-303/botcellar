"use client";

import { useCallback } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { PlusIcon } from "lucide-react";
import { useDropzone } from "@uploadthing/react";
import { generateClientDropzoneAccept } from "uploadthing/client";

import { useUploadThing } from "@/lib/uploadthing";
import { Card, CardContent } from "@/components/ui/card";
import { FormControl } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import Loading from "./loading";

interface DropzoneUploaderProps {
  value: string[];
  onChange: (urls: string[]) => void;
}

export default function DropzoneUploader({
  value,
  onChange,
}: DropzoneUploaderProps) {
  const { startUpload, isUploading } = useUploadThing("imageUploader", {
    onClientUploadComplete: async (res) => {
      const urls = res.map((file) => file.url).filter(Boolean);

      // Wait before checking if images are ready (avoid upstream timeout)
      await new Promise((r) => setTimeout(r, 2000));

      // Optional HEAD check to be sure the image is ready
      const availableUrls = await Promise.all(
        urls.map(async (url) => {
          try {
            const head = await fetch(url, { method: "HEAD" });
            return head.ok ? url : null;
          } catch {
            return null;
          }
        })
      );

      const final = availableUrls.filter(Boolean) as string[];

      if (final.length === 0) {
        toast.warning("Image not ready. Please try again.");
        return;
      }

      onChange([...value, ...final]);
    },

    onUploadError: (err) => {
      toast.error("Upload failed", { description: err.message });
    },
  });

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        await startUpload(acceptedFiles);
      }
    },
    [startUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: generateClientDropzoneAccept(["image/*"]),
  });

  return (
    <Card
      {...getRootProps()} // 🔥 bọc toàn bộ vùng DropzoneUploader
      className={cn(
        "bg-muted/50 border border-border transition-colors duration-200",
        isDragActive && "border-primary bg-primary/5"
      )}
    >
      <input {...getInputProps()} hidden /> {/* hidden vì input không còn trong nút */}

      <CardContent className="mt-2 p-4 space-y-2 min-h-48">
        <div className="flex flex-wrap gap-3">
          {value.map((image) => (
            <div key={image} className="relative w-20 h-20 rounded-md overflow-hidden border border-muted shadow-sm">
              <Image src={image} alt="Uploaded image" fill unoptimized className="object-cover object-center" />
              <button
                type="button"
                onClick={() => onChange(value.filter((img) => img !== image))}
                className="absolute top-0 right-0 w-5 h-5 text-xs bg-muted text-red-500 hover:text-red-700 cursor-pointer"
              >
                ✕
              </button>
            </div>
          ))}

          <FormControl>
            <div
              className={cn(
                "border border-dashed border-border bg-background text-foreground transition-all duration-200",
                "rounded-md w-20 h-20 flex items-center justify-center text-sm font-medium cursor-pointer hover:bg-muted",
                isUploading && "opacity-50 pointer-events-none",
              )}
            >
              {isUploading ? (
                <Loading className="w-4 h-4" />
              ) : (
                <PlusIcon className={cn("text-primary", isDragActive && "animate-bounce")} />
              )}
            </div>
          </FormControl>
        </div>
      </CardContent>
    </Card>
  )
}