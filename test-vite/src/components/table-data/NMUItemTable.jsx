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
import { NmuItemAdd, NmuItemDelete, NmuItemEdit } from "../model/sc-modal"

function nmuItemColums(opts) {
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
            accessorKey: "id",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title={"NMU Item ID"}/>
            ),
        },
        {
            accessorKey: "itemName",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title={"Item Name"}/>
            ),
        },
        {
            accessorKey: "nmuId",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title={"NMU Id"}/>
            ),
        },
        {
            accessorKey: "nmu.NMUDesc",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title={"NMU Desc"}/>
            ),
        },
        {
            accessorKey: "createdAt",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title={"createdAt"}/>
            ),
            cell: ({ getValue }) => formatDate(getValue())
        },
        {
            id: "actions",
            header: () => <div className="text-center">Actions</div>,
            cell: ({ row }) => {
                const id = row.original.id
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

export function NMUItemTable() {
    const [data, setData] = React.useState([])
    const [loading, setLoading] = React.useState(false)
    const [error, setError] = React.useState(null)
    const [sorting, setSorting] = React.useState([])
    const [refresh, setRefresh] = React.useState(false) 

    function handleRefresh(){
      setRefresh(prev => !prev)
    }

    const fetchNMUItem = React.useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
        const res = await ApiCustomer.get(`/api/nmu/nmuitem`)
        setData(res.data.data)
        } catch (error) {
            toast.error("Failed to fetch NMU Item data")
            setError("Failed to fetch data")
        } finally {
            setLoading(false)
        }
    }, [])

    React.useEffect(() => {
        fetchNMUItem()
    }, [fetchNMUItem, refresh])

    const columns = React.useMemo(
        () => 
            nmuItemColums({
                onEdit: (id) => <NmuItemEdit id={id}  onUpdate={fetchNMUItem}/>,
                onDelete: (id) => <NmuItemDelete id={id}/>
            }),
        [fetchNMUItem]
    )
    return (
        <div className="p-4 grid grid-cols-1 w-full rounded-2xl">
            <DataTable
                title={<h2 className="text-xl sm:text-2xl font-bold">📊 NMU Item Management</h2>}
                data={data}
                columns={columns}
                sorting={sorting}
                setSorting={setSorting}
                handleRefresh={handleRefresh}
                loading={loading}
                error={error}
                toolbar={(table) => (
                    <DataTableToolbar table={table} searchPlaceholder="🔍 Search nmu item..." loading={loading} handleRefresh={handleRefresh}>
                        <NmuItemAdd/>
                    </DataTableToolbar>
                )}
            />
        </div>
    )
}
