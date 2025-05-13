"use client"
import React from "react"
import { Icons } from "@/components/icons"
import { useQuery } from "@tanstack/react-query"
import useAuthStatus from "../../../lib/queries/auth-status"
import withAuth from "@/components/with-auth"
import { userService } from "@/services/user-service"
import Image from "next/image"
import UpdateAgencySheet from "@/components/update-agency-sheet"
import { getRandomPatternStyle } from "@/lib/generate-pattern"
import PendingOrdersSection from "./components/pending-orders-section" // Import the new component
import AgencyLocationMap from "./components/agency-location-map"
import { StickyBanner } from "@/components/ui/sticky-banner"
// mport the new map component
const ProfilePage = () => {
  const { data: authStatus, isLoading, error } = useAuthStatus()
  // Fetch agency details - only when user is an agency
  const { data: agencyDetails, isLoading: agencyDetailsLoading } = useQuery({
    queryKey: ["agencyDetails", authStatus?.userId],
    queryFn: () => {
      if (!authStatus?.userId) {
        throw new Error("Agency ID is missing")
      }
      return userService.getSingleAgency(authStatus.userId)
    },
    enabled: authStatus?.isAgency,
  })
  

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error.message}</div>
  }

  if (!authStatus?.isAuthenticated) {
    return <div>Please log in to view this content.</div>
  }

  return (
    <>
      {authStatus.isAgency ? (
        <AgencyProfile
          authStatus={authStatus}
          agencyDetails={agencyDetails}
          agencyDetailsLoading={agencyDetailsLoading}
        />
      ) : (
        <UserProfile authStatus={authStatus} />
      )}
    </>
  )
}


const UserProfile = ({ authStatus }) => {
  const { data, isLoading } = useQuery({
    queryKey: ["userDetails", authStatus?.userId],
    queryFn: () => {
      if (!authStatus?.userId) {
        throw new Error("User ID is missing")
      }
      return userService.getUserById(authStatus.userId)
    },
    enabled: authStatus?.isAuthenticated,
  })

  const {
    data: pendingRequests,
    isLoading: pendingRequestsLoading,
    error: pendingRequestsError,
  } = useQuery({
    queryKey: ["agencyRequests"],
    queryFn: () => userService.anyPendingBeAnAgencyRequest(), // Pass default pagination values
    // Only run this query if we're authenticated
    enabled: authStatus?.isAuthenticated,
  })

  console.log("Pending Requests:", pendingRequests)

  // Verinin doğru şekilde yüklendiğinden emin olun
  if (isLoading) {
    return <div>Loading...</div>
  }

  if (pendingRequestsError) {
    return <div>Error loading user data</div>
  }

  // "Pending" statüsünü kontrol et
  const isPending = data?.status === "Pending" // Verinin durumunu kontrol et
  console.log("User data:", data)

  return (
    <div className="pb-12">
      {/* Sticky Banner sadece onay bekleyen kullanıcılara */}
      {pendingRequests?.hasRequest && (
        <StickyBanner  className="bg-secondary">
          <p className="mx-0 text-sm  text-primary drop-shadow-md">
            Your account has not been approved yet. Please wait until the review process is finalized.
          </p>
        </StickyBanner>
      )}

      <div className="relative h-64 w-full">
        <div className="relative h-full w-full bg-background">
          <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_2px,transparent_2px),linear-gradient(to_bottom,#4f4f4f2e_2px,transparent_2px)] bg-[size:24px_36px] [mask-image:radial-gradient(background,transparent_95%)]"></div>
        </div>
        <div className="flex items-center justify-center">
          <div
            style={getRandomPatternStyle(`${authStatus.userId}`)}
            className="absolute h-48 w-48 rounded-full border bg-background"
          />
        </div>
      </div>

      <div className="flex items-center justify-center pt-32">
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-xl font-semibold">{authStatus.username}</h1>
          <div className="flex items-center justify-center gap-2">
            <p className="text-sm text-muted-foreground">{authStatus.email}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center py-6">
        {authStatus.isAdmin && (
          <p className="max-w-2xl px-4 py-2 text-center text-sm text-muted-foreground">
            This is an admin account. You can create agency products and confirm
            accounts as agency
          </p>
        )}
      </div>

      {/* Sipariş listesi */}
      <PendingOrdersSection userId={authStatus.userId} />
    </div>
  )
}

const AgencyProfile = ({ authStatus, agencyDetails, agencyDetailsLoading }) => {
  console.log(agencyDetails)
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
        <UpdateAgencySheet />
      </div>

      <div className="flex items-center justify-center pt-32">
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-xl font-semibold">{authStatus.username}</h1>
          <div className="flex items-center justify-center gap-2">
            <p className="text-sm text-muted-foreground">{authStatus.email}</p>
            <div className="flex items-center justify-center">
              <p className="text-sm text-muted-foreground">
                {agencyDetails?.agency.province}
              </p>
              <p className="text-sm text-muted-foreground">/</p>
              <p className="text-sm text-muted-foreground">
                {agencyDetails?.agency.district}
              </p>
            </div>
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
                {agencyDetails?.agency.starRating || "0"}
              </h1>
              <p className="text-sm text-muted-foreground">Rating</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center py-6">
        <h1 className="text-base font-semibold">About Me</h1>
        <p className="max-w-2xl px-4 py-2 text-center text-sm text-muted-foreground">
          {agencyDetails?.agency.agencyBio === ""
            ? "No bio available"
            : agencyDetails?.agency.agencyBio}
        </p>
      </div>
      <div className="mx-auto w-full max-w-6xl">
        <AgencyLocationMap
          agencyName={agencyDetails?.agency.agencyName}
          province={agencyDetails?.agency.province}
          district={agencyDetails?.agency.district}
          // addressExtra={agencyDetails?.agency.addressExtra}
        />
      </div>

      <div className="flex flex-col items-center justify-center">
        <h1 className="text-base font-semibold">Takip Et</h1>
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

      {/* Add PendingOrdersSection for agency as well */}
      {authStatus.isAgency ? (
        ""
      ) : (
        <PendingOrdersSection userId={authStatus.userId} />
      )}
    </div>
  )
}

export default withAuth(ProfilePage)
