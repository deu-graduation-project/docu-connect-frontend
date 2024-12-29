"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge"; // Assuming you have shadcn badge
import { cn } from "@/lib/utils"; // Utility for class concatenation
import React from "react";

export type Order = {
  noteTitle: string;
  action: "downloaded" | "liked" | "uploaded" | "commented";
  changeDate: string;
};

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

// Example order data
export const orders: Order[] = [
  {
    noteTitle: "Physics Notes",
    action: "downloaded",
    changeDate: new Date().toISOString(), // Store as ISO string
  },
  {
    noteTitle: "Chemistry Notes",
    action: "liked",
    changeDate: new Date().toISOString(), // Store as ISO string
  },
  {
    noteTitle: "Math Notes",
    action: "uploaded",
    changeDate: new Date().toISOString(), // Store as ISO string
  },
  {
    noteTitle: "Biology Notes",
    action: "commented",
    changeDate: new Date().toISOString(), // Store as ISO string
  },
];

const statusColorMap: Record<Order["action"], string> = {
  downloaded: "bg-yellow-100 text-yellow-800",
  liked: "bg-blue-100 text-blue-800",
  uploaded: "bg-green-100 text-green-800",
  commented: "bg-red-100 text-red-800",
};

// Column Definitions
export const columns: ColumnDef<Order>[] = [
  {
    accessorKey: "noteTitle",
    header: "Note Title",
    cell: ({ row }) => (
      <div className="font-medium">{row.original.noteTitle}</div>
    ),
  },
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ row }) => {
      const status = row.original.action;
      return (
        <Badge className={cn("px-2 py-1", statusColorMap[status])}>
          {status
            ? status.charAt(0).toUpperCase() + status.slice(1)
            : "Unknown"}
        </Badge>
      );
    },
  },

  {
    accessorKey: "changeDate",
    header: "Change Date",
    cell: ({ row }) => {
      const [formattedDate, setFormattedDate] = React.useState<string | null>(
        null
      );

      React.useEffect(() => {
        const date = new Date(row.original.changeDate);
        setFormattedDate(date.toLocaleDateString());
      }, [row.original.changeDate]);

      return <div>{formattedDate || "Loading..."}</div>;
    },
  },
];

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
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
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

async function getData(): Promise<Order[]> {
  return [
    {
      noteTitle: "Physics Notes",
      action: "downloaded",
      changeDate: new Date().toISOString(),
    },
    {
      noteTitle: "Chemistry Notes",
      action: "liked",
      changeDate: new Date().toISOString(),
    },
    {
      noteTitle: "Math Notes",
      action: "uploaded",
      changeDate: new Date().toISOString(),
    },
    {
      noteTitle: "Biology Notes",
      action: "commented",
      changeDate: new Date().toISOString(),
    },
  ];
}

export default async function RecentActivitiesTable() {
  const data = await getData();

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Recent Orders & Photocopies</h1>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
