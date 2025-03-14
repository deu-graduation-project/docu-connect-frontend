import React from "react"
import CreateProductForm from "@/components/forms/create-product-form"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"

export default function CreateProductSheet() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="flex items-center justify-center gap-2">
          Create Product
          <Icons.add />
        </Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-scroll pt-16">
        <SheetTitle className="mb-1 text-lg font-semibold">
          Create New Product
        </SheetTitle>
        <SheetDescription className="mb-6 text-muted-foreground">
          Add a new product to your agency&apos;s portfolio by providing the
          details below.
        </SheetDescription>
        <CreateProductForm />
      </SheetContent>
    </Sheet>
  )
}
