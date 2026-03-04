"use client"

import * as React from "react"
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  getFacetedRowModel,
  getFacetedUniqueValues,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { twMerge } from "tailwind-merge"
import { cn } from "@/lib/utils"
import { useVirtualizer } from "@tanstack/react-virtual"

import { DataTablePagination } from "./data-table-pagination"

function useDebouncedValue(value, delay = 150) {
  const [v, setV] = React.useState(value)
  React.useEffect(() => {
    const t = setTimeout(() => setV(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return v
}

function includesText(value, query) {
  if (!query) return true
  return String(value ?? "").toLowerCase().includes(String(query).toLowerCase())
}

function defaultColumnFilter(row, columnId, filterValue) {
  return includesText(row[columnId], filterValue)
}

export function DataTable({
  data,
  columns,
  loading,
  error,
  title,
  toolbar,
  className,
  cellName,
  sorting,
  setSorting,
  contact,
  potraitName,

  paginationDisabled = false,
  facetedFilterDisabled = false,
  enableVirtualization = false,

  enableColumnFilters = true,

  virtualRowEstimate = 35,
  virtualOverscan = 12,
  virtualWindow = 240, 

  enableSingleSelect = false,
  selectedRowId,
  onSelectedRowChange,
  getRowId,

  enableMultiSelect = false,
  rowSelection,
  onRowSelectionChange,
}) {
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [globalFilter, setGlobalFilter] = React.useState("");

  const debouncedColumnFilters = useDebouncedValue(columnFilters, 150)

  const selectionEnabled = enableSingleSelect || enableMultiSelect;

  const singleRowSelection = React.useMemo(() => {
    if (!enableSingleSelect) return {};
    if (selectedRowId == null) return {};
    return { [String(selectedRowId)]: true };
  }, [enableSingleSelect, selectedRowId]);

  const filteredData = React.useMemo(() => {
    if (!enableVirtualization || !enableColumnFilters) return data;
    if (!debouncedColumnFilters?.length) return data;

    return data.filter((row) => {
      for (const f of debouncedColumnFilters) {
        if (!defaultColumnFilter(row, f.id, f.value)) return false;
      }
      return true;
    });
  }, [data, enableVirtualization, enableColumnFilters, debouncedColumnFilters]);

  const tokenGlobalFilter = React.useCallback((row, _columnId, filterValue) => {
    const q = String(filterValue ?? "")
      .toLowerCase()
      .trim();
    if (!q) return true;
    const tokens = q.split(/\s+/).filter(Boolean);

    const haystack =
      `${row.original.FirstName ?? ""} ${row.original.LastName ?? ""} ${row.original.Email ?? ""} ${row.original.Company ?? ""}`.toLowerCase();

    return tokens.every((t) => haystack.includes(t));
  }, []);

  const globalFilterFn = contact ? tokenGlobalFilter : "includesString";

  const parentRef = React.useRef(null);

  const rowVirtualizer = useVirtualizer({
    count: enableVirtualization ? filteredData.length : 0,
    getScrollElement: () => parentRef.current,
    estimateSize: () => virtualRowEstimate,
    overscan: virtualOverscan,
  });

  const virtualItems = enableVirtualization
    ? rowVirtualizer.getVirtualItems()
    : [];
  const totalSize = enableVirtualization ? rowVirtualizer.getTotalSize() : 0;

  const range = React.useMemo(() => {
    if (!enableVirtualization) return { start: 0, end: filteredData.length };
    if (virtualItems.length === 0)
      return { start: 0, end: Math.min(filteredData.length, virtualWindow) };

    const first = virtualItems[0].index;
    const last = virtualItems[virtualItems.length - 1].index;

    let start = Math.max(0, first - virtualOverscan);
    let end = Math.min(filteredData.length, last + virtualOverscan + 1);

    if (end - start > virtualWindow)
      end = Math.min(filteredData.length, start + virtualWindow);

    return { start, end };
  }, [
    enableVirtualization,
    virtualItems,
    filteredData.length,
    virtualOverscan,
    virtualWindow,
  ]);

  const windowedData = React.useMemo(() => {
    return enableVirtualization
      ? filteredData.slice(range.start, range.end)
      : data;
  }, [enableVirtualization, filteredData, range.start, range.end, data]);


  const table = useReactTable({
    data: windowedData,
    columns,
    getRowId: getRowId ? getRowId : undefined,

    meta: {
      onSelectRow: (original) => onSelectedRowChange?.(original),
    },

    state: {
      sorting,
      globalFilter,
      ...(enableColumnFilters ? { columnFilters } : {}),
      ...(enableSingleSelect ? { rowSelection: singleRowSelection } : {}),
      ...(enableMultiSelect ? { rowSelection: rowSelection ?? {} } : {}),
    },

    onSortingChange: setSorting,
    onColumnFiltersChange: enableColumnFilters ? setColumnFilters : undefined,
    onGlobalFilterChange: setGlobalFilter,

    enableRowSelection: selectionEnabled,
    onRowSelectionChange: enableMultiSelect ? onRowSelectionChange : undefined,

    globalFilterFn,

    getCoreRowModel: getCoreRowModel(),

    getSortedRowModel: enableVirtualization ? undefined : getSortedRowModel(),
    getFilteredRowModel:
      enableVirtualization || !enableColumnFilters
        ? undefined
        : getFilteredRowModel(),

    getPaginationRowModel:
      enableVirtualization || paginationDisabled
        ? undefined
        : getPaginationRowModel(),

    getFacetedRowModel: facetedFilterDisabled
      ? undefined
      : getFacetedRowModel(),
    getFacetedUniqueValues: facetedFilterDisabled
      ? undefined
      : getFacetedUniqueValues(),

    manualFiltering: enableVirtualization && enableColumnFilters,
  });

  const handleSelectRow = React.useCallback(
    (row) => {
      if (enableSingleSelect) {
        onSelectedRowChange?.(row.original);
        return;
      }
      if (enableMultiSelect) row.toggleSelected();
    },
    [enableSingleSelect, enableMultiSelect, onSelectedRowChange],
  );

  const pagedRows = !enableVirtualization
    ? paginationDisabled
      ? table.getRowModel().rows
      : table.getPaginationRowModel().rows
    : [];

  const windowRows = enableVirtualization ? table.getRowModel().rows : [];

  const paddingTop =
    enableVirtualization && virtualItems.length ? virtualItems[0].start : 0;
  const paddingBottom =
    enableVirtualization && virtualItems.length
      ? totalSize - virtualItems[virtualItems.length - 1].end
      : 0;

  return (
    <div className={className}>
      {title ? <div className="mb-3">{title}</div> : null}
      {toolbar ? toolbar(table) : null}
      {error ? <p className="mt-3 text-sm text-red-500">{error}</p> : null}

      <Table
        className="text-[11px] leading-tight"
        potrait={cn(
          "mt-3 rounded-xl border-2 max-h-105 2xl:max-h-195",
          potraitName,
        )}
        ref={enableVirtualization ? parentRef : undefined}
      >
        <TableHeader className="sticky top-0 z-10 bg-muted/70">
          {table.getHeaderGroups().map((hg) => (
            <TableRow key={hg.id}>
              {hg.headers.map((header) => (
                <TableHead key={header.id} className="whitespace-nowrap">
                  {header.isPlaceholder
                    ? null
                    : header.column.columnDef.header
                      ? header.column.columnDef.header(header.getContext())
                      : null}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="p-8 text-xl">
                Loading…
              </TableCell>
            </TableRow>
          ) : enableVirtualization ? (
            <>
              {/* top spacer */}
              {paddingTop > 0 && (
                <TableRow>
                  <TableCell
                    style={{ height: paddingTop }}
                    colSpan={columns.length}
                  />
                </TableRow>
              )}

              {virtualItems.map((vRow) => {
                const dataIndex = vRow.index;
                const sliceIndex = dataIndex - range.start;
                const row = windowRows[sliceIndex];
                if (!row) return null;

                const isSelected = selectionEnabled
                  ? row.getIsSelected()
                  : false;

                return (
                  <TableRow
                    key={row.id}
                    tabIndex={selectionEnabled ? 0 : undefined}
                    aria-selected={selectionEnabled ? isSelected : undefined}
                    onClick={
                      selectionEnabled ? () => handleSelectRow(row) : undefined
                    }
                    onKeyDown={
                      selectionEnabled
                        ? (e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              handleSelectRow(row);
                            }
                          }
                        : undefined
                    }
                    className={cn(
                      selectionEnabled && "cursor-pointer",
                      isSelected && "bg-blue-100",
                    )}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className={twMerge("whitespace-nowrap py-0", cellName)}
                      >
                        {cell.column.columnDef.cell
                          ? cell.column.columnDef.cell(cell.getContext())
                          : null}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })}

              {/* bottom spacer */}
              {paddingBottom > 0 && (
                <TableRow>
                  <TableCell
                    style={{ height: paddingBottom }}
                    colSpan={columns.length}
                  />
                </TableRow>
              )}
            </>
          ) : pagedRows.length ? (
            pagedRows.map((row, idx) => {
              const isSelected = selectionEnabled ? row.getIsSelected() : false;
              return (
                <TableRow
                  key={row.id}
                  tabIndex={selectionEnabled ? 0 : undefined}
                  aria-selected={selectionEnabled ? isSelected : undefined}
                  onClick={
                    selectionEnabled ? () => handleSelectRow(row) : undefined
                  }
                  onKeyDown={
                    selectionEnabled
                      ? (e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            handleSelectRow(row);
                          }
                        }
                      : undefined
                  }
                  className={cn(
                    idx % 2 === 0 ? "bg-background" : "bg-muted/30",
                    selectionEnabled && "cursor-pointer",
                    isSelected && "bg-blue-100",
                  )}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={twMerge("whitespace-nowrap py-0", cellName)}
                    >
                      {cell.column.columnDef.cell
                        ? cell.column.columnDef.cell(cell.getContext())
                        : null}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="p-8 text-center">
                No data found 🚫
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {!enableVirtualization && !paginationDisabled && (
        <div className="mt-4">
          <DataTablePagination table={table} />
        </div>
      )}
    </div>
  );
}
