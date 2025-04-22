"use client"
import React from "react"
import CreateAgencyProductForm from "@/components/forms/create-agency-product-form"
import { CardContent } from "@/components/ui/card"
import { CardHeader, CardTitle, Card } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import useAuthStatus from "@/lib/queries/auth-status"
import { productService } from "@/services/products-service"

export default function ProductList() {
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

      return productService.getAgencyProducts(authStatus.userId)
    },
  })

  console.log(productList)
  return (
    <div className="mx-auto w-full max-w-4xl p-4">
      <CreateAgencyProductForm />

      <Card>
        <CardHeader>
          <CardTitle>Created Products</CardTitle>
        </CardHeader>
        <CardContent></CardContent>
      </Card>
    </div>
  )
}
