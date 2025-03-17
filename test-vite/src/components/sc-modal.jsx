import React, { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { Checkbox } from "./ui/checkbox";
import { SelectBar3 } from "./sc-select";
import { 
  SelectBarContact, 
  SelectBarContact2,
  SelectBarContact3,
  SelectBar,
  SelectBar1,
  SelectBar2,
 } from "@/components/sc-select";

 import {AlertDialog, AlertDialogContent, AlertDialogTrigger} from "@/components/ui/alert-dialog"
//import API
import ApiCustomer from "@/api";
import axios from "axios";

// const assets = [
//   {
//     productname: "HP Victus 16 inch Gaming Laptop 16-r0555TX",
//     product: "9T92PA94-92",
//     HWPorfitCenter: "-",
//     contact: "Slamet Meisa Putra",
//   },
// ];

export function BtnModal() {
  

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-white mr-4">
          <Plus></Plus>Create Case
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] bg-white">
        <DialogHeader>
          <DialogTitle>Case Information</DialogTitle>
        </DialogHeader>
        <div className="flex items-center space-x-3">
          <div className="w-55">
            <Label htmlFor="name" className="text-right">
              Case Subject
            </Label>
            <Input id="name" className="col-span-3 border-b-black p-1" />
          </div>
          <div className="">
            <Label htmlFor="name" className="text-right">
              Case Type
            </Label>
            <SelectBar3></SelectBar3>
          </div>
          <div className="flex items-center space-x-2 mt-5">
            <Checkbox id="terms" />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              KCI For this case?
            </label>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">DONE</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function BtnModalContact({ selectedCompany, selectedContact, setSelectedContact }) {
   const [formDataContact, setFormDataContact] = useState({
      Salutation: '',
      FirstName: '',
      LastName: '',
      Email: '',
      PreferredLanguage: '',
      Phone: '',
      Mobile: '',
      WorkPhone: '',
      WorkExtension: '',
      OtherPhone: '',
      OtherExtension: '',
      Fax: '',
      AddressLine1: '',
      AddressLine2: '',
      City: '',
      StateProvince: '',
      Country: '',
      ZipPostalCode: '',
      SiteAccountID: selectedCompany?.SiteAccountID || null
    });
    
    //handle input
    const handlerInputContactChange = (e) => {
      const { id, value } = e.target;
      setFormDataContact((prev) => ({ ...prev, [id]: value }));
    };
    
    // Handle form submission
  const handlerContactSubmit = async () => {
    console.log("formDataContact", formDataContact);
    try {
      const response = await ApiCustomer.post("/api/contact-information", formDataContact);
      if (response.data.success) {
        alert("Contact added successfully!");
      } else {
        alert("Error adding contact.");
      }

       // ✅ Reload contacts by fetching the latest data
       const updatedContacts = await fetchContacts(selectedCompany.SiteAccountID);
       setSelectedContact(updatedContacts); // ✅ Update state so table refreshes

    } catch (error) {
      console.error("Error adding contact:", error);
    }
  };

  
  // Function to fetch updated contacts
  const fetchContacts = async (companyId) => {
    try {
      const response = await ApiCustomer.get(`/api/contact-information?SiteAccountID=${companyId}`);
      return response.data.data; // ✅ Return updated contacts
    } catch (error) {
      console.error("Error fetching contacts:", error);
      return [];
    }
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-white mt-0.5">
          New Contacts
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[1000px] h-145 bg-white">
        <DialogHeader>
          <div className="flex justify-between">
            <DialogTitle className="text-xl">Contact Information</DialogTitle>
            <DialogTitle className="flex justify-end text-sm mt-2.5">
              Clear All
            </DialogTitle>
          </div>
        </DialogHeader>

        <DialogHeader>
          <DialogTitle className="text-md">Basic Information</DialogTitle>
        </DialogHeader>

        <div className="flex">
          <div className="space-y-0.5">
            <Label htmlFor="Salutation">Salutation</Label>
            <SelectBar1 id="Salutation" onChange={handlerInputContactChange} />
            <Label htmlFor="PreferredLanguage" className="mt-2">Preferred Language</Label>
            <SelectBar2 id="PreferredLanguage" onChange={handlerInputContactChange} />
          </div>
          <div className="space-y-0.5 absolute ml-40 w-42.5">
            <Label htmlFor="FirstName">First Name</Label>
            <Input id="FirstName" type="text" className="border-b-black p-1" onChange={handlerInputContactChange} />
          </div>
          <div className="space-y-0.5 ml-5">
            <Label htmlFor="LastName">Last Name</Label>
            <Input id="LastName" type="text" className="border-b-black p-1" onChange={handlerInputContactChange} />
          </div>
          {/* <div className="space-y-0.4 ml-5">
            <Label htmlFor="new">EXTN</Label>
            <Input id="new" type="text" className="border-b-black p-1 w-73 h-8 text-sm" />
          </div> */}
        </div>

        <DialogHeader>
          <DialogTitle className="text-md">Phone preferences</DialogTitle>
        </DialogHeader>

        <div className="flex">
          <div className="space-y-0.4">
            <Label htmlFor="Phone">Phone</Label>
            <Input id="Phone" type="text" className="border-b-black p-1" onChange={handlerInputContactChange} />

            <Label htmlFor="OtherPhone">Other</Label>
            <Input id="OtherPhone" type="text" className="border-b-black p-1" onChange={handlerInputContactChange} />
          </div>
          <div className="space-y-0.4 ml-3">
            <Label htmlFor="Mobile">Mobile</Label>
            <Input id="Mobile" type="text" className="border-b-black p-1" onChange={handlerInputContactChange} />

            <Label htmlFor="WorkExtension">Work EXTN</Label>
            <Input id="WorkExtension" type="text" className="border-b-black p-1" onChange={handlerInputContactChange} />
          </div>
          <div className="space-y-0.4 ml-5">
            <Label htmlFor="WorkPhone">Work</Label>
            <Input id="WorkPhone" type="text" className="border-b-black p-1" onChange={handlerInputContactChange} />

            <Label htmlFor="Fax">FAX</Label>
            <Input id="Fax" type="text" className="border-b-black p-1" onChange={handlerInputContactChange} />
          </div>
          <div className="space-y-0.4 ml-5">
            <Label htmlFor="OtherExtension"> Other EXTN</Label>
            <Input id="OtherExtension" type="text" className="border-b-black p-1" onChange={handlerInputContactChange} />
          </div>
        </div>

        <DialogHeader>
          <DialogTitle className="text-md">Address</DialogTitle>
        </DialogHeader>

        <div className="flex">
          <div className="space-y-0.4">
            <Label htmlFor="AddressLine1">Address Line 1</Label>
            <Input id="AddressLine1" type="text" className="border-b-black p-1" onChange={handlerInputContactChange} />

            <Label htmlFor="current">Country</Label>
            <SelectBar id="Country" onChange={handlerInputContactChange}/>
          </div>
          <div className="space-y-0.4 ml-5">
            <Label htmlFor="AddressLine2">Address Line 2</Label>
            <Input id="AddressLine2" type="text" className="border-b-black p-1" onChange={handlerInputContactChange} />

            <Label htmlFor="ZipPostalCode">Zip/Postal Code</Label>
            <Input id="ZipPostalCode" type="text" className="border-b-black p-1" onChange={handlerInputContactChange} />
          </div>
          <div className="space-y-0.4 ml-5">
            <Label htmlFor="City">City</Label>
            <Input id="City" type="text" className="border-b-black p-1" onChange={handlerInputContactChange} />
          </div>
          <div className="space-y-0.4 ml-3">
            <Label htmlFor="StateProvince">State/Province</Label>
            <Input id="StateProvince" type="text" className="border-b-black p-1" onChange={handlerInputContactChange} />

            
                  {/* Hidden Input for SiteAccountID */}
                  <Input type="hidden" id="SiteAccountID" value={formDataContact.SiteAccountID || ""} onChange={handlerInputContactChange} />
          </div>
        </div>

        <div className="flex justify-between">
          <div className="flex items-center space-x-2 ">
            <Checkbox id="terms" />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              KCI For this contact?
            </label>
          </div>
        <Button variant="secondary" className="bg-white w-30 drop-shadow-md border-1 cursor-pointer text-xl" onClick={handlerContactSubmit}>Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function BtnModalAsset() {
  //set asset
  const [assets, setAssets] = useState([])
  //fetchDAta
  const fetchDataAssets = async () => {
    try {
      const response = await ApiCustomer.get("/api/asset-information")
      setAssets(response.data.data);
    }catch (error)  {
      console.error("Error fetching assets: ", error)
    }
  }
  //prevent infinite loop of calling fetchDataAssets
  useEffect(() => {
    fetchDataAssets();
  }, []); 

  //set search state
  const [searchAsset, setSearchAsset] = useState("");
  //handle Change Input
  const handleSearchInputAssetsChange = (e) =>{
    const searchQuery = e.target.value;
    setSearchAsset(searchQuery);
  }
  const filteredAssets = searchAsset !== "" ? assets.filter(
    (asset) => 
      asset.SerialNumber?.toLowerCase().includes(searchAsset.toLowerCase()) || 
      asset.ProductName?.toLowerCase().includes(searchAsset.toLowerCase()) || 
      asset.ProductNumber?.toLowerCase().includes(searchAsset.toLowerCase())
  ) : [];


  //handling dialog state
  const [isOpen, setIsOpen] = useState(false);

  //handling save button
  const [newSearchedAsset, setNewSearchedAsset] = useState({
    SerialNumber: "",
    ProductName: "",
    ProductNumber: "",
    HWProfitCenter: "",
    ContactFirstName: "",
    ContactLastName: "",
  })

  const handleNewAssetChange = (e) => {
    setNewSearchedAsset({
      ...newSearchedAsset,
      [e.target.name]: e.target.value,
    })
  }

  //TODO : Post new Save Asset after created the serial number file
  return (
    <Dialog
      open={isOpen} onOpenChange={setIsOpen}
    >
    <DialogTrigger asChild>
      <Button variant="outline" className="bg-white mt-0.5" onClick={() => setIsOpen(true)}>
        New Asset
      </Button>
    </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] bg-white">
        <DialogHeader>
          <div className="flex justify-between">
            <DialogTitle className="text-xl">Asset Information</DialogTitle>
            <DialogTitle className="flex justify-end text-sm mt-2.5">
              Clear All
            </DialogTitle>
          </div>
        </DialogHeader>

        <DialogHeader>
          <DialogTitle className="text-md">Serial Number</DialogTitle>
        </DialogHeader>

        <div className="flex gap-3">  
          <Input className="border-2 border-black rounded-2xl w-55 text-md h-10" type="Search" onChange={handleSearchInputAssetsChange}></Input>
          <Button variant="outline" className="w-30 rounded-2xl h-10 border-blue-600 border-2">Search</Button>
          <div className="mt-2">
          <Checkbox id="terms" className="w-5 h-5 border-2 border-black"/>
            <label
              htmlFor="terms"
              className="text-md font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ml-2"
            >
              Not Available
            </label>
          </div>
        </div>

        <Table className="table-fixed border-spacing-0 mx-auto">
          <TableHeader>
            <TableRow className="bg-blue-200">
              <TableHead className="text-black">Product Name</TableHead>
              <TableHead className="text-black">Product Number</TableHead>
              <TableHead className="text-black">HW Profit Center</TableHead>
              <TableHead className="text-black">Contact</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody >
            {filteredAssets.length > 0 ? (
              filteredAssets.map((asset) => (
                <TableRow key={asset?.AssetID}>
                <TableCell className="whitespace-break-spaces ">{asset?.ProductName}</TableCell>
                <TableCell>{asset?.ProductNumber}</TableCell>
                <TableCell>{asset?.HWPorfitCenter ? asset?.HWPorfitCenter : '-' }</TableCell>
                <TableCell>{asset?.contact_information !== null ? asset?.contact_information?.FirstName + ' ' + asset?.contact_information?.LastName : '-'   }</TableCell>
              </TableRow>
              ))
            ) : assets.length > 0 ? ( assets.map((asset) => (
              <TableRow key={asset?.AssetID}>
                <TableCell className="whitespace-break-spaces ">{asset?.ProductName}</TableCell>
                <TableCell>{asset?.ProductNumber}</TableCell>
                <TableCell>{asset?.HWPorfitCenter ? asset?.HWPorfitCenter : '-' }</TableCell>
                <TableCell>{asset?.contact_information !== null ? asset?.contact_information?.FirstName + ' ' + asset?.contact_information?.LastName : '-'   }</TableCell>
              </TableRow>
             )) ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center font-medium whitespace-break-spaces"
                  >
                    Data Belum Tersedia
                  </TableCell>
                </TableRow>
             )}
          </TableBody>
          </Table>

          <div className="flex justify-end gap-2">
            <Button variant="outline" className="w-20 border-2 border-blue-500" onClick={() => setIsOpen(false)}>Back</Button>
            <Button variant="outline" className="w-20 bg-blue-700 text-white">Save</Button>
          </div>
      </DialogContent>
    </Dialog>
  )
}

export const AssetAlertDialog = ({ assetId, onUpdate }) => {
  const [asset, setAsset] = useState(null);
  const [serialNumber, setSerialNumber] = useState("");
  const [productName, setProductName] = useState("");
  const [productNumber, setProductNumber] = useState("");
  const [productLine, setProductLine] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const fetchAsset = async () => {
    if (!assetId) return; // Cegah fetch jika assetId tidak ada
    try {
      const response = await ApiCustomer.get(`/api/asset-information/${assetId}`);
      const data = response.data.data;
      setAsset(data);
      setSerialNumber(data?.SerialNumber || "");
      setProductName(data?.ProductName || "");
      setProductNumber(data?.ProductNumber || "");
      setProductLine(data?.ProductLine || "");
      console.error("Error fetching asset information:", error);
    }
  };

  useEffect(() => {
    if (assetId && isOpen) { 
      fetchAsset();
    }
  }, [assetId, isOpen]);

  // Reset state saat modal ditutup
  useEffect(() => {
    if (!isOpen) {
      setSerialNumber("");
      setProductName("");
      setProductNumber("");
      setProductLine("");
    }
  }, [isOpen]);

  const handleUpdate = async () => {
    if (!serialNumber || !productName) {
      alert("Serial Number dan Product Name wajib diisi!");
      return;
    }

    try {
      await ApiCustomer.patch(`/api/asset-information/${assetId}`, {
        SerialNumber: serialNumber,
        ProductName: productName,
        ProductNumber: productNumber,
        ProductLine: productLine,
      });
      onUpdate();
      setIsOpen(false);
    } catch (error) {
      console.error("Error updating asset:", error);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Apakah Anda yakin ingin menghapus data ini?")) return;
    try {
      await ApiCustomer.delete(`/api/asset-information/${assetId}`);
      onUpdate();
      setIsOpen(false);
    } catch (error) {
      console.error("Error deleting asset:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={() => { setIsOpen(true); fetchAsset(); }}>Edit/Hapus</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Asset Information</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <Input value={serialNumber} onChange={(e) => setSerialNumber(e.target.value)} placeholder="Serial Number" />
          <Input value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="Product Name" />
          <Input value={productNumber} onChange={(e) => setProductNumber(e.target.value)} placeholder="Product Number" />
          <Input value={productLine} onChange={(e) => setProductLine(e.target.value)} placeholder="Product Line" />
        </div>
        <DialogFooter>
          <Button onClick={handleUpdate}>Update</Button>
          <Button variant="destructive" onClick={handleDelete}>Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

