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
import { fileService } from "@/services/file-service"
import { toast } from "sonner"
import { Icons } from "@/components/icons"
import { OrderState, GetSingleOrder } from "@/types/classes"

// Define order states using the enum for clarity and type safety
const ORDER_STATES_MAP: { [key in OrderState]: string } = {
  [OrderState.Pending]: "Pending",
  [OrderState.Confirmed]: "Confirmed",
  [OrderState.Started]: "Started",
  [OrderState.Finished]: "Finished",
  [OrderState.Completed]: "Completed",
  [OrderState.Rejected]: "Rejected",
}

// Define valid transitions
const VALID_TRANSITIONS: { [key in OrderState]?: OrderState[] } = {
  [OrderState.Pending]: [OrderState.Confirmed, OrderState.Rejected],
  [OrderState.Confirmed]: [OrderState.Started, OrderState.Rejected],
  [OrderState.Started]: [OrderState.Finished],
  [OrderState.Finished]: [OrderState.Completed],
  // Completed and Rejected are terminal states in this flow
  [OrderState.Completed]: [],
  [OrderState.Rejected]: [],
}

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

  // --- Mutations ---
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
      await queryClient.cancelQueries({ queryKey: ["order", orderId] })

      // Snapshot the previous value
      const previousOrder = queryClient.getQueryData(["order", orderId])

      // Optimistically update both list and detail cache
      queryClient.setQueryData(["orders"], (oldData?: GetSingleOrder[]) =>
        oldData?.map((order) =>
          order.orderId === orderId ? { ...order, OrderState: newState } : order
        )
      )
      queryClient.setQueryData(
        ["order", orderId],
        (old: GetSingleOrder | undefined) =>
          old ? { ...old, OrderState: newState } : undefined
      )

      toast.info(
        `Attempting to update order #${selectedOrder?.OrderCode} to ${ORDER_STATES_MAP[newState]}`
      )
      return { previousOrder }
    },
    onSuccess: (data, { orderId, newState }) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] })
      queryClient.invalidateQueries({ queryKey: ["order", orderId] })
      toast.success(
        `Order #${selectedOrder?.OrderCode} status updated to ${ORDER_STATES_MAP[newState]}`
      )
    },
    onError: (err, { orderId }, context: any) => {
      // Rollback optimistic update
      if (context?.previousOrder) {
        queryClient.setQueryData(["order", orderId], context.previousOrder)
        queryClient.invalidateQueries({ queryKey: ["orders"] })
      } else {
        queryClient.invalidateQueries({ queryKey: ["orders"] })
        queryClient.invalidateQueries({ queryKey: ["order", orderId] })
      }

      toast.error(
        `Failed to update order status: ${err instanceof Error ? err.message : "Unknown error"}`
      )
    },
    onSettled: (data, error, { orderId }) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] })
      queryClient.invalidateQueries({ queryKey: ["order", orderId] })
    },
  })

  const cancelOrderMutation = useMutation({
    mutationFn: (orderId: string) =>
      orderService.updateOrder(OrderState.Rejected, orderId),
    onMutate: async (orderId) => {
      await queryClient.cancelQueries({ queryKey: ["orders"] })
      await queryClient.cancelQueries({ queryKey: ["order", orderId] })
      const previousOrder = queryClient.getQueryData(["order", orderId])

      // Optimistic update
      queryClient.setQueryData(["orders"], (oldData?: GetSingleOrder[]) =>
        oldData?.map((order) =>
          order.orderId === orderId
            ? { ...order, OrderState: OrderState.Rejected }
            : order
        )
      )
      queryClient.setQueryData(
        ["order", orderId],
        (old: GetSingleOrder | undefined) =>
          old ? { ...old, OrderState: OrderState.Rejected } : undefined
      )

      toast.info(`Attempting to cancel order #${selectedOrder?.OrderCode}`)
      return { previousOrder }
    },
    onSuccess: (data, orderId) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] })
      queryClient.invalidateQueries({ queryKey: ["order", orderId] })
      toast.success(`Order #${selectedOrder?.OrderCode} has been cancelled`)
      setIsSheetOpen(false) // Close sheet on successful cancel
    },
    onError: (err, orderId, context: any) => {
      if (context?.previousOrder) {
        queryClient.setQueryData(["order", orderId], context.previousOrder)
        queryClient.invalidateQueries({ queryKey: ["orders"] })
      } else {
        queryClient.invalidateQueries({ queryKey: ["orders"] })
        queryClient.invalidateQueries({ queryKey: ["order", orderId] })
      }
      toast.error(
        `Failed to cancel order: ${err instanceof Error ? err.message : "Unknown error"}`
      )
    },
    onSettled: (data, error, orderId) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] })
      queryClient.invalidateQueries({ queryKey: ["order", orderId] })
    },
  })
  // --- End Mutations ---

  // Helper function to map order state to badge class
  const getStateBadgeClass = (state: OrderState) => {
    const stateString = ORDER_STATES_MAP[state]?.toLowerCase()
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

  // Helper function to format date
  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
    })
  }

  // Get valid next states for the dropdown
  const getValidNextStates = (currentState: OrderState): OrderState[] => {
    return VALID_TRANSITIONS[currentState] || []
  }

  if (!selectedOrder) return null

  const currentStatus = selectedOrder.OrderState
  const validNextStates = getValidNextStates(currentStatus)
  const canCancel =
    currentStatus === OrderState.Pending ||
    currentStatus === OrderState.Confirmed

  const stateLabel = ORDER_STATES_MAP[currentStatus]
  const badgeClass = getStateBadgeClass(currentStatus)

  return (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <SheetContent className="overflow-y-auto pt-12 sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            <span>Order #{selectedOrder.OrderCode}</span>
            <Badge className={cn("capitalize", badgeClass)}>{stateLabel}</Badge>
          </SheetTitle>
          <SheetDescription>
            Complete details for the order. Manage status and actions.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* --- Order Basic Info --- */}
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
                <p className="text-xs text-muted-foreground">Order Date</p>
                <p className="font-medium">
                  {formatDate(selectedOrder.CreatedDate)}
                </p>
              </div>
            </div>
          </div>

          {/* --- Print Details --- */}
          <div className="rounded-lg border p-4">
            <h3 className="text-lg font-medium">Print Details</h3>
            <div className="my-4 h-[1px] w-full bg-secondary"></div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-muted-foreground">
                  Number of Copies
                </p>
                <p className="font-medium">{selectedOrder.KopyaSayısı}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Number of Pages</p>
                <p className="font-medium">{selectedOrder.TotalPage}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Paper Type</p>
                <p className="font-medium">
                  {selectedOrder.Product?.paperType || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Print Type</p>
                <p className="font-medium">
                  {selectedOrder.Product?.printType || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Color Option</p>
                <p className="font-medium">
                  {selectedOrder.Product?.colorOption || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Base Price/Unit</p>
                <p className="font-medium">
                  {selectedOrder.Product?.price ??
                    selectedOrder.PricePerPage ??
                    "N/A"}{" "}
                  TL
                </p>
              </div>
            </div>
          </div>

          {/* --- Files --- */}
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
                    <div className="flex items-center space-x-2 overflow-hidden">
                      <Icons.fileText className="h-8 w-8 flex-shrink-0 text-muted-foreground" />
                      <span
                        className="truncate text-xs font-medium"
                        title={file.fileName}
                      >
                        {file.fileName}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        if (file?.filePath) {
                          fileService.downloadFile(file.filePath)
                        } else {
                          toast.error("File path not available for download.")
                        }
                      }}
                      className="flex-shrink-0 rounded-md bg-primary/10 p-1 text-xs text-primary hover:bg-primary/20"
                      title="Download File"
                    >
                      <Icons.download className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* --- Order Timeline (Fixed) --- */}
          <div className="rounded-lg border p-4">
            <h3 className="text-lg font-medium">Order Timeline</h3>
            <div className="my-4 h-[1px] w-full bg-secondary"></div>
            <div className="space-y-3">
              {/* Order Created Entry */}
              <div className="flex items-start space-x-3">
                <div className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-green-500"></div>
                <div className="flex-1">
                  <p className="font-medium">Order Created</p>
                  <p className="text-xs text-muted-foreground">
                    Order placed by {selectedOrder.CustomerName || "customer"}.
                  </p>
                </div>
                <p className="flex-shrink-0 text-right text-xs text-muted-foreground">
                  {formatDate(selectedOrder.CreatedDate)}
                </p>
              </div>

              {/* Status Change Entry (Show if not pending) */}
              {currentStatus !== OrderState.Pending && (
                <div className="flex items-start space-x-3">
                  <div className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-blue-500"></div>
                  <div className="flex-1">
                    <p className="font-medium">Order Status Changed</p>
                    <p className="text-xs text-muted-foreground">
                      Order status is currently {stateLabel}.
                    </p>
                  </div>
                  <p className="flex-shrink-0 text-right text-xs text-muted-foreground">
                    {/* Assuming no timestamp for status change, use current date as fallback */}
                    {selectedOrder.StatusUpdateDate
                      ? formatDate(selectedOrder.StatusUpdateDate)
                      : "Recently"}
                  </p>
                </div>
              )}

              {/* Add more timeline events here if you have historical data */}
            </div>
          </div>

          {/* --- Update Order Status Section --- */}
          {validNextStates.length > 0 && (
            <div className="rounded-lg border p-4">
              <h3 className="text-lg font-medium">Update Order Status</h3>
              <div className="my-4 h-[1px] w-full bg-secondary"></div>
              <div className="space-y-4">
                <Select
                  onValueChange={(value) => {
                    const newState = parseInt(value) as OrderState
                    if (
                      selectedOrder?.orderId &&
                      validNextStates.includes(newState)
                    ) {
                      updateOrderStatusMutation.mutate({
                        orderId: selectedOrder.orderId,
                        newState: newState,
                      })
                    } else {
                      console.error("Invalid state transition attempted.")
                      toast.warning("Invalid status transition selected.")
                    }
                  }}
                  value={currentStatus.toString()}
                  disabled={
                    updateOrderStatusMutation.isPending ||
                    cancelOrderMutation.isPending
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select next status..." />
                  </SelectTrigger>
                  <SelectContent>
                    {/* Show current state as disabled option for context */}
                    <SelectItem value={currentStatus.toString()} disabled>
                      Current: {ORDER_STATES_MAP[currentStatus]}
                    </SelectItem>
                    {/* Map only valid next states */}
                    {validNextStates.map((stateValue) => (
                      <SelectItem
                        key={stateValue}
                        value={stateValue.toString()}
                      >
                        {ORDER_STATES_MAP[stateValue]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Select the next status for this order based on workflow
                  progress.
                </p>
              </div>
            </div>
          )}

          {/* --- Order Actions --- */}
          <div className="flex space-x-2 pt-4">
            {/* Show Cancel button only if allowed */}
            {canCancel && (
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
                  <Icons.close className="mr-2 h-4 w-4" />
                )}
                Cancel Order (Reject)
              </Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
