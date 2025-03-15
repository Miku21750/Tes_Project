import React from 'react'

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Checkbox } from "@/components/ui/checkbox"


 
export function BtnModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-white mr-4"><Plus></Plus>Edit Profile</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
        </DialogHeader>
        <div className="flex items-center space-x-3">
        <div className="">
            <Label htmlFor="name" className="text-right">
            Case Subject
            </Label>
            <Input id="name" className="col-span-3" />
          </div>
          <div className="">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function BtnModalNewAsset() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-white mr-4">
          <Plus /> New Asset
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Asset Information</DialogTitle>
        </DialogHeader>
        <div className="">          
          <div className="space-y-0.5">
            <p className="text-red-500 text-sm">No Data Found</p>
          </div>

          <form action="" method="post">
            <div className="flex justify-end">
              <Button type="reset">Clear All</Button>
            </div>
            
            <div className="space-y-0.5 flex items-center space-x-3">
              <div>
                <Label htmlFor="SerialNumber" className="text-right">Serial Number</Label>
                <Input id="SerialNumber" className="col-span-3" />
              </div>
            </div>

            <div className="space-y-0.5 flex items-center space-x-3">
              <div>
                <Label htmlFor="ProductNumber" className="text-right">Product Number</Label>
                <Input id="ProductNumber" className="col-span-3" />
              </div>
              <div>
                <Button type="submit">Search</Button>
              </div>
              <div className='space-x-2'>
                <Checkbox id="terms" />
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Not available
                </label>
              </div>
            </div>

            <div className="space-y-0.5 flex items-center space-x-3">
              <div>
                <Label htmlFor="ProductName" className="text-right">Product Name</Label>
                <Input id="ProductName" className="col-span-3" />
              </div>
            </div>
          </form>

          <Table>
            <TableCaption>A list of your recent invoices.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="">Product Name</TableHead>
                <TableHead>Product Number</TableHead>
                <TableHead>HW Profit Center</TableHead>
                <TableHead className="">Contract</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="">-</TableCell>
                <TableCell>-</TableCell>
                <TableCell>-</TableCell>
                <TableCell className="">-</TableCell>
              </TableRow>
            </TableBody>
          </Table>


          <DialogFooter>
          <Button type="">New</Button>
          <Button type="">Back</Button>
          <Button type="submit">Save</Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>

  )
}
