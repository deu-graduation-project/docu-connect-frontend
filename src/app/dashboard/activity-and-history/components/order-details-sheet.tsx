"use client" // Keep this if it's already there

import React, { useState, useEffect } from "react" // Added useState, useEffect
import { useMutation, useQueryClient } from "@tanstack/react-query"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  Dialog, // Added Dialog components
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger, // Only if you need to trigger dialog manually elsewhere
} from "@/components/ui/dialog" // Assuming path for Shadcn Dialog
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input" // Added Input
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { cn } from "@/lib/utils"
import { orderService } from "@/services/orders-service" // Ensure this service is correctly imported
import { fileService } from "@/services/file-service"
import { toast } from "sonner" // Assuming you use sonner for toasts
import { Icons } from "@/components/icons" // For spinner icon
import { OrderState, GetSingleOrder } from "@/types/classes" // Ensure these types are correct

// Define order states using the enum for clarity and type safety
const ORDER_STATES_MAP: { [key in OrderState]: string } = {
  [OrderState.Pending]: "Pending",
  [OrderState.Confirmed]: "Confirmed",
  [OrderState.Started]: "Started",
  [OrderState.Finished]: "Finished",
  [OrderState.Completed]: "Completed",
  [OrderState.Rejected]: "Rejected",
}

