"use client"
import React, { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { productService } from "@/services/products-service"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { Icons } from "@/components/icons"
import useAuthStatus from "@/lib/queries/auth-status"

type Product = {
  id: string
  colorOption: string
  paperType: string
  printType: string
}

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

  const {
    data: productList,
    isLoading: productListLoading,
    error: productListError,
  } = useQuery({
    queryKey: ["ProductListForAgencies"],
    queryFn: () => {
      if (!authStatus?.userId) throw new Error("Agency ID is missing")
      return productService.getAgencyProducts(authStatus.userId)
    },
    enabled: !!authStatus?.userId,
  })

  const products: Product[] =
    productList?.agencyProducts?.map((product: any) => ({
      id: product.id,
      colorOption: product.colorOption,
      paperType: product.paperType,
      printType: product.printType,
    })) || []

  const createAgencyProductMutation = useMutation({
    mutationFn: async () => {
      const agencyProducts: CreateAgencyProduct[] = Object.entries(
        productPrices
      )
        .filter(([_, price]) => price > 0)
        .map(([productId, price]) => ({
          ProductId: productId,
          Price: price,
        }))
      return productService.createAgencyProduct(agencyProducts)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ProductListForAgencies"] })
      toast.success("Agency products created successfully")
      setProductPrices({})
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
    createAgencyProductMutation.mutate()
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
    <div className="mx-auto max-w-4xl p-4">
      <Card>
        <CardHeader>
          <CardTitle>Create Agency Products</CardTitle>
        </CardHeader>
        <CardContent>
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
                  <div className="flex flex-col items-end gap-1">
                    <label htmlFor={`price-${product.id}`} className="sr-only">
                      Price for {product.printType}
                    </label>
                    <Input
                      id={`price-${product.id}`}
                      type="number"
                      placeholder="₺ Price"
                      className="w-32"
                      value={productPrices[product.id] || ""}
                      onChange={(e) => {
                        const price = parseFloat(e.target.value)
                        handlePriceChange(product.id, isNaN(price) ? 0 : price)
                      }}
                      min={0}
                      step="0.01"
                    />
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
                    Creating...
                  </>
                ) : (
                  "Create Agency Products"
                )}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
