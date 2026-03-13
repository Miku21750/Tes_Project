"use client";

/**
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │  DataTable — unified table component                                    │
 * │                                                                         │
 * │  CLIENT    — <DataTable data columns />                                 │
 * │  SERVER    — <DataTable ... serverPagination={...} />                   │
 * │  VIRTUAL   — <DataTable ... virtual={...} />                            │
 * └─────────────────────────────────────────────────────────────────────────┘
 *
 */

import * as React from "react";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  useReactTable,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { twMerge } from "tailwind-merge";

// ─────────────────────────────────────────────────────────────────────────────
// PaginationBar
// ─────────────────────────────────────────────────────────────────────────────

function PaginationBar({ table, serverPagination }) {
  const isServer = !!serverPagination;

  const pageIndex = isServer ? serverPagination.pageIndex : table.getState().pagination.pageIndex;
  const pageCount = isServer ? serverPagination.pageCount : table.getPageCount();
  const pageSize  = isServer ? serverPagination.pageSize  : table.getState().pagination.pageSize;
  const total     = isServer ? serverPagination.total     : table.getFilteredRowModel().rows.length;

  const canPrev = pageIndex > 0;
  const canNext = pageIndex < pageCount - 1;

  const goTo = (idx) => {
    if (isServer) serverPagination.onPageChange(idx);
    else          table.setPageIndex(idx);
  };

  const handlePageSize = (val) => {
    const n = Number(val);
    if (isServer) serverPagination.onPageSizeChange?.(n);
    else          table.setPageSize(n);
  };

  // Build numbered pill list: always show first, last, current±2, with gap markers
  const pills = React.useMemo(() => {
    if (pageCount <= 0) return [];
    const show = new Set([0, pageCount - 1]);
    for (let d = -2; d <= 2; d++) {
      const i = pageIndex + d;
      if (i >= 0 && i < pageCount) show.add(i);
    }
    const sorted = Array.from(show).sort((a, b) => a - b);
    const result = [];
    for (let k = 0; k < sorted.length; k++) {
      if (k > 0 && sorted[k] - sorted[k - 1] > 1) result.push("gap-" + k);
      result.push(sorted[k]);
    }
    return result;
  }, [pageIndex, pageCount]);

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 px-1 py-2 text-sm text-muted-foreground">

      <div className="flex items-center gap-1.5 text-xs">
        <span className="hidden sm:inline">Rows per page</span>
        <Select value={String(pageSize)} onValueChange={handlePageSize}>
          <SelectTrigger className="h-7 w-16 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent side="top">
            {[10, 20, 50, 100].map((n) => (
              <SelectItem key={n} value={String(n)} className="text-xs">{n}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <span className="shrink-0 text-xs">
        {total.toLocaleString()} row{total !== 1 ? "s" : ""}
        {pageCount > 1 && ` · page ${pageIndex + 1} of ${pageCount}`}
      </span>

      <div className="flex flex-wrap items-center gap-0.5">
        <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => goTo(0)} disabled={!canPrev} title="First">
          <ChevronsLeft className="h-3.5 w-3.5" />
        </Button>
        <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => goTo(pageIndex - 1)} disabled={!canPrev} title="Previous">
          <ChevronLeft className="h-3.5 w-3.5" />
        </Button>

        {pills.map((item) =>
          typeof item === "string" ? (
            <span key={item} className="px-1 text-xs select-none">…</span>
          ) : (
            <Button
              key={item}
              variant={item === pageIndex ? "default" : "outline"}
              size="icon"
              className="h-7 w-7 text-xs"
              onClick={() => goTo(item)}
            >
              {item + 1}
            </Button>
          )
        )}

        <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => goTo(pageIndex + 1)} disabled={!canNext} title="Next">
          <ChevronRight className="h-3.5 w-3.5" />
        </Button>
        <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => goTo(pageCount - 1)} disabled={!canNext} title="Last">
          <ChevronsRight className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DataTable
// ─────────────────────────────────────────────────────────────────────────────

