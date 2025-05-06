"use client"
import React from "react"
import { useQuery } from "@tanstack/react-query"
import { userService } from "@/services/user-service"
import { Icons } from "@/components/icons"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"

const PendingOrdersSection = ({ userId }) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["userOrders", userId],
    queryFn: () => {
      if (!userId) {
        throw new Error("User ID is missing")
      }
      return userService.getUserById(userId)
    },
    enabled: !!userId,
  })

  // Filter orders to show only pending ones
  const pendingOrders =
    data?.userOrders?.filter((order) => order.orderState === "Pending") || []

  if (isLoading) {
    return <OrdersLoadingState />
  }

  if (error) {
    return <OrdersErrorState error={error} />
  }

  if (pendingOrders.length === 0) {
    return <OrdersEmptyState />
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Pending Orders</h2>
        <Badge
          variant="outline"
          className="px-4 py-2 font-normal tracking-tight"
        >
          {pendingOrders.length} orders
        </Badge>
      </div>

      <ScrollArea className="h-[785px] rounded-md border">
        <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 lg:grid-cols-3">
          {pendingOrders.map((order) => (
            <OrderCard key={order.orderCode} order={order} />
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

const OrderCard = ({ order }) => {
  return (
    <div className="flex flex-col rounded-lg border bg-card p-4 transition-shadow hover:shadow-md">
      <div className="mb-2 flex items-start justify-between">
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground">Order Code</span>
          <span className="font-medium">{order.orderCode}</span>
        </div>
        <Badge className="border-yellow-500/50 bg-yellow-500/20 text-yellow-700 hover:bg-yellow-500/30">
          {order.orderState}
        </Badge>
      </div>

      <div className="mt-2 space-y-1">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Agency:</span>
          <span>{order.agencyName}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Copies:</span>
          <span>{order.kopyaSayısı}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Pages:</span>
          <span>{order.sayfaSayısı}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Paper:</span>
          <span>{order.product?.paperType || "N/A"}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Print:</span>
          <span>{order.product?.printType || "N/A"}</span>
        </div>
      </div>

      <div className="mt-auto flex items-center justify-between border-t pt-3">
        <span className="font-semibold">{order.totalPrice} TL</span>
        <button className="flex items-center gap-1 text-xs text-primary hover:underline">
          View Details
          <Icons.chevronRight className="h-3 w-3" />
        </button>
      </div>
    </div>
  )
}

const OrdersLoadingState = () => {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-6">
      <div className="mb-4 flex items-center justify-between">
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-6 w-24" />
      </div>

      <div className="rounded-md border p-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array(3)
            .fill(0)
            .map((_, index) => (
              <div key={index} className="flex flex-col rounded-lg border p-4">
                <div className="mb-2 flex items-start justify-between">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-5 w-16" />
                </div>

                <div className="mt-2 space-y-3">
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <div key={i} className="flex justify-between">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    ))}
                </div>

                <div className="mt-auto flex items-center justify-between border-t pt-3">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}

const OrdersEmptyState = () => {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-12">
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
        <Icons.inbox className="mb-4 h-12 w-12 text-muted-foreground" />
        <h3 className="mb-1 text-lg font-medium">No Pending Orders</h3>
        <p className="max-w-md text-sm text-muted-foreground">
          You don't have any pending orders at the moment. When you place a new
          order, it will appear here.
        </p>
      </div>
    </div>
  )
}

const OrdersErrorState = ({ error }) => {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-12">
      <div className="flex flex-col items-center justify-center rounded-lg border border-red-200 bg-red-50 p-8 text-center">
        <Icons.alertCircle className="mb-4 h-12 w-12 text-red-500" />
        <h3 className="mb-1 text-lg font-medium">Error Loading Orders</h3>
        <p className="max-w-md text-sm text-muted-foreground">
          {error?.message ||
            "There was a problem retrieving your orders. Please try again later."}
        </p>
        <button className="mt-4 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          Retry
        </button>
      </div>
    </div>
  )
}

export default PendingOrdersSection
