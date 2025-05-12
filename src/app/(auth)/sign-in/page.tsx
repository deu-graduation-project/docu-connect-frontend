import React from "react"
import Image from "next/image"
import SignInForm from "@/components/forms/sign-in-form"
import { Icons } from "@/components/icons"
import Link from "next/link"

export default function SignIn() {
  return (
    <div className="grid max-h-screen overflow-hidden lg:grid-cols-2">
      <div className="mx-12 flex flex-col gap-4 p-6 md:p-4">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="/" className="flex items-center space-x-2">
            <Icons.logo />
            <h1 className="text-xl font-bold sm:inline-block">DocuConnect</h1>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <SignInForm />
          </div>
        </div>
      </div>
      <div className="relative hidden max-h-screen bg-muted lg:block">
        <Image
          alt="photocopy machine login image"
          src={"/features_img_1.webp"}
          className="h-full w-full object-cover"
          width={3456}
          quality={100}
          height={5184}
        />
      </div>
    </div>
  )
}
