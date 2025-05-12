"use client"

import React, { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import useAuthStatus from "@/lib/queries/auth-status"
import { orderService } from "@/services/orders-service"
// Import the specific types needed
import { GetSingleOrder, OrderState, CopyFile } from "@/types/classes"
import { columns } from "./columns" // Ensure columns are adapted for GetSingleOrder type
import { DataTable } from "./data-table"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { OrderDetailsSheet } from "./order-details-sheet"
import { Icons } from "@/components/icons"

// Helper function to map API state string to numeric enum
function mapApiStateToEnum(apiState?: string): OrderState {
  if (!apiState) return OrderState.Pending // Default state
  const lowerState = apiState.toLowerCase()
  switch (lowerState) {
    case "pending":
      return OrderState.Pending
    case "confirmed":
      return OrderState.Confirmed
    case "started":
      return OrderState.Started
    case "finished":
      return OrderState.Finished
    case "completed":
      return OrderState.Completed
    case "rejected":
      return OrderState.Rejected
    default:
      console.warn(`Unknown order state from API: ${apiState}`)
      return OrderState.Pending // Fallback state
  }
}

export default function OrdersTable() {
  const { data: authStatus } = useAuthStatus()
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  // State holds the GetSingleOrder object after mapping
  const [selectedOrder, setSelectedOrder] = useState<GetSingleOrder | null>(
    null
  )
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  const {
    data: ordersResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["agencyOrders", page, pageSize],
    // Specify the return type of the queryFn for clarity
    queryFn: async (): Promise<{
      orders: GetSingleOrder[]
      totalCount: number
    }> => {
      if (!authStatus?.isAgency) {
        return { orders: [], totalCount: 0 }
      }
      // Fetch raw data from the service
      // Assuming apiData is like { orders: ApiOrder[], totalCount?: number }
      const apiData = await orderService.getOrders(page, pageSize)

      // --- Mapping Step ---
      const mappedOrders: GetSingleOrder[] = apiData.orders.map((order) => ({
        // Map fields from API structure to GetSingleOrder structure
        orderId: order.orderCode, // Use orderCode as orderId
        OrderCode: order.orderCode,
        AgencyName: order.agencyName,
        CustomerName: order.customerUserName || null, // Handle potential null/undefined
        TotalPrice: order.totalPrice,
        TotalPage: order.sayfaSayısı, // Map from Turkish name
        KopyaSayısı: order.kopyaSayısı, // Map from Turkish name
        CreatedDate: order.createdDate,
        OrderState: mapApiStateToEnum(order.orderState), // *** Use the mapping helper ***
        PricePerPage: order.pricePerPage,
        CopyFiles: order.copyFile
          ? order.copyFile.map((f: any) => ({ fileName: f.fileName }))
          : null, // Map file array
        // Map optional fields if needed
        ProductPaperType: order.productPaperType,
        ProductColorOption: order.productColorOption,
        ProductPrintType: order.productPrintType,
      }))

      return {
        orders: mappedOrders,
        // Pass totalCount if your API provides it, otherwise calculate based on result length maybe?
        totalCount: apiData.totalCount || mappedOrders.length,
      }
    },
    enabled: !!authStatus?.isAgency,
  })

  // Extract the *mapped* orders array for the DataTable
  const ordersData = ordersResponse?.orders || []
  const totalOrderCount = ordersResponse?.totalCount || 0 // Use totalCount for pagination

  const minTableHeight = `calc(${
    Math.max(
      ordersData.length, // Use fetched data length for calculation
      1
    ) * 53
  }px + 57px)` // Adjust row height (53px) if needed

  const handleRowClick = (order: GetSingleOrder) => {
    // Set the *mapped* GetSingleOrder object
    setSelectedOrder(order)
    setIsSheetOpen(true)
  }

  return (
    <div className="container mx-auto py-10">
      <div className="overflow-x-auto">
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <Icons.spinner className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="flex h-64 items-center justify-center text-red-500">
            Error loading orders:{" "}
            {error instanceof Error ? error.message : "Please try again."}
          </div>
        ) : authStatus?.isAgency ? (
          <>
            <div className="min-h-[600px]">
              <div style={{ minHeight: minTableHeight }}>
                <DataTable
                  columns={columns} // *** REMINDER: Ensure columns.ts uses GetSingleOrder properties ***
                  data={ordersData} // Pass the mapped data
                  onRowClick={handleRowClick}
                />
              </div>

              {/* Render the imported OrderDetailsSheet with the mapped selectedOrder */}
              <OrderDetailsSheet
                selectedOrder={selectedOrder} // Pass the state holding GetSingleOrder | null
                isSheetOpen={isSheetOpen}
                setIsSheetOpen={setIsSheetOpen}
              />

              {/* Pagination Controls - Using totalOrderCount */}
              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Showing {ordersData.length} of {totalOrderCount} entries
                </div>
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                    disabled={page === 1 || isLoading}
                    className={cn(
                      buttonVariants({ variant: "outline" }),
                      "disabled:opacity-50"
                    )}
                  >
                    Previous
                  </button>
                  <span className="px-3 py-1 text-xs tabular-nums">
                    Page {page}{" "}
                    {/* Optional: Calculate total pages: Math.ceil(totalOrderCount / pageSize) */}
                  </span>
                  <button
                    onClick={() => setPage((prev) => prev + 1)}
                    // Disable 'Next' accurately using totalCount
                    disabled={page * pageSize >= totalOrderCount || isLoading}
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
