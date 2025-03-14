import React from "react"
import {
  MorphingDialog,
  MorphingDialogTrigger,
  MorphingDialogContent,
  MorphingDialogTitle,
  MorphingDialogImage,
  MorphingDialogSubtitle,
  MorphingDialogClose,
  MorphingDialogDescription,
  MorphingDialogContainer,
} from "@/components/ui/morphing-dialog"
import { PlusIcon, DownloadIcon, TrashIcon, EditIcon } from "lucide-react"
import { getRandomPatternStyle } from "@/lib/generate-pattern"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { useQuery } from "@tanstack/react-query"
import useAuthStatus from "@/lib/queries/auth-status"
import { productService } from "@/services/products-service"
import CreateProductForm from "../../../../components/forms/create-product-form"
type Note = {
  id: string
  title: string
  author: string
  uploadDate: string
  size: string
  isPublic: boolean
}

const notes: Note[] = [
  {
    id: "1",
    title: "Physics - Quantum Mechanics",
    author: "Richard Feynman",
    uploadDate: "2023-12-01",
    size: "2.4 MB",
    isPublic: true,
  },
  {
    id: "2",
    title: "Linear Algebra Notes",
    author: "Gilbert Strang",
    uploadDate: "2023-11-20",
    size: "1.9 MB",
    isPublic: false,
  },
  {
    id: "3",
    title: "Computer Networks",
    author: "Andrew Tanenbaum",
    uploadDate: "2023-10-15",
    size: "3.2 MB",
    isPublic: true,
  },
  {
    id: "4",
    title: "History of Art",
    author: "Gombrich",
    uploadDate: "2023-09-05",
    size: "5.1 MB",
    isPublic: false,
  },
  {
    id: "5",
    title: "Calculus Workbook",
    author: "James Stewart",
    uploadDate: "2023-08-22",
    size: "4.5 MB",
    isPublic: true,
  },
  {
    id: "6",
    title: "Biology Basics",
    author: "Campbell",
    uploadDate: "2023-07-10",
    size: "6.7 MB",
    isPublic: true,
  },
]

export default function NotesLibrary() {
  return (
    <div className="container mx-auto py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Products</h1>
        {/* <Button className="flex items-center gap-2">
          <PlusIcon size={16} /> Upload New Note
        </Button> */}
      </div>
      <CreateProductForm />

      <div></div>

      {/* <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-3">
        {notes.map((note) => (
          <MorphingDialog key={note.id}>
            <MorphingDialogTrigger className="flex flex-col overflow-hidden rounded-lg border shadow-sm hover:shadow-md">
              <AspectRatio ratio={16 / 9}>
                <div
                  className="h-32 w-full"
                  style={getRandomPatternStyle(note.title)}
                />
              </AspectRatio>
              <div className="p-4">
                <MorphingDialogTitle>{note.title}</MorphingDialogTitle>
                <MorphingDialogSubtitle className="text-muted-foreground">
                  {note.author}
                </MorphingDialogSubtitle>
                <p className="mt-2 text-sm text-muted-foreground">
                  {note.uploadDate} <span className="mx-2">•</span> {note.size}
                </p>
              </div>
            </MorphingDialogTrigger>

            <MorphingDialogContainer>
              <MorphingDialogContent className="w-[600px] rounded-xl bg-background">
                <AspectRatio ratio={21 / 8}>
                  <div
                    className="h-full w-full"
                    style={getRandomPatternStyle(note.title)}
                  />
                </AspectRatio>
                <div className="p-4">
                  <MorphingDialogTitle className="text-3xl">
                    {note.title}
                  </MorphingDialogTitle>
                  <MorphingDialogSubtitle className="text-muted-foreground">
                    {note.author}
                  </MorphingDialogSubtitle>
                  <MorphingDialogDescription>
                    <p className="mt-4 text-base">
                      Uploaded on:{" "}
                      <span className="ml-2 font-semibold">
                        {note.uploadDate}
                      </span>
                    </p>
                    <p>
                      File Size:
                      <span className="ml-2 font-semibold">{note.size}</span>
                    </p>

                    <div className="mt-6 flex items-center gap-4">
                      <Switch
                        checked={note.isPublic}
                        className="data-[state=checked]:bg-green-500"
                      />
                      <span className="text-sm">
                        {note.isPublic ? "Public" : "Private"}
                      </span>
                    </div>

                    <div className="mt-8 flex justify-end gap-4">
                      <Button variant="outline" className="flex items-center">
                        <DownloadIcon size={16} className="mr-2" />
                        Download
                      </Button>
                      <Button variant="outline" className="flex items-center">
                        <EditIcon size={16} className="mr-2" />
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        className="flex items-center"
                      >
                        <TrashIcon size={16} className="mr-2" />
                        Delete
                      </Button>
                    </div>
                  </MorphingDialogDescription>
                  <MorphingDialogClose className="mt-4 text-zinc-500" />
                </div>
              </MorphingDialogContent>
            </MorphingDialogContainer>
          </MorphingDialog>
        ))}
      </div> */}
    </div>
  )
}
