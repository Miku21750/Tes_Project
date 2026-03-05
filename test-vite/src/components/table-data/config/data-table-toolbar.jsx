"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, RefreshCw } from "lucide-react"

function useDebounced(value, delay = 400) {
  const [debounced, setDebounced] = React.useState(value)
  React.useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return debounced
}


export function DataTableToolbar({
  table,
  searchPlaceholder = "Search…",
  children,
  loading,
  handleRefresh,
  noGlobalSearch = false,
} ) {
  const [raw, setRaw] = React.useState("");
  const debounced = useDebounced(raw, 450);
  React.useEffect(() => {
    table.setGlobalFilter(debounced);
    table.setPageIndex(0);
  }, [debounced, table]);

  const isFiltered =
    table.getState().globalFilter || table.getState().columnFilters?.length > 0;

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex w-full flex-col gap-2  ">
      {!noGlobalSearch &&
        <Input
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          placeholder={searchPlaceholder}
          className="sm:w-[320px]"
          variant={"outline"}
        />
      }
        <div className="flex flex-wrap items-center gap-2">
          {children}

          {isFiltered ? (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setRaw("");
                table.resetGlobalFilter();
                table.resetColumnFilters();
                table.resetSorting();
                table.setPageIndex(0);
              }}
            >
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
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

    <Button className={'w-fit'} onClick={() => handleRefresh()} disabled={loading}> 
     Refresh <RefreshCw className={ loading && 'animate-spin'} />
    </Button>
        </div>
      </div>
    </div>
  );
}