// Define valid transitions (remains the same)
const VALID_TRANSITIONS: { [key in OrderState]?: OrderState[] } = {
  [OrderState.Pending]: [OrderState.Confirmed, OrderState.Rejected],
  [OrderState.Confirmed]: [OrderState.Started, OrderState.Rejected],
  [OrderState.Started]: [OrderState.Finished],
  [OrderState.Finished]: [OrderState.Completed], // Key transition
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

  // State for the new completion code dialog
  const [isCompletionDialogVisible, setIsCompletionDialogVisible] =
    useState(false)
  const [agencyProvidedCode, setAgencyProvidedCode] = useState("")
  const [pendingCompletionState, setPendingCompletionState] =
    useState<OrderState | null>(null)

  // --- Mutations ---
  // Inside OrderDetailsSheet.tsx

  const updateOrderStatusMutation = useMutation({
    mutationFn: ({
      orderId, // This will be used as 'orderCode'
      newState, // This is the numeric OrderState enum value
      code, // This is the 'agencyProvidedCode' from the dialog, for 'completedCode'
    }: {
      orderId: string
      newState: OrderState
      code?: string
    }) => {
      const stringState = ORDER_STATES_MAP[newState] // Convert numeric enum to string (e.g., "Completed")
      if (!stringState) {
        return Promise.reject(new Error(`Invalid order state: ${newState}`))
      }

      // Make sure 'code' (agencyProvidedCode) is passed as the 6th argument (completedCode)
      // Other optional params (comment, starRating, removeCommentIds) are undefined
      // if the agency isn't providing them in this specific action.
      return orderService.updateOrder(
        stringState, // orderState
        orderId, // orderCode
        undefined, // comment
        undefined, // starRating
        undefined, // removeCommentIds
        code // completedCode (This is the crucial part)
      )
    },
    onMutate: async ({ newState, code }) => {
      const actionVerb = code ? "send code and complete" : "update status for"
      toast.info(
        `Attempting to ${actionVerb} order #${selectedOrder?.OrderCode} to ${ORDER_STATES_MAP[newState]}`
      )
      await queryClient.cancelQueries({ queryKey: ["agencyOrders"] })
    },
    onSuccess: (data, { orderId, newState, code }) => {
      const successMessage = code
        ? `Code sent and order #${selectedOrder?.OrderCode} marked as ${ORDER_STATES_MAP[newState]}`
        : `Order #${selectedOrder?.OrderCode} status updated to ${ORDER_STATES_MAP[newState]}`
      toast.success(successMessage)
      queryClient.invalidateQueries({ queryKey: ["agencyOrders"] })

      if (code) {
        // If a code was involved (i.e., dialog was used)
        setIsCompletionDialogVisible(false)
        setAgencyProvidedCode("")
        setPendingCompletionState(null)
      }
    },
    onError: (err, { orderId, newState, code }) => {
      const actionVerb = code ? "send code and complete" : "update status for"
      // The error from backend will be err.message
      toast.error(
        `Failed to ${actionVerb} order #${selectedOrder?.OrderCode}. ${err instanceof Error ? err.message : "Please try again."}`
      )
      queryClient.invalidateQueries({ queryKey: ["agencyOrders"] })
    },
  })

  const cancelOrderMutation = useMutation({
    mutationFn: (orderId: string) => {
      const stringState = ORDER_STATES_MAP[OrderState.Rejected]
      if (!stringState) {
        return Promise.reject(new Error("Invalid order state for rejection."))
      }
      return orderService.updateOrder(stringState, orderId) // No code needed for rejection
    },
    onMutate: async () => {
      toast.info(`Attempting to cancel order #${selectedOrder?.OrderCode}`)
      await queryClient.cancelQueries({ queryKey: ["agencyOrders"] })
    },
    onSuccess: (data, orderId) => {
      toast.success(`Order #${selectedOrder?.OrderCode} has been cancelled`)
      queryClient.invalidateQueries({ queryKey: ["agencyOrders"] })
      setIsSheetOpen(false)
    },
    onError: (err, orderId) => {
      toast.error(
        `Failed to cancel order #${selectedOrder?.OrderCode}: ${err instanceof Error ? err.message : "Unknown error"}`
      )
      queryClient.invalidateQueries({ queryKey: ["agencyOrders"] })
    },
  })

  const handleStatusSelectChange = (value: string) => {
    const newState = parseInt(value) as OrderState
    if (selectedOrder?.orderId && validNextStates.includes(newState)) {
      if (
        currentStatus === OrderState.Finished &&
        newState === OrderState.Completed
      ) {
        // Open dialog instead of immediate mutation
        setPendingCompletionState(OrderState.Completed)
        setIsCompletionDialogVisible(true)
      } else {
        // For other transitions, mutate directly without a code
        updateOrderStatusMutation.mutate({
          orderId: selectedOrder.orderId,
          newState: newState,
        })
      }
    }
  }

  const handleSubmitCompletionCode = () => {
    if (!agencyProvidedCode.trim()) {
      toast.error("Please enter a completion code or message for the customer.")
      return
    }
    if (
      selectedOrder?.orderId &&
      pendingCompletionState === OrderState.Completed
    ) {
      console.log("Submitting to mutation with code:", agencyProvidedCode) // For debugging

      updateOrderStatusMutation.mutate({
        orderId: selectedOrder.orderId,
        newState: OrderState.Completed,
        code: agencyProvidedCode,
      })
    }
  }

  // Helper functions (getStateBadgeClass, formatDate, getValidNextStates) remain the same...
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

  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }
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
  console.log(selectedOrder, "selectedOrder")

  return (
    <>
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="overflow-y-auto pt-12 sm:max-w-lg">
          <SheetHeader>
            <SheetTitle className="flex items-center justify-between">
              <span>Order #{selectedOrder.OrderCode}</span>
              <Badge className={cn("capitalize", badgeClass)}>
                {stateLabel}
              </Badge>
            </SheetTitle>
            <SheetDescription>
              Complete details for the order. Manage status and actions.
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-6">
            {/* Order Info, Print Details, Files, Timeline sections remain the same */}
            {/* ... (previous JSX for these sections) ... */}
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
                  <p className="text-xs text-muted-foreground">
                    Number of Pages
                  </p>
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
                  <p className="text-xs text-muted-foreground">
                    Base Price/Unit
                  </p>
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
                      <div className="flex items-center space-x-2">
                        <Icons.fileText className="h-8 w-8 text-muted-foreground" />
                        <span className="text-xs font-medium">
                          {file.fileName || `File ${index + 1}`}{" "}
                        </span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={async () => {
                          if (!file?.fileCode) {
                            toast.error("Download Error", {
                              description:
                                "File identifier is missing. Cannot download.",
                            })
                            return
                          }

                          try {
                            // Show loading toast
                            const loadingToast = toast.loading(
                              "Downloading file..."
                            )

                            // Use the fileName from the file object when downloading
                            await fileService.downloadFile(file.fileCode)

                            // Dismiss loading toast and show success
                            toast.dismiss(loadingToast)
                            toast.success("Download successful")
                          } catch (error) {
                            // Show error toast with detailed message
                            toast.error("Download Failed", {
                              description:
                                error instanceof Error
                                  ? error.message
                                  : "Unknown error occurred",
                            })
                          }
                        }}
                        disabled={
                          !file?.fileCode ||
                          updateOrderStatusMutation.isPending ||
                          cancelOrderMutation.isPending
                        }
                      >
                        {/* Add a loading spinner when downloading */}
                        {updateOrderStatusMutation.isPending ? (
                          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Icons.download className="mr-2 h-4 w-4" />
                        )}
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* --- Order Timeline (Fixed) --- */}
            <div className="rounded-lg border p-4">
              <h3 className="text-lg font-medium">Order Timeline</h3>
              {/* ... (Timeline JSX as before) ... */}
            </div>

            {/* --- Update Order Status Section --- */}
            {validNextStates.length > 0 && (
              <div className="rounded-lg border p-4">
                <h3 className="text-lg font-medium">Update Order Status</h3>
                <div className="my-4 h-[1px] w-full bg-secondary"></div>
                <div className="space-y-4">
                  <Select
                    value={currentStatus.toString()}
                    onValueChange={handleStatusSelectChange} // Use the new handler
                    disabled={
                      updateOrderStatusMutation.isPending ||
                      cancelOrderMutation.isPending
                    }
                  >
                    <SelectTrigger className="w-full sm:w-[200px]">
                      <SelectValue>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            Current: {ORDER_STATES_MAP[currentStatus]}
                          </span>
                        </div>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <div className="p-1">
                        <div className="px-2 py-1.5 text-sm font-medium text-muted-foreground">
                          Change to:
                        </div>
                        {validNextStates.map((stateValue) => (
                          <SelectItem
                            key={stateValue}
                            value={stateValue.toString()}
                            className="pl-4"
                          >
                            {ORDER_STATES_MAP[stateValue]}
                          </SelectItem>
                        ))}
                      </div>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Select the next status for this order. If moving from
                    'Finished' to 'Completed', you will be prompted to provide a
                    completion code/message for the customer.
                  </p>
                </div>
              </div>
            )}

            {/* --- Order Actions (Cancel Button) --- */}
            <div className="flex space-x-2 pt-4">
              {canCancel && (
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={() => {
                    if (selectedOrder?.orderId) {
                      cancelOrderMutation.mutate(selectedOrder.orderId)
                    }
                  }}
                  disabled={
                    updateOrderStatusMutation.isPending ||
                    cancelOrderMutation.isPending
                  }
                >
                  {cancelOrderMutation.isPending ? (
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Cancel Order
                </Button>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* --- Completion Code Dialog --- */}
      <Dialog
        open={isCompletionDialogVisible}
        onOpenChange={setIsCompletionDialogVisible}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Provide Completion Code/Instructions</DialogTitle>
            <DialogDescription>
              Enter the code or message to send to the customer for order{" "}
              <strong>#{selectedOrder?.OrderCode}</strong>. This will also mark
              the order as 'Completed'.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-4">
            <label
              htmlFor="agencyCodeInput"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Completion Code / Message
            </label>
            <Input
              id="agencyCodeInput"
              placeholder="e.g., Your pickup code is XYZ123"
              value={agencyProvidedCode}
              onChange={(e) => setAgencyProvidedCode(e.target.value)}
              className="mt-1"
            />
            <p className="text-xs text-muted-foreground">
              The customer will use this code/information to confirm receipt on
              their end.
            </p>
          </div>
          <DialogFooter className="sm:justify-end">
            <Button
              variant="outline"
              onClick={() => {
                setIsCompletionDialogVisible(false)
                setAgencyProvidedCode("")
                setPendingCompletionState(null)
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitCompletionCode}
              disabled={
                updateOrderStatusMutation.isPending ||
                !agencyProvidedCode.trim()
              }
            >
              {updateOrderStatusMutation.isPending &&
              updateOrderStatusMutation.variables?.code ? (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Send and Complete Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
