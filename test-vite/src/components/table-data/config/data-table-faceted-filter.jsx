"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { twMerge } from "tailwind-merge";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
function uniqSorted(values) {
  return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b))
}


export function DataTableFacetedFilter({
  column,
  title,
  getLabel,
  disabled,
  className,
}) {
  const current = (column.getFilterValue() ) ?? ""

  // TanStack can compute unique values for you:
  const faceted = column.getFacetedUniqueValues()
  const options = React.useMemo(() => {
    const raw = Array.from(faceted.keys()).map((v) => {
      const label = getLabel ? getLabel(v) : String(v ?? "")
      return label
    })
    return uniqSorted(raw.filter(Boolean))
  }, [faceted, getLabel])

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={twMerge(`justify-between overflow-hidden ${className}`)}
          disabled={disabled}
        >
         {current ? `${title}: ${current}` : title}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[19em] p-0">
        <Command>
          <CommandInput placeholder={title} className="h-9" />
          <CommandList>
            <CommandEmpty>No state found.</CommandEmpty>
            <CommandGroup>
              {options?.map((data) => (
                <CommandItem
                  key={data}
                  value={data}
                  onSelect={() => { column.setFilterValue(data) }}
                >
                  {data}
                  <Check
                    className={cn(
                      "ml-auto",
                      current === data ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

