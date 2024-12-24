import React from "react";
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
} from "@/components/ui/morphing-dialog";
import { PlusIcon, DownloadIcon, TrashIcon, EditIcon } from "lucide-react";
import { getRandomPatternStyle } from "@/lib/generate-pattern";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

type Note = {
  id: string;
  title: string;
  author: string;
  uploadDate: string;
  size: string;
  isPublic: boolean;
};

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
];

export default function NotesLibrary() {
  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Uploaded PDFs/Notes Library</h1>
        <Button className="flex items-center gap-2">
          <PlusIcon size={16} /> Upload New Note
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-3">
        {notes.map((note) => (
          <MorphingDialog key={note.id}>
            <MorphingDialogTrigger className="flex flex-col overflow-hidden border rounded-lg shadow-sm hover:shadow-md">
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
                <p className="text-sm text-muted-foreground mt-2">
                  {note.uploadDate} <span className="mx-2">•</span> {note.size}
                </p>
              </div>
            </MorphingDialogTrigger>

            <MorphingDialogContainer>
              <MorphingDialogContent className="w-[600px] bg-background rounded-xl ">
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
                      <span className="font-semibold ml-2">
                        {note.uploadDate}
                      </span>
                    </p>
                    <p>
                      File Size:
                      <span className="font-semibold ml-2">{note.size}</span>
                    </p>

                    <div className="flex items-center gap-4 mt-6">
                      <Switch
                        checked={note.isPublic}
                        className="data-[state=checked]:bg-green-500"
                      />
                      <span className="text-sm">
                        {note.isPublic ? "Public" : "Private"}
                      </span>
                    </div>

                    <div className="flex justify-end gap-4 mt-8">
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
                  <MorphingDialogClose className="text-zinc-500 mt-4" />
                </div>
              </MorphingDialogContent>
            </MorphingDialogContainer>
          </MorphingDialog>
        ))}
      </div>
    </div>
  );
}
