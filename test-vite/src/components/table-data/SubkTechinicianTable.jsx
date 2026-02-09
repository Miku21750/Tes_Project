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
import { SubkTechnicianAdd, SubkTechnicianDelete, SubkTechnicianEdit } from "../model/sc-modal"


function subkTechnicianColums(opts) {
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
            accessorKey: "SubkTechnicianId",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title={"Subk Technician ID"}/>
            ),
        },
        {
            accessorKey: "Name",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title={"Name"}/>
            ),
        },
        {
            accessorKey: "resourceAccount.Name",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title={"Name Resource Account"}/>
            ),
        },
        {
            id: "actions",
            header: () => <div className="text-center">Actions</div>,
            cell: ({ row }) => {
                const id = row.original.SubkTechnicianId
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

export function SubkTechnicianTable() {
    const [data, setData] = React.useState([])
    const [loading, setLoading] = React.useState(false)
    const [error, setError] = React.useState(null)
    const [sorting, setSorting] = React.useState([])
    const [refresh, setRefresh] = React.useState(false) 

    function handleRefresh(){
      setRefresh(prev => !prev)
    }

    const fetchSubkTechinician = React.useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
        const res = await ApiCustomer.get(`/api/subk-technician`)
        setData(res.data.data)
        } catch (error) {
            toast.error("Failed to fetch SubkTechnician data")
            setError("Failed to fetch data")
        } finally {
            setLoading(false)
        }
    }, [])

    React.useEffect(() => {
        fetchSubkTechinician()
    }, [fetchSubkTechinician, refresh])

    const columns = React.useMemo(
        () => 
            subkTechnicianColums({
                onEdit: (id) => <SubkTechnicianEdit SubkTechnicianId={id}  onUpdate={fetchSubkTechinician}/>,
                onDelete: (id) => <SubkTechnicianDelete SubkTechnicianId={id}/>
            }),
        [fetchSubkTechinician]
    )
    return (
        <div className="p-4 grid grid-cols-1 w-full rounded-2xl">
            <DataTable
                title={<h2 className="text-xl sm:text-2xl font-bold">📊 Subk Technician Management</h2>}
                data={data}
                columns={columns}
                sorting={sorting}
                setSorting={setSorting}
                handleRefresh={handleRefresh}
                loading={loading}
                error={error}
                toolbar={(table) => (
                    <DataTableToolbar table={table} searchPlaceholder="🔍 Search subktechnician..." loading={loading} handleRefresh={handleRefresh}>
                       <DataTableFacetedFilter
                        title={"All Subktechnician"}
                        column={table.getColumn("SubkTechnicianId")}
                       />
                       <DataTableFacetedFilter
                        title={"All Name"}
                        column={table.getColumn("Name")}
                       />
                       <SubkTechnicianAdd/>
                    </DataTableToolbar>
                )}
            />
        </div>
    )
}
