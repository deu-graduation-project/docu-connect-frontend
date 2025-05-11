"use client"
import React, { useState, useEffect, useMemo } from "react"
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
  // Memoize the products array to prevent unnecessary re-renders
  const products = useMemo(() => productList?.products || [], [productList])
  // Initialize prices state when product list is loaded
  useEffect(() => {
    if (products && products.length > 0) {
      console.log('Initial product list:', products)
      const initialPrices = products.reduce((acc, product) => {
        if ("price" in product && typeof product.price === "number") {
          acc[product.id] = product.price
        }
        return acc
      }, {} as { [key: string]: number })
      console.log('Initial prices:', initialPrices)
      setProductPrices(initialPrices)
    }
  }, [products])
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
      console.log('Creating agency products:', {
        allProducts: products,
        pricesSet: productPrices,
        productsToCreate: agencyProducts
      })
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
  // Define options for mapping
  const paperTypeOptions = ["A3", "A4", "A5", "A6"]
  const colorOptionsMap = [
    { label: "Siyah/Beyaz", value: "SiyahBeyaz" },
    { label: "Renkli", value: "Renkli" },
  ]
  const printTypeOptionsMap = [
    { label: "Tek Yüz", value: "TekYuz" },
    { label: "Çift Yüz", value: "CiftYuz" },
  ]
  // Show loading state
  if (authLoading || productListLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Icons.spinner className="mr-2 h-8 w-8 animate-spin" />
        <span>Loading products...</span>
      </div>
    )
  }
  // Show error state
  if (authError || productListError) {
    return (
      <div className="p-4 text-red-500">
        Error: {authError?.message || productListError?.message}
      </div>
    )
  }
 
  return (
    <div className="mx-auto max-w-4xl max-h-[calc(100vh-200px)] overflow-y-auto">
      <Card className="border-none">
        <CardContent className="border-none p-0">
          {products.length === 0 ? (
            <div className="text-center text-muted-foreground">
              No products available to add prices
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {paperTypeOptions.map((paperType) => {
                // Get all products for this paper type
                const typeProducts = products.filter(
                  (p) => p.paperType === paperType
                )
                
                if (typeProducts.length === 0) return null
                
                return (
                  <div key={paperType} className="space-y-4">
                    <h3 className="text-lg font-semibold">
                      {paperType} Products
                    </h3>
                    
                    {/* Group by color option */}
                    {colorOptionsMap.map(colorOption => {
                      // Get products for this paper type and color option
                      const colorProducts = typeProducts.filter(
                        p => p.colorOption === colorOption.value
                      )
                      
                      if (colorProducts.length === 0) return null
                      
                      return (
                        <div key={`${paperType}-${colorOption.value}`} className="space-y-2">
                          <h4 className="text-md font-medium ml-2">{colorOption.label}</h4>
                          <div className="space-y-2">
                            {colorProducts.map((product) => (
                              <div
                                key={product.id}
                                className="flex items-center gap-4 rounded-lg border p-4"
                              >
                                <div className="flex-grow">
                                  <div className="font-semibold">
                                    {printTypeOptionsMap.find(
                                      (option) => option.value === product.printType
                                    )?.label || product.printType}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    {paperType} - {colorOption.label}
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
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )
              })}
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