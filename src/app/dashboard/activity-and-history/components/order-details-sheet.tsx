import React from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { orderService } from "@/services/orders-service"
import { toast } from "sonner"
import { Icons } from "@/components/icons"
import { OrderState, GetSingleOrder } from "@/types/classes" // Assuming you have this type defined

// Define order states as an array to match your enum
const ORDER_STATES = [
  "Pending",
  "Confirmed",
  "Started",
  "Finished",
  "Completed",
  "Rejected",
] as const

interface OrderDetailsSheetProps {
  selectedOrder: GetSingleOrder | null
  isSheetOpen: boolean
  setIsSheetOpen: (open: boolean) => void
}

export function OrderDetailsSheet({
  selectedOrder,
  isSheetOpen,
  setIsSheetOpen,
}: OrderDetailsSheetProps) {
  const queryClient = useQueryClient()

  // Mutation for updating order status
  const updateOrderStatusMutation = useMutation({
    mutationFn: ({
      orderId,
      newState,
    }: {
      orderId: string
      newState: OrderState
    }) => orderService.updateOrder(newState, orderId),

    onMutate: async ({ orderId, newState }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["orders"] })

      // Snapshot the previous value
      const previousOrder = queryClient.getQueryData(["orders", orderId])

      // Optimistically update to new state
      queryClient.setQueryData(["orders", orderId], (old: GetSingleOrder) => ({
        ...old,
        OrderState: newState,
      }))

      // Return a context object with the snapshotted value
      return { previousOrder }
    },

    onSuccess: (_, { orderId, newState }) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["orders"] })

      toast.success(
        `Order #${orderId} status updated to ${OrderState[newState]}`
      )
    },

    onError: (err, { orderId }, context) => {
      // If the mutation fails, use the context we returned to rollback
      if (context?.previousOrder) {
        queryClient.setQueryData(["orders", orderId], context.previousOrder)
      }

      toast.error(
        `Failed to update order status: ${err instanceof Error ? err.message : "Unknown error"}`
      )
    },
  })

  // Mutation for cancelling order
  const cancelOrderMutation = useMutation({
    mutationFn: (orderId: string) =>
      orderService.updateOrder(OrderState.Rejected, orderId),

    onMutate: async (orderId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["orders"] })

      // Snapshot the previous value
      const previousOrder = queryClient.getQueryData(["orders", orderId])

      // Optimistically update to rejected state
      queryClient.setQueryData(["orders", orderId], (old: GetSingleOrder) => ({
        ...old,
        OrderState: OrderState.Rejected,
      }))

      return { previousOrder }
    },

    onSuccess: (_, orderId) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["orders"] })

      toast.success(`Order #${orderId} has been cancelled`)
      setIsSheetOpen(false)
    },

    onError: (err, orderId, context) => {
      // If the mutation fails, use the context we returned to rollback
      if (context?.previousOrder) {
        queryClient.setQueryData(["orders", orderId], context.previousOrder)
      }

      toast.error(
        `Failed to cancel order: ${err instanceof Error ? err.message : "Unknown error"}`
      )
    },
  })

  // Helper function to map order state to badge class
  const getStateBadgeClass = (state: OrderState) => {
    const stateString = OrderState[state].toLowerCase()
    switch (stateString) {
      case "pending":
        return "border-yellow-500/50 bg-yellow-500/20 text-yellow-700 hover:bg-yellow-500/30"
      case "confirmed":
        return "border-blue-500/50 bg-blue-500/20 text-blue-700 hover:bg-blue-500/30"
      case "rejected":
        return "border-red-500/50 bg-red-500/20 text-red-700 hover:bg-red-500/30"
      case "started":
        return "border-purple-500/50 bg-purple-500/20 text-purple-700 hover:bg-purple-500/30"
      case "finished":
        return "border-teal-500/50 bg-teal-500/20 text-teal-700 hover:bg-teal-500/30"
      case "completed":
        return "border-green-500/50 bg-green-500/20 text-green-700 hover:bg-green-500/30"
      default:
        return "border-gray-500/50 bg-gray-500/20 text-gray-700 hover:bg-gray-500/30"
    }
  }

  if (!selectedOrder) return null

  return (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <SheetContent className="overflow-y-auto pt-12">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            <span>Order #{selectedOrder.OrderCode}</span>
            <Badge
              className={cn(
                "px-2 py-1 capitalize",
                getStateBadgeClass(selectedOrder.OrderState)
              )}
            >
              {OrderState[selectedOrder.OrderState]}
            </Badge>
          </SheetTitle>
          <SheetDescription>Complete details for your order</SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Order Information Section */}
          <div className="rounded-lg border p-4">
            <h3 className="text-lg font-medium">Order Information</h3>
            <div className="my-4 h-[1px] w-full bg-secondary"></div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-muted-foreground">Agency</p>
                <p className="font-medium">{selectedOrder.AgencyName}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Customer</p>
                <p className="font-medium">
                  {selectedOrder.CustomerName || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Price</p>
                <p className="font-medium">{selectedOrder.TotalPrice} TL</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Pages</p>
                <p className="font-medium">{selectedOrder.TotalPage}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Copies</p>
                <p className="font-medium">{selectedOrder.KopyaSayısı}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Price Per Page</p>
                <p className="font-medium">{selectedOrder.PricePerPage} TL</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Order Date</p>
                <p className="font-medium">
                  {new Date(selectedOrder.CreatedDate).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "numeric",
                      day: "numeric",
                      hour: "2-digit",
                    }
                  )}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">File Name</p>
                <p className="font-medium">
                  {selectedOrder.CopyFiles?.[0]?.fileName || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Order Status Update Section */}
          <div className="rounded-lg border p-4">
            <h3 className="text-lg font-medium">Update Order Status</h3>
            <div className="my-4 h-[1px] w-full bg-secondary"></div>
            <div className="space-y-4">
              <Select
                onValueChange={(value) => {
                  if (selectedOrder?.orderId) {
                    updateOrderStatusMutation.mutate({
                      orderId: selectedOrder.orderId,
                      newState: parseInt(value) as OrderState,
                    })
                  }
                }}
                value={selectedOrder.OrderState.toString()}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select new status" />
                </SelectTrigger>
                <SelectContent>
                  {ORDER_STATES.map((_, stateIndex) => (
                    <SelectItem key={stateIndex} value={stateIndex.toString()}>
                      {OrderState[stateIndex]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Files Section */}
          {selectedOrder.CopyFiles && selectedOrder.CopyFiles.length > 0 && (
            <div className="rounded-lg border p-4">
              <h3 className="text-lg font-medium">Files</h3>
              <div className="my-4 h-[1px] w-full bg-secondary"></div>

              <div className="space-y-2">
                {selectedOrder.CopyFiles.map((file, index) => (
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
                        // Implement file download logic
                        toast("this is not implemented yet.", {
                          title: "Download",
                          description:
                            "File download functionality to be implemented",
                          variant: "default",
                        })
                      }}
                    >
                      <Icons.download className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Order Actions */}
          <div className="flex space-x-2">
            <Button
              variant="destructive"
              className="flex-1"
              disabled={
                updateOrderStatusMutation.isPending ||
                cancelOrderMutation.isPending
              }
              onClick={() => {
                if (selectedOrder?.orderId) {
                  cancelOrderMutation.mutate(selectedOrder.orderId)
                }
              }}
            >
              {cancelOrderMutation.isPending ? (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Cancel Order"
              )}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
