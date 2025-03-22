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
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"

// Define type for products
type Product = {
  id: string
  colorOption: string
  paperType: string
  printType: string
}

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
      return productService.getProducts(1, 10)
    },
    enabled: authData?.isAdmin,
  })

  const products: Product[] =
    data?.products.map((product: GetProducts) => ({
      id: product.id,
      colorOption: product.colorOption,
      paperType: product.paperType,
      printType: product.printType,
    })) || []

  // Function to handle product edit
  const handleEdit = (productId: string) => {
    console.log("Edit product:", productId)
    // Implement edit functionality here
  }

  // Function to handle product delete
  const handleDelete = (productId: string) => {
    console.log("Delete product:", productId)
    // Implement delete functionality here
  }

  // Color mapping function for better visual representation
  const getColorClass = (colorOption: string) => {
    switch (colorOption) {
      case "SiyahBeyaz":
        return "bg-gray-800 text-white"
      default:
        return "bg-blue-500 text-white"
    }
  }

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

      {isLoading ? (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="h-64 animate-pulse bg-muted/50">
              <CardContent className="flex h-full items-center justify-center">
                <p className="text-muted-foreground">Loading...</p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : error ? (
        <div className="mt-8 rounded border border-red-300 bg-red-50 p-4 text-red-800">
          Error loading products:{" "}
          {error instanceof Error ? error.message : "Unknown error"}
        </div>
      ) : products && products.length > 0 ? (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product: Product) => (
            <Card
              key={product.id}
              className="overflow-hidden transition-shadow hover:shadow-md"
            >
              <CardHeader className="p-4">
                <CardTitle className="truncate text-lg">
                  {product.printType}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="mb-4 grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Color Option
                    </p>
                    <Badge className={getColorClass(product.colorOption)}>
                      {product.colorOption}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Paper Type</p>
                    <Badge variant="outline">{product.paperType}</Badge>
                  </div>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  ID: {product.id.substring(0, 8)}...
                </p>
              </CardContent>
              <CardFooter className="flex justify-end gap-2 p-4 pt-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(product.id)}
                  className="h-8 w-12"
                >
                  <Pencil size={16} />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(product.id)}
                  className="h-8 w-12"
                >
                  <Trash2 size={16} />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="mt-8 flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <p className="mb-4 text-muted-foreground">No products found</p>
          <p className="mb-4 text-sm text-muted-foreground">
            Create your first product to get started
          </p>
        </div>
      )}
    </div>
  )
}
