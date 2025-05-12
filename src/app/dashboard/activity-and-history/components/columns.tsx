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
}

// State badge styling function
const getStateBadgeClass = (state: string) => {
  switch (state.toLowerCase()) {
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
    accessorKey: "agencyName",
    header: "Agency Name",
  },
  {
    accessorKey: "totalCost",
    header: "Total Cost",
    cell: ({ row }) => (
      <div className="text-start">₺{row.original.totalCost.toFixed(2)}</div>
    ),
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
          {status.toLowerCase()}
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
  {
    id: "actions",
    cell: ({ row }) => (
      <Sheet>
        <SheetTrigger asChild>
          <Button
            className={cn(
              buttonVariants({ variant: "outline", size: "icon" }),
              "items center flex justify-center text-primary"
            )}
          >
            <Ellipsis />
          </Button>
        </SheetTrigger>
      </Sheet>
    ),
  },
]
