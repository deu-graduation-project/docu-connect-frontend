"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import React from "react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Ellipsis } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
// Define the Order type based on your service response

export type Order = {
  orderId: string
  agencyName: string
  totalCost: number
  status:
    | "pending"
    | "confirmed"
    | "rejected"
    | "started"
    | "finished"
    | "completed"
    | string
  orderDate: string
  // Keep all your existing fields here
  fileName?: string
  paperSize?: string
  colorOption?: string
  printStyle?: string
  numPrints?: number
  pricePerPage?: number
  filePrice?: number
  numPages?: number
  // ... any other fields you need
}

const getStateBadgeClass = (state: string) => {
  switch (state) {
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

// Column Definitions
export const columns: ColumnDef<Order>[] = [
  {
    accessorKey: "orderId",
    header: "Order ID",
    cell: ({ row }) => (
      <div className="font-medium">{row.original.orderId}</div>
    ),
  },
  {
    accessorKey: "numPages",
    header: "Pages",
    cell: ({ row }) => (
      <div className="text-center">{row.original.numPages || 0}</div>
    ),
  },
  {
    // Optional: Use accessorKey for sorting/filtering consistency
    accessorKey: "TotalPrice",
    header: "Total Cost",
    cell: ({ row }) => {
      // Access the correct property name: TotalPrice
      const totalPrice = row.original.totalCost

      // Add a check: only call toFixed if it's a valid number
      const displayPrice =
        typeof totalPrice === "number" ? totalPrice.toFixed(2) : "N/A" // Or display 0.00 or '-'

      // Apply formatting
      return <div className="text-start font-medium">₺{displayPrice}</div>
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status
      return (
        <Badge
          className={cn("px-2 py-1 capitalize", getStateBadgeClass(status))}
        >
          {status}
        </Badge>
      )
    },
  },
  {
    accessorKey: "orderDate",
    header: "Order Date",
    cell: ({ row }) => {
      const [formattedDate, setFormattedDate] = React.useState<string | null>(
        null
      )

      React.useEffect(() => {
        const date = new Date(row.original.orderDate)
        setFormattedDate(date.toLocaleDateString())
      }, [row.original.orderDate])

      return <div>{formattedDate || "Loading..."}</div>
    },
  },
]
