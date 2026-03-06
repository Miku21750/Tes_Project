import * as React from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { DataTable } from "./config/data-table"
import { DataTableColumnHeader } from "./config/data-table-column-header"
import { DataTableToolbar } from "./config/data-table-toolbar"
import { Button }    from "@/components/ui/button";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";





function ColFilter({ id, label, filterStateRef, column, className }) {
  const value = filterStateRef.current.columnFilters.find((f) => f.id === id)?.value ?? "";

  const sorted = column.getIsSorted() // false | "asc" | "desc"
  const onChange = (e) => {
    const v = e.target.value;
    filterStateRef.current.setColumnFilters((prev) => {
      const without = prev.filter((f) => f.id !== id);
      return v ? [...without, { id, value: v }] : without;
    });
  };

  return (
    <div className="font-semibold text-foreground whitespace-pre-wrap">
      <Button
        type="button"
        variant="ghost"
        className={className}
        onClick={() => column.toggleSorting(sorted === "asc")}
      >
        {label}
        {sorted === "asc" ? (
          <ArrowUp className="ml-2 h-4 w-4" />
        ) : sorted === "desc" ? (
          <ArrowDown className="ml-2 h-4 w-4" />
        ) : (
          <ArrowUpDown className="ml-2 h-4 w-4 opacity-60" />
        )}
      </Button>
      {/* {label} */}
      <Input
        className="mt-1 bg-background font-normal h-7 text-xs"
        value={value}
        onChange={onChange}
        onClick={(e) => e.stopPropagation()}
        placeholder="Filter…"
      />
    </div>
  );
}

// ── Column factory ────────────────────────────────────────────────────────────

function buildColumns(filterStateRef) {
  return [
    {
      id: "select",
      header: () => <span className="font-semibold text-foreground">Select</span>,
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(v) => row.toggleSelected(!!v)}
          onClick={(e) => e.stopPropagation()}
        />
      ),
      enableSorting: false,
      size: 56,
    },
    {
      accessorKey: "PartNumber",
      header: ({ column }) => <ColFilter id="PartNumber" label="Part #" filterStateRef={filterStateRef} column={column}/>,
    },
    {
      accessorKey: "Keyword",
      header: ({ column }) => <ColFilter id="Keyword" label="Keyword" filterStateRef={filterStateRef} column={column}/>,
    },
    {
      accessorKey: "PartDescription",
      header: ({ column }) => <ColFilter id="PartDescription" label="Description" filterStateRef={filterStateRef} column={column}/>,
    },
  ];
}

// ── Shared row-selection logic ────────────────────────────────────────────────

function usePartRowSelection(data, selectedParts, setSelectedParts) {
  const dataById = React.useMemo(() => {
    const m = new Map();
    for (const part of data) m.set(String(part.PartNumber), part);
    return m;
  }, [data]);

  const rowSelection = React.useMemo(() => {
    const map = {};
    for (const item of selectedParts) map[String(item.PartNumber)] = true;
    return map;
  }, [selectedParts]);

  const onRowSelectionChange = React.useCallback(
    (updater) => {
      setSelectedParts((prev) => {
        const prevMap = Object.fromEntries(prev.map((p) => [String(p.PartNumber), true]));
        const nextMap = typeof updater === "function" ? updater(prevMap) : updater;
        const nextIds = new Set(Object.keys(nextMap).filter((k) => nextMap[k]));
        let next = prev.filter((p) => nextIds.has(String(p.PartNumber)));
        for (const id of nextIds) {
          if (prev.some((p) => String(p.PartNumber) === id)) continue;
          const part = dataById.get(id);
          if (part) next = [...next, { ...part, qty: 1, Total: part.Price }];
        }
        return next;
      });
    },
    [dataById, setSelectedParts],
  );

  return { rowSelection, onRowSelectionChange };
}



// ── Paginated variant ─────────────────────────────────────────────────────────

export function PartCatalogPaginated({ selectedPartCatalog, setSelectedPartCatalog, hook }) {

  const { rowSelection, onRowSelectionChange } = usePartRowSelection(
    hook.data, selectedPartCatalog, setSelectedPartCatalog,
  );

  const filterStateRef = React.useRef({ columnFilters: hook.columnFilters, setColumnFilters: hook.setColumnFilters });
  filterStateRef.current = { columnFilters: hook.columnFilters, setColumnFilters: hook.setColumnFilters };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const columns = React.useMemo(() => buildColumns(filterStateRef), []);

  return (
    <DataTable
      data={hook.data}
      columns={columns}
      loading={hook.loading}
      error={hook.error}
      sorting={hook.sorting}
      setSorting={hook.setSorting}
      columnFilters={hook.columnFilters}
      setColumnFilters={hook.setColumnFilters}
      potraitName="max-h-80"
      cellName="p-2"
      facetedFilter={false}
      enableMultiSelect
      getRowId={(row) => String(row.PartNumber)}
      rowSelection={rowSelection}
      onRowSelectionChange={onRowSelectionChange}
      serverPagination={{
        pageIndex:        hook.pageIndex,
        pageCount:        hook.pageCount,
        pageSize:         hook.pageSize,
        total:            hook.total,
        onPageChange:     hook.setPageIndex,
        onPageSizeChange: hook.setPageSize, // FIX B: was () => {} no-op before
      }}
      toolbar={(table) => (
        <DataTableToolbar table={table} searchPlaceholder="🔍 Search erf cases..." loading={hook.loading} noGlobalSearch handleRefresh={hook.refresh}/>
      )}
    />
  );
}
