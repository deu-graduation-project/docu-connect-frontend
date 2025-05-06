// components/FileUpload.tsx
import React from "react"
import { useDropzone } from "react-dropzone"
import { Control } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { X } from "lucide-react"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Separator } from "@/components/ui/separator"

type FileUploadProps = {
  files: File[]
  onDrop: (acceptedFiles: File[]) => void
  removeFile: (fileName: string) => void
  control: Control<any> // Use 'any' for simplicity or create a specific type
  name: string
}

export function FileUpload({
  files,
  onDrop,
  removeFile,
  control,
  name,
}: FileUploadProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
  })

  return (
    <>
      <FormField
        control={control}
        name={name}
        render={() => (
          <FormItem>
            <div
              {...getRootProps()}
              className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-muted p-6 transition hover:bg-muted/20"
            >
              <input {...getInputProps()} />
              {isDragActive ? (
                <p className="text-sm">Drop the PDF here ...</p>
              ) : (
                <p className="text-sm">
                  Drag 'n' drop PDF files here, or click to select
                </p>
              )}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          <FormLabel>Uploaded Files</FormLabel>
          {files.map((file) => (
            <div
              key={file.name}
              className="flex w-full items-center justify-between gap-2 rounded-md border bg-muted p-2"
            >
              <div className="flex items-center justify-start gap-2">
                <Icons.file className="h-4 w-4" />
                <p className="text-sm font-medium">{file.name}</p>
              </div>
              <div className="flex items-center justify-start gap-2">
                <p className="text-xs text-muted-foreground">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
                <Button
                  type="button"
                  size="icon"
                  variant="destructive"
                  onClick={() => removeFile(file.name)}
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>
            </div>
          ))}
          <Separator className="my-4" />
        </div>
      )}
    </>
  )
}
