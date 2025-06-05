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

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  showUserColumn?: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  showUserColumn = true,
}: DataTableProps<TData, TValue>) {
  // Filter out the 'User' column if showUserColumn is false
  const filteredColumns = showUserColumn
    ? columns
    : columns.filter((col) => col.header !== "User");

  const table = useReactTable({
    data,
    columns: filteredColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="rounded-xl border border-white/10 overflow-hidden bg-white/2.5 backdrop-blur-sm shadow-lg">
      <Table>
        <TableHeader className="bg-gradient-to-r from-cyan-500/5 to-teal-500/5">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="border-b border-white/10">
              {headerGroup.headers.map((header) => (
                <TableHead 
                  key={header.id}
                  className="h-12 px-6 text-xs font-semibold text-gray-300 uppercase tracking-wider group"
                >
                  <div className="flex items-center gap-2">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    {header.column.getCanSort() && (
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                        ↕
                      </span>
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
                className="bg-transparent hover:bg-white/3 transition-all duration-200 border-b border-white/5 last:border-0 group"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell 
                    key={cell.id}
                    className={`px-6 py-4 text-sm text-gray-200 whitespace-nowrap transition-colors duration-200 
                      ${cell.column.id === 'name' ? 'font-medium text-white' : ''}
                      ${cell.column.id === 'actions' ? 'w-20' : ''}
                    `}
                  >
                    <div className="flex items-center">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </div>
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell 
                colSpan={columns.length} 
                className="h-48 text-center p-8"
              >
                <div className="flex flex-col items-center justify-center gap-3">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-200">No files found</h3>
                  <p className="text-sm text-gray-400 max-w-md text-center">
                    Upload your first file or create a new folder to get started
                  </p>
                  <div className="mt-2">
                    <button className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg bg-gradient-to-r from-cyan-500/20 to-teal-500/20 border border-white/10 text-white hover:from-cyan-500/30 hover:to-teal-500/30 transition-all">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Upload File
                    </button>
                  </div>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}