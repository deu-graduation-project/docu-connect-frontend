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
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CreateOrder from "./components/create-order"
import UserCart from "./components/user-cart"

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
    <div className="container mx-auto max-w-6xl p-4">
      <div className="mb-4">
        <Link href="/dashboard/agencies">
          <Button variant="outline" className="mb-4">
            <Icons.chevronLeft className="mr-2 h-4 w-4" />
            Back to agencies
          </Button>
        </Link>
      </div>

      {/* Agency Header */}
      <div className="relative pb-12">
        <div className="relative h-64 w-full">
          <div className="relative h-full w-full bg-background">
            <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_2px,transparent_2px),linear-gradient(to_bottom,#4f4f4f2e_2px,transparent_2px)] bg-[size:24px_36px] [mask-image:radial-gradient(background,transparent_95%)]"></div>
          </div>
          <div className="flex items-center justify-center">
            {agency.profilePhoto ? (
              <img
                src={`data:image/jpeg;base64,${agency.profilePhoto}`}
                alt="Profile"
                className="absolute h-48 w-48 rounded-full border bg-background object-cover"
              />
            ) : (
              <div
                style={getRandomPatternStyle(agency.agencyId)}
                className="absolute h-48 w-48 rounded-full border bg-background"
              />
            )}
          </div>
        </div>
        <div className="flex items-center justify-center pt-32">
          <div className="flex flex-col items-center gap-2">
            <h1 className="text-xl font-semibold">{agency.agencyName}</h1>
            <div className="flex items-center justify-center gap-2">
              <div className="flex items-center justify-center">
                <p className="text-sm text-muted-foreground">
                  {agency.province}
                </p>
                <p className="text-sm text-muted-foreground">/</p>
                <p className="text-sm text-muted-foreground">
                  {agency.district}
                </p>
                {agency.addressExtra && (
                  <>
                    <p className="text-sm text-muted-foreground">/</p>
                    <p className="text-sm text-muted-foreground">
                      {agency.addressExtra}
                    </p>
                  </>
                )}
              </div>
            </div>
            <div className="flex justify-center gap-4 pt-3">
              <div className="flex items-center justify-center gap-1">
                <h1 className="font-semibold">
                  {agency.agencyProducts?.length || 0}
                </h1>
                <p className="text-sm text-muted-foreground"> Products</p>
              </div>
              <div className="flex items-center justify-center gap-1">
                <h1 className="font-semibold">
                  {agency.comments?.length || 0}
                </h1>
                <p className="text-sm text-muted-foreground">Comments</p>
              </div>
              <div className="flex items-center justify-center gap-1">
                <h1 className="font-semibold">
                  {agency.starRating ? agency.starRating.toFixed(1) : "0"}
                </h1>
                <p className="text-sm text-muted-foreground">Rating</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Agency Bio */}
      {agency.agencyBio && (
        <div className="flex flex-col items-center justify-center py-6">
          <h1 className="text-base font-semibold">About {agency.agencyName}</h1>
          <p className="max-w-2xl px-4 py-2 text-center text-sm text-muted-foreground">
            {agency.agencyBio}
          </p>
        </div>
      )}

      <Tabs
        defaultValue="available-products"
        className="min-h-[260px] w-full max-w-6xl pt-12"
      >
        <TabsList>
          <TabsTrigger value="available-products">
            Available Products
          </TabsTrigger>
          <TabsTrigger value="create-order">Create your order</TabsTrigger>
          <TabsTrigger value="your-cart">Your Cart</TabsTrigger>
        </TabsList>
        <TabsContent className="w-full pt-4" value="available-products">
          {/* Agency Products */}
          <Card className="mb-8 w-full">
            <CardContent className="w-full pt-6">
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
        </TabsContent>
        <TabsContent value="create-order">
          <Card className="mb-8 w-full">
            <CardHeader>
              <CardTitle>Create your order</CardTitle>
            </CardHeader>
            <CardContent className="w-full pt-6">
              <CreateOrder agencyId={agencyDetails.agency.agencyId} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent className="py-4" value="your-cart">
          <UserCart agencyId={agencyDetails.agency.agencyId} />
        </TabsContent>
      </Tabs>

      {/* Agency Reviews - Using your styling */}
      <Card className="my-12">
        <CardHeader>
          <CardTitle>Customer Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          {agency.comments && agency.comments.length > 0 ? (
            <>
              {agency.comments.map((comment, index) => (
                <div key={index} className="mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">
                        {comment.userName}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Reviewed on{" "}
                        {new Date(comment.createdDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <Star
                          key={idx}
                          size={18}
                          className={cn(
                            "text-muted-foreground",
                            idx < Number(comment.starRating)
                              ? "text-yellow-500"
                              : ""
                          )}
                        />
                      ))}
                    </div>
                  </div>

                  <p className="mt-4">{comment.commentText}</p>

                  {index < agency.comments.length - 1 && (
                    <Separator className="my-6" />
                  )}
                </div>
              ))}
            </>
          ) : (
            <p className="text-muted-foreground">No reviews yet</p>
          )}
        </CardContent>
      </Card>

      {/* Social Media Section */}
      <div className="mt-8 flex flex-col items-center justify-center">
        <h1 className="text-base font-semibold">Follow us on</h1>
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
