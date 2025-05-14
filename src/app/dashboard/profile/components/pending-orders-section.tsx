"use client"
import { Copy, MessageSquarePlus } from "lucide-react"
import React, { useState, useEffect } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { userService } from "@/services/user-service"
import { Icons } from "@/components/icons"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { Inbox } from "lucide-react"
import { fileService } from "@/services/file-service"
import { useOrdersStates } from "./orders-states"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  OrderState,
  getOrderStateLabel,
  getStateBadgeClass,
} from "./utils/order-utils"
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
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const PendingOrdersSection = ({ userId }) => {
  const { OrdersLoadingState, OrdersEmptyState, OrdersErrorState } =
    useOrdersStates()

  const [filterState, setFilterState] = useState("all")
  const [sortOption, setSortOption] = useState("newest")

  // Fetch user orders
  const { data, isLoading, error } = useQuery({
    queryKey: ["userOrders", userId],
    queryFn: () => {
      if (!userId) {
        return Promise.reject(new Error("User ID is missing"))
      }
      return userService.getUserById(userId)
    },
    enabled: !!userId, // Query will not run until userId is available
  })

  // Filter orders based on active filter and sort option
  const filteredOrders = React.useMemo(() => {
    if (!data?.userOrders) return []

    let filtered = [...data.userOrders]
    if (filterState !== "all") {
      filtered = filtered.filter((order) => order.orderState === filterState)
    }

    if (sortOption === "newest") {
      filtered.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate)) // Sort by date
    } else if (sortOption === "oldest") {
      filtered.sort((a, b) => new Date(a.createdDate) - new Date(b.createdDate)) // Sort by date
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

  const statusCounts = data?.userOrders?.reduce((acc, order) => {
    const state = order.orderState
    acc[state] = (acc[state] || 0) + 1
    return acc
  }, {})

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
                <SelectItem value={OrderState.Pending}>
                  Pending ({statusCounts?.[OrderState.Pending] || 0})
                </SelectItem>
                <SelectItem value={OrderState.Confirmed}>
                  Confirmed ({statusCounts?.[OrderState.Confirmed] || 0})
                </SelectItem>
                <SelectItem value={OrderState.Started}>
                  Started ({statusCounts?.[OrderState.Started] || 0})
                </SelectItem>
                <SelectItem value={OrderState.Finished}>
                  Finished ({statusCounts?.[OrderState.Finished] || 0})
                </SelectItem>
                <SelectItem value={OrderState.Completed}>
                  Completed ({statusCounts?.[OrderState.Completed] || 0})
                </SelectItem>
                <SelectItem value={OrderState.Rejected}>
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
              <OrderCard key={order.orderCode} order={order} userId={userId} />
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  )
}

