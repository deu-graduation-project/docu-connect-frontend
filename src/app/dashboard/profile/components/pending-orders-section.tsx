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
import { StarIcon as StarIconFilled } from "lucide-react"
import { Star as StarIcon } from "lucide-react"
import { Label } from "@/components/ui/label"
import { fileService } from "@/services/file-service"
import { useOrdersStates } from "./orders-states"
import { toast } from "sonner"
import { orderService } from "@/services/orders-service"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
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
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Star } from "lucide-react"
interface StarRatingInputProps {
  rating: number
  setRating: (rating: number) => void
  maxStars?: number
  disabled?: boolean
}

const StarRatingInput: React.FC<StarRatingInputProps> = ({
  rating,
  setRating,
  maxStars = 5,
  disabled = false,
}) => {
  const [hoverRating, setHoverRating] = useState(0)

  return (
    <div className="flex items-center space-x-1">
      {[...Array(maxStars)].map((_, index) => {
        const starValue = index + 1
        return (
          <Star
            key={starValue}
            className={`h-6 w-6 cursor-pointer ${
              starValue <= (hoverRating || rating)
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            } ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
            onClick={() => !disabled && setRating(starValue)}
            onMouseEnter={() => !disabled && setHoverRating(starValue)}
            onMouseLeave={() => !disabled && setHoverRating(0)}
          />
        )
      })}
    </div>
  )
}

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

interface OrderCardProps {
  order: {
    orderCode: string
    orderState: OrderState
    createdDate: string
    agencyName: string
    kopyaSayısı: number
    sayfaSayısı: number
    totalPrice: number
    customerName?: string
    product?: {
      paperType?: string
      printType?: string
      colorOption?: string
      price?: number
    }
    copyFiles?: { fileName: string; fileCode: string }[]
    updatedDate?: string
    completedCode?: string
    commentText?: string | null // Add comment fields from your API response
    starRating?: number | null // Add comment fields from your API response
  }
  userId: string | null
  onCommentAdded?: () => void // Callback to refresh orders list
}

const OrderCard = ({ order, userId, onCommentAdded }: OrderCardProps) => {
  const stateLabel = getOrderStateLabel(order.orderState)
  const badgeClass = getStateBadgeClass(order.orderState)
  const queryClient = useQueryClient()
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [isCommentDialogOpen, setIsCommentDialogOpen] = useState(false)

  // State for comment form
  const [commentText, setCommentText] = useState(order.commentText || "")
  const [starRating, setStarRating] = useState(order.starRating || 0)

  const fetchCompletedCodeMutation = useMutation({
    mutationFn: () =>
      userService.updateOrder(OrderState.Finished, order.orderCode),
    onSuccess: (data) => {
      if (data?.completedCode) {
        queryClient.invalidateQueries({ queryKey: ["userOrders", userId] })
        toast.success("Pickup code retrieved.")
      }
    },
    onError: (error: Error) => {
      toast.error(`Failed to fetch pickup code: ${error.message}`)
    },
  })

  useEffect(() => {
    if (
      order.orderState === OrderState.Finished &&
      !order.completedCode &&
      userId
    ) {
      fetchCompletedCodeMutation.mutate()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order.orderState, order.orderCode, order.completedCode, userId])

  const cancelOrderMutation = useMutation({
    mutationFn: (orderCode: string) => orderService.cancelOrder(orderCode),
    onSuccess: (data) => {
      toast.success(data.message || "Order cancelled successfully!")
      queryClient.invalidateQueries({ queryKey: ["userOrders", userId] })
      setIsSheetOpen(false)
    },
    onError: (error: Error) => {
      toast.error(`Failed to cancel order: ${error.message}`)
    },
  })

  const handleCancelOrder = () => {
    cancelOrderMutation.mutate(order.orderCode)
  }

  // --- Create Comment Mutation ---
  const createCommentMutation = useMutation({
    mutationFn: (payload: {
      orderCode: string
      starRating: number
      commentText: string
    }) =>
      orderService.createComment(
        payload.orderCode,
        payload.starRating,
        payload.commentText
      ),
    onSuccess: (data) => {
      toast.success(data.message || "Comment submitted successfully!")
      queryClient.invalidateQueries({ queryKey: ["userOrders", userId] }) // Invalidate to refetch orders
      if (onCommentAdded) {
        onCommentAdded() // Call parent callback if provided
      }
      setIsCommentDialogOpen(false) // Close dialog
      // Optionally update local state or rely on query invalidation
      // setCommentText("");
      // setStarRating(0);
    },
    onError: (error: Error) => {
      toast.error(`Failed to submit comment: ${error.message}`)
    },
  })

  const handleCommentSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (starRating === 0) {
      toast.error("Please select a star rating.")
      return
    }
    if (!commentText.trim()) {
      toast.error("Please enter your comment.")
      return
    }
    createCommentMutation.mutate({
      orderCode: order.orderCode,
      starRating,
      commentText,
    })
  }

  // Check if a comment already exists for this order
  const hasComment = order.commentText && order.starRating

  return (
    <div className="flex flex-col rounded-lg border bg-card p-4 transition-shadow hover:shadow-md">
      {/* Card Header and Basic Info */}
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
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
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
              {/* Order Basic Info, Print Details, Files, Timeline */}
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
                    <p className="font-medium">{order.customerName || "N/A"}</p>
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
                            if (fileService && file.fileCode) {
                              fileService.downloadFile(file.fileCode)
                            } else {
                              toast.error("File download not available.")
                            }
                          }}
                        >
                          <Icons.download className="mr-2 h-4 w-4" /> Download
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="rounded-lg border p-4">
                <h3 className="text-lg font-medium">Order Timeline</h3>
                <div className="my-4 h-[1px] w-full bg-secondary"></div>
                <div className="space-y-3">
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
                            if (order.completedCode) {
                              navigator.clipboard.writeText(order.completedCode)
                              toast(
                                <div className="flex items-center space-x-2">
                                  <Icons.check className="h-4 w-4" />
                                  <span className="ml-2">
                                    Code copied to clipboard!
                                  </span>
                                </div>
                              )
                            }
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
                        : "Your order is ready for pickup. Please visit the agency to collect your order. The pickup code will appear here once available."}
                    </p>
                  )}
                </div>
              )}

              {/* --- Comment Section --- */}
              {order.orderState === OrderState.Completed && (
                <div className="flex flex-col gap-4">
                  <div className="my-4 rounded-lg border bg-green-500/10 p-4 text-sm text-green-700">
                    <p className="font-medium">Order Completed</p>
                    <p>
                      This order has been successfully completed and picked up.
                    </p>
                  </div>

                  {/* Display existing comment if any */}
                  {hasComment && (
                    <div className="rounded-lg border p-4">
                      <h3 className="text-lg font-medium">Your Review</h3>
                      <div className="my-4 h-[1px] w-full bg-secondary"></div>
                      <div className="mb-2 flex items-center">
                        <StarRatingInput
                          rating={order.starRating || 0}
                          setRating={() => {}}
                          disabled={true}
                        />
                        <span className="ml-2 text-sm text-muted-foreground">
                          ({order.starRating} out of 5)
                        </span>
                      </div>
                      <p className="whitespace-pre-wrap text-sm text-gray-700">
                        {order.commentText}
                      </p>
                      {/* Optionally, add an edit/delete button here if needed in the future */}
                    </div>
                  )}

                  {/* Add Comment Dialog - only if no comment exists yet */}
                  {!hasComment && (
                    <Dialog
                      open={isCommentDialogOpen}
                      onOpenChange={setIsCommentDialogOpen}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="default"
                          className="gap-2 text-center text-base tracking-tight"
                        >
                          Add a Comment{" "}
                          <MessageSquarePlus className="h-5 w-5" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <form onSubmit={handleCommentSubmit}>
                          <DialogHeader>
                            <DialogTitle>
                              Leave a Review for Order #{order.orderCode}
                            </DialogTitle>
                            <DialogDescription>
                              Share your experience with this order. Your
                              feedback helps us improve.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-5 items-center gap-4">
                              <Label
                                htmlFor="starRating"
                                className="text-start"
                              >
                                Rating
                              </Label>
                              <div className="col-span-4">
                                <StarRatingInput
                                  rating={starRating}
                                  setRating={setStarRating}
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-5 items-center gap-4">
                              <Label
                                htmlFor="commentText"
                                className="text-start"
                              >
                                Comment
                              </Label>
                              <Textarea
                                id="commentText"
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                placeholder="Tell us about your experience..."
                                className="col-span-4 h-24 resize-none border"
                                rows={4}
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <DialogClose asChild>
                              <Button type="button" variant="outline">
                                Cancel
                              </Button>
                            </DialogClose>
                            <Button
                              type="submit"
                              disabled={createCommentMutation.isPending}
                            >
                              {createCommentMutation.isPending ? (
                                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                              ) : (
                                "Submit Review"
                              )}
                            </Button>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              )}
              {/* --- End Comment Section --- */}

              {/* Order Actions (Cancel) */}
              <div className="flex space-x-2 pt-4">
                {order.orderState === OrderState.Pending && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="destructive"
                        className="flex-1"
                        disabled={cancelOrderMutation.isPending}
                      >
                        {cancelOrderMutation.isPending ? (
                          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          "Cancel Order"
                        )}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Confirm Cancellation</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to cancel this order (
                          {order.orderCode})? This action cannot be undone.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter className="sm:justify-end">
                        <DialogClose asChild>
                          <Button type="button" variant="outline">
                            Keep Order
                          </Button>
                        </DialogClose>
                        <Button
                          type="button"
                          variant="destructive"
                          onClick={handleCancelOrder}
                          disabled={cancelOrderMutation.isPending}
                        >
                          {cancelOrderMutation.isPending ? (
                            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            "Yes, Cancel Order"
                          )}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
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
