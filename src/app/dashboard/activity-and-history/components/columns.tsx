"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import React from "react"
import { GetSingleOrder, OrderState } from "@/types/classes"
import { Button } from "@/components/ui/button" // Added for sort button styling
import { ArrowUpDown } from "lucide-react" // Added for sort icon

// Map for status display (keep as is)
const ORDER_STATES_MAP: { [key in OrderState]: string } = {
  [OrderState.Pending]: "Pending",
  [OrderState.Confirmed]: "Confirmed",
  [OrderState.Started]: "Started",
  [OrderState.Finished]: "Finished",
  [OrderState.Completed]: "Completed",
  [OrderState.Rejected]: "Rejected",
}

// Badge class function (keep as is)
const getStateBadgeClass = (state: OrderState) => {
  // ... (implementation from previous step)
  const stateString = ORDER_STATES_MAP[state]?.toLowerCase() // Get string representation
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

// Format date function (keep as is)
const formatDate = (dateString: string | Date | null | undefined) => {
  // ... (implementation from previous step)
  if (!dateString) return "N/A"
  try {
    // Simple date format, adjust as needed
    return new Date(dateString).toLocaleDateString("en-GB") // e.g., DD/MM/YYYY
  } catch (e) {
    console.error("Error formatting date:", e)
    return "Invalid Date"
  }
}

// Column Definitions using GetSingleOrder
export const columns: ColumnDef<GetSingleOrder>[] = [
  {
    accessorKey: "OrderCode",
    header: "Order Code",
    cell: ({ row }) => (
      <div className="font-medium">{row.original.OrderCode}</div>
    ),
    enableSorting: false, // Example: Disable sorting for code
    enableHiding: false, // Example: Prevent hiding this column
  },
  // {
  //   accessorKey: "AgencyName",
  //   header: "Agency",
  //   cell: ({ row }) => <div>{row.original.AgencyName || "N/A"}</div>,
  // },
  {
    // Crucial for filtering: Use the correct accessorKey
    accessorKey: "CustomerName",
    header: "Customer",
    cell: ({ row }) => <div>{row.original.CustomerName || "N/A"}</div>,
  },
  {
    accessorKey: "TotalPage",
    header: "Pages",
    cell: ({ row }) => (
      <div className="text-start">{row.original.TotalPage ?? 0}</div>
    ),
  },
  {
    accessorKey: "TotalPrice",
    header: "Total Cost",
    cell: ({ row }) => {
      const totalPrice = row.original.TotalPrice
      const displayPrice =
        typeof totalPrice === "number" ? totalPrice.toFixed(2) : "N/A"
      return <div className="text-start font-medium">₺{displayPrice}</div>
    },
  },
  {
    // Crucial for filtering: Use the correct accessorKey
    accessorKey: "OrderState",
    header: "Status",
    // Add a filter function (optional but can improve matching)
    filterFn: (row, columnId, filterValue) => {
      // If filter value is 'all' or empty, show row
      if (!filterValue || filterValue === "all") return true
      // Compare the row's OrderState (enum value) with the filter value (string representation of enum)
      return row.original.OrderState === parseInt(filterValue as string, 10)
    },
    cell: ({ row }) => {
      const statusEnum = row.original.OrderState
      const statusString = ORDER_STATES_MAP[statusEnum] || "Unknown"
      return (
        <Badge
          variant="outline"
          className={cn("px-2 py-1 capitalize", getStateBadgeClass(statusEnum))}
        >
          {statusString}
        </Badge>
      )
    },
  },
  {
    // Crucial for sorting: Use the correct accessorKey
    accessorKey: "CreatedDate",
    // Make header explicitly sortable
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Order Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const formattedDate = formatDate(row.original.CreatedDate)
      return <div className="pl-4">{formattedDate}</div> // Added padding to align with button header
    },
    // Optional: Define a custom sorting function if default doesn't work well for dates
    // sortingFn: 'datetime', // Tanstack table built-in for dates
  },
]
