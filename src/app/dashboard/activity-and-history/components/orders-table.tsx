"use client"

import React, { useState, useEffect, useMemo } from "react" // Added useMemo
import { useQuery } from "@tanstack/react-query"
import useAuthStatus from "@/lib/queries/auth-status"
import { orderService } from "@/services/orders-service"
import { GetSingleOrder, OrderState, CopyFile } from "@/types/classes"
import { columns } from "./columns"
import { DataTable } from "./data-table"
import { cn } from "@/lib/utils"
import { buttonVariants, Button } from "@/components/ui/button"
import { OrderDetailsSheet } from "./order-details-sheet"
import { Icons } from "@/components/icons"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Import table state types
import {
  SortingState,
  ColumnFiltersState,
  PaginationState,
} from "@tanstack/react-table" // Added PaginationState

// Mapping helper (keep as is)
// ... mapApiStateToEnum ...
function mapApiStateToEnum(apiState?: string): OrderState {
  // ... (implementation from previous step)
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

// Status map needed for the filter dropdown
// ... STATUS_FILTER_OPTIONS ...
const STATUS_FILTER_OPTIONS = {
  all: "All Statuses", // Option to clear filter
  [OrderState.Pending]: "Pending",
  [OrderState.Confirmed]: "Confirmed",
  [OrderState.Started]: "Started",
  [OrderState.Finished]: "Finished",
  [OrderState.Completed]: "Completed",
  [OrderState.Rejected]: "Rejected",
}

export default function OrdersTable() {
  const { data: authStatus } = useAuthStatus()
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  // --- Manage Pagination State ---
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0, // Tanstack table uses 0-based index
    pageSize: 10,
  })

  const [selectedOrder, setSelectedOrder] = useState<GetSingleOrder | null>(
    null
  )
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  // Debounced Search state
  const [customerSearch, setCustomerSearch] = useState("")
  const [debouncedCustomerSearch, setDebouncedCustomerSearch] = useState("")

  // Debounce effect for customer search
  useEffect(() => {
    const handler = setTimeout(
      () => setDebouncedCustomerSearch(customerSearch),
      500
    )
    return () => clearTimeout(handler)
  }, [customerSearch])

  // Update columnFilters effect for customer search
  useEffect(() => {
    setColumnFilters((prev) => {
      const otherFilters = prev.filter((f) => f.id !== "CustomerName")
      if (debouncedCustomerSearch) {
        return [
          ...otherFilters,
          { id: "CustomerName", value: debouncedCustomerSearch },
        ]
      }
      return otherFilters
    })
  }, [debouncedCustomerSearch])

  // --- Adjust useQuery to use pageIndex + 1 for API call ---
  const apiPage = pageIndex + 1 // Convert 0-based index to 1-based for API
  const {
    data: ordersResponse,
    isLoading,
    error,
    isFetching, // Use isFetching for loading indicators during refetch
    isPreviousData, // Useful for pagination UI
  } = useQuery({
    // Update query key to include pagination
    queryKey: ["agencyOrders", apiPage, pageSize],
    queryFn: async (): Promise<{
      orders: GetSingleOrder[]
      totalCount: number
    }> => {
      if (!authStatus?.isAgency) return { orders: [], totalCount: 0 }
      // Pass 1-based page index to service
      const apiData = await orderService.getOrders(apiPage, pageSize)
      // ... (mapping logic remains the same) ...
      const mappedOrders: GetSingleOrder[] = apiData.orders.map(
        (order: any) => ({
          // Add 'any' temporarily if TS complains about raw type
          orderId: order.orderCode,
          OrderCode: order.orderCode,
          AgencyName: order.agencyName,
          CustomerName: order.customerUserName || null,
          TotalPrice: order.totalPrice,
          TotalPage: order.sayfaSayısı,
          KopyaSayısı: order.kopyaSayısı,
          CreatedDate: order.createdDate,
          OrderState: mapApiStateToEnum(order.orderState),
          PricePerPage: order.pricePerPage,
          CopyFiles:
            order.copyFile?.map((f: any) => ({
              fileName: f.fileName,
              filePath: f.filePath,
              fileCode: f.fileCode,
            })) ?? null, // Ensure filePath is mapped
          Product: {
            // Assuming product details might be flat or nested
            paperType: order.productPaperType,
            colorOption: order.productColorOption,
            printType: order.productPrintType,
            price: order.productPrice, // Assuming base price might be here
          },
        })
      )
      return {
        orders: mappedOrders,
        totalCount: apiData.totalCount || 0, // Use totalCount from API
      }
    },
    enabled: !!authStatus?.isAgency,
    keepPreviousData: true, // Recommended for smooth pagination
  })

  const ordersData = ordersResponse?.orders || []
  const totalOrderCount = ordersResponse?.totalCount || 0

  // Calculate page count based on total orders and page size
  const pageCount = useMemo(() => {
    return pageSize > 0 ? Math.ceil(totalOrderCount / pageSize) : 0
  }, [totalOrderCount, pageSize])

  const handleRowClick = (order: GetSingleOrder) => {
    setSelectedOrder(order)
    setIsSheetOpen(true)
  }

  const handleStatusFilterChange = (value: string) => {
    setColumnFilters((prev) => {
      const otherFilters = prev.filter((f) => f.id !== "OrderState")
      if (value && value !== "all") {
        return [...otherFilters, { id: "OrderState", value: value }]
      }
      return otherFilters
    })
    // Reset to first page when filters change
    setPagination((prev) => ({ ...prev, pageIndex: 0 }))
  }

  // Handle customer search input change
  const handleCustomerInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCustomerSearch(event.target.value)
    // Reset to first page when filters change (triggered by debounce effect)
    // Note: Debounce effect handles setting the filter, so pagination reset
    // should ideally happen there, or here if immediate reset is desired.
    // Let's keep it simple and reset pagination when the debounced value updates.
    // (This logic is implicitly handled by the useEffect updating columnFilters)
  }

  // Effect to reset page index when debounced search changes filters
  useEffect(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }))
  }, [debouncedCustomerSearch]) // Reset page when search filter is applied

  // Combine state for DataTable pagination prop
  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  )

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between gap-4 py-4">
        <Input
          placeholder="Filter by customer name..."
          value={customerSearch}
          onChange={handleCustomerInputChange} // Use specific handler
          className="max-w-sm"
        />
        <Select
          onValueChange={handleStatusFilterChange}
          // Optional: Control the Select value based on current filter state
          // value={columnFilters.find(f => f.id === 'OrderState')?.value as string ?? 'all'}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by Status" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(STATUS_FILTER_OPTIONS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-x-auto">
        {isLoading && !isPreviousData ? ( // Show spinner only on initial load or hard refresh
          <div className="flex h-64 items-center justify-center">
            <Icons.spinner className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="flex h-64 items-center justify-center text-red-500">
            Error:{" "}
            {error instanceof Error ? error.message : "Please try again."}
          </div>
        ) : authStatus?.isAgency ? (
          <>
            <DataTable
              columns={columns}
              data={ordersData}
              onRowClick={handleRowClick}
              columnFilters={columnFilters}
              setColumnFilters={setColumnFilters}
              sorting={sorting}
              setSorting={setSorting}
              // --- Pass Pagination State ---
              pagination={pagination}
              setPagination={setPagination}
              pageCount={pageCount}
            />

            <OrderDetailsSheet
              selectedOrder={
                ordersData.find(
                  (order) => order.orderId === selectedOrder?.orderId
                ) || selectedOrder
              }
              isSheetOpen={isSheetOpen}
              setIsSheetOpen={setIsSheetOpen}
              key={selectedOrder?.orderId} // Force remount when order changes
            />

            {/* --- Pagination Controls (Using state managed here) --- */}
            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                {/* Show total count from API, not affected by client filters */}
                Total Orders: {totalOrderCount}
              </div>
              <div className="flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setPagination((prev) => ({
                      ...prev,
                      pageIndex: prev.pageIndex - 1,
                    }))
                  }
                  disabled={pageIndex === 0 || isFetching} // Disable based on state
                >
                  Previous
                </Button>
                <span className="px-3 py-1 text-xs tabular-nums">
                  Page {pageIndex + 1} of {pageCount}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setPagination((prev) => ({
                      ...prev,
                      pageIndex: prev.pageIndex + 1,
                    }))
                  }
                  disabled={pageIndex >= pageCount - 1 || isFetching} // Disable based on state
                >
                  Next
                </Button>
                {/* Optional: Page size selector */}
                <Select
                  value={pageSize.toString()}
                  onValueChange={(value) => {
                    setPagination({
                      pageIndex: 0, // Reset to first page on size change
                      pageSize: Number(value),
                    })
                  }}
                >
                  <SelectTrigger className="w-[80px]">
                    <SelectValue placeholder={pageSize} />
                  </SelectTrigger>
                  <SelectContent>
                    {[10, 20, 50, 100].map((size) => (
                      <SelectItem key={size} value={size.toString()}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {isFetching && (
                <Icons.spinner className="ml-4 h-4 w-4 animate-spin" />
              )}{" "}
              {/* Show loading during refetch */}
            </div>
          </>
        ) : (
          // ... (Not agency message)
          <div className="flex h-64 items-center justify-center text-muted-foreground">
            You need agency access to view orders.
          </div>
        )}
      </div>
    </div>
  )
}
