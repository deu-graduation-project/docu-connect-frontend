"use client"
import React, { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { userService } from "@/services/user-service"
import { Icons } from "@/components/icons"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import Seperator from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

// Order state as strings
const OrderState = {
  Pending: "Pending",
  Confirmed: "Confirmed",
  Rejected: "Rejected",
  Started: "Started",
  Finished: "Finished",
  Completed: "Completed",
}

// Get display label (same as state in this case)
const getOrderStateLabel = (state) => {
  return state || "All"
}

// Get badge color based on state
const getStateBadgeClass = (state) => {
  switch (state) {
    case OrderState.Pending:
      return "border-yellow-500/50 bg-yellow-500/20 text-yellow-700 hover:bg-yellow-500/30"
    case OrderState.Confirmed:
      return "border-blue-500/50 bg-blue-500/20 text-blue-700 hover:bg-blue-500/30"
    case OrderState.Rejected:
      return "border-red-500/50 bg-red-500/20 text-red-700 hover:bg-red-500/30"
    case OrderState.Started:
      return "border-purple-500/50 bg-purple-500/20 text-purple-700 hover:bg-purple-500/30"
    case OrderState.Finished:
      return "border-teal-500/50 bg-teal-500/20 text-teal-700 hover:bg-teal-500/30"
    case OrderState.Completed:
      return "border-green-500/50 bg-green-500/20 text-green-700 hover:bg-green-500/30"
    default:
      return "border-gray-500/50 bg-gray-500/20 text-gray-700 hover:bg-gray-500/30"
  }
}

const PendingOrdersSection = ({ userId }) => {
  const [filterState, setFilterState] = useState("all")
  const [sortOption, setSortOption] = useState("newest")

  // Fetch user orders
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

  // For API-based filtering and sorting (if needed)
  const [page, setPage] = useState(1)
  const [size, setSize] = useState(20)

  // Filter orders based on active filter and sort option
  const filteredOrders = React.useMemo(() => {
    if (!data?.userOrders) return []

    // Filter by state
    let filtered = [...data.userOrders]
    if (filterState !== "all") {
      filtered = filtered.filter((order) => order.orderState === filterState)
    }

    // Sort by date (assuming we'd add a createdAt field to the orders API)
    // Since we don't have createdAt in the data, we'll sort by orderCode as a fallback
    // In a real scenario, replace this with actual date sorting
    if (sortOption === "newest") {
      filtered.sort((a, b) => b.orderCode.localeCompare(a.orderCode))
    } else if (sortOption === "oldest") {
      filtered.sort((a, b) => a.orderCode.localeCompare(b.orderCode))
    }

    return filtered
  }, [data?.userOrders, filterState, sortOption])

  if (isLoading) {
    return <OrdersLoadingState />
  }

  if (error) {
    return <OrdersErrorState error={error} />
  }

  if (!data?.userOrders || data.userOrders.length === 0) {
    return <OrdersEmptyState />
  }

  // Get counts for each status
  const statusCounts = data?.userOrders?.reduce((acc, order) => {
    const state = order.orderState
    acc[state] = (acc[state] || 0) + 1
    return acc
  }, {})

  // Calculate total count
  const totalCount = data?.userOrders?.length || 0

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-6">
      <div className="mb-4 flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Your Orders</h2>
        </div>

        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Filter by:</span>
            <Select value={filterState} onValueChange={setFilterState}>
              <SelectTrigger className="w-44">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Orders ({totalCount})</SelectItem>
                <SelectItem value={OrderState.Pending.toString()}>
                  Pending ({statusCounts?.[OrderState.Pending] || 0})
                </SelectItem>
                <SelectItem value={OrderState.Confirmed.toString()}>
                  Confirmed ({statusCounts?.[OrderState.Confirmed] || 0})
                </SelectItem>
                <SelectItem value={OrderState.Started.toString()}>
                  Started ({statusCounts?.[OrderState.Started] || 0})
                </SelectItem>
                <SelectItem value={OrderState.Finished.toString()}>
                  Finished ({statusCounts?.[OrderState.Finished] || 0})
                </SelectItem>
                <SelectItem value={OrderState.Completed.toString()}>
                  Completed ({statusCounts?.[OrderState.Completed] || 0})
                </SelectItem>
                <SelectItem value={OrderState.Rejected.toString()}>
                  Rejected ({statusCounts?.[OrderState.Rejected] || 0})
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Sort by:</span>
            <Select value={sortOption} onValueChange={setSortOption}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <Icons.package className="mb-4 h-12 w-12 text-muted-foreground" />
          <h3 className="mb-1 text-lg font-medium">
            No {filterState !== "all" ? getOrderStateLabel(filterState) : ""}{" "}
            Orders Found
          </h3>
          <p className="max-w-md text-sm text-muted-foreground">
            {filterState !== "all"
              ? `You don't have any ${getOrderStateLabel(filterState).toLowerCase()} orders at the moment.`
              : "You don't have any orders at the moment. When you place a new order, it will appear here."}
          </p>
        </div>
      ) : (
        <ScrollArea className="h-[785px] rounded-md border">
          <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredOrders.map((order) => (
              <OrderCard key={order.orderCode} order={order} />
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  )
}

const OrderCard = ({ order }) => {
  // Convert numeric state to string for display
  const stateLabel = getOrderStateLabel(order.orderState)

  // Get appropriate badge styling based on state
  const badgeClass = getStateBadgeClass(order.orderState)

  return (
    <div className="flex flex-col rounded-lg border bg-card p-4 transition-shadow hover:shadow-md">
      <div className="mb-2 flex items-start justify-between">
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground">Order Code</span>
          <span className="font-medium">{order.orderCode}</span>
        </div>
        <Badge className={badgeClass}>{stateLabel}</Badge>
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

        <Sheet>
          <SheetTrigger asChild>
            <button className="flex items-center gap-1 text-xs text-primary hover:underline">
              View Details
              <Icons.chevronRight className="h-3 w-3" />
            </button>
          </SheetTrigger>
          <SheetContent className="overflow-y-auto pt-12">
            <SheetHeader>
              <SheetTitle className="flex items-center justify-between">
                <span>Order #{order.orderCode}</span>
                <Badge className={badgeClass}>{stateLabel}</Badge>
              </SheetTitle>
              <SheetDescription>
                Complete details for your order
              </SheetDescription>
            </SheetHeader>

            <div className="mt-6 space-y-6">
              {/* Order Basic Info */}
              <div className="rounded-lg border p-4">
                <h3 className="text-lg font-medium">Order Information</h3>
                <div className="my-4 h-[1px] w-full bg-secondary"></div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Agency</p>
                    <p className="font-medium">{order.agencyName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Customer</p>
                    <p className="font-medium">{order.customerName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Total Price</p>
                    <p className="font-medium">{order.totalPrice} TL</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">State</p>
                    <p className="font-medium">{order.orderState}</p>
                  </div>
                </div>
              </div>

              {/* Order Details */}
              <div className="rounded-lg border p-4">
                <h3 className="text-lg font-medium">Print Details</h3>
                <div className="my-4 h-[1px] w-full bg-secondary"></div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Number of Copies
                    </p>
                    <p className="font-medium">{order.kopyaSayısı}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Number of Pages
                    </p>
                    <p className="font-medium">{order.sayfaSayısı}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Paper Type</p>
                    <p className="font-medium">
                      {order.product?.paperType || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Print Type</p>
                    <p className="font-medium">
                      {order.product?.printType || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Color Option
                    </p>
                    <p className="font-medium">
                      {order.product?.colorOption || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Base Price</p>
                    <p className="font-medium">
                      {order.product?.price || "N/A"} TL
                    </p>
                  </div>
                </div>
              </div>

              {/* Files */}
              {order.copyFiles && order.copyFiles.length > 0 && (
                <div className="rounded-lg border p-4">
                  <h3 className="text-lg font-medium">Files</h3>
                  <div className="my-4 h-[1px] w-full bg-secondary"></div>

                  <div className="space-y-2">
                    {order.copyFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between rounded-md border p-2"
                      >
                        <div className="flex items-center space-x-2">
                          <Icons.fileText className="h-8 w-8 text-muted-foreground" />
                          <span className="text-xs font-medium">
                            {file.fileName}
                          </span>
                        </div>
                        <button className="rounded-md bg-primary/10 p-1 text-xs text-primary hover:bg-primary/20">
                          <Icons.download className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Order Timeline/History - Can be added later */}
              <div className="rounded-lg border p-4">
                <h3 className="text-lg font-medium">Order Timeline</h3>
                <div className="my-4 h-[1px] w-full bg-secondary"></div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="-mt-3 h-2 w-2 rounded-full bg-green-500"></div>
                    <div className="flex-1">
                      <p className="font-medium">Order Created</p>
                      <p className="text-xs text-muted-foreground">
                        Your order was successfully created
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground">Today</p>
                  </div>

                  {order.orderState !== "Pending" && (
                    <div className="flex items-start space-x-3">
                      <div className="mt-0.5 h-2 w-2 rounded-full bg-blue-500"></div>
                      <div className="flex-1">
                        <p className="font-medium">Order Status Changed</p>
                        <p className="text-xs text-muted-foreground">
                          Order status updated to {order.orderState}
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground">Today</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Actions */}
              <div className="flex space-x-2">
                <button className="flex-1 rounded-md border border-destructive bg-destructive/10 py-2 text-sm font-medium text-destructive hover:bg-destructive/20">
                  Cancel Order
                </button>
                <button className="flex-1 rounded-md bg-primary py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                  Contact Agency
                </button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
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

      <div className="mb-4 flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <Skeleton className="h-10 w-44" />
        <Skeleton className="h-10 w-40" />
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
        <Icons.package className="mb-4 h-12 w-12 text-muted-foreground" />
        <h3 className="mb-1 text-lg font-medium">No Orders</h3>
        <p className="max-w-md text-sm text-muted-foreground">
          You don&apos;t have any orders at the moment. When you place a new
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
