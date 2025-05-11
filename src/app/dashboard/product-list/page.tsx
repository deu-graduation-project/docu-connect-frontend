"use client"
import React, { useState } from "react"
import CreateAgencyProductForm from "@/components/forms/create-agency-product-form"
import { CardContent, CardDescription } from "@/components/ui/card"
import { CardHeader, CardTitle, Card } from "@/components/ui/card"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import useAuthStatus from "@/lib/queries/auth-status"
import { productService } from "@/services/products-service"
import { Icons } from "@/components/icons"
import { Badge } from "@/components/ui/badge"
import { AgencyProduct } from "@/types/classes"
import { Button, buttonVariants } from "@/components/ui/button"
import { Trash2, Plus, ChevronDown, ChevronUp } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

export default function ProductList() {
  const queryClient = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set())
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
    queryKey: ["AgencyProducts"],
    queryFn: () => {
      if (!authStatus?.userId) throw new Error("agency id required.")

      if (!authStatus?.userId) throw new Error("Agency ID is required.")
      return productService.getAgencyProducts(authStatus.userId)
    },
    enabled: !!authStatus?.userId,
  })

  const products = productList?.agencyProducts || []

  const deleteAgencyProductMutation = useMutation({
    mutationFn: (agencyProductId: string) => {
      if (!agencyProductId)
        throw new Error("Agency product ID needed but not received.")

      return productService.deleteAgencyProducts([agencyProductId])
    },
    onMutate: (agencyProductId: string) => {
      setDeletingIds((prev) => new Set(prev).add(agencyProductId))
    },
    onSuccess: (_data, agencyProductId) => {
      setProductPrices((prev) => {
        const updated = { ...prev }
        delete updated[agencyProductId]
        return updated
      })

      setDeletingIds((prev) => {
        const updated = new Set(prev)
        updated.delete(agencyProductId)
        return updated
      })

      queryClient.invalidateQueries({ queryKey: ["AgencyProducts"] })
      toast.success("Product removed successfully")
    },
    onError: (error: { message: string }, agencyProductId) => {
      setDeletingIds((prev) => {
        const updated = new Set(prev)
        updated.delete(agencyProductId)
        return updated
      })
      toast.error(error.message || "Failed to delete agency product")
    },
  })

  const handleDelete = (productId: string) => {
    deleteAgencyProductMutation.mutate(productId)
  }

  const toggleForm = () => {
    setShowForm(!showForm)
  }

  return (
    <div className="w-full max-w-4xl space-y-4">
      <Card className="m-4">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex max-w-lg flex-col gap-2 px-4">
            <CardTitle>Set Product Prices for Your Agency</CardTitle>
            <CardDescription className="mr-4">
              Assign prices to the products available for your agency. These
              products are predefined by the admin.
            </CardDescription>{" "}
          </div>
          <Button
            variant="ghost"
            size="lg"
            onClick={toggleForm}
            className={cn(buttonVariants({ variant: "ghost" }), "h-8 w-8 p-0")}
          >
            {showForm ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </CardHeader>
        <CardContent
          className={`overflow-hidden border-none transition-all duration-300 ease-in-out ${showForm ? "max-h-screen border-none" : "max-h-0 py-0"}`}
        >
          {showForm && <CreateAgencyProductForm />}
        </CardContent>
      </Card>

      <Card className="m-4">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Your Priced Products</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={toggleForm}
            className="flex items-center gap-1"
          >
            <Plus className="h-4 w-4" /> Add Products
          </Button>
        </CardHeader>
        <CardContent className="p-4">
          {productListLoading || authLoading ? (
            <div className="flex items-center justify-center p-4">
              <Icons.spinner className="mr-2 h-6 w-6 animate-spin" />
              <span>Loading your products...</span>
            </div>
          ) : productListError || authError ? (
            <div className="p-4 text-center text-red-500">
              Error loading products:{" "}
              {productListError?.message || authError?.message}
            </div>
          ) : products && products.length > 0 ? (
            <div className="space-y-4">
              {products.map((product: AgencyProduct) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between gap-4 rounded-lg border p-4"
                >
                  <div className="flex flex-grow flex-col gap-4">
                    <div className="font-semibold">{product?.printType}</div>
                    <div className="text-sm text-muted-foreground">
                      <Badge variant="outline" className="mr-2">
                        {product?.paperType}
                      </Badge>
                      <Badge variant="secondary">{product.colorOption}</Badge>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDelete(product?.id)}
                    disabled={deletingIds.has(product?.id)}
                    className="flex h-10 w-10 items-center justify-center"
                  >
                    {deletingIds.has(product.id) ? (
                      <Icons.spinner className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                  <div className="text-lg font-medium">
                    ₺{product?.price?.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-muted-foreground">
              You haven&apos;t set prices for any products yet. Click &quot;Add
              Products&quot; to add them.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
