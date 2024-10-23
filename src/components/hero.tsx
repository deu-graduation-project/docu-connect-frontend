import React from "react";
import { cn } from "@/lib/utils";
import { Spotlight } from "./ui/spotlight";

export default function HeroSection() {
  return (
    <div className="h-[25rem] lg:h-[40rem] w-full  rounded-md flex md:items-center    dark:bg-dot-white/[0.2] bg-dot-black/[0.2] md:justify-center antialiased  relative overflow-hidden">
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-background  [mask-image:radial-gradient(ellipse_at_center,transparent_20%,currentColor)]"></div>

      <div className=" p-4 max-w-6xl z-20  mx-auto relative   w-full pt-20 md:pt-0">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-primary bg-opacity-50">
          Your Hub for Photocopy Services & Notes
        </h1>
        <p className="mt-4 font-normal text-base text-muted-foreground max-w-lg text-center mx-auto">
          Connect with local copy centers for hassle-free printing, and build a
          library of notes that others can access. Empower your agency or share
          your expertise today!
        </p>
      </div>
    </div>
  );
}
