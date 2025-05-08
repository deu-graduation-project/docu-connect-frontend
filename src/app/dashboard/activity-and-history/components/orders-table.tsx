"use client"
import { Order, columns } from "./columns"
import { DataTable } from "./data-table"
import { useQuery } from "@tanstack/react-query"
import useAuthStatus from "@/lib/queries/auth-status"
import { getOrders } from "@/services/orders-service"
import { orderService } from "@/services/orders-service"
import { useEffect, useState } from "react"

export default function OrdersTable() {
  const { data: authStatus } = useAuthStatus()

  const { data: agencyDetails } = useQuery({
    queryKey: ["agencyOrders"],
    queryFn: () => {
      if (!authStatus?.isAgency) {
        return []
      }
      return orderService.getOrders(0, 10)
    },
  })

  console.log("agencyDetails", agencyDetails)

  return (
    <div className="container mx-auto py-10">
      <h1 className="mb-6 text-2xl font-bold">Recent Orders & Photocopies</h1>
      {/* <DataTable columns={columns} data={data} /> */}
    </div>
  )
}
