"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge"; // Assuming you have shadcn badge
import { cn } from "@/lib/utils"; // Utility for class concatenation
import { formatDate } from "@/lib/utils";
import React from "react";
export type Order = {
  orderId: string;
  agencyName: string;
  totalCost: number;
  status: "pending" | "processing" | "success" | "failed";
  orderDate: string; // Kept as string for easier API handling
};

// Example order data
export const orders: Order[] = [
  {
    orderId: "48602fjd",
    agencyName: "New Agency",
    totalCost: 120,
    status: "pending",
    orderDate: new Date().toISOString(), // Store as ISO string
  },
];

const statusColorMap: Record<Order["status"], string> = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  success: "bg-green-100 text-green-800",
  failed: "bg-red-100 text-red-800",
};

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
      <div className="text-start">${row.original.totalCost.toFixed(2)}</div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <Badge className={cn("px-2 py-1", statusColorMap[status])}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      );
    },
  },
  {
    accessorKey: "orderDate",
    header: "Order Date",
    cell: ({ row }) => {
      const [formattedDate, setFormattedDate] = React.useState<string | null>(
        null
      );

      React.useEffect(() => {
        const date = new Date(row.original.orderDate);
        setFormattedDate(date.toLocaleDateString());
      }, [row.original.orderDate]);

      return <div>{formattedDate || "Loading..."}</div>;
    },
  },
];
