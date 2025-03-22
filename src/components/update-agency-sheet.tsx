import React from "react"
import UpdateAgencyInfoForm from "./forms/update-agency-info-form"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet" // Import SheetTitle
import { Button } from "./ui/button"
import useAuthStatus from "@/lib/queries/auth-status"

export default function UpdateAgencySheet() {
  const { data: authStatus, isLoading, error } = useAuthStatus()

  return (
    <Sheet>
      <SheetTrigger asChild>
        {authStatus?.isAgency && <Button>Edit bio</Button>}
      </SheetTrigger>
      <SheetContent className="overflow-y-scroll pt-16">
        {/* Add SheetTitle for accessibility */}
        <SheetTitle className="mb-1 text-lg font-semibold">
          Update Agency Information
        </SheetTitle>
        <SheetDescription className="mb-6 text-muted-foreground">
          Provide the latest information about your agency to keep your profile
          up to date.
        </SheetDescription>
        <UpdateAgencyInfoForm />
      </SheetContent>
    </Sheet>
  )
}
