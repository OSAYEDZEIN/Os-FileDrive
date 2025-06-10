"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
} from "@tanstack/react-table";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FileText } from "lucide-react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  showUserColumn?: boolean;
  isLoading?: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data = [],
  showUserColumn = true,
  isLoading = false,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);

  // Filter out the 'User' column if showUserColumn is false
  const filteredColumns = showUserColumn
    ? columns
    : columns.filter((col) => col.header !== "User");

  const table = useReactTable({
    data,
    columns: filteredColumns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 w-full bg-white/5 rounded-lg animate-pulse"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border overflow-hidden bg-background/80 backdrop-blur-sm shadow-2xl">
      <div className="overflow-x-auto">
        <Table className="min-w-full">
          <TableHeader className="bg-muted/50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-b border-white/5">
                {headerGroup.headers.map((header) => (
                  <TableHead 
                    key={header.id}
                    className={cn(
                      "h-12 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider group",
                      "hover:bg-accent/50 transition-colors duration-200"
                    )}
                    style={{
                      width: header.getSize() !== 150 ? header.getSize() : undefined,
                    }}
                  >
                    <div className="flex items-center gap-2">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      {header.column.getCanSort() && (
                        <button
                          className="opacity-0 group-hover:opacity-100 transition-opacity ml-1"
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {header.column.getIsSorted() === "asc" ? (
                            <span className="text-cyan-400">↑</span>
                          ) : header.column.getIsSorted() === "desc" ? (
                            <span className="text-cyan-400">↓</span>
                          ) : (
                            <span className="text-gray-500 hover:text-gray-300">↕</span>
                          )}
                        </button>
                      )}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="divide-y divide-white/5">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="bg-transparent hover:bg-white/5 transition-colors duration-200 group"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell 
                      key={cell.id}
                      className={cn(
                        "px-4 py-3 text-sm text-foreground/80 transition-colors duration-200",
                        cell.column.id === 'name' && 'font-medium text-foreground',
                        cell.column.id === 'actions' && 'w-24 text-right',
                        'first:rounded-l-lg last:rounded-r-lg',
                        'first:pl-6 last:pr-6',
                        'hover:bg-accent/30'
                      )}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell 
                  colSpan={columns.length} 
                  className="h-64 text-center p-8"
                >
                  <div className="flex flex-col items-center justify-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center">
                      <FileText className="w-10 h-10 text-muted-foreground/50" />
                    </div>
                    <div className="space-y-2 text-center">
                      <h3 className="text-lg font-medium text-white">No files found</h3>
                      <p className="text-sm text-gray-400 max-w-md">
                        Upload your first file or create a new folder to get started
                      </p>
                    </div>
                    <button className="mt-2 inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                      <span className="mr-2">+</span> Upload File
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}