import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BtnModalContact } from "./sc-modal";
import { BtnModalAsset } from "./sc-modal";
import { ChevronDown } from "lucide-react";
import { Checkbox } from "./ui/checkbox";
import { Input } from "./ui/input";
import { ContactRound, User,Search, Laptop } from "lucide-react";








export function TableCompany({ selectedAsset = [] }) {

  //check if not have any input available
  const ifEmptyQuerySearch = !selectedAsset || Object.keys(selectedAsset).length === 0;
  if (ifEmptyQuerySearch) return (
    <p>No Record Found</p>
  );

  
  console.log("Received asset in TableCompany:", selectedAsset);
  const companies = selectedAsset?.site_account ? [
    {
      key: selectedAsset?.SiteAccountID,
      company: selectedAsset?.site_account?.Company,
    },
    {
      text: `${selectedAsset?.site_account?.AddressLine1} ${selectedAsset?.site_account?.City} ${selectedAsset?.site_account?.StateProvince} ${selectedAsset?.site_account?.Country}-${selectedAsset?.site_account?.ZipPostalCode} | Email: ${selectedAsset?.site_account?.Email} | Phone : ${selectedAsset?.site_account?.PrimaryPhone}`,
    },
  ] : null;

  const contacts = selectedAsset?.contact_information ? [
    {
      contactID: selectedAsset?.contact_information?.ContactID,
      firstname: selectedAsset?.contact_information?.FirstName,
      lastname: selectedAsset?.contact_information?.LastName,
      email: selectedAsset?.contact_information?.Email,
      phone: selectedAsset?.contact_information?.Phone || selectedAsset?.contact_information?.Mobile,
      country: selectedAsset?.contact_information?.Country ,
      source: "CRM",
      hpID: "526291",
    },
  ] : null;

  const assets = selectedAsset ? [
    {
      assetID : selectedAsset.AssetID,
      serialNumber : selectedAsset.SerialNumber,
      productName : selectedAsset.ProductName,
      productNumber : selectedAsset.ProductNumber,
      productLine : selectedAsset.ProductLine,
      // TODO : Search what tf is this mean
      isparent: "-",
      parentasset: "-",
      source: "CRM",
    },
  ] : null;
  
  console.log("Invoices")
  console.log(companies)
  return (
    // Company
      <Card className="m-0 p-0 gap-0">
        <CardHeader className="bg-blue-400 p-3 rounded-t-lg">
          <span className="flex items-center gap-2 text-xl">
            <Checkbox className="border-black border-3 w-7.5 h-7 "></Checkbox>
            { companies !== null ? companies[0].company : "" }
          </span>
        </CardHeader>
        <CardContent className=" p-3">
        { companies !== null ? (
          <div className="text-gray-500"key={companies[0].key}>
              <p>{companies[1].text}</p>
          </div>
          
        ) : (
          <div className="text-gray-500">
              <p>No Company Available</p>
          </div>
        )}
        </CardContent>

        {/* Contact */}
        <CardFooter className="p-0 flex flex-col">
            <div className=" bg-blue-200 p-3 text-black font-bold text-xl flex w-full justify-between  ">
              <div className="flex items-center gap-2">
                <User></User>
                Contact
                <span className="relative flex items-center">
                  <Search className="absolute right-1"/><Input className="bg-white ring-2 border-0 rounded-2xl pr-10"/>
                </span>
              </div>
              <BtnModalContact className=""></BtnModalContact>
              </div>
          <Table> 
            <TableHeader className="bg-gray-400">
              <TableRow>
                <TableHead className=" text-black font-bold">First Name</TableHead>
                <TableHead className=" text-black font-bold">Last Name</TableHead>
                <TableHead className=" text-black font-bold">Email</TableHead>
                <TableHead className=" text-black font-bold">Phone</TableHead>
                <TableHead className=" text-black font-bold">Country</TableHead>
                <TableHead className=" text-black font-bold">Source</TableHead>
                <TableHead className=" text-black font-bold">HP ID</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contacts !== null ? contacts.map((contact) => (
                <TableRow key={contact.contactID}>
                  <TableCell>{contact.firstname}</TableCell>
                  <TableCell>{contact.lastname}</TableCell>
                  <TableCell>{contact.email}</TableCell>
                  <TableCell>{contact.phone}</TableCell>
                  <TableCell>{contact.country}</TableCell>
                  <TableCell>{contact.source}</TableCell>
                  <TableCell>{contact.hpID}</TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={7}>No Contact Available</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Asset */}
            <div className=" bg-blue-200 p-3 text-black font-bold text-xl flex w-full justify-between">
              <div className="flex items-center gap-2">
                <Laptop></Laptop>
                Assets
                <span className="relative flex items-center">
                  <Search className="absolute right-1"/><Input className="bg-white ring-2 border-0 rounded-2xl pr-10"/>
                </span>
              </div>
              <BtnModalAsset></BtnModalAsset>
              </div>
          <Table> 
            <TableHeader className="bg-gray-400 text-black font-bold">
              <TableRow>
                <TableHead className=" text-black font-bold">Product Name</TableHead>
                <TableHead className=" text-black font-bold">Product #</TableHead>
                <TableHead className=" text-black font-bold">Serial Number</TableHead>
                <TableHead className=" text-black font-bold">Product Line</TableHead>
                <TableHead className=" text-black font-bold">Is Parent</TableHead>
                <TableHead className=" text-black font-bold">Parent Asset</TableHead>
                <TableHead className=" text-black font-bold">Source</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
            {assets !== null? assets.map((asset) => (
              <TableRow key={asset.assetID}>
                <TableCell>{asset.productName}</TableCell>
                <TableCell>{asset.productNumber}</TableCell>
                <TableCell>{asset.serialNumber}</TableCell>
                <TableCell>{asset.productLine}</TableCell>
                <TableCell>{asset.isparent}</TableCell>
                <TableCell>{asset.parentasset}</TableCell>
                <TableCell>{asset.source}</TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={7}>No Assets Available</TableCell>
              </TableRow>
            )}
            </TableBody>
          </Table>
        </CardFooter>
      </Card>
    
  );
}

export function TableContact({ selectedAsset = [] }) {
  // console.log("Received asset in TableCompany:", selectedAsset);
  const contacts = selectedAsset?.contact_information ? [
    {
      contactID: selectedAsset?.contact_information?.ContactID,
      firstname: selectedAsset?.contact_information?.FirstName,
      lastname: selectedAsset?.contact_information?.LastName,
      email: selectedAsset?.contact_information?.Email,
      phone: selectedAsset?.contact_information?.Phone || selectedAsset?.contact_information?.Mobile,
      country: selectedAsset?.contact_information?.Country ,
      source: "CRM",
      hpID: "526291",
    },
  ] : null;
  return (
    <div className="">
    </div>
  );
}

export function TableAsset({ selectedAsset }) {
  const assets = selectedAsset ? [
    {
      assetID : selectedAsset.AssetID,
      serialNumber : selectedAsset.SerialNumber,
      productName : selectedAsset.ProductName,
      productNumber : selectedAsset.ProductNumber,
      productLine : selectedAsset.ProductLine,
      // TODO : Search what tf is this mean
      isparent: "-",
      parentasset: "-",
      source: "CRM",
    },
  ] : null;
  return (
    <div className="">
    </div>
  );
}