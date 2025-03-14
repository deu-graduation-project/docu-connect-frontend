"use client"
import React from "react"
import useAuthStatus from "@/lib/queries/auth-status"
import { userService } from "@/services/user-service"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import {
  GetBeAnAgencyRequests,
  BeAnAgencyRequestState,
} from "../../../types/classes"
import Image from "next/image"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { useRouter } from "next/navigation"
import { useMutation } from "@tanstack/react-query"
import { boolean } from "zod"
import { toast } from "sonner"
import { useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
export default function AgencyRequestsPage() {
  const {
    data: authData,
    isLoading: authLoading,
    error: authError,
  } = useAuthStatus()
  const queryClient = useQueryClient()
  const router = useRouter()
  const { isLoading: isAuthLoading } = useAuth()

  useEffect(() => {
    if (authData?.isAuthenticated === false) {
      router.push("/sign-in")
    }
  }, [authData, router])

  // Fetch agency requests
  const {
    data: agencyRequests,
    isLoading: requestsLoading,
    error: requestsError,
  } = useQuery({
    queryKey: ["agencyRequests"],
    queryFn: () => userService.getBeAnAgencyRequests(1, 10), // Pass default pagination values
    // Only run this query if we're authenticated
    enabled: !isAuthLoading,
  })

  // handle approve request
  const { mutate: handleAgencyRequest } = useMutation({
    mutationFn: ({
      requestId,
      isConfirmed,
    }: {
      requestId: string
      isConfirmed: boolean
    }) => userService.beAnAgencyConfirm(requestId, isConfirmed),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agencyRequests"] })
      toast.success("Agency request updated successfully")
    },
    onError: (error) => {
      console.error("Failed to update agency request", error)
      toast.error("Failed to update agency request")
    },
  })

  // @ts-expect-error: Type assertion for filtering pending requests
  const pendingRequests = agencyRequests?.beAnAgencyRequests.filter(
    (request) => request.beAnAgencyRequestState === "Pending"
  )

  // Handle loading state
  if (authLoading || requestsLoading) {
    return (
      <div className="mx-auto mt-12 flex max-h-screen w-full items-center p-4">
        <div className="flex flex-1 flex-col gap-4 pt-0">
          <div className="grid auto-rows-min grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="h-[300px] w-auto animate-pulse rounded-xl bg-muted/50" />
            <div className="h-[300px] w-auto animate-pulse rounded-xl bg-muted/50" />
            <div className="hidden h-[300px] w-auto animate-pulse rounded-xl bg-muted/50 lg:flex" />
          </div>
          <div className="flex h-full w-full gap-4">
            <div className="mb-2 h-[300px] w-auto animate-pulse rounded-xl bg-muted/50"></div>
            <div className="mb-2 h-[300px] w-auto animate-pulse rounded-xl bg-muted/50"></div>
          </div>
        </div>
      </div>
    )
  }

  // Handle unauthorized access
  if (authData?.isAdmin === false) {
    return <div>Unauthorized: You are not an admin.</div>
  }

  // Handle errors
  if (authError) {
    return <div>Error: {authError.message}</div>
  }
  if (requestsError) {
    return <div>Error: {requestsError.message}</div>
  }

  // Handle empty state
  if (!pendingRequests || pendingRequests.length === 0) {
    return (
      <div className="flex h-[calc(100vh-200px)] flex-col items-center justify-center">
        <h1 className="mb-4 text-2xl font-bold">Agency Requests</h1>
        <p className="text-muted-foreground">
          No pending agency requests found.
        </p>
      </div>
    )
  }

  return (
    <div className="mx-4 flex flex-col items-start justify-center overflow-hidden">
      <h1 className="mb-4 text-2xl font-bold">Agency Requests</h1>
      <div className="grid w-full grid-cols-1 gap-4 overflow-hidden sm:w-auto sm:grid-cols-2 lg:grid-cols-3">
        {pendingRequests?.map(
          // Use lowercase 'b'

          (request: GetBeAnAgencyRequests) => {
            return (
              <div
                key={request.beAnAgencyRequestId} // Use a unique key
                className="my-4 flex flex-col gap-2 rounded-md border p-4 shadow-md"
              >
                {request.profilePhoto ? (
                  <div className="">
                    <Image
                      src={`data:image/jpeg;base64,${request.profilePhoto}`} // Ensure this is a valid base64 string
                      width={100}
                      height={100}
                      alt={`Profile of ${request.name}`}
                      className="h-16 w-16 rounded-full border object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-full border bg-transparent p-4 text-[17px] font-semibold">
                    {request.name.slice(0, 1)}
                    {request.surname.slice(0, 1)}
                  </div>
                )}
                <h2 className="pt-2 text-lg font-semibold">
                  {request.agencyName}
                </h2>

                <p className="mt-2 text-sm text-muted-foreground">
                  <strong className="text-white">Name:</strong> {request.name}{" "}
                  {request.surname}
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong className="text-white">Email:</strong> {request.email}
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong className="text-white">Address:</strong>{" "}
                  {request.address.province}, {request.address.district}
                </p>

                <div className="flex w-full items-center justify-between pt-2">
                  <Button
                    onClick={() =>
                      handleAgencyRequest({
                        requestId: request.beAnAgencyRequestId,
                        isConfirmed: true,
                      })
                    }
                    className={cn(
                      buttonVariants({ variant: "outline" }),
                      "bg-outline mr-2 w-full rounded-md px-4 py-1 text-white"
                    )}
                  >
                    Approve
                  </Button>
                  <button
                    onClick={() =>
                      handleAgencyRequest({
                        requestId: request.beAnAgencyRequestId,
                        isConfirmed: false,
                      })
                    }
                    className={cn(
                      buttonVariants({ variant: "destructive" }),
                      "mr-2 w-full rounded-md px-4 py-1 text-white"
                    )}
                  >
                    Reject
                  </button>
                </div>
              </div>
            )
          }
        )}
      </div>
    </div>
  )
}