export function DataTable({
  data = [],
  columns,

  title,
  toolbar,
  className,
  potraitName,     // forwarded to <Table potrait=…> — controls max-height, border, etc.
  cellName,
  loading,
  error,
  emptyMessage = "No data found",

  sorting,
  setSorting,
  columnFilters,
  setColumnFilters,

  enableSingleSelect   = false,
  enableMultiSelect    = false,
  selectedRowId,
  onSelectedRowChange,
  rowSelection,
  onRowSelectionChange,
  getRowId,

  // serverPagination: { pageIndex, pageCount, pageSize, total, onPageChange, onPageSizeChange }
  serverPagination,
  defaultPageSize    = 20,
  paginationDisabled = false,

  // virtual: { total, allLoaded, fetchMore, sentinelOffset? }
  // NOTE: sentinelRef is now built INSIDE DataTable (not passed from hook)
  // so the observer can be properly rooted on the scroll container.
  virtual,
  virtualRowEstimate = 36,
  virtualOverscan    = 8,

  facetedFilter = true,
} = {}) {

  const isServerPage = !!serverPagination;
  const isVirtual    = !!virtual;
  const isClient     = !isServerPage && !isVirtual;

  // ── Internal state ──────────────────────────────────────────────────────────
  const [internalSorting,   setInternalSorting]   = React.useState([]);
  const [internalFilters,   setInternalFilters]   = React.useState([]);
  // FIX A: pageIndex must be tracked, not hardcoded to 0
  const [internalPageIndex, setInternalPageIndex] = React.useState(0);
  const [internalPageSize,  setInternalPageSize]  = React.useState(defaultPageSize);

  const activeSorting    = sorting         ?? internalSorting;
  const activeSetSorting = setSorting      ?? setInternalSorting;
  const activeFilters    = columnFilters   ?? internalFilters;
  const activeSetFilters = setColumnFilters ?? setInternalFilters;

  // Reset to page 0 when client-side filters/sorting change
  const prevClientKey = React.useRef("");
  React.useEffect(() => {
    if (!isClient) return;
    const key = JSON.stringify({ f: activeFilters, s: activeSorting });
    if (key !== prevClientKey.current) {
      prevClientKey.current = key;
      setInternalPageIndex(0);
    }
  }, [activeFilters, activeSorting, isClient]);

  // ── Single-select map ───────────────────────────────────────────────────────
  const singleSel = React.useMemo(() => {
    if (!enableSingleSelect || selectedRowId == null) return {};
    return { [String(selectedRowId)]: true };
  }, [enableSingleSelect, selectedRowId]);

  const selectionEnabled = enableSingleSelect || enableMultiSelect;

  // ── Scroll container ref ────────────────────────────────────────────────────
  // FIX D: attached directly to <Table ref=…> (Table's outer div)
  // FIX C: also used as `root` for IntersectionObserver
  const scrollRef = React.useRef(null);

  // ── Virtualizer ─────────────────────────────────────────────────────────────
  const rowVirtualizer = useVirtualizer({
    count:            isVirtual ? data.length : 0,
    getScrollElement: () => scrollRef.current,
    estimateSize:     () => virtualRowEstimate,
    overscan:         virtualOverscan,
  });

  const virtualItems  = isVirtual ? rowVirtualizer.getVirtualItems() : [];
  const totalVirtSize = isVirtual ? rowVirtualizer.getTotalSize()    : 0;

  const sentinelOffset = virtual?.sentinelOffset ?? 30;
  const sentinelIndex  = isVirtual && data.length > sentinelOffset
    ? data.length - sentinelOffset : -1;

  // FIX C: Build sentinel observer rooted on our own scroll container
  const observerRef = React.useRef(null);
  const sentinelRowRef = React.useCallback(
    (el) => {
      observerRef.current?.disconnect();
      observerRef.current = null;
      if (!el || !isVirtual || !virtual?.fetchMore) return;
      const obs = new IntersectionObserver(
        (entries) => { if (entries[0]?.isIntersecting) virtual.fetchMore(); },
        {
          root:       scrollRef.current, // ← relative to THIS scroll container
          rootMargin: "0px 0px 300px 0px",
          threshold:  0,
        },
      );
      obs.observe(el);
      observerRef.current = obs;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isVirtual, virtual?.fetchMore],
  );

  // ── TanStack table ──────────────────────────────────────────────────────────
  const table = useReactTable({
    data,
    columns,
    getRowId: getRowId ?? undefined,

    meta: { onSelectRow: (original) => onSelectedRowChange?.(original) },

    state: {
      sorting:       activeSorting,
      columnFilters: activeFilters,
      ...(enableSingleSelect ? { rowSelection: singleSel }          : {}),
      ...(enableMultiSelect  ? { rowSelection: rowSelection ?? {} } : {}),
      // FIX A: use tracked internalPageIndex
      ...(isClient ? {
        pagination: { pageIndex: internalPageIndex, pageSize: internalPageSize },
      } : {}),
      ...(isServerPage ? {
        pagination: { pageIndex: serverPagination.pageIndex, pageSize: serverPagination.pageSize },
      } : {}),
    },

    manualPagination: isServerPage,
    manualFiltering:  isServerPage || isVirtual,
    manualSorting:    isServerPage || isVirtual,

    pageCount: isServerPage ? (serverPagination.pageCount ?? -1) : undefined,

    onSortingChange:       activeSetSorting,
    onColumnFiltersChange: activeSetFilters,

    // FIX A: handle both pageIndex AND pageSize in client mode
    onPaginationChange: isServerPage
      ? (updater) => {
          const prev = { pageIndex: serverPagination.pageIndex, pageSize: serverPagination.pageSize };
          const next = typeof updater === "function" ? updater(prev) : updater;
          if (next.pageIndex !== prev.pageIndex) serverPagination.onPageChange(next.pageIndex);
          if (next.pageSize  !== prev.pageSize)  serverPagination.onPageSizeChange?.(next.pageSize);
        }
      : isClient
        ? (updater) => {
            const prev = { pageIndex: internalPageIndex, pageSize: internalPageSize };
            const next = typeof updater === "function" ? updater(prev) : updater;
            if (next.pageIndex !== prev.pageIndex) setInternalPageIndex(next.pageIndex);
            if (next.pageSize  !== prev.pageSize) {
              setInternalPageSize(next.pageSize);
              setInternalPageIndex(0);
            }
          }
        : undefined,

    enableRowSelection:   selectionEnabled,
    onRowSelectionChange: enableMultiSelect ? onRowSelectionChange : undefined,

    getCoreRowModel:        getCoreRowModel(),
    getSortedRowModel:      isClient                          ? getSortedRowModel()      : undefined,
    getFilteredRowModel:    isClient                          ? getFilteredRowModel()    : undefined,
    getPaginationRowModel:  (isClient && !paginationDisabled) ? getPaginationRowModel()  : undefined,
    getFacetedRowModel:     (isClient && facetedFilter)       ? getFacetedRowModel()     : undefined,
    getFacetedUniqueValues: (isClient && facetedFilter)       ? getFacetedUniqueValues() : undefined,
  });

  // ── Row selection handler ───────────────────────────────────────────────────
  const handleSelectRow = React.useCallback((row) => {
    if (enableSingleSelect) { onSelectedRowChange?.(row.original); return; }
    if (enableMultiSelect)  row.toggleSelected();
  }, [enableSingleSelect, enableMultiSelect, onSelectedRowChange]);

  // ── Rows to render ──────────────────────────────────────────────────────────
  const allRows = table.getRowModel().rows;

  const displayRows = isVirtual
    ? null
    : (isClient && !paginationDisabled) || isServerPage
      ? table.getPaginationRowModel().rows
      : allRows;

  const paddingTop    = virtualItems.length > 0 ? virtualItems[0].start                      : 0;
  const paddingBottom = virtualItems.length > 0 ? totalVirtSize - virtualItems.at(-1).end    : 0;

  const showPagination = !isVirtual && !paginationDisabled;

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {title  && <div>{title}</div>}
      {toolbar && toolbar(table)}
      {error  && <p className="text-sm text-destructive">{error}</p>}

      {isVirtual && virtual.total > 0 && (
        <p className="text-xs text-muted-foreground">
          {data.length.toLocaleString()} / {virtual.total.toLocaleString()} rows loaded
          {virtual.allLoaded && " · all loaded ✓"}
        </p>
      )}

      {/*
        FIX D: <Table> is a combined outer-div + inner-<table> custom component.
        We attach scrollRef via ref= on Table (which forwards to its outer div).
        No extra wrapper div needed or wanted.
      */}
      <Table
        ref={isVirtual ? scrollRef : undefined}
        className="text-[11px] leading-tight"
        potrait={cn("mt-3 rounded-xl border-2 max-h-105 2xl:max-h-195", potraitName)}
      >
        <TableHeader className="sticky top-0 z-10 bg-muted/70 backdrop-blur-sm">
          {table.getHeaderGroups().map((hg) => (
            <TableRow key={hg.id}>
              {hg.headers.map((h) => (
                <TableHead key={h.id} className="whitespace-nowrap">
                  {h.isPlaceholder ? null : h.column.columnDef.header?.(h.getContext()) ?? null}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {loading && !data.length ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="py-16 text-center text-muted-foreground">
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span>Loading…</span>
                </div>
              </TableCell>
            </TableRow>

          ) : isVirtual ? (
            <>
              {paddingTop > 0 && (
                <TableRow><TableCell style={{ height: paddingTop }} colSpan={columns.length} /></TableRow>
              )}

              {virtualItems.map((vRow) => {
                const row        = allRows[vRow.index];
                const isSelected = selectionEnabled && row ? row.getIsSelected() : false;
                const isSentinel = vRow.index === sentinelIndex;

                return (
                  <TableRow
                    key={row?.id ?? `v-${vRow.index}`}
                    ref={isSentinel ? sentinelRowRef : undefined}
                    tabIndex={selectionEnabled ? 0 : undefined}
                    aria-selected={isSelected || undefined}
                    onClick={selectionEnabled && row ? () => handleSelectRow(row) : undefined}
                    onKeyDown={selectionEnabled && row ? (e) => {
                      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleSelectRow(row); }
                    } : undefined}
                    className={cn(
                      selectionEnabled && row && "cursor-pointer",
                      isSelected && "bg-blue-50 dark:bg-blue-950",
                    )}
                  >
                    {row
                      ? row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id} className={twMerge("whitespace-nowrap py-0", cellName)}>
                            {cell.column.columnDef.cell?.(cell.getContext()) ?? null}
                          </TableCell>
                        ))
                      : columns.map((_, ci) => (
                          <TableCell key={ci} className={twMerge("whitespace-nowrap py-0", cellName)}>
                            <div className="h-3 w-3/4 animate-pulse rounded bg-muted" />
                          </TableCell>
                        ))}
                  </TableRow>
                );
              })}

              {paddingBottom > 0 && (
                <TableRow><TableCell style={{ height: paddingBottom }} colSpan={columns.length} /></TableRow>
              )}

              {loading && data.length > 0 && (
                <TableRow>
                  <TableCell colSpan={columns.length} className="py-3 text-center text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-2">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      Loading more…
                    </span>
                  </TableCell>
                </TableRow>
              )}
            </>

          ) : displayRows?.length ? (
            displayRows.map((row, idx) => {
              const isSelected = selectionEnabled ? row.getIsSelected() : false;
              return (
                <TableRow
                  key={row.id}
                  tabIndex={selectionEnabled ? 0 : undefined}
                  aria-selected={isSelected || undefined}
                  onClick={selectionEnabled ? () => handleSelectRow(row) : undefined}
                  onKeyDown={selectionEnabled ? (e) => {
                    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleSelectRow(row); }
                  } : undefined}
                  className={cn(
                    idx % 2 === 0 ? "bg-background" : "bg-muted/30",
                    selectionEnabled && "cursor-pointer",
                    isSelected      && "bg-blue-50 dark:bg-blue-950",
                  )}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className={twMerge("whitespace-nowrap py-0", cellName)}>
                      {cell.column.columnDef.cell?.(cell.getContext()) ?? null}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="py-16 text-center text-muted-foreground">
                {emptyMessage}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {showPagination && (
        <PaginationBar
          table={table}
          serverPagination={isServerPage ? serverPagination : undefined}
        />
      )}
    </div>
  );
}
