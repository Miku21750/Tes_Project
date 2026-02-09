"use client"

import * as React from "react"
import Swal from "sweetalert2"
import { toast } from "sonner"
import ApiCustomer from "@/api"
import { DataTableToolbar } from "./config/data-table-toolbar"
import { DataTableColumnHeader } from "./config/data-table-column-header"
import { DataTablePagination } from "./config/data-table-pagination"
import { DataTableFacetedFilter } from "./config/data-table-faceted-filter"
import { DataTable } from "./config/data-table"
import { Button } from "../ui/button"
import { SymptomCodeAdd, SymptomCodeDelete, SymptomCodeEdit } from "../model/sc-modal"
import { formatDate } from "@/lib/utils"

function symptomCodeColums(opts) {
    return [
        {
            id: "no",
            header: () => <div className="text-center">No</div>,
            cell: ({ row, table }) => {
                const pageIndex = table.getState().pagination.pageIndex
                const pageSize  = table.getState().pagination.pageSize
                return (
                    <div className="text-center">
                        {pageIndex * pageSize + row.index + 1}
                    </div>
                )
            },
        }, 
        {
            accessorKey: "TopCategory",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title={"Top Category"}/>
            ),
        },
        {
            accessorKey: "SubCategory",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title={"Sub Category"}/>
            ),
        },
        {
            accessorKey: "QualityCodes",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title={"Quality Codes"}/>
            ),
        },
        {
            accessorKey: "CreatedOn",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title={"CreatedOn"}/>
            ),
            cell: ({ getValue }) => formatDate(getValue())
        },
        {
            id: "actions",
            header: () => <div className="text-center">Actions</div>,
            cell: ({ row }) => {
                const id = row.original.SymptomCodeID
            return (
                <div className="flex justify-center gap-2">
                    {opts.onEdit(id)}
                    {opts.onDelete(id)}
                </div>
            )
            },
        },
    ]
}

export function SymptomCodeTable() {
    const [data, setData] = React.useState([])
    const [loading, setLoading] = React.useState(false)
    const [error, setError] = React.useState(null)
    const [sorting, setSorting] = React.useState([])
    const [refresh, setRefresh] = React.useState(false) 

    function handleRefresh(){
      setRefresh(prev => !prev)
    }
    const fetchSymptomCode = React.useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
        const res = await ApiCustomer.get(`/api/symptom-codes`)
        setData(res.data.data)
        } catch (error) {
            toast.error("Failed to fetch Symptom Code data")
            setError("Failed to fetch data")
        } finally {
            setLoading(false)
        }
    }, [])

    React.useEffect(() => {
        fetchSymptomCode()
    }, [fetchSymptomCode, refresh])

    const columns = React.useMemo(
        () => 
            symptomCodeColums({
                onEdit: (id) => <SymptomCodeEdit SymptomCodeID={id}  onUpdate={fetchSymptomCode}/>,
                onDelete: (id) => <SymptomCodeDelete SymptomCodeID={id}/>
            }),
        [fetchSymptomCode]
    )
    return (
        <div className="p-4 grid grid-cols-1 w-full rounded-2xl">
            <DataTable
                title={<h2 className="text-xl sm:text-2xl font-bold">📊 Symptom Code Management</h2>}
                data={data}
                columns={columns}
                sorting={sorting}
                setSorting={setSorting}
                handleRefresh={handleRefresh}
                loading={loading}
                error={error}
                toolbar={(table) => (
                    <DataTableToolbar table={table} searchPlaceholder="🔍 Search symptomcode..." loading={loading} handleRefresh={handleRefresh}>
                       <DataTableFacetedFilter
                        title={"All Top Category"}
                        column={table.getColumn("TopCategory")}
                       />
                       <DataTableFacetedFilter
                        title={"All Sub Category"}
                        column={table.getColumn("SubCategory")}
                       />
                       <DataTableFacetedFilter
                        title={"All Quality Codes"}
                        column={table.getColumn("QualityCodes")}
                       />
                       <SymptomCodeAdd/>
                    </DataTableToolbar>
                )}
            />
        </div>
    )
}
