// components/agency-list.tsx (modified version with links)
import React from "react"
import { useQuery } from "@tanstack/react-query"
import { userService } from "@/services/user-service"
import { GetAgencies } from "@/types/classes"
import { getRandomPatternStyle } from "@/lib/generate-pattern"
import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { StarRating } from "@/components/star-rating" // Import the new component

type AgencyListResponse = {
  totalCount: number
  agencies: GetAgencies[]
}

type AgencyListProps = {
  province?: string
  district?: string
  orderBy?: string
  paperType?: string
  colorOptions?: number
  printType?: number
  currentPage: number
  itemsPerPage: number
  onPageChange: (page: number) => void
}

export default function AgencyList({
  province,
  district,
  orderBy,
  paperType,
  colorOptions,
  printType,
  currentPage,
  itemsPerPage,
  onPageChange,
}: AgencyListProps) {
  // Use query with the exact parameters from the service
  const {
    data: agencyList,
    isLoading: isAgencyListLoading,
    error: agencyListError,
  } = useQuery<AgencyListResponse>({
    queryKey: [
      "AgencyList",
      province,
      district,
      orderBy,
      paperType,
      colorOptions,
      printType,
      currentPage,
      itemsPerPage,
    ],
    queryFn: async () => {
      return await userService.getAgencies(
        currentPage,
        itemsPerPage,
        undefined, // agencyName is undefined
        province,
        district,
        orderBy,
        paperType,
        colorOptions?.toString(), // Convert number to string
        printType?.toString() // Convert number to string
      )
    },
  })

  console.log("Agency List:", agencyList)

  // Calculate total pages
  const totalPages = agencyList?.totalCount
    ? Math.ceil(agencyList.totalCount / itemsPerPage)
    : 0

  // Generate pagination range
  const getPaginationRange = () => {
    const range = []
    const delta = 1 // How many pages to show before and after current page

    for (
      let i = Math.max(1, currentPage - delta);
      i <= Math.min(totalPages, currentPage + delta);
      i++
    ) {
      range.push(i)
    }

    // Add first page if not already in range
    if (range[0] > 1) {
      range.unshift(1)
      // Add ellipsis if there's a gap
      if (range[1] > 2) {
        range.splice(1, 0, "ellipsis1")
      }
    }

    // Add last page if not already in range
    if (range[range.length - 1] < totalPages) {
      // Add ellipsis if there's a gap
      if (range[range.length - 1] < totalPages - 1) {
        range.push("ellipsis2")
      }
      range.push(totalPages)
    }

    return range
  }

  const paginationRange = getPaginationRange()

  return (
    <div className="flex w-full flex-col items-center justify-start gap-4 pb-8">
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
            Showing {(currentPage - 1) * itemsPerPage + 1} -{" "}
            {Math.min(currentPage * itemsPerPage, agencyList.totalCount)} of{" "}
            {agencyList.totalCount} agencies
            {province && ` in ${province}`}
            {district && `, ${district}`}
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {agencyList.agencies.map((agency) => (
              <Link
                href={`/dashboard/agencies/${agency.agencyId}`}
                key={agency.agencyId}
                className="transition-transform hover:scale-[1.02]"
              >
                <div className="mb-2 flex flex-col items-start justify-center gap-2 rounded-md border p-4 hover:shadow-md">
                  <div
                    className="h-32 w-full rounded-lg"
                    style={getRandomPatternStyle(parseInt(agency.agencyId))} // Convert string to number
                  />

                  <h3 className="text-xl font-semibold">{agency.agencyName}</h3>
                  <div className="flex items-center justify-start gap-2">
                    <p className="text-sm text-muted-foreground">Location:</p>
                    <span
                      className="block max-w-[200px] truncate text-sm text-primary"
                      title={`${agency.province}, ${agency.district}`}
                    >
                      {agency.province}, {agency.district}
                    </span>
                  </div>
                  <div className="flex items-center justify-start gap-2">
                    <p className="text-sm text-muted-foreground">Rating:</p>
                    {agency.starRating === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        no rating yet
                      </p>
                    ) : (
                      <StarRating rating={agency.starRating} />
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                aria-label="Previous page"
              >
                <Icons.chevronLeft className="h-4 w-4" />
              </Button>

              {paginationRange.map((page) => // Removed unused 'index'
                typeof page === "string" ? (
                  <span key={page} className="px-2">
                    ...
                  </span>
                ) : (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="icon"
                    onClick={() => onPageChange(page)}
                    className="h-8 w-8"
                    aria-label={`Go to page ${page}`}
                    aria-current={currentPage === page ? "page" : undefined}
                  >
                    {page}
                  </Button>
                )
              )}

              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  onPageChange(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                aria-label="Next page"
              >
                <Icons.chevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="p-8 text-center text-muted-foreground">
          No agencies found {province && ` in ${province}`}
          {district && `, ${district}`}
        </div>
      )}
    </div>
  )
}
