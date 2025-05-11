"use client"
import React, { useState, useEffect } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { productService } from "@/services/products-service"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { Icons } from "@/components/icons"
import useAuthStatus from "@/lib/queries/auth-status"

type CreateAgencyProduct = {
  ProductId: string
  Price: number
}

export default function CreateAgencyProductForm() {
  const queryClient = useQueryClient()
  const [productPrices, setProductPrices] = useState<{ [key: string]: number }>(
    {}
  )

  const {
    data: authStatus,
    isLoading: authLoading,
    error: authError,
  } = useAuthStatus()

  // Query to fetch products with proper typing
  const {
    data: productList,
    isLoading: productListLoading,
    error: productListError,
  } = useQuery({
    queryKey: ["ProductListForAgencies"],
    queryFn: async () => {
      if (!authStatus?.userId) throw new Error("Agency ID is missing")
      return productService.getProducts(0, 10)
    },
    enabled: !!authStatus?.userId,
  })
  console.log("Product List:", productList)
  // Get the actual products array from the response
  const products = productList?.products || []

  // Initialize prices state when product list is loaded
  useEffect(() => {
    if (products && products.length > 0) {
      const initialPrices = products.reduce(
        (acc, product) => {
          if (product.price !== undefined && product.price !== null) {
            acc[product.id] = product.price
          }
          return acc
        },
        {} as { [key: string]: number }
      )
      setProductPrices(initialPrices)
    }
  }, [products]) // Dependency on products array

  // Mutation for creating/updating products
  const createAgencyProductMutation = useMutation({
    mutationFn: async () => {
      const agencyProducts: CreateAgencyProduct[] = Object.entries(
        productPrices
      )
        .filter(([, price]) => price > 0)
        .map(([productId, price]) => ({
          ProductId: productId,
          Price: price,
        }))

      // Send the data to backend
      return await productService.createAgencyProduct(agencyProducts)
    },
    onSuccess: () => {
      // Invalidate and refetch to ensure fresh data
      queryClient.invalidateQueries({ queryKey: ["ProductListForAgencies"] })
      queryClient.invalidateQueries({ queryKey: ["AgencyProducts"] })

      toast.success("Product prices saved successfully")
    },
    onError: (error: { message: string }) => {
      toast.error(error.message || "Failed to create agency products")
    },
  })

  const handlePriceChange = (productId: string, price: number) => {
    setProductPrices((prev) => ({
      ...prev,
      [productId]: price,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    createAgencyProductMutation.mutate(undefined, {
      onSuccess: () => {
        setProductPrices({})
      },
    })
  }

  const isFormValid = Object.values(productPrices).some((price) => price > 0)

  if (authLoading || productListLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Icons.spinner className="mr-2 h-8 w-8 animate-spin" />
        <span>Loading products...</span>
      </div>
    )
  }

  if (authError || productListError) {
    return (
      <div className="p-4 text-red-500">
        Error: {authError?.message || productListError?.message}
      </div>
    )
  }

  return (
    <div className="mx-auto h-[550px] max-w-4xl">
      <Card className="h-[550px] overflow-y-scroll border-none">
        <CardContent className="border-none p-4">
          {products.length === 0 ? (
            <div className="text-center text-muted-foreground">
              No products available to add prices
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center gap-4 rounded-lg border p-4"
                >
                  <div className="flex-grow">
                    <div className="font-semibold">{product.printType}</div>
                    <div className="text-sm text-muted-foreground">
                      {product.paperType} - {product.colorOption}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col items-end gap-1">
                      <label
                        htmlFor={`price-${product.id}`}
                        className="sr-only"
                      >
                        Price for {product.printType}
                      </label>
                      <Input
                        id={`price-${product.id}`}
                        type="number"
                        placeholder="₺ Price"
                        className="w-28"
                        value={productPrices[product.id] || ""}
                        onChange={(e) => {
                          const price = parseFloat(e.target.value)
                          handlePriceChange(
                            product.id,
                            isNaN(price) ? 0 : price
                          )
                        }}
                        min={0}
                        step="0.01"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <Button
                type="submit"
                disabled={!isFormValid || createAgencyProductMutation.isPending}
                className="w-full"
              >
                {createAgencyProductMutation.isPending ? (
                  <>
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Product Prices"
                )}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
