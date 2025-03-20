import * as React from "react"
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog"

// This is sample data.

import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell, TableCaption } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export function ModalAsset({ assets = [], filteredAssets = [] }) {
  const [isModalAssetOpen, setIsModalAssetOpen] = useState(false);

  return (
    <AlertDialog open={isModalAssetOpen} onOpenChange={setIsModalAssetOpen}>
      <AlertDialogTrigger asChild>
        <Button className="bg-black text-white" variant="outline">Assets</Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-gray-200 overflow-auto min-w-[max-content] max-h-[90vh]">
        <AlertDialogHeader>
          <AlertDialogTitle>Asset List</AlertDialogTitle>
          <AlertDialogDescription className="max-h-[70vh] overflow-auto">
            <Table>
              <TableCaption>A list of your assets.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[150px]">Serial Number</TableHead>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Product Number</TableHead>
                  <TableHead>Product Line</TableHead>
                  <TableHead className="text-right">Site Account ID</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAssets.length > 0 ? (
                  filteredAssets.map((asset) => (
                    <TableRow key={asset.AssetID}>
                      <TableCell className="font-medium">{asset.SerialNumber}</TableCell>
                      <TableCell>{asset.ProductName}</TableCell>
                      <TableCell>{asset.ProductNumber}</TableCell>
                      <TableCell>{asset.ProductLine}</TableCell>
                      <TableCell className="text-right">{asset.SiteAccountID}</TableCell>
                    </TableRow>
                  ))
                ) : assets.length > 0 ? (
                  assets.map((asset) => (
                    <TableRow key={asset.AssetID}>
                      <TableCell className="font-medium">{asset.SerialNumber}</TableCell>
                      <TableCell>{asset.ProductName}</TableCell>
                      <TableCell>{asset.ProductNumber}</TableCell>
                      <TableCell>{asset.ProductLine}</TableCell>
                      <TableCell className="text-right">{asset.SiteAccountID}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell className="font-medium text-center" colSpan={5}>
                      Data Belum Tersedia
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
