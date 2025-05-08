import React from "react"
import { Icons } from "@/components/icons"
import { Skeleton } from "@/components/ui/skeleton"

// Main function that exports the three state component functions
export function useOrdersStates() {
  // Loading state component
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
                <div
                  key={index}
                  className="flex flex-col rounded-lg border p-4"
                >
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

  // Empty state component
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

  // Error state component
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

  // Return all three components as an object
  return {
    OrdersLoadingState,
    OrdersEmptyState,
    OrdersErrorState,
  }
}

// Example usage:
// import { useOrdersStates } from "./path-to-this-file"
//
// function YourComponent() {
//   const { OrdersLoadingState, OrdersEmptyState, OrdersErrorState } = useOrdersStates()
//
//   // Then use them as needed:
//   return isLoading ? <OrdersLoadingState /> :
//          error ? <OrdersErrorState error={error} /> :
//          orders.length === 0 ? <OrdersEmptyState /> : <YourOrdersList />
// }
