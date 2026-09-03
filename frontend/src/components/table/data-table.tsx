"use client";

import * as React from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Search,
  Download,
  SlidersHorizontal,
  FileSpreadsheet,
  FileCode,
} from "lucide-react";

export interface ColumnDef<T> {
  key: keyof T | string;
  header: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
  searchable?: boolean;
  width?: string;
}

export interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  isLoading?: boolean;
  pageSizeDefault?: number;
  onExport?: (format: "csv" | "json") => void;
  emptyTitle?: string;
  emptyDescription?: string;
  className?: string;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  isLoading = false,
  pageSizeDefault = 10,
  onExport,
  emptyTitle = "No records found",
  emptyDescription = "Try adjusting your search filters to find what you are looking for.",
  className,
}: DataTableProps<T>) {
  // Search state
  const [searchTerm, setSearchTerm] = React.useState("");

  // Sorting state
  const [sortKey, setSortKey] = React.useState<string | null>(null);
  const [sortDirection, setSortDirection] = React.useState<"asc" | "desc">("asc");

  // Pagination state
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(pageSizeDefault);

  // Column Visibility state
  const [visibleColumns, setVisibleColumns] = React.useState<string[]>(
    columns.map((c) => String(c.key))
  );

  const toggleColumnVisibility = (key: string) => {
    setVisibleColumns((prev) =>
      prev.includes(key)
        ? prev.filter((k) => k !== key)
        : [...prev, key]
    );
  };

  // Handle Sort Toggle
  const handleSort = (key: string) => {
    if (sortKey === key) {
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else {
        setSortKey(null);
        setSortDirection("asc");
      }
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  // Filtered and Sorted Data
  const filteredData = React.useMemo(() => {
    let result = [...data];

    // Search filter
    if (searchTerm.trim()) {
      const lower = searchTerm.toLowerCase();
      result = result.filter((item) =>
        columns.some((col) => {
          const val = item[col.key as keyof T];
          return val !== undefined && val !== null && String(val).toLowerCase().includes(lower);
        })
      );
    }

    // Sort
    if (sortKey) {
      result.sort((a, b) => {
        const valA = a[sortKey];
        const valB = b[sortKey];

        if (valA === valB) return 0;
        if (valA === null || valA === undefined) return 1;
        if (valB === null || valB === undefined) return -1;

        if (typeof valA === "number" && typeof valB === "number") {
          return sortDirection === "asc" ? valA - valB : valB - valA;
        }

        const comp = String(valA).localeCompare(String(valB));
        return sortDirection === "asc" ? comp : -comp;
      });
    }

    return result;
  }, [data, columns, searchTerm, sortKey, sortDirection]);

  // Paginated Slices
  const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize));
  const paginatedData = React.useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage, pageSize]);

  // Adjust page if data shrinks
  React.useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  const activeColumns = columns.filter((c) => visibleColumns.includes(String(c.key)));

  return (
    <div className="space-y-3">
      {/* Table Toolbar: Search, Column Visibility, Export */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="w-full sm:w-72">
          <Input
            placeholder="Search records..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onClear={() => setSearchTerm("")}
            leftIcon={<Search className="h-4 w-4" />}
            className="h-9 text-xs"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
          {/* Column Visibility */}
          <DropdownMenu
            trigger={
              <Button variant="outline" size="sm" leftIcon={<SlidersHorizontal className="h-3.5 w-3.5" />}>
                Columns
              </Button>
            }
            items={columns.map((c) => ({
              label: (
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={visibleColumns.includes(String(c.key))}
                    onChange={() => toggleColumnVisibility(String(c.key))}
                    className="rounded text-gov-primary focus:ring-ring"
                  />
                  <span>{c.header}</span>
                </div>
              ),
              onClick: () => toggleColumnVisibility(String(c.key)),
            }))}
          />

          {/* Export Button Placeholder with format selection */}
          <DropdownMenu
            trigger={
              <Button variant="outline" size="sm" leftIcon={<Download className="h-3.5 w-3.5" />}>
                Export
              </Button>
            }
            items={[
              {
                label: "Export as CSV",
                icon: <FileSpreadsheet className="h-4 w-4 text-gov-success" />,
                onClick: () => onExport?.("csv"),
              },
              {
                label: "Export as GeoJSON / JSON",
                icon: <FileCode className="h-4 w-4 text-gov-accent" />,
                onClick: () => onExport?.("json"),
              },
            ]}
          />
        </div>
      </div>

      {/* Table Body */}
      <Table className={className}>
        <TableHeader>
          <TableRow>
            {activeColumns.map((col) => {
              const isSorted = sortKey === String(col.key);

              return (
                <TableHead
                  key={String(col.key)}
                  style={{ width: col.width }}
                  className={col.sortable ? "cursor-pointer select-none hover:text-foreground" : ""}
                  onClick={() => col.sortable && handleSort(String(col.key))}
                >
                  <div className="flex items-center space-x-1.5">
                    <span>{col.header}</span>
                    {col.sortable && (
                      <span className="text-muted-foreground">
                        {isSorted ? (
                          sortDirection === "asc" ? (
                            <ArrowUp className="h-3.5 w-3.5 text-gov-primary" />
                          ) : (
                            <ArrowDown className="h-3.5 w-3.5 text-gov-primary" />
                          )
                        ) : (
                          <ArrowUpDown className="h-3 w-3 opacity-50" />
                        )}
                      </span>
                    )}
                  </div>
                </TableHead>
              );
            })}
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading ? (
            Array.from({ length: pageSize }).map((_, rIdx) => (
              <TableRow key={rIdx}>
                {activeColumns.map((_, cIdx) => (
                  <TableCell key={cIdx}>
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : paginatedData.length > 0 ? (
            paginatedData.map((item, rowIdx) => (
              <TableRow key={rowIdx}>
                {activeColumns.map((col) => (
                  <TableCell key={String(col.key)}>
                    {col.render
                      ? col.render(item)
                      : String(item[col.key as keyof T] ?? "-")}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={activeColumns.length} className="p-0">
                <EmptyState
                  title={emptyTitle}
                  description={emptyDescription}
                  className="border-0 rounded-none bg-transparent py-10"
                />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Pagination Footer */}
      {!isLoading && filteredData.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          pageSize={pageSize}
          onPageSizeChange={setPageSize}
          totalItems={filteredData.length}
        />
      )}
    </div>
  );
}
