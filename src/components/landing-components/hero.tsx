import React from "react"
import { cn } from "@/lib/utils"

import Link from "next/link"
import { Button, buttonVariants } from "../ui/button"
import { Icons } from "../icons"
import { Landmark } from "lucide-react"
export default function HeroSection() {
  return (
    <div className="relative flex h-[25rem] w-full flex-col overflow-hidden rounded-md antialiased bg-dot-black/[0.2] dark:bg-dot-white/[0.2] md:h-[33rem] md:items-center md:justify-center lg:h-[40rem]">
      <div className="pb-4">
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_20%,currentColor)]"></div>
        <div className="relative z-20 mx-auto w-full max-w-6xl p-4 pt-20 md:pt-0">
          <h1 className="bg-opacity-50 bg-gradient-to-b from-neutral-400 to-primary bg-clip-text text-center text-4xl font-bold text-transparent md:text-6xl lg:text-7xl">
            Your Hub for Photocopy Services & Notes
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-center text-base font-normal text-muted-foreground">
            Connect with local copy centers for hassle-free printing, and build
            a library of notes that others can access. Empower your agency or
            share your expertise today!
          </p>
          <div className="z-40 flex justify-center gap-4 mt-10">
          <Button className={buttonVariants({ variant: "default" })}>
            <Landmark className="h-4 w-4" />

            <Link href="/become-an-agency">Become an Agency</Link>
          </Button>

          <Button className={buttonVariants({ variant: "secondary" })}>
            <Icons.user className="h-4 w-4" />

            <Link href="/sign-up"> Become a User</Link>
          </Button>
        </div>
        </div>
      </div>
    </div>
  )
}
