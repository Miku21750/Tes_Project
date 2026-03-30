"use client";

/**
 * DataTableToolbar
 *
 * Works in two modes:
 *
 * CLIENT MODE (default):
 *   Calls table.setGlobalFilter(value) — TanStack filters in-memory.
 *   Nothing special needed.
 *
 * SERVER MODE:
 *   When `onGlobalSearchChange` prop is provided the toolbar does NOT call
 *   table.setGlobalFilter. Instead it calls onGlobalSearchChange(value)
 *   which is wired to useServerPageTable / useServerVirtual so the debounced
 *   value is sent to the server as a query-param.
 *
 *   The toolbar receives these props automatically when you spread serverProps
 *   from DataTable's toolbar render-prop:
 *
 *     toolbar={(table, serverProps) => (
 *       <DataTableToolbar table={table} {...serverProps} ... />
 *     )}
 *
 *   serverProps shape: { isServerMode, globalSearch, onGlobalSearchChange }
 *
 * RESET BUTTON:
 *   In server mode, clicking Reset also calls onGlobalSearchChange("") so the
 *   server refetches without the search term.
 */

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, RefreshCw } from "lucide-react";

function useDebounced(value, delay = 400) {
  const [debounced, setDebounced] = React.useState(value);
  React.useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export function DataTableToolbar({
  table,
  searchPlaceholder = "Search…",
  children,
  loading,
  handleRefresh,
  noGlobalSearch = false,

  // ── Server-mode props (spread from DataTable's serverProps) ───────────────
  isServerMode = false,
  globalSearch: controlledSearch,       // controlled value from hook
  onGlobalSearchChange,                 // (value: string) => void | undefined
}) {
  // Local raw input state — always uncontrolled for instant feedback
  const [raw, setRaw] = React.useState(controlledSearch ?? "");

  // Keep local state in sync if parent resets it externally (e.g. filter reset)
  React.useEffect(() => {
    if (controlledSearch !== undefined && controlledSearch !== raw) {
      setRaw(controlledSearch);
    }
    // Only sync when parent changes, not on every raw keystroke
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [controlledSearch]);

  const debounced = useDebounced(raw, 450);

  React.useEffect(() => {
    if (isServerMode && onGlobalSearchChange) {
      // Server mode: send to hook, do NOT touch table.setGlobalFilter
      onGlobalSearchChange(debounced);
    } else {
      // Client mode: let TanStack filter in memory
      table.setGlobalFilter(debounced);
      table.setPageIndex(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced, isServerMode]);

  const isFiltered =
    raw ||
    table.getState().globalFilter ||
    table.getState().columnFilters?.length > 0;

  const handleReset = () => {
    setRaw("");
    if (isServerMode && onGlobalSearchChange) {
      onGlobalSearchChange("");
    } else {
      table.resetGlobalFilter();
      table.setPageIndex(0);
    }
    table.resetColumnFilters();
    table.resetSorting();
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex w-full flex-col gap-2">
        {!noGlobalSearch && (
          <Input
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            placeholder={searchPlaceholder}
            className="sm:w-[320px]"
            variant="outline"
          />
        )}
        <div className="flex flex-wrap items-center gap-2">
          {children}

          {isFiltered ? (
            <Button variant="secondary" size="sm" onClick={handleReset}>
              Reset
            </Button>
          ) : null}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuGroup>
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            className="w-fit"
            onClick={() => handleRefresh?.()}
            disabled={loading}
          >
            Refresh <RefreshCw className={loading ? "animate-spin" : ""} />
          </Button>
        </div>
      </div>
    </div>
  );
}
