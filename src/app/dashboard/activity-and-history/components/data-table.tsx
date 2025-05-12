"use client"

import React from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  PaginationState, // Import PaginationState
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  onRowClick?: (row: TData) => void
  columnFilters: ColumnFiltersState
  setColumnFilters: React.Dispatch<React.SetStateAction<ColumnFiltersState>>
  sorting: SortingState
  setSorting: React.Dispatch<React.SetStateAction<SortingState>>
  // --- Add Pagination State Props ---
  pagination: PaginationState
  setPagination: React.Dispatch<React.SetStateAction<PaginationState>>
  pageCount: number // Pass calculated page count
}

export function DataTable<TData, TValue>({
  columns,
  data,
  onRowClick,
  columnFilters,
  setColumnFilters,
  sorting,
  setSorting,
  // --- Destructure Pagination Props ---
  pagination,
  setPagination,
  pageCount,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    pageCount: pageCount, // Set page count for pagination logic
    state: {
      sorting,
      columnFilters,
      pagination, // Use pagination state from props
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination, // Update pagination state managed in parent
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    manualPagination: true, // Crucial: Indicate pagination is handled outside (by useQuery in parent)
    // manualFiltering: true, // Uncomment if server-side
    // manualSorting: true,  // Uncomment if server-side
  })

  // Expose table instance if needed elsewhere, e.g., for external controls
  // React.useImperativeHandle(ref, () => table, [table]); // Requires forwardRef

  return (
    <div className="rounded-md border">
      <Table>
        {/* TableHeader remains the same */}
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    style={{
                      width:
                        header.getSize() !== 150 ? header.getSize() : undefined,
                    }}
                  >
                    {" "}
                    {/* Optional: Set width */}
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        {/* TableBody remains the same */}
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                onClick={
                  onRowClick ? () => onRowClick(row.original) : undefined
                }
                className={cn(onRowClick && "cursor-pointer hover:bg-muted/50")}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results matching your filters. {/* Updated message */}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {/* You can optionally render pagination controls directly here */}
      {/* Or keep them in the parent OrdersTable component */}
    </div>
  )
}
