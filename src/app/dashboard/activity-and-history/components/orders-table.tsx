"use client"

import { Order, columns } from "./columns"
import { DataTable } from "./data-table"
import { useQuery } from "@tanstack/react-query"
import useAuthStatus from "@/lib/queries/auth-status"
import { orderService } from "@/services/orders-service"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
export default function OrdersTable() {
  const { data: authStatus } = useAuthStatus()
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  const {
    data: ordersData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["agencyOrders", page, pageSize],
    queryFn: async () => {
      if (!authStatus?.isAgency) {
        return []
      }
      // Fetch orders from the service
      const apiData = await orderService.getOrders(page, pageSize)

      // Map the API response to match our Order type
      return apiData.orders.map((order) => ({
        orderId: order.orderCode || "",
        agencyName: order.agencyName || "Agency",
        totalCost: order.totalPrice || 0,
        status: mapOrderStateToStatus(order.orderState),
        orderDate: order.createdDate || new Date().toISOString(),
      })) as Order[]
    },
    enabled: !!authStatus?.isAgency,
  })

  // In your OrdersTable component, update the mapOrderStateToStatus function:
  function mapOrderStateToStatus(state?: string): Order["status"] {
    if (!state) return "pending"

    const lowerState = state.toLowerCase()
    if (lowerState.includes("completed")) return "completed"
    if (lowerState.includes("finished")) return "finished"
    if (lowerState.includes("started")) return "started"
    if (lowerState.includes("confirmed")) return "confirmed"
    if (lowerState.includes("rejected")) return "rejected"
    if (lowerState.includes("pending")) return "pending"

    return state // return the original state if no match
  }

  // Calculate the minimum height needed for 10 rows (pageSize) plus header and padding
  const minTableHeight = `calc(${pageSize * 53}px + 57px)` // 53px per row, 57px for header

  return (
    <div className="container mx-auto py-10">
      <div className="overflow-x-auto">
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
          </div>
        ) : error ? (
          <div className="flex h-64 items-center justify-center text-red-500">
            Error loading orders. Please try again.
          </div>
        ) : authStatus?.isAgency ? (
          <>
            <div className="min-h-[600px]">
              {" "}
              {/* Fixed height container */}
              <div style={{ minHeight: minTableHeight }}>
                <DataTable
                  columns={columns}
                  data={ordersData || []}
                  onRowClick={(order) => {
                    setSelectedOrder(order)
                    setIsSheetOpen(true)
                  }}
                />
              </div>
              {selectedOrder && (
                <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                  <SheetContent className="overflow-y-auto pt-12">
                    <SheetHeader>
                      <SheetTitle className="flex items-center justify-between">
                        <span>Order #{selectedOrder.orderId}</span>
                        {/* <Badge
                          className={getStateBadgeClass(selectedOrder.status)}
                        >
                          {selectedOrder.status}
                        </Badge> */}
                      </SheetTitle>
                      <SheetDescription>
                        Complete details for your order
                      </SheetDescription>
                    </SheetHeader>

                    <div className="mt-6 space-y-6">
                      {/* Order Basic Info */}
                      <div className="rounded-lg border p-4">
                        <h3 className="text-lg font-medium">
                          Order Information
                        </h3>
                        <div className="my-4 h-[1px] w-full bg-secondary"></div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <p className="text-xs text-muted-foreground">
                              Agency
                            </p>
                            <p className="font-medium">
                              {selectedOrder.agencyName}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">
                              Total Price
                            </p>
                            <p className="font-medium">
                              {selectedOrder.totalCost} TL
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">
                              Order Date
                            </p>
                            <p className="font-medium">
                              {new Date(
                                selectedOrder.orderDate
                              ).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "numeric",
                                day: "numeric",
                                hour: "2-digit",
                              })}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Add other sections similarly */}
                      {/* Print Details, Files, Timeline etc. */}

                      {/* Order Actions */}
                      <div className="flex space-x-2">
                        <button className="flex-1 rounded-md border border-destructive bg-destructive/10 py-2 text-sm font-medium text-destructive hover:bg-destructive/20">
                          Cancel Order
                        </button>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              )}
              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Showing {ordersData?.length || 0} entries
                </div>
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                    disabled={page === 1}
                    className={cn(
                      buttonVariants({ variant: "outline" }),
                      "disabled:opacity-50"
                    )}
                  >
                    Previous
                  </button>
                  <span className="px-3 py-1 text-xs">Page {page}</span>
                  <button
                    onClick={() => setPage((prev) => prev + 1)}
                    disabled={!ordersData || ordersData.length < pageSize}
                    className={cn(
                      buttonVariants({ variant: "outline" }),
                      "disabled:opacity-50"
                    )}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex h-64 items-center justify-center text-muted-foreground">
            You need agency access to view orders.
          </div>
        )}
      </div>
    </div>
  )
}
