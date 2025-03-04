"use client"
import React from "react"
import { Icons } from "@/components/icons"
import { useEffect, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import useAuthStatus from "../../../lib/queries/auth-status"
import withAuth from "@/components/with-auth"
import { userService } from "@/services/user-service"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import UpdateAgencySheet from "@/components/update-agency-sheet"
const ProfilePage = () => {
  const { data, isLoading, error } = useAuthStatus()
  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error.message}</div>
  }

  if (!data?.isAuthenticated) {
    return <div>Please log in to view this content.</div>
  }

  console.log(
    data.isAgency === true
      ? "this account type is Agency"
      : "this account type is User"
  )

  // Fetch agency details
  const {
    data: agencyDetails,
    isLoading: agencyDetailsLoading,
    error: agencyDetailsError,
  } = useQuery({
    queryKey: ["agencyDetails", data.userId], // Include agencyId in the query key
    queryFn: () => {
      if (!data.userId) {
        throw new Error("Agency ID is missing")
      }
      return userService.getSingleAgency(data.userId)
    },
  })

  // you have to extract the outer object first before you can access the inner object for that we use .agency
  // console.log(agencyDetails?.agency.profilePhoto);

  return (
    <div className="pb-12">
      <div className="relative h-64 w-full">
        <div className="relative h-full w-full bg-background">
          <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_2px,transparent_2px),linear-gradient(to_bottom,#4f4f4f2e_2px,transparent_2px)] bg-[size:24px_36px] [mask-image:radial-gradient(background,transparent_95%)]"></div>
        </div>
        <div className="flex items-center justify-center">
          <Image
            src={`data:image/jpeg;base64,${agencyDetails?.agency.profilePhoto}`}
            alt="Profile"
            width={192}
            height={192}
            className="absolute h-48 w-48 rounded-full border bg-background object-cover"
          />
        </div>
      </div>
      <div className="absolute right-6 top-6">
        {/* <Button>Edit bio</Button> */}
        <UpdateAgencySheet />
      </div>
      <div className="flex items-center justify-center pt-32">
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-xl font-semibold">{data.username}</h1>
          <div className="flex items-center justify-center gap-2">
            <p className="text-sm text-muted-foreground">{data.email}</p>
            {data.isAgency && (
              <div className="flex items-center justify-center">
                <p className="text-sm text-muted-foreground">
                  {agencyDetails?.agency.province}
                </p>
                <p className="text-sm text-muted-foreground">/</p>
                <p className="text-sm text-muted-foreground">
                  {agencyDetails?.agency.district}
                </p>
              </div>
            )}
          </div>
          <div className="flex justify-center gap-4 pt-3">
            <div className="flex items-center justify-center gap-1">
              <h1 className="font-semibold">
                {agencyDetails?.agency.agencyProducts.length}
              </h1>
              <p className="text-sm text-muted-foreground"> Products</p>
            </div>
            <div className="flex items-center justify-center gap-1">
              <h1 className="font-semibold">
                {agencyDetails?.agency.comments.length}
              </h1>
              <p className="text-sm text-muted-foreground">Comments</p>
            </div>
            <div className="flex items-center justify-center gap-1">
              <h1 className="font-semibold">
                {agencyDetails?.agency.starRating
                  ? agencyDetails?.agency.starRating
                  : "0"}
              </h1>
              <p className="text-sm text-muted-foreground">Rating</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center py-6">
        <h1 className="text-base font-semibold">About Me</h1>
        <p className="max-w-2xl px-4 py-2 text-center text-muted-foreground">
          {agencyDetails?.agency.agencyBio === ""
            ? "No bio available"
            : agencyDetails?.agency.agencyBio}
        </p>
      </div>

      <div className="flex flex-col items-center justify-center">
        <h1 className="text-base font-semibold">Follow me on</h1>
        <div className="flex justify-center gap-4 py-4">
          <button>
            <Icons.twitter className="h-6 w-6 cursor-pointer" />
          </button>
          <button>
            <Icons.facebook className="h-6 w-6 cursor-pointer" />
          </button>
          <button>
            <Icons.instagram className="h-6 w-6 cursor-pointer" />
          </button>
          <button>
            <Icons.linkedin className="h-6 w-6 cursor-pointer" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default withAuth(ProfilePage)
