"use client";

import { CloudUploadIcon, Trash2Icon } from "lucide-react";
import {
  Dropzone,
  DropZoneArea,
  DropzoneDescription,
  DropzoneMessage,
  DropzoneFileListItem,
  DropzoneRemoveFile,
  DropzoneTrigger,
  useDropzone,
} from "./dropzone";

export function BlogDropzone({ onFileSelect }) {
  const dropzone = useDropzone({
    onDropFile: async (file) => {
      // immediately pass the actual file back
      onFileSelect?.(file); // ✅ important
      return {
        status: "success",
        result: URL.createObjectURL(file), // still used for preview
      };
    },
    validation: {
      accept: {
        "image/*": [".png", ".jpg", ".jpeg", ".webp"],
      },
      maxSize: 10 * 1024 * 1024,
      maxFiles: 1,
    },
  });

  const uploadedFile = dropzone.fileStatuses[0]; // only one file allowed

  return (
    <div className="not-prose flex flex-col gap-4">
      <Dropzone {...dropzone}>
        <div>
          <div className="mb-2 flex justify-between">
            <DropzoneDescription>
              Recommended format: WebP. Also supports JPG and PNG.
            </DropzoneDescription>
            <DropzoneMessage />
          </div>

          <DropZoneArea className="border-muted-foreground/40 bg-primary-foreground relative rounded-md border border-dashed">
            {!uploadedFile ? (
              <DropzoneTrigger className="flex w-full flex-col items-center gap-4 bg-transparent py-10 text-center text-sm">
                <CloudUploadIcon className="size-8" />
                <div>
                  <p className="font-semibold">Upload listing image</p>
                  <p className="text-muted-foreground text-sm">
                    Click here or drag and drop to upload
                  </p>
                </div>
              </DropzoneTrigger>
            ) : (
              <DropzoneFileListItem
                file={uploadedFile}
                className="relative m-0 w-full bg-transparent p-0"
              >
                {uploadedFile.status === "pending" && (
                  <div className="aspect-video animate-pulse rounded-md bg-black/20" />
                )}

                {uploadedFile.status === "success" && (
                  <div className="relative">
                    <img
                      src={uploadedFile.result}
                      alt={`uploaded-${uploadedFile.fileName}`}
                      className="aspect-video w-full rounded-md object-cover"
                    />

                    <div className="absolute right-0 bottom-0 left-0 flex items-center justify-between bg-black/60 px-3 py-2 text-sm text-white">
                      <p className="truncate">{uploadedFile.fileName}</p>
                      <p className="text-xs opacity-80">
                        {(uploadedFile.file.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>

                    <DropzoneRemoveFile className="absolute top-2 right-2 rounded-full bg-[#9e4042] p-2 text-white shadow hover:bg-[#9e4042]">
                      <Trash2Icon className="size-4" />
                    </DropzoneRemoveFile>
                  </div>
                )}
              </DropzoneFileListItem>
            )}
          </DropZoneArea>
        </div>
      </Dropzone>
    </div>
  );
}
