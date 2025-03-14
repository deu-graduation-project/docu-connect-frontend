"use client"
import React from "react"
import useAuthStatus from "@/lib/queries/auth-status"
import { useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import CreateProductSheet from "./components/create-product-sheet"
import { Separator } from "@/components/ui/separator"
import { useQuery } from "@tanstack/react-query"
import { productService } from "@/services/products-service"
export default function CreateProducts() {
  const {
    data: authData,
    isLoading: authLoading,
    error: authError,
  } = useAuthStatus()
  const queryClient = useQueryClient()
  const router = useRouter()
  const { isLoading: isAuthLoading } = useAuth()

  const { data, isLoading, error } = useQuery({
    queryKey: ["viewCreatedProducts"],
    queryFn: () => {
      if (!authData?.isAdmin) {
        throw new Error(
          "can't show products because the accunt type is not admin."
        )
      }

      return productService.getProducts(1, 10)
    },
    enabled: authData?.isAdmin,
  })

  console.log(data)
  // Handle loading state
  if (authLoading) {
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

  return (
    <div className="p-4 pb-12">
      <div className="flex w-full flex-col items-start justify-between sm:flex-row sm:items-center">
        <h1 className="mb-4 text-xl font-bold lg:text-2xl">Created Products</h1>
        <CreateProductSheet />
      </div>
      <Separator className="mt-4" />
      <div className="mt-4 h-64 rounded-lg border border-secondary p-2"></div>
    </div>
  )
}
