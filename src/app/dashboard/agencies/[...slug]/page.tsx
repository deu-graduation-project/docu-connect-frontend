// app/agencies/[slug]/page.tsx
"use client"

import React from "react"
import { useParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { userService } from "@/services/user-service"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Icons } from "@/components/icons"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getRandomPatternStyle } from "@/lib/generate-pattern"

// Star Rating component (inline for simplicity)
function StarRating({ rating }: { rating: number }) {
  const safeRating = Math.min(5, Math.max(0, rating))
  return (
    <div className="flex items-center justify-start gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Icons.star
          key={star}
          fill={star <= safeRating ? "currentColor" : "transparent"}
          className="h-4 w-4 text-yellow-500"
        />
      ))}
    </div>
  )
}

export default function AgencyPage() {
  const params = useParams()
  const agencyId =
    typeof params.slug === "string"
      ? params.slug
      : Array.isArray(params.slug)
        ? params.slug[0]
        : ""

  // Fetch agency details
  const {
    data: agencyDetails,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["AgencyDetails", agencyId],
    queryFn: async () => {
      if (!agencyId) throw new Error("Agency ID is missing")
      return await userService.getSingleAgency(agencyId)
    },
    enabled: !!agencyId,
  })

  const agency = agencyDetails?.agency

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Icons.spinner className="mr-2 h-5 w-5 animate-spin" />
        <span>Loading agency details...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-500">
        Error loading agency details
        <div className="mt-4">
          <Link href="/agencies">
            <Button>Back to agencies</Button>
          </Link>
        </div>
      </div>
    )
  }

  if (!agency) {
    return (
      <div className="p-8 text-center">
        <h2 className="mb-4 text-2xl font-bold">Agency not found</h2>
        <p className="mb-6 text-muted-foreground">
          The agency you are looking for does not exist or has been removed.
        </p>
        <Link href="/agencies">
          <Button>Back to agencies</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <Link href="/dashboard/agencies">
          <Button variant="outline" className="mb-4">
            <Icons.chevronLeft className="mr-2 h-4 w-4" />
            Back to agencies
          </Button>
        </Link>
      </div>

      {/* Agency Header */}
      <div className="mb-8 grid gap-6 md:grid-cols-3">
        <div className="col-span-2">
          <h1 className="text-3xl font-bold md:text-4xl">
            {agency.agencyName}
          </h1>
          <div className="mt-2 flex items-center">
            {agency.starRating > 0 ? (
              <>
                <StarRating rating={agency.starRating} />
                <span className="ml-2 text-muted-foreground">
                  {agency.starRating.toFixed(1)}
                </span>
              </>
            ) : (
              <span className="text-sm text-muted-foreground">
                No ratings yet
              </span>
            )}
          </div>
          <p className="mt-2 text-muted-foreground">
            {agency.province}, {agency.district}
            {agency.addressExtra && `, ${agency.addressExtra}`}
          </p>
        </div>
        <div>
          <div
            className="h-32 w-full rounded-lg md:h-full"
            style={getRandomPatternStyle(agency.agencyId)}
          />
        </div>
      </div>

      {/* Agency Bio */}
      {agency.agencyBio && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>About {agency.agencyName}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{agency.agencyBio}</p>
          </CardContent>
        </Card>
      )}

      {/* Agency Products */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Available Products</CardTitle>
        </CardHeader>
        <CardContent>
          {agency.agencyProducts && agency.agencyProducts.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {agency.agencyProducts.map((product) => (
                <Card key={product.productId} className="p-4">
                  <div className="flex flex-col gap-2">
                    <div className="text-lg font-medium">
                      {product.printType}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {product.paperType}, {product.colorOption}
                    </div>
                    <div className="mt-2 text-lg font-bold">
                      ₺{product.price.toFixed(2)}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No products available</p>
          )}
        </CardContent>
      </Card>

      {/* Agency Reviews */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          {agency.comments && agency.comments.length > 0 ? (
            <div className="space-y-4">
              {agency.comments.map((comment, index) => (
                <div key={index} className="border-b pb-4 last:border-0">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{comment.userName}</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(comment.createdDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="mt-1">
                    <StarRating rating={Number(comment.starRating)} />
                  </div>
                  <p className="mt-2">{comment.commentText}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No reviews yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
