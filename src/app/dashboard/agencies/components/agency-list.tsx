import React from "react"
import { useQuery } from "@tanstack/react-query"
import { userService } from "@/services/user-service"
import { GetAgencies } from "@/types/classes"
import { getRandomPatternStyle } from "@/lib/generate-pattern"
import { Icons } from "@/components/icons"

type AgencyListResponse = {
  totalCount: number
  agencies: GetAgencies[]
}

// Star Rating component to show filled and empty stars
function StarRating({ rating }: { rating: number }) {
  // Make sure rating is between 0 and 5
  const safeRating = Math.min(5, Math.max(0, rating))

  // Create an array of 5 stars
  return (
    <div className="flex items-center justify-start gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Icons.star
          key={star}
          color="white"
          fill={star <= safeRating ? "white" : "transparent"}
          className="h-4 w-4"
        />
      ))}
    </div>
  )
}

export default function AgencyList() {
  const {
    data: agencyList,
    isLoading: isAgencyListLoading,
    error: agencyListError,
  } = useQuery<AgencyListResponse>({
    queryKey: ["AgencyList"],
    queryFn: async () => {
      return await userService.getAgencies(1, 10)
    },
  })

  return (
    <div className="flex flex-col items-center justify-start gap-4 pb-8">
      {isAgencyListLoading ? (
        <div className="flex items-center justify-center p-8">
          <Icons.spinner className="mr-2 h-5 w-5 animate-spin" />
          <span>Loading agencies...</span>
        </div>
      ) : agencyListError ? (
        <div className="p-8 text-center text-red-500">
          Error loading agencies
        </div>
      ) : agencyList?.agencies && agencyList.agencies.length > 0 ? (
        <div className="flex w-full flex-col gap-4">
          <p className="mt-2 text-sm text-muted-foreground">
            Showing {agencyList.agencies.length} of {agencyList.totalCount}{" "}
            agencies
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {agencyList.agencies.map((agency) => (
              <div
                key={agency.agencyId}
                className="mb-2 flex flex-col items-start justify-center gap-2 rounded-md border p-4"
              >
                <div
                  className="h-32 w-full rounded-lg"
                  style={getRandomPatternStyle(agency.agencyId)}
                />

                <h3 className="text-xl font-semibold">{agency.agencyName}</h3>
                <div className="flex items-end justify-start gap-2">
                  <p className="text-sm text-muted-foreground">Location:</p>
                  {agency.province}, {agency.district}
                </div>
                <div className="flex items-center justify-start gap-2">
                  <p className="text-sm text-muted-foreground">Rating:</p>
                  {agency.starRating === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      no rating for this agency yet
                    </p>
                  ) : (
                    <StarRating rating={agency.starRating} />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-8 text-center text-muted-foreground">
          No agencies found
        </div>
      )}
    </div>
  )
}
