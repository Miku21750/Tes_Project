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
import { formatDate } from "@/lib/utils"
import { Link } from "react-router"
import { CrsAdd, CrsDelete, CrsEdit,} from "../model/sc-modal"

function caseResolutionColums(opts) {
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
            accessorKey: "id_csr",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title={"CSR ID"}/>
            ),
        },
        {
            accessorKey: "caseResolutionCode",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title={"Case Resolution Code"}/>
            ),
        },
        {
            accessorKey: "autoClose",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title={"Auto Close"}/>
            ),
        },
        {
            accessorKey: "readyForCloseDays",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title={"Ready For Close Days"}/>
            ),
        },
        {
            accessorKey: "readyForClosureDate",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title={"Ready For Closure Date"}/>
            ),
            cell: ({ getValue }) => formatDate(getValue())
        },
        {
            accessorKey: "pendingCustomerAction",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title={"Pending Customer Action"}/>
            ),
            cell: ({ getValue }) => formatDate(getValue())
        },
        {
            accessorKey: "customerRequestedCloseDate",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title={"Customer Requested Close Date"}/>
            ),
            cell: ({ getValue }) => formatDate(getValue())
        },
        {
            id: "actions",
            header: () => <div className="text-center">Actions</div>,
            cell: ({ row }) => {
                const id = row.original.id_csr
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

export function CaseResolutionTable() {
    const [data, setData] = React.useState([])
    const [loading, setLoading] = React.useState(false)
    const [error, setError] = React.useState(null)
    const [sorting, setSorting] = React.useState([])
    const [refresh, setRefresh] = React.useState(false) 

    function handleRefresh(){
      setRefresh(prev => !prev)
    }

    const fetchCaseResolution = React.useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
        const res = await ApiCustomer.get(`/api/caseResolution`)
        setData(res.data.data)
        } catch (error) {
            toast.error("Failed to fetch Case Resolution data")
            setError("Failed to fetch data")
        } finally {
            setLoading(false)
        }
    }, [])

    React.useEffect(() => {
        fetchCaseResolution()
    }, [fetchCaseResolution, refresh])

    const columns = React.useMemo(
        () => 
            caseResolutionColums({
                onEdit: (id) => <CrsEdit id_csr={id}  onUpdate={fetchCaseResolution}/>,
                onDelete: (id) => <CrsDelete id_csr={id}/>
            }),
        [fetchCaseResolution]
    )
    return (
        <div className="p-4 grid grid-cols-1 w-full rounded-2xl">
            <DataTable
                title={<h2 className="text-xl sm:text-2xl font-bold">📊 Case Resolution Management</h2>}
                data={data}
                columns={columns}
                sorting={sorting}
                setSorting={setSorting}
                handleRefresh={handleRefresh}
                loading={loading}
                error={error}
                toolbar={(table) => (
                    <DataTableToolbar table={table} searchPlaceholder="🔍 Search case resolution..." loading={loading} handleRefresh={handleRefresh}>
                        <CrsAdd/>
                    </DataTableToolbar>
                )}
            />
        </div>
    )
}