const OrderCard = ({ order, userId }) => {
  const stateLabel = getOrderStateLabel(order.orderState)
  const badgeClass = getStateBadgeClass(order.orderState)
  const queryClient = useQueryClient()

  // State for storing the completedCode received from the backend
  const [completedCode, setCompletedCode] = useState("")

  // Mutation to fetch the completed code when the order is in Finished state
  const fetchCompletedCodeMutation = useMutation({
    mutationFn: () =>
      userService.updateOrder(OrderState.Finished, order.orderCode),
    onSuccess: (data) => {
      if (data?.completedCode) {
        setCompletedCode(data.completedCode)
      }
    },
    onError: (error) => {
      console.error("Failed to fetch completion code:", error)
    },
  })

  // Fetch the completion code when the component mounts and order is in Finished state
  useEffect(() => {
    if (order.orderState === OrderState.Finished && !completedCode) {
      fetchCompletedCodeMutation.mutate()
    }
  }, [order.orderState, order.orderCode, completedCode])

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
          <span className="text-muted-foreground">Date:</span>
          <span>
            {new Date(order.createdDate).toLocaleDateString("en-US", {
              year: "numeric",
              month: "numeric",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
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
          <SheetContent className="overflow-y-auto pt-12 sm:max-w-lg">
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
                    <p className="text-xs text-muted-foreground">Order Date</p>
                    <p className="font-medium">
                      {new Date(order.createdDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "numeric",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
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
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            fileService.downloadFile(file?.fileCode)
                          }}
                        >
                          <Icons.download className="mr-2 h-4 w-4" /> Download
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Order Timeline/History */}
              <div className="rounded-lg border p-4">
                <h3 className="text-lg font-medium">Order Timeline</h3>
                <div className="my-4 h-[1px] w-full bg-secondary"></div>
                <div className="space-y-3">
                  {/* Order Created */}
                  <div className="flex items-center space-x-3">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <div className="flex-1">
                      <p className="font-medium">Order Created</p>
                      <p className="text-xs text-muted-foreground">
                        Your order was successfully created.
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.createdDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>

                  {/* Current Status (if no detailed history or status changed) */}
                  {order.orderState !== OrderState.Pending &&
                    order.updatedDate &&
                    order.updatedDate !== "0001-01-01T00:00:00" && (
                      <div className="flex items-center space-x-3">
                        <div
                          className={`mt-0.5 h-2 w-2 rounded-full ${getStateBadgeClass(order.orderState).split(" ")[1]}`}
                        ></div>
                        <div className="flex-1">
                          <p className="font-medium">
                            Order Status: {getOrderStateLabel(order.orderState)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {order.orderState === OrderState.Completed
                              ? "This order has been successfully completed and picked up."
                              : "Order status updated."}
                          </p>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {new Date(order.updatedDate).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </p>
                      </div>
                    )}
                </div>
              </div>

              {/* Completion Code for Finished State */}
              {order.orderState === OrderState.Finished && (
                <div className="mt-4 rounded-lg border bg-teal-500/10 p-4 text-sm">
                  {order.completedCode ? (
                    <div className="space-y-2">
                      <p className="pb-1 text-teal-700">
                        Your order is ready! Please show this code to the agency
                        when picking up your order:
                      </p>
                      <div className="flex items-center justify-between rounded-md border border-teal-300 bg-teal-700 p-4">
                        <span className="text-xl font-bold tracking-wider text-primary">
                          {order.completedCode}
                        </span>
                        <Button
                          variant="default"
                          size="icon"
                          onClick={() => {
                            navigator.clipboard.writeText(order.completedCode)
                            toast(
                              <div className="flex items-center space-x-2">
                                <Icons.check className="h-4 w-4" />
                                <span className="ml-2">
                                  Code copied to clipboard!
                                </span>
                              </div>
                            )
                          }}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="pt-1 text-xs text-teal-600">
                        The agency will use this code to mark your order as
                        completed when you pick it up.
                      </p>
                    </div>
                  ) : (
                    <p className="text-teal-700">
                      {fetchCompletedCodeMutation.isLoading
                        ? "Retrieving your pickup code..."
                        : "Your order is ready for pickup. Please visit the agency to collect your order."}
                    </p>
                  )}
                </div>
              )}

              {/* Message if order is completed */}
              {order.orderState === OrderState.Completed && (
                <div className="flex flex-col gap-4">
                  <div className="my-4 rounded-lg border bg-green-500/10 p-4 text-sm text-green-700">
                    <p className="font-medium">Order Completed</p>
                    <p>
                      This order has been successfully completed and picked up.
                    </p>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="default"
                        className="gap-2 text-center text-base tracking-tight"
                      >
                        Add a comment
                        <MessageSquarePlus className="h-5 w-5" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Are you absolutely sure?</DialogTitle>
                        <DialogDescription>
                          This action cannot be undone. This will permanently
                          delete your account and remove your data from our
                          servers.
                        </DialogDescription>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                </div>
              )}

              {/* Order Actions */}
              <div className="flex space-x-2 pt-4">
                {order.orderState === OrderState.Pending && (
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={() => {
                      alert("Cancel functionality to be implemented.")
                    }}
                  >
                    Cancel Order
                  </Button>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}

export default PendingOrdersSection
