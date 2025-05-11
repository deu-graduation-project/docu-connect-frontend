"use client"
import React from "react"
import useAuthStatus from "@/lib/queries/auth-status"

import CreateProductSheet from "./components/create-product-sheet"
import { Separator } from "@/components/ui/separator"
import { useQuery } from "@tanstack/react-query"
import { productService } from "@/services/products-service"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogClose,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { buttonVariants } from "@/components/ui/button"
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
import { cn } from "@/lib/utils"

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

  // Remove the queryClient.invalidateQueries call from inside queryFn
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["viewCreatedProducts"],
    queryFn: () => productService.getProducts(0, 20),
    enabled: authData?.isAdmin,
    staleTime: 0, // This ensures the data is always considered stale and will refetch
  })

  const products: Product[] =
    data?.products.map((product: any) => ({
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
  const handleDelete = async (productId: string) => {
    try {
      await productService.deleteProducts([productId])
      refetch() // Use the refetch function directly
      console.log(`Product ${productId} successfully deleted.`)
    } catch (error) {
      console.error("Error! Couldn't delete product", error)
    }
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

  // a color mapping funtion for paper type
  const getPaperTypeClass = (paperType: string) => {
    switch (paperType) {
      case "Mat":
        return "bg-gray-800 text-white"
      case "Parlak":
        return "bg-yellow-500 text-white"
      case "Saten":
        return "bg-green-500 text-white"
      default:
        return "bg-transparent text-white"
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
    <div className="max-w-4xl p-4 pb-12">
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
        <div className="grid w-auto max-w-4xl grid-cols-1 flex-col gap-4 py-4 sm:grid-cols-2">
          {products.map((product: Product) => (
            <Card
              key={product.id}
              className="flex w-full flex-col items-start overflow-hidden transition-shadow hover:shadow-md"
            >
              <CardHeader className="p-4">
                <CardTitle className="truncate text-lg">
                  {product.printType}
                </CardTitle>
              </CardHeader>
              <CardContent className="w-full p-4 pt-0">
                <div className="mb-4 flex w-full items-center justify-start gap-6">
                  <div className="flex flex-col gap-2">
                    <p className="text-sm text-muted-foreground">
                      Color Option
                    </p>
                    <Badge className="flex items-center justify-center">
                      {product.colorOption}
                    </Badge>
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="text-sm text-muted-foreground">Paper Type</p>
                    <Badge
                      className={cn(
                        getPaperTypeClass(`${product.paperType}`),
                        "flex items-center justify-center"
                      )}
                      variant="outline"
                    >
                      {product.paperType}
                    </Badge>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex w-full justify-start gap-2 p-4 pt-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(product.id)}
                  className="h-8 w-12"
                >
                  <Pencil size={16} />
                </Button>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="h-8 w-12"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="flex w-full flex-col">
                    <DialogHeader className="flex w-auto flex-col items-center justify-start text-left">
                      <DialogTitle className="w-full text-start">
                        Are you sure?
                      </DialogTitle>
                      <DialogDescription className="w-full text-start">
                        Are you sure you want to delete this product?
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex items-center justify-end gap-4">
                      <DialogClose asChild>
                        <Button
                          className={cn(
                            "text-white",
                            buttonVariants({ variant: "outline" })
                          )}
                        >
                          Cancel
                        </Button>
                      </DialogClose>
                      <Button
                        onClick={() => handleDelete(product.id)}
                        className={buttonVariants({ variant: "destructive" })}
                      >
                        Delete
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
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
