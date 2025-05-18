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
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch"
import { Plus,PhoneCall, Copy, ExternalLink, XIcon } from "lucide-react";
import { Checkbox } from "./ui/checkbox";
import { SelectBar3, SelectBarContact4, SelectYN } from "./sc-select";
import { 
  SelectBarContact,
  SelectBarContact2,
  SelectBarContact3,
  SelectBar,
  SelectBar1,
  SelectBar2,
 } from "@/components/sc-select";
 import { 
   Select,
   SelectContent,
   SelectGroup,
   SelectItem,
   SelectLabel,
   SelectTrigger,
   SelectValue,
  } from '@/components/ui/select'


import { useNavigate } from 'react-router';
  
 import { SnInput } from "./sn-input";
import { Textarea } from "./ui/textarea";
import { Pencil, Trash } from "lucide-react";
//import API
import ApiCustomer from "@/api";
import axios from "axios";
import Swal from "sweetalert2";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

import { getUserFromToken } from "@/lib/utils/auth";
import { Description } from "@radix-ui/react-alert-dialog";

// const assets = [
//   {
//     productname: "HP Victus 16 inch Gaming Laptop 16-r0555TX",
//     product: "9T92PA94-92",
//     HWPorfitCenter: "-",
//     contact: "Slamet Meisa Putra",
//   },
// ];

export function BtnModal({
  handleCreateCase,
  selectedAssetForCase,
  selectedContactForCase,
  caseType,
  setCaseType,
  accessories,
  setAccessories
}) {
  
  
  // console.log("This is  the data",selectedAssetForCase.AssetID);

  const handleAccessoryChange = (index, field, value) => {
      const newAccessories = [...accessories];
      newAccessories[index][field] = value;
      setAccessories(newAccessories);
    };
  
    const addAccessory = (e) => {
      // e.prevent.default()
      setAccessories([...accessories, { name: "", note: "", code: "" }]);
    };
  return (
    <Dialog>
    <DialogTrigger asChild>
      <Button 
        variant="outline" 
        disabled={!selectedAssetForCase || !selectedContactForCase}
        className={`mr-4 ${(!selectedAssetForCase || !selectedContactForCase) ? "bg-white cursor-not-allowed" : "bg-blue-500 text-white"}`}
      >
        <Plus className="mr-2" />Create Case
      </Button>
    </DialogTrigger>

    <DialogContent className="sm:max-w-[700px] bg-white">
      <DialogHeader>
        <DialogTitle>Case Information</DialogTitle>
      </DialogHeader>

      <form className="space-y-5">
        {/* Subject & Type */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-1">
            <Label htmlFor="CaseSubject">Case Subject<Label className="text-red-600">*</Label></Label>
            <Input id="CaseSubject" className="p-2 border" placeholder="Enter subject" />
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="CaseType">Case Type<Label className="text-red-600">*</Label></Label>
            <SelectBar3
              value={caseType} 
              onChange={setCaseType} 
              id="CaseType"
              placeholder="Select CaseType"
              options={[
                { id: "Depot Repair", name: "Depot Repair" },
                { id: "Onsite", name: "Onsite" },
                { id: "Bench", name: "Bench" },
              ]}
            />
          </div>
        </div>

        {/* KCI Flag */}
        <div className="flex items-center space-x-2">
          <Checkbox id="KCI_Flag" />
          <Label
            htmlFor="KCI_Flag"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            KCI For this case?
          </Label>
        </div>

        {/* Problem Description */}
        <div className="flex flex-col">
          <Label htmlFor="ProblemDesc">Problem Description</Label>
          <textarea
            id="ProblemDesc"
            className="w-full p-2 border rounded-md"
            rows={3}
            placeholder="Describe the problem here..."
          />
        </div>

        {/* Case Note */}
        <div className="flex flex-col">
          <Label htmlFor="CaseNote">Case Note</Label>
          <textarea
            id="CaseNote"
            className="w-full p-2 border rounded-md"
            rows={3}
            placeholder="Additional notes..."
          />
        </div>

        {/* Accessories */}
        {accessories.map((acc, index) => (
          <div key={index} className="grid grid-cols-1 gap-2 mt-2 md:grid-cols-3">
            <Input placeholder="Accessory name" value={acc.name} onChange={(e) => handleAccessoryChange(index, "name", e.target.value)} />
            <Input placeholder="Note" value={acc.note} onChange={(e) => handleAccessoryChange(index, "note", e.target.value)} />
            <Input placeholder="CT / SN code" value={acc.code} onChange={(e) => handleAccessoryChange(index, "code", e.target.value)} />
          </div>
        ))}
        <Button variant="outline" type="button" onClick={addAccessory}>+ Add Accessory</Button>

        <DialogFooter>
          <Button type="submit" onClick={(e) => {
            e.preventDefault(); // Prevents form submission
            handleCreateCase();
          }}>DONE</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>

  );
}

export function BtnModalAccount({
  
})
{}
/**
 * TODO 
 * VALIDATION WHERE INPUTED CONTACT ALREADY AVAILABLE
 * CHECK EMAIL OR PHONE
 */

export function BtnModalContact({ 
  selectedCompany, 
  selectedContact, 
  setSelectedContact, 
  open : externalOpen, 
  onOpenChange : externalOnChange,
  companyData
  }) {

    const [provinces, setProvinces] = useState([]);
    const [cities, setCities] = useState([]);
    console.log("CHECK DATA FORM BTN MOdAL",selectedContact)

  //set modal state 

  console.log("Company Data in Modal Contact : ",companyData)
  // const [isModalContactSearchInput, setIsModalContactSearchInput] = useState(false);
  
  const isControlled = externalOpen !== undefined;
  const [internalOpen, setInternalOpen] = useState(false);
  const open = isControlled ? externalOpen : internalOpen;

  const handleChange = (value) => {
    if (isControlled) {
      externalOnChange?.(value); // ✅ Don't force false always
    } else {
      setInternalOpen(value);
    }
  };


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
      SiteAccountID: typeof selectedCompany === "object" 
      ? selectedCompany.SiteAccountID ?? "" 
      : selectedCompany
    });

     useEffect(() => {
        fetch("https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json")
          .then((res) => res.json())
          .then(setProvinces)
          .catch(console.error);
      }, []);
    
      useEffect(() => {
        const selectedProvince = provinces.find((p) => p.name === formDataContact.StateProvince);
        if (selectedProvince) {
          fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${selectedProvince.id}.json`)
            .then((res) => res.json())
            .then(setCities)
            .catch(console.error);
        }
      }, [formDataContact.StateProvince]);
    
    //handle input
    const handlerInputContactChange = (eOrId, value) => {
      if (typeof eOrId === 'string') {
        setFormDataContact((prev) => ({ ...prev, [eOrId]: value }));
      } else {
        const { id, value } = eOrId.target;
        setFormDataContact((prev) => ({ ...prev, [id]: value }));
      }
    };

    
    const handleClearAllContact = () => {
      setFormDataContact({
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
      })
    }

  // Function to fetch updated contacts
  const fetchContacts = async (companyId) => {
    try {
      console.log("Fetching contacts for Company ID:", companyId); // ✅ Debugging
      const response = await ApiCustomer.get(`/api/contact-information?SiteAccountID=${companyId}`);
      console.log("response Fetch Contacts: ", response.data)
      return response.data.data; // ✅ Return updated contacts
    } catch (error) {
      console.error("Error fetching contacts:", error);
      return [];
    }
  };
  // Handle form submission
  const handlerContactSubmit = async () => {
    console.log("formDataContact", formDataContact);
    try {
      Swal.fire({
        title: 'Saving Case...',
        text: 'Mohon tunggu sebentar',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
      });
      let responseMessage = '';
  
      if (formDataContact.ContactID) {
        // ✅ Update existing contact
        await ApiCustomer.patch(`/api/contact-information/${formDataContact.ContactID}`, formDataContact);
        responseMessage = 'Kontak berhasil diperbarui!';
      } else {
        // ✅ Add new contact
        console.log("Selected Company in ModalContactSubmit : ", selectedCompany)
        await ApiCustomer.post("/api/contact-information", formDataContact);
        responseMessage = 'Kontak berhasil ditambahkan!';
      }
  
      // 1✅ Tutup modal form input dulu
     if (!isControlled) {
      setInternalOpen(false);
     }
  
      // ✅ Tunggu sebentar biar modal benar-benar hilang (hindari konflik z-index)
      setTimeout(async () => {
        await Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: responseMessage,
          confirmButtonText: 'OK',
          allowEscapeKey: false,
        });
  
        // ✅ Refresh data kontak setelah SweetAlert ditutup
        if (selectedCompany?.SiteAccountID) {
          const updatedContacts = await fetchContacts(selectedCompany.SiteAccountID);
          setSelectedContact(updatedContacts);
          console.log("Updated Selected Contacts:", updatedContacts);
        }
      }, 300); // delay kecil untuk pastikan modal tertutup
  
    } catch (error) {
      console.error("Error adding contact:", error);
      Swal.fire({
        icon: 'error',
        title: 'Gagal!',
        text: 'Terjadi kesalahan saat menyimpan kontak.',
        timer: 1500,
        showConfirmButton: false,
        allowEscapeKey: false,
      });
    }
  };

  // make the 'same in account information' button :
  const handleCopyFromAccount = () => {
    if (companyData == null) return;
  
    const fieldsToCopy = [
      "AddressLine1",
      "AddressLine2",
      "City",
      "StateProvince",
      "Country",
      "ZipPostalCode"
    ];
  
    fieldsToCopy.forEach((field) => {
      const value = companyData[field] || "";
      handlerInputContactChange({ target: { id: field, value } });
    });
  };
  

  // Edit function 

  // ✅ Function to open Edit Modal
  const openEditModal = (contact) => {
    setFormDataContact(contact);
  };

  
    // const [provinces, setProvinces] = useState([]);
    // const [cities, setCities] = useState([]);
     useEffect(() => {
        fetch("https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json")
          .then((res) => res.json())
          .then(setProvinces)
          .catch(console.error);
      }, []);
    
      useEffect(() => {
        const selectedProvince = provinces.find((p) => p.name === formDataContact.StateProvince);
        if (selectedProvince) {
          fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${selectedProvince.id}.json`)
            .then((res) => res.json())
            .then(setCities)
            .catch(console.error);
        }
      }, [formDataContact.StateProvince]);


  return (
    <Dialog open={open} onOpenChange={handleChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-white mt-0.5">
          New Contacts
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[1000px]  bg-white">
        <DialogHeader className="flex-row items-center justify-between">
          <DialogDescription className="flex gap-2 text-xl font-semibold text-black"><PhoneCall></PhoneCall>Contact Information</DialogDescription>
            <Button 
            className="self-end mr-2" 
            variant="ghost"
            onClick={handleClearAllContact}
            >Clear All</Button>
          
        </DialogHeader>

        <DialogHeader>
          <DialogTitle className="text-md">Basic Information</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-6 gap-2">
          <div className="space-y-0.5 flex flex-col">
            <Label htmlFor="Salutation">Salutation</Label>
            <SelectBar 
              value={formDataContact.Salutation} 
              id="Salutation" 
              onChange={handlerInputContactChange} 
              placeholder="Select Salutation"
              options={[
                { id: "Mr. ", name: "Mr." },
                { id: "Mrs. ", name: "Mrs." },
              ]}
            />
          </div>
          <div className="space-y-0.5 flex flex-col"> 
            <Label htmlFor="PreferredLanguage" >Preferred Language</Label>
            <SelectBar2 
              value={formDataContact.PreferredLanguage} 
              id="PreferredLanguage" 
              onChange={handlerInputContactChange} 
              placeholder="Select Preferred Language"
              options={[
                { id: "English", name: "English" },
                { id: "Spanish", name: "Spanish" },
                { id: "Bahasa Indonesia", name: "Bahasa Indonesia" },
              ]}
            />
          </div>
          <div className="space-y-0.5">
            <Label htmlFor="FirstName">First Name</Label>
            <Input value={formDataContact.FirstName} id="FirstName" type="text" className="p-1 border-b-black " onChange={handlerInputContactChange} />
          </div>
          <div className="space-y-0.5 ">
            <Label htmlFor="LastName">Last Name</Label>
            <Input value={formDataContact.LastName} id="LastName" type="text" className="p-1 border-b-black " onChange={handlerInputContactChange} />
          </div>
          <div className="space-y-0.5 col-span-2">
            <Label htmlFor="Email">Email</Label>
            <Input value={formDataContact.Email} id="Email" type="email" className="p-1 border-b-black" onChange={handlerInputContactChange} />
          </div>
          {/* <div className="space-y-0.4 ml-5">
            <Label htmlFor="new">EXTN</Label>
            <Input id="new" type="text" className="h-8 p-1 text-sm border-b-black w-73" />
          </div> */}
        </div>

        <DialogHeader>
          <DialogTitle className="text-md">Phone preferences</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-6 gap-2">
          <div className="space-y-0.4 col-span-2">
            <Label htmlFor="Phone">Phone</Label>
            <Input
             value={formDataContact.Phone} id="Phone" type="text" className="p-1 border-b-black" onChange={handlerInputContactChange} />
          </div>
          <div className="space-y-0.4 col-span-2">
            <Label htmlFor="Mobile">Mobile</Label>
            <Input
             value={formDataContact.Mobile} id="Mobile" type="text" className="p-1 border-b-black" onChange={handlerInputContactChange} />
          </div> 
          <div className="space-y-0.4">
            <Label htmlFor="WorkPhone">Work</Label>
            <Input
             value={formDataContact.WorkPhone} id="WorkPhone" type="text" className="p-1 border-b-black" onChange={handlerInputContactChange} />
          </div>
          <div className="space-y-0.4">
            <Label htmlFor="WorkExtension">Work EXTN</Label>
            <Input value={formDataContact.WorkExtension} id="WorkExtension" type="text" className="p-1 border-b-black" onChange={handlerInputContactChange} />
          </div>
          <div className="space-y-0.4">
            <Label htmlFor="OtherPhone">Other</Label>
            <Input value={formDataContact.OtherPhone} id="OtherPhone" type="text" className="p-1 border-b-black" onChange={handlerInputContactChange} />
          </div> 
          <div className="space-y-0.4 ">
            <Label htmlFor="OtherExtension"> Other EXTN</Label>
            <Input value={formDataContact.OtherExtension} id="OtherExtension" type="text" className="p-1 text-sm border-b-black" onChange={handlerInputContactChange} />
          </div>
          <div className="space-y-0.4 col-span-2">
            <Label htmlFor="Fax">FAX</Label>
            <Input value={formDataContact.Fax} id="Fax" type="text" className="p-1 border-b-black" onChange={handlerInputContactChange} />
          </div>
        </div>

        <DialogHeader className="flex-row items-center justify-between">
          <DialogTitle className="text-md">Address</DialogTitle>
          <Button className="text-gray-400 bg-white " onClick={handleCopyFromAccount}><Copy></Copy>Same in Account Adress </Button>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-0.4">
            <Label htmlFor="AddressLine1">Address Line 1</Label>
            <Input id="AddressLine1" type="text" value={formDataContact.AddressLine1 || ""} className="p-1 border-b-black" onChange={handlerInputContactChange} />
          </div>
          <div className="space-y-0.4 flex flex-col">
            <Label htmlFor="current">Country</Label>
            <SelectBar 
              id="Country" 
              value={formDataContact.Country || ""} 
              onChange={handlerInputContactChange}
              options={[
                { id: "id", name: "Indonesia" },
                { id: "my", name: "Malaysia" },
                { id: "sg", name: "Singapura" },
                { id: "uk", name: "Inggris" },
                { id: "cn", name: "Cina" }
              ]}
              placeholder="Select a Country"
            />
          </div>
          <div className="space-y-0.4 ">
            <Label htmlFor="AddressL
            ine2">Address Line 2</Label>
            <Input id="AddressLine2" value={formDataContact.AddressLine2 || ""} type="text" className="p-1 border-b-black" onChange={handlerInputContactChange} />
          </div>
          <div className="space-y-0.4 ">
            <Label htmlFor="ZipPostalCode">Zip/Postal Code</Label>
            <Input id="ZipPostalCode" value={formDataContact.ZipPostalCode || ""} type="text" className="p-1 border-b-black" onChange={handlerInputContactChange} />
          </div>
          <div className="space-y-0.4 ">
            <Label htmlFor="City">City</Label>
            <SelectBar 
              id="City" 
              value={formDataContact.City || ""} 
              className="p-1 text-sm border-b-black" 
              onChange={handlerInputContactChange} 
              options={cities} 
              placeholder="Select a City"
            />

            
          </div>
          <div className="space-y-0.4 ">
            <Label htmlFor="StateProvince">State/Province</Label>
            <SelectBar 
              id="StateProvince" 
              value={formDataContact.StateProvince || ""} 
              className="p-1 text-sm border-b-black" 
              onChange={handlerInputContactChange} 
              options={provinces}
              placeholder="Select a Province"
            />

            
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
        <Button variant="secondary" className="text-xl bg-white cursor-pointer w-30 drop-shadow-md border-1" onClick={handlerContactSubmit}>Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/**
 * TODO 
 * MAKE ROUTE FOR PRODUCT
 */
export function BtnModalAsset({
  typeSearch,
  contactID, 
  siteAccountID, 
  selectedContactForCase,
  selectedCompany,
  setSelectedAsset,
  selectedAsset,
  open : externalOpen,
  onOpenChange : externalOnChange,
}) {
  //set asset
  console.log("BtnModalAsset ContactID : ",contactID)
  const [assets, setAssets] = useState([])
  //prevent infinite loop of calling fetchDataAssets
  useEffect(() => {
    fetchDataAssets();
    fetchUnownedAssets();
  }, []); 

  //set search state
  const [searchAsset, setSearchAsset] = useState("");

  const [currentPage, setCurrentPage] = useState(null);

  const [totalPages, setTotalPages] = useState(null);

  //handle Change Input
  const handleSearchInputAssetsChange = (e) =>{
    const searchQuery = e.target.value;
    setSearchAsset(searchQuery);
  }
  const filteredAssets = searchAsset !== "" ? assets.filter(
    (asset) => 
      asset.SerialNumber?.toLowerCase().includes(searchAsset.toLowerCase()) || 
      asset.product_information?.ProductName?.toLowerCase().includes(searchAsset.toLowerCase()) || 
      asset.ProductNumber?.toLowerCase().includes(searchAsset.toLowerCase())
  ) : [];


  //handling dialog state
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAssetForCreatingAsset, setSelectedAssetForCreatingAsset] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const itemsPerPage = 10;
  const [unownedAssets, setUnownedAssets] = useState([]);
  const [loadingUnowned, setLoadingUnowned] = useState(false);
  const [searchUnowned, setSearchUnowned] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const open = externalOpen || isOpen;

  const handleChange = (value) => {
    if (externalOpen !== undefined) {
      externalOnChange?.(false);
    } else {
      setIsOpen(value);
    }
  };
  
  useEffect(() => {
    if (!contactID) return;
    fetchUnownedAssets();
    fetchDataAssets();
    console.log("selectedContactForCase : ",selectedContactForCase)
    console.log('ContactIDFromSelectedContact')
  }, [contactID, currentPage, searchAsset]);

  const fetchDataAssets = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await ApiCustomer.get(`/api/asset-information/kepemilikan`, {
        params: { page: currentPage, limit: itemsPerPage, search: searchAsset, contactID },
      });

      setAssets(response.data.data);
      // setSelectedAsset(response.data.data);
      setTotalPages(response.data.totalPages);
      return response.data.data;
    } catch (error) {
      setError("Failed to load asset data.");
      console.error("Error fetching assets:", error);
      return []; // ✅ Return an empty array instead of `undefined`
    } finally{
      setLoading(false);
    }
  };

  const fetchAssetTable = async (companyID = null, contactID = null) => {
    try {
      let query = '';
      if(companyID !== null){
        query += `SiteAccountID=${companyID}`
      }
      if(contactID !== null){
        if(companyID !== null) query += `&`
        query += `ContactID=${contactID}`
      }
      const response = await ApiCustomer.get(`/api/asset-information?${query}`);
      console.log("response Fetch Contacts: ", response.data)
      return response.data.data; // ✅ Return updated contacts
    } catch (error) {
      console.error("Error fetching contacts:", error);
      return [];
    }
  }
  
  
  const fetchUnownedAssets = async () => {
    setLoadingUnowned(true);
    try {
      console.log("Search Unowned : ",searchUnowned)
      const response = await ApiCustomer.get(`/api/asset-information/kepemilikan/unowned`, {
        params: {page: 1, limit: 10, search: searchUnowned},
      });
      setUnownedAssets(response.data.data);
    } catch (error) {
      console.error("Error fetching unowned assets:", error);
    }
    setLoadingUnowned(false);
  };

  const handleUpdateAsset = async () => {
    if (!selectedAssetForCreatingAsset) return;
  
    // Tampilkan loading menggunakan SweetAlert2
    Swal.fire({
      title: 'Memperbarui asset...',
      text: 'Mohon tunggu sebentar',
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
  
    try {
      const response = await ApiCustomer.patch(`/api/asset-information/kepemilikan/${selectedAssetForCreatingAsset.AssetID}`, {
        contactID,
        siteAccountID
      });
  
      if (response.status === 200) {
        const updatedAssets = await fetchAssetTable(siteAccountID, contactID);
        setSelectedAsset(updatedAssets);
        setIsOpen(false);
  
        // Tutup loading dan tampilkan alert sukses
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Asset berhasil diperbarui!',
          timer: 2000,
          showConfirmButton: false,
          allowEscapeKey: false,
        });
      }
    } catch (error) {
      // Tutup loading dan tampilkan alert error
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: 'Terjadi kesalahan saat memperbarui asset.',
        timer: 2000,
        showConfirmButton: false,
        allowEscapeKey: false,
      });
      console.error("Terjadi kesalahan : ", error);
    }
  };
  
  
  
  const handleSearch = async () => {
    setIsSearching(true);
    setCurrentPage(1);
    await fetchDataAssets();
    setIsSearching(false);
    await fetchUnownedAssets();
  };

  //handler check for creating product with frontdesk
  const [isCheckedForCreateProduct, setIsCheckedForCreateProduct] = useState(false);

  return (
    <Dialog open={open} onOpenChange={handleChange}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          // className="bg-white mt-0.5"
          className={`mt-0.5 ${(!selectedContactForCase && typeSearch !== 'individual') ? "bg-white cursor-not-allowed" : "bg-blue-500"}`} 
          onClick={() => setIsOpen(true)}
          disabled={!selectedContactForCase && typeSearch !== 'individual'} // 🔥 Button disabled if no contact selected
        >
          New Asset
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[800px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl">Asset Information</DialogTitle>
          <DialogDescription>Add Asset</DialogDescription>
          <Button className="self-end mr-2" variant="ghost">Clear All</Button>
        </DialogHeader>

        <DialogHeader>
          <DialogTitle className="text-md">Serial Number</DialogTitle>
        </DialogHeader>

        {/* <div className="flex gap-3">  
          <Input className="h-10 border-2 border-black rounded-2xl w-55 text-md" type="Search" onChange={handleSearchInputAssetsChange}></Input>
          <Button variant="outline" className="h-10 border-2 border-blue-600 w-30 rounded-2xl">Search</Button>
          
        </div> */}


        {/* <Table className="mx-auto table-fixed border-spacing-0">
          <TableHeader>
            <TableRow className="bg-blue-200">
              <TableHead className="text-black">Product Name</TableHead>
              <TableHead className="text-black">Product Number</TableHead>
              <TableHead className="text-black">HW Profit Center</TableHead>
              <TableHead className="text-black" colSpan="2">Contact</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody >
            {assets.length > 0 ? ( assets.map((asset) => (
              <TableRow key={asset?.AssetID}>
                <TableCell className="whitespace-break-spaces ">{asset?.product_information?.ProductName}</TableCell>
                <TableCell>{asset?.product_information?.ProductNumber}</TableCell>
                <TableCell>{asset?.HWPorfitCenter ? asset?.HWPorfitCenter : '-' }</TableCell>
                <TableCell>{asset?.contact_information !== null ? asset?.contact_information?.FirstName + ' ' + asset?.contact_information?.LastName : '-'   }</TableCell>
              </TableRow>
             )) ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="font-medium text-center whitespace-break-spaces"
                  >
                    Data Belum Tersedia
                  </TableCell>
                </TableRow>
              )}
          </TableBody>
        </Table> */}

        {/* <h3 className="mt-4 text-lg font-semibold">Unowned Assets</h3> */}
        
        <div className="flex items-center gap-3">
          <Input
            className="h-10 my-2 border-2 border-black rounded-2xl w-55 text-md"
            type="Search"
            value={searchUnowned}
            onChange={(e) => setSearchUnowned(e.target.value)}
          />
          <Button
            variant="search"
            className=""
            onClick={fetchUnownedAssets}
          >
            Search
          </Button>
          <div className="flex items-center mt-2">
          <Checkbox id="terms" className="w-5 h-5 border-2 border-black" checked={isCheckedForCreateProduct} onCheckedChange={setIsCheckedForCreateProduct} />
            <label
              htmlFor="terms"
              className="ml-2 font-medium leading-none text-md peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Not Available
            </label>
          </div>
          {isCheckedForCreateProduct && 
            <SnInput 
              unownedAssets={unownedAssets}
              setUnownedAssets={setUnownedAssets}
              fetchUnownedAssets={fetchUnownedAssets}
            />
          }
        </div>

        <Table className="mx-auto mt-2 table-fixed border-spacing-0">
          <TableHeader>
            <TableRow className="bg-gray-200">
              <TableHead>Serial Number</TableHead>
              <TableHead>Product Name</TableHead>
              <TableHead>Product Number</TableHead>
              <TableHead>Product Line</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loadingUnowned ? (
              <TableRow>
                <TableCell colSpan={4}>Loading...</TableCell>
              </TableRow>
            ) : unownedAssets.length > 0 ? (
              unownedAssets.map((asset) => (
                <TableRow
                  key={asset.AssetID}
                  onClick={() => setSelectedAssetForCreatingAsset(asset)}
                  className={`cursor-pointer hover:bg-gray-200 ${
                    selectedAsset?.AssetID === asset.AssetID ? "bg-blue-300" : ""
                  }`}
                >
                  <TableCell>{asset.SerialNumber}</TableCell>
                  <TableCell className={'whitespace-break-spaces'}>{asset.product_information?.ProductName}</TableCell>
                  <TableCell>{asset.ProductNumber}</TableCell>
                  <TableCell>{asset.product_information?.ProductLine}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4}>No Unowned Assets Available</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <div className="flex justify-end gap-2 mt-2">
          <Button
            variant="search"
            className=""
            onClick={handleUpdateAsset}
            disabled={isUpdating || !selectedAssetForCreatingAsset}
          >
            {isUpdating ? "Processing..." : "Select"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
};

//? MODAL FOR MASTER SITE

export function AssetEdit ({ assetId, onUpdate }) {
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
    } catch (error) {
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
    if (!serialNumber || !productName || !productNumber) {
      Swal.fire({
        icon: 'warning',
        title: 'Warning!',
        text: 'Please fill in all fields before submitting.',
        timer: 1100,
        timerProgressBar: false,
        showConfirmButton: false,
        allowEscapeKey: false,
      });
      return;
    }
  
    try {
      await ApiCustomer.patch(`/api/asset-information/${assetId}`, {
        SerialNumber: serialNumber,
        ProductName: productName,
        ProductNumber: productNumber,
        ProductLine: productLine,
      });
  
      // ✅ Tambahan SweetAlert berhasil update
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Asset information updated successfully.',
        timer: 1500,
        showConfirmButton: false,
        allowEscapeKey: false,
      });
  
      onUpdate();       // refresh data
      setIsOpen(false); // tutup modal
  
    } catch (error) {
      console.error("Error updating asset:", error);
  
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: 'An error occurred while updating the asset.',
        allowEscapeKey: false,
      });
    }
  };
  

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button  variant="outline" onClick={() => { setIsOpen(true); fetchAsset(); }}>
          <Pencil />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Asset Information</DialogTitle>
          <DialogDescription>
            Update the details of the asset. Fields marked with * are required.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <Input value={serialNumber} onChange={(e) => setSerialNumber(e.target.value)} placeholder="Serial Number*" />
          <Input value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="Product Name*" />
          <Input value={productNumber} onChange={(e) => setProductNumber(e.target.value)} placeholder="Product Number*" />
          <Input value={productLine} onChange={(e) => setProductLine(e.target.value)} placeholder="Product Line" />
        </div>
        <DialogFooter>
          <Button onClick={handleUpdate}>Update</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export function AssetDelete ({ assetId }) {
  const handleDelete = async () => {
    const result = await Swal.fire({
      title: 'Apakah Anda yakin?',
      text: "Data ini akan dihapus secara permanen dan tidak bisa dibatalkan.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal',
    });
  
    if (result.isConfirmed) {
      try {
        const response = await ApiCustomer.delete(`/api/asset-information/${assetId}`);
  
        if (response.status === 409 || response.data.success === false) {
          return Swal.fire({
            icon: 'warning',
            title: 'Tidak Bisa Dihapus!',
            text: response.data.message || 'Data ini memiliki keterkaitan dan tidak dapat dihapus.',
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false,
            allowEscapeKey: false,
          });
        }
  
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Data berhasil dihapus.',
          timer: 1500,
          timerProgressBar: true,
          showConfirmButton: false,
          allowEscapeKey: false,
        }).then(() => {
          window.location.reload();
        });
        
        if (onUpdate) onUpdate();
  
      } catch (error) {
        const message = error?.response?.data?.message;
        if (error?.response?.status === 409) {
          Swal.fire({
            icon: 'warning',
            title: 'Tidak Bisa Dihapus!',
            text: message || 'Data ini memiliki keterkaitan dan tidak dapat dihapus.',
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false,
            allowEscapeKey: false,
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Gagal Menghapus!',
            text: 'Terjadi kesalahan saat menghapus data. Silakan coba lagi.',
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false,
            allowEscapeKey: false,
          });
        }
      }
    }
  };
  
  return (
    <Button 
      variant="outline" 
      className="text-red-500 hover:text-red-700" 
      onClick={handleDelete} >
      <Trash />
    </Button>
  );  
};

export function CompanyEdit({ siteAccountId, onUpdate }) {
  const [company, setCompany] = useState(null);
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [primaryPhone, setPrimaryPhone] = useState("");
  const [whatsappNo, setWhatsappNo] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [stateProvince, setStateProvince] = useState("");
  const [country, setCountry] = useState("");
  const [zipPostalCode, setZipPostalCode] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const fetchCompany = async () => {
    if (!siteAccountId) return;
    try {
      const response = await ApiCustomer.get(`/api/site_account/${siteAccountId}`);
      const data = response.data.data;
      setCompany(data);
      setCompanyName(data?.Company || "");
      setEmail(data?.Email || "");
      setPrimaryPhone(data?.PrimaryPhone || "");
      setWhatsappNo(data?.WhatsappNo || "");
      setAddressLine1(data?.AddressLine1 || "");
      setAddressLine2(data?.AddressLine2 || "");
      setCity(data?.City || "");
      setStateProvince(data?.StateProvince || "");
      setCountry(data?.Country || "");
      setZipPostalCode(data?.ZipPostalCode || "");
    } catch (error) {
      console.error("Error fetching company information:", error);
    }
  };

  useEffect(() => {
    if (siteAccountId && isOpen) {
      fetchCompany();
    }
  }, [siteAccountId, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setCompanyName("");
      setEmail("");
      setPrimaryPhone("");
      setWhatsappNo("");
      setAddressLine1("");
      setAddressLine2("");
      setCity("");
      setStateProvince("");
      setCountry("");
      setZipPostalCode("");
    }
  }, [isOpen]);

  const handleUpdate = async () => {
    if (!companyName || !email || !primaryPhone || !addressLine1 || !city || !country || !zipPostalCode) {
      Swal.fire({
        title: "Incomplete Data",
        text: "Please fill in all fields before submitting.",
        icon: "warning",
        timer: 1100,
        timerProgressBar: true,
        showConfirmButton: false,
        allowEscapeKey: false,
      });
      return;
    }
  
    try {
      await ApiCustomer.patch(`/api/site_account/${siteAccountId}`, {
        Company: companyName,
        Email: email,
        PrimaryPhone: primaryPhone,
        WhatsappNo: whatsappNo,
        AddressLine1: addressLine1,
        AddressLine2: addressLine2,
        City: city,
        StateProvince: stateProvince,
        Country: country,
        ZipPostalCode: zipPostalCode,
      });
  
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Company information updated successfully.',
        timer: 1500,
        showConfirmButton: false,
        allowEscapeKey: false,
      });
  
      onUpdate();
      setIsOpen(false);
      
    } catch (error) {
      console.error("Error updating company:", error);
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: 'An error occurred while updating company information.',
        allowEscapeKey: false,
        timer: 1500,
      });
    }
  };
  

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={() => { setIsOpen(true); fetchCompany(); }}>
          <Pencil />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Company Information</DialogTitle>
          <DialogDescription>
            Update the details of the company. Fields marked with * are required.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <Input value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Company Name *" />
          <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email *" />
          <Input value={primaryPhone} onChange={(e) => setPrimaryPhone(e.target.value)} placeholder="Primary Phone *" />
          <Input value={whatsappNo} onChange={(e) => setWhatsappNo(e.target.value)} placeholder="Whatsapp No *" />
          <Input value={addressLine1} onChange={(e) => setAddressLine1(e.target.value)} placeholder="Address Line 1 *" />
          <Input value={addressLine2} onChange={(e) => setAddressLine2(e.target.value)} placeholder="Address Line 2" />
          <Input value={city} onChange={(e) => setCity(e.target.value)} placeholder="City *" />
          <Input value={stateProvince} onChange={(e) => setStateProvince(e.target.value)} placeholder="State/Province" />
          <Input value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Country *" />
          <Input value={zipPostalCode} onChange={(e) => setZipPostalCode(e.target.value)} placeholder="Zip/Postal Code *" />
        </div>
        <DialogFooter>
          <Button onClick={handleUpdate}>Update</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export function CompanyDelete ({ siteAccountId, isModalOpen, setIsModalOpen, onUpdate }) {
const handleDelete = async () => {
  const result = await Swal.fire({
    title: 'Apakah Anda yakin?',
    text: "Data ini akan dihapus secara permanen dan tidak bisa dibatalkan.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Ya, hapus!',
    cancelButtonText: 'Batal',
  });

  if (result.isConfirmed) {
    try {
      const response = await ApiCustomer.delete(`/api/site_account/${siteAccountId}`);

      if (response.status === 409 || response.data.success === false) {
        return Swal.fire({
          icon: 'warning',
          title: 'Tidak Bisa Dihapus!',
          text: response.data.message || 'Data ini memiliki keterkaitan dan tidak dapat dihapus.',
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
          allowEscapeKey: false,
        });
      }

      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Data berhasil dihapus.',
        timer: 1500,
        timerProgressBar: true,
        showConfirmButton: false,
        allowEscapeKey: false,
      }).then(() => {
        window.location.reload();
      });
      
      if (onUpdate) onUpdate();

    } catch (error) {
      const message = error?.response?.data?.message;
      if (error?.response?.status === 409) {
        Swal.fire({
          icon: 'warning',
          title: 'Tidak Bisa Dihapus!',
          text: message || 'Data ini memiliki keterkaitan dan tidak dapat dihapus.',
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
          allowEscapeKey: false,
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Gagal Menghapus!',
          text: 'Terjadi kesalahan saat menghapus data. Silakan coba lagi.',
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
          allowEscapeKey: false,
        });
      }
    }
  }
};

return (
  <Button 
    variant="outline" 
    className="text-red-500 hover:text-red-700" 
    onClick={handleDelete}
  >
    <Trash />
  </Button>
);

};

export function ContactEdit({ contactID, onUpdate }) {
  const [contact, setContact] = useState(null);
  const [salutation, setSalutation] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [preferredLanguage, setPreferredLanguage] = useState("");
  const [phone, setPhone] = useState("");
  const [mobile, setMobile] = useState("");
  const [workPhone, setWorkPhone] = useState("");
  const [workExtension, setWorkExtension] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [stateProvince, setStateProvince] = useState("");
  const [country, setCountry] = useState("");
  const [zipPostalCode, setZipPostalCode] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const fetchContact = async () => {
    if (!contactID) return;
    try {
      const response = await ApiCustomer.get(`/api/contact-information/${contactID}`);
      const data = response.data.data;
      setContact(data);
      setSalutation(data?.Salutation || "");
      setFirstName(data?.FirstName || "");
      setLastName(data?.LastName || "");
      setEmail(data?.Email || "");
      setPreferredLanguage(data?.PreferredLanguage || "");
      setPhone(data?.Phone || "");
      setMobile(data?.Mobile || "");
      setWorkPhone(data?.WorkPhone || "");
      setWorkExtension(data?.WorkExtension || "");
      setAddressLine1(data?.AddressLine1 || "");
      setAddressLine2(data?.AddressLine2 || "");
      setCity(data?.City || "");
      setStateProvince(data?.StateProvince || "");
      setCountry(data?.Country || "");
      setZipPostalCode(data?.ZipPostalCode || "");
    } catch (error) {
      console.error("Error fetching contact information:", error);
    }
  };

  useEffect(() => {
    if (contactID && isOpen) {
      fetchContact();
    }
  }, [contactID, isOpen]);

  const handleUpdate = async () => {
    if (!firstName || !lastName || !email || !phone || !city || !country) {
      Swal.fire({
        title: "Incomplete Data",
        text: "Please fill in all fields before submitting.",
        icon: "warning",
        timer: 1100,
        timerProgressBar: true,
        showConfirmButton: false,
        allowEscapeKey: false,
      });  
      return;
    }
  
    try {
      await ApiCustomer.patch(`/api/contact-information/${contactID}`, {
        Salutation: salutation,
        FirstName: firstName,
        LastName: lastName,
        Email: email,
        PreferredLanguage: preferredLanguage,
        Phone: phone,
        Mobile: mobile,
        WorkPhone: workPhone,
        WorkExtension: workExtension,
        AddressLine1: addressLine1,
        AddressLine2: addressLine2,
        City: city,
        StateProvince: stateProvince,
        Country: country,
        ZipPostalCode: zipPostalCode,
      });
  
      // ✅ Tampilkan notifikasi berhasil
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Contact information updated successfully.',
        timer: 1500,
        showConfirmButton: false,
        allowEscapeKey: false,
      });
  
      onUpdate();       // perbarui data di tampilan
      setIsOpen(false); // tutup modal
  
    } catch (error) {
      console.error("Error updating contact:", error);
  
      // ❌ Tampilkan notifikasi gagal
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: 'An error occurred while updating contact information.',
        allowEscapeKey: false,
      });
    }
  };
  

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={() => { setIsOpen(true); fetchContact(); }}>
          <Pencil />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Contact Information</DialogTitle>
          <DialogDescription>
            Update the details of the contact. Fields marked with * are required.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <Input value={salutation} onChange={(e) => setSalutation(e.target.value)} placeholder="Salutation" />
          <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First Name *" />
          <Input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last Name *" />
          <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email *" />
          <Input value={preferredLanguage} onChange={(e) => setPreferredLanguage(e.target.value)} placeholder="Preferred Language" />
          <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone *" />
          <Input value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="Mobile" />
          <Input value={workPhone} onChange={(e) => setWorkPhone(e.target.value)} placeholder="Work Phone" />
          <Input value={workExtension} onChange={(e) => setWorkExtension(e.target.value)} placeholder="Work Extension" />
          <Input value={addressLine1} onChange={(e) => setAddressLine1(e.target.value)} placeholder="Address Line 1" />
          <Input value={addressLine2} onChange={(e) => setAddressLine2(e.target.value)} placeholder="Address Line 2" />
          <Input value={city} onChange={(e) => setCity(e.target.value)} placeholder="City *" />
          <Input value={stateProvince} onChange={(e) => setStateProvince(e.target.value)} placeholder="State/Province" />
          <Input value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Country *" />
          <Input value={zipPostalCode} onChange={(e) => setZipPostalCode(e.target.value)} placeholder="Zip/Postal Code *" />
        </div>
        <DialogFooter>
          <Button onClick={handleUpdate}>Update</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export function ContactDelete ({ contactID }) {
  const handleDelete = async () => {
    const result = await Swal.fire({
      title: 'Apakah Anda yakin?',
      text: "Data kontak akan dihapus secara permanen.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal',
    });
  
    if (result.isConfirmed) {
      try {
        await ApiCustomer.delete(`/api/contact-information/${contactID}`);
        await Swal.fire('Berhasil!', 'Kontak berhasil dihapus.', 'success');
        window.location.reload();
      } catch (error) {
        console.error("Error deleting contact:", error);
        await Swal.fire('Gagal!', 'Terjadi kesalahan saat menghapus.', 'error');
      }
    }
  };
  
  return (
    <Button 
      variant="outline" 
      className="text-red-500 hover:text-red-700" 
      onClick={handleDelete}>
      <Trash />
    </Button>
  );
};

export function ProductAdd() {
  // Form Product
  const [formDataProduct, setFormDataProduct] = useState({
    ProductNumber: '',
    ProductLine: '',
    ProductName: '',
    ProductTypeID: '', // <- penting!
  });

  // List ProductType untuk dropdown
  const [productTypes, setProductTypes] = useState([]);

  // Ambil data product type saat pertama render
  useEffect(() => {
    async function fetchProductTypes() {
      try {
        const response = await ApiCustomer.get("/api/product-type");
        setProductTypes(response.data.data || []);
      } catch (err) {
        console.error("Failed to fetch product types:", err);
      }
    }
    fetchProductTypes();
  }, []);

  // Input Handler
  const handlerInputProduct = (e) => {
    const { id, value } = e.target;
    setFormDataProduct(prev => ({ ...prev, [id]: value }));
  };

  // Submit Handler
  const handlerProduct = async () => {
    const { ProductNumber, ProductLine, ProductName, ProductTypeID } = formDataProduct;

    if (!ProductNumber || !ProductLine || !ProductName || !ProductTypeID) {
      Swal.fire({
        title: "Incomplete Data",
        text: "Please fill in all fields before submitting.",
        icon: "warning",
        timer: 1500,
        timerProgressBar: true,
        showConfirmButton: false,
        allowEscapeKey: false,
      });
      return;
    }

    try {
      const response = await ApiCustomer.post("/api/product-information", formDataProduct);
      console.log("Success:", response.data);
      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Product berhasil disimpan.',
        timer: 1200,
        timerProgressBar: true,
        showConfirmButton: false,
        allowEscapeKey: false,
      }).then(() => window.location.reload());
    } catch (err) {
      console.error("Error saving product:", err);
      Swal.fire({
        title: "Error!",
        text: "Failed to save Product. Please try again.",
        icon: "error",
        timer: 1200,
        timerProgressBar: true,
        showConfirmButton: false,
        allowEscapeKey: false,
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="ml-2 rounded-sm h-11">Product Add</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Product Information</DialogTitle>
          <DialogDescription>Fields marked with * are required.</DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <Label>Product Number *</Label>
          <Input type="text" id="ProductNumber" value={formDataProduct.ProductNumber} onChange={handlerInputProduct} />

          <Label>Product Line *</Label>
          <Input type="text" id="ProductLine" value={formDataProduct.ProductLine} onChange={handlerInputProduct} />

          <Label>Product Name *</Label>
          <Input type="text" id="ProductName" value={formDataProduct.ProductName} onChange={handlerInputProduct} />

          <Label>Product Type *</Label>
          <Select
            value={formDataProduct.ProductTypeID?.toString() || ""}
            onValueChange={(value) =>
              setFormDataProduct((prev) => ({
                ...prev,
                ProductTypeID: parseInt(value),
              }))
          }>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Product Type" />
            </SelectTrigger>
            <SelectContent>
              {productTypes.map((type) => (
                <SelectItem key={type.ProductTypeID} value={type.ProductTypeID.toString()}>
                  {type.ProductType}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <DialogFooter>
          <Button onClick={handlerProduct}>Add</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export function ProductEdit({ ProductNumber, onUpdate }) {
  const [products, setProducts] = useState(null);
  const [productLine, setProductLine] = useState("");
  const [productName, setProductName] = useState("");
  const [productTypeID, setProductTypeID] = useState("");
  const [productTypes, setProductTypes] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const fetchProducts = async () => {
    if (!ProductNumber) return;
    try {
      const response = await ApiCustomer.get(`/api/product-information/${ProductNumber}`);
      const data = response.data.data;
      setProducts(data);
      setProductLine(data?.ProductLine || "");
      setProductName(data?.ProductName || "");
      setProductTypeID(data?.ProductTypeID || "");
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };

  const fetchProductTypes = async () => {
    try {
      const response = await ApiCustomer.get("/api/product-type");
      setProductTypes(response.data.data);
    } catch (error) {
      console.error("Error fetching product types:", error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchProducts();
      fetchProductTypes();
    }
  }, [ProductNumber, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setProductLine("");
      setProductName("");
      setProductTypeID("");
    }
  }, [isOpen]);

  const handleUpdate = async () => {
    if (!productLine || !productName || !productTypeID) {
      Swal.fire({
        title: "Incomplete Data",
        text: "Please fill in all fields before submitting.",
        icon: "warning",
        timer: 1200,
        timerProgressBar: true,
        showConfirmButton: false,
        allowEscapeKey: false,
      });
      return;
    }
  
    try {
      await ApiCustomer.patch(`/api/product-information/${ProductNumber}`, {
        ProductLine: productLine,
        ProductName: productName,
        ProductTypeID: parseInt(productTypeID),
      });
  
      // ✅ Notifikasi jika berhasil
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Product information updated successfully.',
        timer: 1500,
        showConfirmButton: false,
        allowEscapeKey: false,  
      });
  
      onUpdate();     // refresh data
      setIsOpen(false); // tutup modal
  
    } catch (error) {
      console.error("Error updating product:", error);
  
      // ❌ Notifikasi jika gagal
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: 'An error occurred while updating product information.',
        allowEscapeKey: false,
        timer: 1500,
      });
    }
  };
  

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={() => setIsOpen(true)}>
          <Pencil />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Product Information</DialogTitle>
          <DialogDescription>Update the details of the product. Fields marked with * are required.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <Input value={productLine} onChange={(e) => setProductLine(e.target.value)} placeholder="Product Line*" />
          <Input value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="Product Name*" />
          <Select value={productTypeID} onValueChange={setProductTypeID}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Product Type" />
          </SelectTrigger>
          <SelectContent>
            {productTypes.map((type) => (
              <SelectItem key={type.ProductTypeID} value={String(type.ProductTypeID)}>
                {type.ProductType}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        </div>
        <DialogFooter>
          <Button onClick={handleUpdate}>Update</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export function ProductDelete ({ ProductNumber, isModalOpen, setIsModalOpen, onUpdate }) {
  //set modal
  const handleDelete = async () => {
    const result = await Swal.fire({
      title: 'Apakah Anda yakin?',
      text: "Product ini akan dihapus secara permanen dan tidak bisa dibatalkan.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal',
    });
  
    if (result.isConfirmed) {
      try {
        const response = await ApiCustomer.delete(`/api/product-information/${ProductNumber}`);
  
        console.log("Server Response:", response.data);
        if (response.status === 409 || response.data.success === false) {
          // 🚨 Restriction triggered - Show alert message
          Swal.fire({
            icon: 'warning',
            title: 'Tidak Bisa Dihapus!',
            text: response.data.message || "Product ini memiliki keterkaitan dan tidak dapat dihapus.",
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false,
          });
          return;
        }
  
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Product berhasil dihapus.',
          timer: 1500,
          timerProgressBar: true,
          showConfirmButton: false,
        }).then(() => {
          // Refresh table or take any action after successful deletion
          if (onUpdate) {
            onUpdate();
          }
        });
  
      } catch (error) {
        if (error.response && error.response.status === 409) {
          // 🚨 Handle 409 Conflict error from backend
          Swal.fire({
            icon: 'warning',
            title: 'Tidak Bisa Dihapus!',
            text: error.response.data.message || "Product ini memiliki keterkaitan dan tidak dapat dihapus.",
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false,
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Gagal Menghapus!',
            text: 'Terjadi kesalahan saat menghapus product. Silakan coba lagi.',
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false,
          });
        }
      }
    }
  };
  
  return (
    <Button variant="outline" className="text-red-500 hover:text-red-700" onClick={handleDelete}>
      <Trash />
    </Button>
  );
};

export function ProductTypeAdd () {
  // Form ProductType
   const [formDataProductType, setFormDataProductType] = useState({
     ProductGroup: '',
     ProductTower: '',
     ProductType: '',
    })
    
    // Make Handler ProductType
    const handlerInputProductType = (e) => {
      const { id, value } = e.target
      setFormDataProductType(prevState => ({
        ...prevState,
        [id]:value
      }));
    };

    // Handler Submit
    const handlerProductType = async () => {
      const { ProductTower, ProductGroup, ProductType } = formDataProductType;
    
      if (!ProductTower || !ProductGroup || !ProductType) {
        Swal.fire({
          title: "Incomplete Data",
          text: "Please fill in all fields before submitting.",
          icon: "warning",
          timer: 1500,
          timerProgressBar: true,
          showConfirmButton: false,
          allowEscapeKey: false,
        });
        return;
      }
    
      try {
        const response = await ApiCustomer.post("/api/product-type", formDataProductType);
        console.log("Success:", response.data);
    
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Product Type berhasil disimpan.',
          timer: 1200,
          timerProgressBar: true,
          showConfirmButton: false,
          allowEscapeKey: false,
        }).then(() => {
          window.location.reload();
        });

      } catch (err) {
        console.error("Error saving product type: ", err);
    
        Swal.fire({
          title: "Error!",
          text: "Failed to save ProductType. Please try again.",
          icon: "error",
          timer: 1200,
          timerProgressBar: true,
          showConfirmButton: false,
          allowEscapeKey: false,
        });
      }
    };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="ml-2 rounded-sm h-11"> ProductType Add</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add ProductType Information</DialogTitle>
          <DialogDescription>
            Add the productType Fields marked with * are required.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
   
          <Label>Product Tower</Label>
          <Select  value={formDataProductType.ProductTower} onValueChange={(value) =>
    setFormDataProductType((prev) => ({ ...prev, ProductTower: value }))
  }>
                      <SelectTrigger className="w-full col-span-3">
                        <SelectValue placeholder="Product Tower"/>
                      </SelectTrigger>
                      <SelectContent >
                        <SelectGroup>
                          <SelectLabel>Product tower</SelectLabel>
                          {/* <SelectItem value="">.</SelectItem> */}
                          <SelectItem value="PSG">PSG</SelectItem>
                          <SelectItem value="IPG">IPG</SelectItem>
                        </SelectGroup>
                      </SelectContent>
            </Select>

          <Label>Product Group</Label>
          <Select   value={formDataProductType.ProductGroup}
  onValueChange={(value) =>
    setFormDataProductType((prev) => ({ ...prev, ProductGroup: value }))
  }>
                      <SelectTrigger className="w-full col-span-3">
                        <SelectValue placeholder="Product Group"/>
                      </SelectTrigger>
                      <SelectContent >
                        <SelectGroup>
                          <SelectLabel>Product group</SelectLabel>
                          {/* <SelectItem value="">.</SelectItem> */}
                          <SelectItem value="Commercial">Commercial</SelectItem>
                          <SelectItem value="Consumer">Consumer</SelectItem>
                        </SelectGroup>
                      </SelectContent>
            </Select>

          <Label>Product Type</Label>
          <Input type="text" id="ProductType" className="p-2" value={formDataProductType.ProductType} onChange={handlerInputProductType} />
        </div>
        <DialogFooter>
          <Button onClick={handlerProductType}>Add</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
};

export function ProductTypeEdit({ ProductTypeID, onUpdate }) {
  const [producttypes, setProductTypes] = useState(null);
  const [productTower, setProductTower] = useState("");
  const [productGroup, setProductGroup] = useState("");
  const [productType, setProductType] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const fetchProductTypes = async () => {
    if (!ProductTypeID) return;
    try {
      const response = await ApiCustomer.get(`/api/product-type/${ProductTypeID}`);
      const data = response.data.data;
      setProductTypes(data);
      setProductTower(data?.ProductTower || "");
      setProductGroup(data?.ProductGroup || "");
      setProductType(data?.ProductType || "");
    } catch (error) {
      console.error("Error fetching productType information:", error);
    }
  };

  useEffect(() => {
    if (ProductTypeID && isOpen) {
      fetchProductTypes();
    }
  }, [ProductTypeID, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setProductTower("");
      setProductGroup("");
      setProductType("");
    }
  }, [isOpen]);

  const handleUpdate = async () => {
    if (!productTower || !productGroup || !productType) {
      Swal.fire({
        title: "Incomplete Data",
        text: "Please fill in all fields before submitting.",
        icon: "warning",
        timer: 1100,
        timerProgressBar: true,
        showConfirmButton: false,
        allowEscapeKey: false,
      });  
      return;
    }
  
    try {
      await ApiCustomer.patch(`/api/product-type/${ProductTypeID}`, {
        ProductTower: productTower,
        ProductGroup: productGroup,
        ProductType: productType,
      });
  
      // ✅ Notifikasi sukses
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Product type updated successfully.',
        timer: 1500,
        showConfirmButton: false,
        allowEscapeKey: false,
      });
  
      onUpdate();      // Refresh data parent
      setIsOpen(false); // Tutup modal
  
    } catch (error) {
      console.error("Error updating productType:", error);
  
      // ❌ Notifikasi error
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: 'An error occurred while updating product type.',
        allowEscapeKey: false, 
      });
    }
  };
  

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={() => { setIsOpen(true); fetchProductTypes(); }}>
          <Pencil />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit ProductType Information</DialogTitle>
          <DialogDescription>
            Update the details of the productType Fields marked with * are required.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
   
        <Label>Product Tower</Label>
        <Select
  value={productTower}
  onValueChange={(value) => setProductTower(value)}
>
  <SelectTrigger className="w-full col-span-3">
    <SelectValue placeholder="Product Tower" />
  </SelectTrigger>
  <SelectContent>
    <SelectGroup>
      <SelectLabel>Product Tower</SelectLabel>
      <SelectItem value="PSG">PSG</SelectItem>
      <SelectItem value="IPG">IPG</SelectItem>
    </SelectGroup>
  </SelectContent>
</Select>

        <Label>Product Group</Label>
        <Select
  value={productGroup}
  onValueChange={(value) => setProductGroup(value)}
>
  <SelectTrigger className="w-full col-span-3">
    <SelectValue placeholder="Product Tower" />
  </SelectTrigger>
  <SelectContent>
    <SelectGroup>
      <SelectLabel>Product Group</SelectLabel>
      <SelectItem value="Commercial">Commercial</SelectItem>
      <SelectItem value="Consumer">Consumer</SelectItem>
    </SelectGroup>
  </SelectContent>
</Select>


        <Label>Product Type</Label>
        <Input type="text" id="ProductType" value={productType} onChange={(e) => setProductType(e.target.value)} />
      </div>
        <DialogFooter>
          <Button onClick={handleUpdate}>Update</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export function ProductTypeDelete ({ ProductTypeID, isModalOpen, setIsModalOpen, onUpdate }) {
  const handleDelete = async () => {
    const result = await Swal.fire({
      title: 'Apakah Anda yakin?',
      text: "Product Type ini akan dihapus secara permanen dan tidak bisa dibatalkan.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal',
    });
  
    if (result.isConfirmed) {
      try {
        const response = await ApiCustomer.delete(`/api/product-type/${ProductTypeID}`);
  
        console.log("Server Response:", response.data);
        if (response.status === 409 || response.data.success === false) {
          // 🚨 Restriction triggered - Show alert message
          Swal.fire({
            icon: 'warning',
            title: 'Tidak Bisa Dihapus!',
            text: response.data.message || "ProductType ini memiliki keterkaitan dan tidak dapat dihapus.",
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false,
          });
          return;
        }
  
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'ProductType berhasil dihapus.',
          timer: 1500,
          timerProgressBar: true,
          showConfirmButton: false,
        }).then(() => {
          // ✅ Close the modal if it's open
          window.location.reload();
          // ✅ Refresh the table by calling `onUpdate()`
          if (onUpdate) {
            onUpdate();
          }
        });
      } catch (error) {
        if (error.response && error.response.status === 409) {
          // 🚨 Handle 409 Conflict error from backend
          Swal.fire({
            icon: 'warning',
            title: 'Tidak Bisa Dihapus!',
            text: error.response.data.message || "ProductType ini memiliki keterkaitan dan tidak dapat dihapus.",
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false,
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Gagal Menghapus!',
            text: 'Terjadi kesalahan saat menghapus ProductType. Silakan coba lagi.',
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false,
          });
        }
      }
    }
  };
  
  return (
    <Button variant="outline" className="text-red-500 hover:text-red-700" onClick={handleDelete}>
      <Trash />
    </Button>
  );
};

export function WarrantyServiceAdd () {
   const [formDataWarratyService, setFormDataWarrantyService] = useState({
    Service_offerID: '',
    Service_description: '',	
    CTat_RTime: '',
    Price: '',
    Shipping_Fee: '',
    qty_ws: '',
    Tax: '',
    Total: '',
    })
    
    // Make Handler ProductType
    const handlerInputWarrantyService = (e) => {
      const { id, value } = e.target
      setFormDataWarrantyService(prevState => ({
        ...prevState,
        [id]:value
      }));
    };

    // Handler Submit
    const handlerWarrantyService = async () => {
      const { 
        Service_offerID, Service_description, CTat_RTime, Price,
        Shipping_Fee, qty_ws, Tax, Total
      } = formDataWarratyService;
    
      if (!Service_offerID || !Service_description || !CTat_RTime || !Price || !Shipping_Fee || !qty_ws || !Tax || !Total) {
        Swal.fire({
          title: "Incomplete Data",
          text: "Please fill in all fields before submitting.",
          icon: "warning",
          timer: 1500,
          timerProgressBar: true,
          showConfirmButton: false,
          allowEscapeKey: false,
        });
        return;
      }
    
      try {
        const response = await ApiCustomer.post("/api/warranty-services", formDataWarratyService);
        console.log("Success:", response.data);
    
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Warranty Service berhasil disimpan.',
          timer: 1200,
          timerProgressBar: true,
          showConfirmButton: false,
          allowEscapeKey: false,
        }).then(() => {
          window.location.reload();
        });

      } catch (err) {
        console.error("Error saving warranty service: ", err);
    
        Swal.fire({
          title: "Error!",
          text: "Failed to save warranty service. Please try again.",
          icon: "error",
          timer: 1200,
          timerProgressBar: true,
          showConfirmButton: false,
          allowEscapeKey: false,
        });
      }
    };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="ml-2 rounded-sm h-11"> Warranty Service Add</Button>
      </DialogTrigger>
      <DialogContent className="h-[500px] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Warranty Service Information</DialogTitle>
          <DialogDescription>
            Add the warranty service Fields marked with * are required.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">

        <Label>Service Offer ID</Label>
        <Input type="text" id="Service_offerID" className="p-2" value={formDataWarratyService.Service_offerID} onChange={handlerInputWarrantyService} />
   
        <Label htmlFor="Service_description">Service Description</Label>
        <Textarea
          id="Service_description"
          placeholder="Masukkan deskripsi servis"
          className="mt-1"
          value={formDataWarratyService.Service_description}
          onChange={handlerInputWarrantyService}
        />

        <Label>Customer TAT / Response Time</Label>
        <Input type="text" id="CTat_RTime" className="p-2" value={formDataWarratyService.CTat_RTime} onChange={handlerInputWarrantyService} />

        <Label>Price</Label>
        <Input type="text" id="Price" className="p-2" value={formDataWarratyService.Price} onChange={handlerInputWarrantyService} />
        
        <Label>Shipping Fee</Label>
        <Input type="text" id="Shipping_Fee" className="p-2" value={formDataWarratyService.Shipping_Fee} onChange={handlerInputWarrantyService} />

        <Label>Quantity</Label>
        <Input type="number" id="qty_ws" className="p-2" value={formDataWarratyService.qty_ws} onChange={handlerInputWarrantyService} />
         
        <Label>Tax</Label>
        <Input type="text" id="Tax" className="p-2" value={formDataWarratyService.Tax} onChange={handlerInputWarrantyService} />

        <Label>Total</Label>
        <Input type="text" id="Total" className="p-2" value={formDataWarratyService.Total} onChange={handlerInputWarrantyService} />
        </div>
        <DialogFooter>
          <Button onClick={handlerWarrantyService}>Add</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
};

export function WarrantyServiceEdit({ Service_offerID, onUpdate }) {
  const [WarrantyService, setWarrantyService] = useState(null);
  const [Service_offerIDState, setService_offerIDState] = useState("");
  const [Service_description, setService_description] = useState("");
  const [CTat_RTime, setCTat_RTime] = useState("");
  const [Price, setPrice] = useState("");
  const [Shipping_Fee, setShipping_Fee] = useState("");
  const [qty_ws, setQty_ws] = useState("");
  const [Tax, setTax] = useState("");
  const [Total, setTotal] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const fetchWarrantyService = async () => {
    if (!Service_offerID) return;
    try {
      const response = await ApiCustomer.get(`/api/warranty-services/${Service_offerID}`);
      const data = response.data.data;
      setWarrantyService(data);
      setService_offerIDState(data?.Service_offerID || "");
      setService_description(data?.Service_description || "");
      setCTat_RTime(data?.CTat_RTime || "");
      setPrice(data?.Price || "");
      setShipping_Fee(data?.Shipping_Fee || "");
      setQty_ws(data?.qty_ws || "");
      setTax(data?.Tax || "");
      setTotal(data?.Total || "");

    } catch (error) {
      console.error("Error fetching Warranty Service information:", error);
    }
  };

  useEffect(() => {
    if (Service_offerID && isOpen) {
      fetchWarrantyService();
    }
  }, [Service_offerID, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setWarrantyService("");
      setService_description("");
      setCTat_RTime("");
      setPrice("");
      setShipping_Fee("");
      setQty_ws("");
      setTax("");
      setTotal("");
    }
  }, [isOpen]);

  const handleUpdate = async () => {
    if (
      !Service_offerIDState || !Service_description || !CTat_RTime || !Price ||
      !Shipping_Fee || !qty_ws || !Tax || !Total
    ) {
      Swal.fire({
        title: "Incomplete Data",
        text: "Please fill in all fields before submitting.",
        icon: "warning",
        timer: 1100,
        timerProgressBar: true,
        showConfirmButton: false,
        allowEscapeKey: false,  
      });  
      return;
    }
  
    try {
      // ⏳ Tampilkan loading saat proses update
      Swal.fire({
        title: "Updating...",
        text: "Please wait while saving data.",
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => Swal.showLoading(),
      });
  
      await ApiCustomer.patch(`/api/warranty-services/${Service_offerID}`, {
        Service_description,
        CTat_RTime,
        Price: parseFloat(Price),
        Shipping_Fee: parseFloat(Shipping_Fee),
        qty_ws: parseInt(qty_ws),
        Tax: parseFloat(Tax),
        Total: parseFloat(Total)
      });
  
      Swal.close(); // Tutup loading
  
      // ✅ Notifikasi sukses
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Warranty service updated successfully.',
        timer: 1500,
        showConfirmButton: false,
        allowEscapeKey: false,
      });
  
      onUpdate();
      setIsOpen(false);
  
    } catch (error) {
      console.error("Error updating Warranty Service:", error);
  
      Swal.close(); // Tutup loading jika error
  
      // ❌ Notifikasi error
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: 'An error occurred while updating warranty service.',
        allowEscapeKey: false,
      });
    }
  };
  

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={() => { setIsOpen(true); fetchWarrantyService(); }}>
          <Pencil />
        </Button>
      </DialogTrigger>
      <DialogContent className="h-[500px] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Warranty Service Information</DialogTitle>
          <DialogDescription>
            Update the details of the Warranty Service Fields marked with * are required.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">

<Label htmlFor="Service_description">Service Description</Label>
<Textarea
  id="Service_description"
  placeholder="Masukkan deskripsi servis"
  className="mt-1"
  value={Service_description} onChange={(e) => setService_description(e.target.value)}
/>

<Label>Customer TAT / Response Time</Label>
<Input type="text" id="CTat_RTime" className="p-2"  value={CTat_RTime} onChange={(e) => setCTat_RTime(e.target.value)} />

<Label>Price</Label>
<Input type="text" id="Price" className="p-2"  value={Price} onChange={(e) => setPrice(e.target.value)} />

<Label>Shipping Fee</Label>
<Input type="text" id="Shipping_Fee" className="p-2"  value={Shipping_Fee} onChange={(e) => setShipping_Fee(e.target.value)} />

<Label>Quantity</Label>
<Input type="number" id="qty_ws" className="p-2"  value={qty_ws} onChange={(e) => setQty_ws(e.target.value)} />
 
<Label>Tax</Label>
<Input type="text" id="Tax" className="p-2"  value={Tax} onChange={(e) => setTax(e.target.value)} />

<Label>Total</Label>
<Input type="text" id="Total" className="p-2"  value={Total} onChange={(e) => setTotal(e.target.value)}/>
</div>
        <DialogFooter>
          <Button onClick={handleUpdate}>Update</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export function WarrantyServiceDelete ({ Service_offerID, isModalOpen, setIsModalOpen, onUpdate }) {
  const handleDelete = async () => {
    const result = await Swal.fire({
      title: 'Apakah Anda yakin?',
      text: "Layanan Garansi ini akan dihapus secara permanen dan tidak bisa dibatalkan.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal',
    });
  
    if (result.isConfirmed) {
      try {
        const response = await ApiCustomer.delete(`/api/warranty-services/${Service_offerID}`);
        
        console.log("Server Response:", response.data);
        if (response.status === 409 || response.data.success === false) {
          // 🚨 Restriction triggered - Show alert message
          Swal.fire({
            icon: 'warning',
            title: 'Tidak Bisa Dihapus!',
            text: response.data.message || "Layanan Garansi ini memiliki keterkaitan dan tidak dapat dihapus.",
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false,
          });
          return;
        }
  
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Layanan Garansi berhasil dihapus.',
          timer: 1500,
          timerProgressBar: true,
          showConfirmButton: false,
        }).then(() => {
          // ✅ Close the modal if it's open
          window.location.reload();
          // ✅ Refresh the table by calling `onUpdate()`
          if (onUpdate) {
            onUpdate();
          }
        });
      } catch (error) {
        if (error.response && error.response.status === 409) {
          // 🚨 Handle 409 Conflict error from backend
          Swal.fire({
            icon: 'warning',
            title: 'Tidak Bisa Dihapus!',
            text: error.response.data.message || "Layanan Garansi ini memiliki keterkaitan dan tidak dapat dihapus.",
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false,
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Gagal Menghapus!',
            text: 'Terjadi kesalahan saat menghapus Layanan Garansi. Silakan coba lagi.',
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false,
          });
        }
      }
    }
  };
  
  return (
    <Button variant="outline" className="text-red-500 hover:text-red-700" onClick={handleDelete}>
      <Trash />
    </Button>
  );
};

export function MaterialOrderEdit({ MOID, onUpdate }) {
  const [MaterialOrder, setMaterialOrder] = useState(null);
  const [WOID,  setWOID] = useState("");
  const [OrderNumber,  setOrderNumber ] = useState("");
  const [OrderStatus, setOrderStatus] = useState("");
  const [OrderType, setOrderType] = useState("");
  const [CreatedOn, setCreatedOn] = useState("");
  const [SalesOrderNumber, setSalesOrderNumber] = useState("");
  const [RMANumber, setRMANumber] = useState("");
  const [ReadyForClosureDate,  setReadyForClosureDate] = useState("");
  const [Owner,  setOwner] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const fetchMaterialOrder = async () => {
    if (!MOID) return;
    try {
      const response = await ApiCustomer.get(`/api/mo-detaill/${MOID}`);
      const data = response.data.data;
  
      // Fungsi bantu untuk konversi ke yyyy-MM-dd
      const formatDate = (dateString) => {
        return dateString ? new Date(dateString).toISOString().split("T")[0] : "";
      };
  
      setMaterialOrder(data);
      setWOID(data?.WOID || "");
      setOrderNumber(data?.OrderNumber || "");
      setOrderStatus(data?.OrderStatus || "");
      setOrderType(data?.OrderType || "");
      setCreatedOn(formatDate(data?.CreatedOn));
      setSalesOrderNumber(data?.SalesOrderNumber || "");
      setRMANumber(data?.RMANumber || "");
      setReadyForClosureDate(formatDate(data?.ReadyForClosureDate));
      setOwner(data?.Owner || "");
  
    } catch (error) {
      console.error("Error fetching Material Order information:", error);
    }
  };
  

  useEffect(() => {
    if (MOID && isOpen) {
      fetchMaterialOrder();
    }
  }, [MOID, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setMaterialOrder("");
      setWOID("");
      setOrderNumber("");
      setOrderStatus("");
      setOrderType("");
      setCreatedOn("");
      setSalesOrderNumber("");
      setRMANumber("");
      setReadyForClosureDate("");
      setOwner("");
    }
  }, [isOpen]);

  const handleUpdate = async () => {
    if (
      !WOID || !OrderNumber || !OrderStatus || !OrderType ||
      !CreatedOn || !SalesOrderNumber || !RMANumber ||
      !ReadyForClosureDate || !Owner
    ) {
      Swal.fire({
        title: "Incomplete Data",
        text: "Please fill in all fields before submitting.",
        icon: "warning",
        timer: 1100,
        timerProgressBar: true,
        showConfirmButton: false,
        allowEscapeKey: false,
      });
      return;
    }
  
    try {
      // ⏳ Tampilkan loading
      Swal.fire({
        title: "Updating...",
        text: "Please wait while saving data.",
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => Swal.showLoading(),
      });
  
      await ApiCustomer.patch(`/api/mo-detaill/${MOID}`, {
        WOID,
        OrderNumber,
        OrderStatus,
        OrderType,
        CreatedOn,
        SalesOrderNumber,
        RMANumber,
        ReadyForClosureDate,
        Owner,
      });
  
      Swal.close(); // Tutup loading
  
      // ✅ Notifikasi sukses
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Material Order updated successfully.",
        timer: 1500,
        showConfirmButton: false,
        allowEscapeKey: false,
      });
  
      onUpdate();
      setIsOpen(false);
    } catch (error) {
      console.error("Error updating Material Order:", error);
  
      Swal.close(); // Tutup loading jika gagal
  
      // ❌ Notifikasi gagal
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: "An error occurred while updating Material Order.",
        allowEscapeKey: false,
      });
    }
  };
  

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={() => { setIsOpen(true); fetchMaterialOrder(); }}>
          <Pencil />
        </Button>
      </DialogTrigger>
      <DialogContent className="h-[500px] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Material Order Information</DialogTitle>
          <DialogDescription>
            Update the details of the Material Order Fields marked with * are required.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">


<Label>Order Number</Label>
<Input type="text" id="Order Number" className="p-2"  value={OrderNumber} onChange={(e) => setOrderNumber(e.target.value)} />

<Label>Order Status</Label>
<Input type="text" id="Order Status" className="p-2"  value={OrderStatus} onChange={(e) => setOrderStatus(e.target.value)} />

<Label>Order Type</Label>
<Input type="text" id="Order Type" className="p-2"  value={OrderType} onChange={(e) => setOrderType(e.target.value)} />
 
<Label>Created On</Label>
<Input type="date" id="Created On" className="p-2"  value={CreatedOn} onChange={(e) => setCreatedOn(e.target.value)} />

<Label>Sales Order Number</Label>
<Input type="text" id="Sales Order Number" className="p-2"  value={SalesOrderNumber} onChange={(e) => setSalesOrderNumber(e.target.value)}/>

<Label>RMANumber</Label>
<Input type="text" id="RMANumber" className="p-2"  value={RMANumber} onChange={(e) => setRMANumber(e.target.value)}/>

<Label>Ready For Closure Date</Label>
<Input type="date" id="Ready For Closure Date" className="p-2"  value={ReadyForClosureDate} onChange={(e) => setReadyForClosureDate(e.target.value)}/>

<Label>Owner</Label>
<Input type="text" id="Owner" className="p-2"  value={Owner} onChange={(e) => setOwner(e.target.value)}/>
</div>
        <DialogFooter>
          <Button onClick={handleUpdate}>Update</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export function MaterialOrderDelete ({ MOID, isModalOpen, setIsModalOpen, onUpdate }) {
  const handleDelete = async () => {
    const result = await Swal.fire({
      title: 'Apakah Anda yakin?',
      text: "Material Order ini akan dihapus secara permanen dan tidak bisa dibatalkan.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal',
    });
  
    if (result.isConfirmed) {
      try {
        const response = await ApiCustomer.delete(`/api/mo-detaill/${MOID}`);
        
        console.log("Server Response:", response.data);
        if (response.status === 409 || response.data.success === false) {
          // 🚨 Restriction triggered - Show alert message
          Swal.fire({
            icon: 'warning',
            title: 'Tidak Bisa Dihapus!',
            text: response.data.message || "Material Order ini memiliki keterkaitan dan tidak dapat dihapus.",
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false,
          });
          return;
        }
  
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Material Order berhasil dihapus.',
          timer: 1500,
          timerProgressBar: true,
          showConfirmButton: false,
        }).then(() => {
         window.location.reload();
          if (onUpdate) {
            onUpdate();
          }
        });
      } catch (error) {
        if (error.response && error.response.status === 409) {
          // 🚨 Handle 409 Conflict error from backend
          Swal.fire({
            icon: 'warning',
            title: 'Tidak Bisa Dihapus!',
            text: error.response.data.message || "Material Order ini memiliki keterkaitan dan tidak dapat dihapus.",
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false,
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Gagal Menghapus!',
            text: 'Terjadi kesalahan saat menghapus Material Order. Silakan coba lagi.',
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false,
          });
        }
      }
    }
  };
  
  return (
    <Button variant="outline" className="text-red-500 hover:text-red-700" onClick={handleDelete}>
      <Trash />
    </Button>
  );
};

export function WorkOrderEdit({ WOID, onUpdate }) {
  const [formData, setFormData] = useState({});
  const [isOpen, setIsOpen] = useState(false);

  const defaultFormData = {
    WorkOrderType: "",
    Priority: "",
    SystemStatus: "",
    SubStatus: "",
    PreferredDay: "",
    PreferredTime: "",
    ShipmentCountry: "",
    ShipmentState: "",
    CreatedOn: "",
    Owner: "",
    SLAJeopardy: "",
    DueDateCustomer: "",
    CoverageWindow: "",
    Response: "",
    OTCCode: "",
    RequestedDateTimeCustomer: "",
    GuaranteedFixTimeCustomer: "",
    EarlyStartDateTimeCustomer: "",
    LatestStartDateTimeCustomer: "",
    SLAReschedule: "",
    ActiveScheduleDate: "",
    SLAErrorDescription: "",
    CasePriorityIndex: "",
    PartnerStatus: "",
    WorkOrderDescription: "",
    PartnerNotes: "",
    IncomingChannel: "",
  };

  const formatDate = (dateString) => dateString ? new Date(dateString).toISOString().split("T")[0] : "";

  const fetchWorkOrder = async () => {
    if (!WOID) return;
    try {
      const response = await ApiCustomer.get(`/api/work-order/${WOID}`);
      const data = response.data.data || {};

      setFormData({
        WorkOrderType: data.WorkOrderType || "",
        Priority: data.Priority || "",
        SystemStatus: data.SystemStatus || "",
        SubStatus: data.SubStatus || "",
        PreferredDay: formatDate(data.PreferredDay),
        PreferredTime: formatDate(data.PreferredTime),
        ShipmentCountry: data.ShipmentCountry || "",
        ShipmentState: data.ShipmentState || "",
        CreatedOn: formatDate(data.CreatedOn),
        Owner: data.Owner || "",
        SLAJeopardy: data.SLAJeopardy || "",
        DueDateCustomer: formatDate(data.DueDateCustomer),
        CoverageWindow: data.CoverageWindow || "",
        Response: data.Response || "",
        OTCCode: data.OTCCode || "",
        RequestedDateTimeCustomer: formatDate(data.RequestedDateTimeCustomer),
        GuaranteedFixTimeCustomer: formatDate(data.GuaranteedFixTimeCustomer),
        EarlyStartDateTimeCustomer: formatDate(data.EarlyStartDateTimeCustomer),
        LatestStartDateTimeCustomer: formatDate(data.LatestStartDateTimeCustomer),
        SLAReschedule: data.SLAReschedule || "",
        ActiveScheduleDate: formatDate(data.ActiveScheduleDate),
        SLAErrorDescription: data.SLAErrorDescription || "",
        CasePriorityIndex: data.CasePriorityIndex || "",
        PartnerStatus: data.PartnerStatus || "",
        WorkOrderDescription: data.WorkOrderDescription || "",
        PartnerNotes: data.PartnerNotes || "",
        IncomingChannel: data.IncomingChannel || "",
      });
    } catch (error) {
      console.error("Error fetching Work Order information:", error);
    }
  };

  const resetForm = () => setFormData(defaultFormData);

  useEffect(() => {
    if (WOID && isOpen) {
      fetchWorkOrder();
    }
  }, [WOID, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target ? e.target.value : e,
    }));
  };

  const handleUpdate = async () => {
    const { WorkOrderType, Priority, SystemStatus } = formData;
  
    if (!WorkOrderType || !Priority || !SystemStatus) {
      Swal.fire({
        title: "Incomplete Data",
        text: "Please fill in all required fields.",
        icon: "warning",
        timer: 1200,
        timerProgressBar: true,
        showConfirmButton: false,
        allowEscapeKey: false,
      });
      return;
    }
  
    try {
      // ⏳ Tampilkan loading selama proses update
      Swal.fire({
        title: "Updating...",
        text: "Please wait while saving data.",
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => Swal.showLoading(),
      });
  
      await ApiCustomer.patch(`/api/work-order/${WOID}`, formData);
  
      Swal.close(); // Tutup loading
  
      // ✅ Notifikasi sukses
      Swal.fire({
        title: "Success!",
        text: "Data berhasil diperbarui.",
        icon: "success",
        timer: 1500,
        timerProgressBar: true,
        showConfirmButton: false,
        allowEscapeKey: false,
      });
  
      onUpdate();       // Refresh data
      setIsOpen(false); // Tutup modal/form
    } catch (error) {
      console.error("Error updating Work Order:", error);
  
      Swal.close(); // Tutup loading jika gagal
  
      // ❌ Notifikasi gagal
      Swal.fire({
        title: "Error",
        text: "Gagal memperbarui data!",
        icon: "error",
        timer: 1500,
        timerProgressBar: true,
        showConfirmButton: false,
        allowEscapeKey: false,
      });
    }
  };
  
  

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={() => { setIsOpen(true); fetchWorkOrder(); }}>
          <Pencil />
        </Button>
      </DialogTrigger>

      <DialogContent className="h-[500px] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Work Order Information</DialogTitle>
          <DialogDescription>
            Update the details of the Work Order. Fields marked with * are required.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          {[
            { label: "Work Order Type", id: "WorkOrderType", type: "text" },
            { label: "Priority", id: "Priority", type: "select", options: ["High", "Medium", "Low"] },
            { label: "System Status", id: "SystemStatus", type: "select", options: ["Open", "In Progress", "Closed"] },
            { label: "Sub Status", id: "SubStatus", type: "select", options: ["Pending", "Resolved", "Escalated"] },
            { label: "Preferred Day", id: "PreferredDay", type: "date" },
            { label: "Preferred Time", id: "PreferredTime", type: "datetime-local" },
            { label: "Shipment Country", id: "ShipmentCountry", type: "select", options: ["USA", "Canada", "Indonesia", "UK", "Germany", "France", "Japan", "China", "India", "Australia", "Brazil"] },
            { label: "Shipment State", id: "ShipmentState", type: "select", options: ["California", "Texas", "New York", "Florida"] },
            { label: "Created On", id: "CreatedOn", type: "date" },
            { label: "Owner", id: "Owner", type: "text" },
            { label: "SLA Jeopardy", id: "SLAJeopardy", type: "select", options: ["Yes", "No"] },
            { label: "Due Date Customer", id: "DueDateCustomer", type: "date" },
            { label: "Coverage Window", id: "CoverageWindow", type: "text" },
            { label: "Response", id: "Response", type: "text" },
            { label: "OTC Code", id: "OTCCode", type: "text" },
            { label: "Requested Date Time Customer", id: "RequestedDateTimeCustomer", type: "date" },
            { label: "Guaranteed Fix Time Customer", id: "GuaranteedFixTimeCustomer", type: "date" },
            { label: "Early Start Date Time Customer", id: "EarlyStartDateTimeCustomer", type: "date" },
            { label: "Latest Start Date Time Customer", id: "LatestStartDateTimeCustomer", type: "date" },
            { label: "SLA Reschedule", id: "SLAReschedule", type: "text" },
            { label: "Active Schedule Date", id: "ActiveScheduleDate", type: "date" },
            { label: "SLA Error Description", id: "SLAErrorDescription", type: "text" },
            { label: "Case Priority Index", id: "CasePriorityIndex", type: "text" },
            { label: "Partner Status", id: "PartnerStatus", type: "text" },
            { label: "Work Order Description", id: "WorkOrderDescription", type: "textarea" },
            { label: "Partner Notes", id: "PartnerNotes", type: "textarea" },
            { label: "Incoming Channel", id: "IncomingChannel", type: "select", options: ["Email", "Phone", "Chat"] },
          ].map(({ label, id, type, options }) => (
            <div key={id}>
              <Label>{label}</Label>
              {type === "select" ? (
                <Select onValueChange={handleChange(id)} value={formData[id]}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder={`Select ${label}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {options.map(option => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : type === "textarea" ? (
                <Textarea id={id} className="p-2" value={formData[id]} onChange={handleChange(id)} />
              ) : (
                <Input type={type} id={id} className="p-2" value={formData[id]} onChange={handleChange(id)} />
              )}
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button onClick={handleUpdate}>Update</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export function WorkOrderDelete ({ WOID, isModalOpen, setIsModalOpen, onUpdate }) {
  const handleDelete = async () => {
    const result = await Swal.fire({
      title: 'Apakah Anda yakin?',
      text: "Work Order ini akan dihapus secara permanen dan tidak bisa dibatalkan.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal',
    });
  
    if (result.isConfirmed) {
      try {
        const response = await ApiCustomer.delete(`/api/work-order/${WOID}`);
        
        console.log("Server Response:", response.data);
        if (response.status === 409 || response.data.success === false) {
          // 🚨 Restriction triggered - Show alert message
          Swal.fire({
            icon: 'warning',
            title: 'Tidak Bisa Dihapus!',
            text: response.data.message || "Work Order ini memiliki keterkaitan dan tidak dapat dihapus.",
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false,
          });
          return;
        }
  
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Work Order berhasil dihapus.',
          timer: 1500,
          timerProgressBar: true,
          showConfirmButton: false,
        }).then(() => {
          window.location.reload(); // Memuat ulang halaman
          if (onUpdate) {
            onUpdate();
          }
        });
      } catch (error) {
        if (error.response && error.response.status === 409) {
          // 🚨 Handle 409 Conflict error from backend
          Swal.fire({
            icon: 'warning',
            title: 'Tidak Bisa Dihapus!',
            text: error.response.data.message || "Work Order ini memiliki keterkaitan dan tidak dapat dihapus.",
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false,
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Gagal Menghapus!',
            text: 'Terjadi kesalahan saat menghapus Work Order. Silakan coba lagi.',
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false,
          });
        }
      }
    }
  };
  
  return (
    <Button variant="outline" className="text-red-500 hover:text-red-700" onClick={handleDelete}>
      <Trash />
    </Button>
  );
};

export function UserAdd({ onAdd }) {
  const [formData, setFormData] = useState({
    Email: "",
    Username: "",
    Password: "",
    Name: "",
    Role: "",
    ProfilePhoto: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewPhoto, setPreviewPhoto] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setPreviewPhoto(URL.createObjectURL(file));
  };

  const uploadImage = async () => {
    if (!selectedFile) return "";
    const formDataUpload = new FormData();
    formDataUpload.append("file", selectedFile);

    try {
      const res = await ApiCustomer.post("/api/upload", formDataUpload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data.url;
    } catch (error) {
      console.error("Upload failed:", error);
      return "";
    }
  };

  const handleSubmit = async () => {
    const { Email, Username, Password, Name } = formData;
    if (!Email || !Username || !Password || !Name) {
      Swal.fire({
        title: "Data tidak lengkap",
        text: "Silakan isi semua data wajib.",
        icon: "warning",
        timer: 1500,
        showConfirmButton: false,
        allowEscapeKey: false,
      });
      return;
    }

    try {
      const uploadedPhoto = await uploadImage();

      const payload = {
        ...formData,
        ProfilePhoto: uploadedPhoto,
      };

      await ApiCustomer.post("/api/user", payload);

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "User berhasil ditambahkan.",
        timer: 1500,
        showConfirmButton: false,
        allowEscapeKey: false,
      }).then(() => {
        window.location.reload(); // Memuat ulang halaman
      });

      onAdd?.(); // panggil callback jika ada
      setIsOpen(false);
      setFormData({ Email: "", Username: "", Password: "", Name: "", Role: "", ProfilePhoto: "" });
      setSelectedFile(null);
      setPreviewPhoto(null);
    } catch (err) {
      console.error("Gagal tambah user:", err);
      Swal.fire({
        title: "Error!",
        text: "Gagal menambahkan user.",
        icon: "error",
        timer: 1500,
        showConfirmButton: false,
        allowEscapeKey: false,
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="ml-2 rounded-sm h-11">Tambah User</Button>
      </DialogTrigger>

      <DialogContent className="h-[550px] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tambah Data User</DialogTitle>
          <DialogDescription>Isikan semua data pengguna baru dengan benar.</DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div>
            <Label>Email*</Label>
            <Input type="email" value={formData.Email} onChange={handleChange("Email")} />
          </div>
          <div>
            <Label>Username*</Label>
            <Input type="text" value={formData.Username} onChange={handleChange("Username")} />
          </div>
          <div>
            <Label>Password*</Label>
            <Input type="password" value={formData.Password} onChange={handleChange("Password")} />
          </div>
          <div>
            <Label>Nama*</Label>
            <Input type="text" value={formData.Name} onChange={handleChange("Name")} />
          </div>
          <div>
            <Label>Role</Label>
            <Input type="text" value={formData.Role} onChange={handleChange("Role")} placeholder="Contoh: admin / user" />
          </div>
          {/* <div>
            <Label>Foto Profil</Label>
            <Input type="file" accept="image/*" onChange={handleFileChange} />
            {previewPhoto && (
              <img src={previewPhoto} alt="Preview" className="object-cover w-24 h-24 mt-2 rounded-md" />
            )}
          </div> */}
        </div>

        <DialogFooter>
          <Button onClick={handleSubmit}>Simpan</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export function UserEdit({ IDUser, onUpdate }) {
  const [formData, setFormData] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [previewPhoto, setPreviewPhoto] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const defaultFormData = {
    Email: "",
    Username: "",
    Password: "",
    Name: "",
    Role: "",
    ProfilePhoto: "",
  };

  const fetchUser = async () => {
    if (!IDUser) return;
    try {
      const response = await ApiCustomer.get(`/api/user/${IDUser}`);
      const data = response.data.data || {};

      setFormData({
        Email: data.Email || "",
        Username: data.Username || "",
        Password: "",
        Name: data.Name || "",
        Role: data.Role || "",
        ProfilePhoto: data.ProfilePhoto || "",
      });

      setPreviewPhoto(data.ProfilePhoto || null);
    } catch (error) {
      console.error("Error fetching User information:", error);
    }
  };

  const resetForm = () => {
    setFormData(defaultFormData);
    setPreviewPhoto(null);
    setSelectedFile(null);
  };

  useEffect(() => {
    if (IDUser && isOpen) fetchUser();
  }, [IDUser, isOpen]);

  useEffect(() => {
    if (!isOpen) resetForm();
  }, [isOpen]);

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setPreviewPhoto(URL.createObjectURL(file));
  };

  const uploadImage = async () => {
    if (!selectedFile) return formData.ProfilePhoto;

    const formDataUpload = new FormData();
    formDataUpload.append("file", selectedFile);

    try {
      const res = await ApiCustomer.post("/api/upload", formDataUpload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data.url; // Asumsikan API mengembalikan URL foto
    } catch (error) {
      console.error("Image upload failed:", error);
      return formData.ProfilePhoto; // fallback
    }
  };

  const handleUpdate = async () => {
    const { Email, Username, Password, Name, Role } = formData;

    if (!Email || !Username || !Name) {
      Swal.fire({
        title: "Incomplete Data",
        text: "Please fill in all required fields.",
        icon: "warning",
        timer: 1200,
        timerProgressBar: true,
        showConfirmButton: false,
        allowEscapeKey: false,
      });
      return;
    }

    try {
      const uploadedPhotoURL = await uploadImage();

      const updatedData = {
        Email,
        Username,
        Name,
        Role,
        ProfilePhoto: uploadedPhotoURL,
      };

      if (Password) updatedData.Password = Password;

      await ApiCustomer.patch(`/api/user/${IDUser}`, updatedData);

      Swal.fire({
        title: "Success!",
        text: "Data berhasil diperbarui.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
        allowEscapeKey: false,  
      });

      onUpdate();
      setIsOpen(false);
    } catch (error) {
      console.error("Error updating user:", error);
      Swal.fire({
        title: "Error",
        text: "Gagal memperbarui data!",
        icon: "error",
        timer: 1500,
        showConfirmButton: false,
        allowEscapeKey: false,
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={() => { setIsOpen(true); fetchUser(); }}>
          <Pencil />
        </Button>
      </DialogTrigger>

      <DialogContent className="h-[500px] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit User Information</DialogTitle>
          <DialogDescription>
            Update the details of the user. Fields marked with * are required.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div>
            <Label>Email*</Label>
            <Input type="email" value={formData.Email} onChange={handleChange("Email")} />
          </div>
          <div>
            <Label>Username*</Label>
            <Input type="text" value={formData.Username} onChange={handleChange("Username")} />
          </div>
          {/* <div>
            <Label>Password</Label>
            <Input type="password" value={formData.Password} onChange={handleChange("Password")} placeholder="Kosongkan jika tidak ingin mengubah" />
          </div> */}
          <div>
            <Label>Name*</Label>
            <Input type="text" value={formData.Name} onChange={handleChange("Name")} />
          </div>
          <div>
            <Label>Role</Label>
            <Input type="text" value={formData.Role} onChange={handleChange("Role")} />
          </div>

          {/* <div>
            <Label>Profile Photo</Label>
            <Input type="file" accept="image/*" onChange={handleFileChange} />
            {previewPhoto && (
              <img src={previewPhoto} alt="Preview" className="object-cover w-24 h-24 mt-2 rounded-md" />
            )}
          </div> */}
        </div>

        <DialogFooter>
          <Button onClick={handleUpdate}>Update</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export function UserDelete ({ IDUser, isModalOpen, setIsModalOpen, onUpdate }) {
 
const handleDelete = async () => {
  const result = await Swal.fire({
    title: 'Apakah Anda yakin?',
    text: "User ini akan dihapus secara permanen dan tidak bisa dibatalkan.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Ya, hapus!',
    cancelButtonText: 'Batal',
  });

  if (result.isConfirmed) {
    try {
      const response = await ApiCustomer.delete(`/api/user/${IDUser}`);
      
      console.log("Server Response:", response.data);
      if (response.status === 409 || response.data.success === false) {
        // 🚨 Restriction triggered - Show alert message
        Swal.fire({
          icon: 'warning',
          title: 'Tidak Bisa Dihapus!',
          text: response.data.message || "User ini memiliki keterkaitan dan tidak dapat dihapus.",
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
        });
        return;
      }

      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'User berhasil dihapus.',
        timer: 1500,
        timerProgressBar: true,
        showConfirmButton: false,
      }).then(() => {
        window.location.reload(); // Memuat ulang halaman
        if (onUpdate) {
          onUpdate();
        }
      });
    } catch (error) {
      if (error.response && error.response.status === 409) {
        // 🚨 Handle 409 Conflict error from backend
        Swal.fire({
          icon: 'warning',
          title: 'Tidak Bisa Dihapus!',
          text: error.response.data.message || "User ini memiliki keterkaitan dan tidak dapat dihapus.",
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Gagal Menghapus!',
          text: 'Terjadi kesalahan saat menghapus User. Silakan coba lagi.',
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
        });
      }
    }
  }
};

return (
  <Button variant="outline" className="text-red-500 hover:text-red-700" onClick={handleDelete}>
    <Trash />
  </Button>
);
};

export function PartAdd () {
  const [formData, setFormData] = useState({
    PartNumber: '',
    Keyword: '',
    PartDescription: '',
    RestrictionReason: '',
    Orderability: false,
    CSR_Flag: false,
    ROHS_Flag: false,
    Returnable_Flag: false,
    HardRoll_Flag: false,
    DangerousGoods_Flag: false,
    LithiumBattery_Flag: false,
    Oversize_Flag: false,
    Heavy_Flag: false,
    Price: 0,
    FreightPrice: 0,
    Shipping_Fee: 0,
    Tax: 0,
    Total: 0,
  });

  const handleChange = (e) => {
    const { id, type, value, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setFormData((prev) => ({ ...prev, [id]: newValue }));
  };

  const handleSubmit = async () => {
    const { PartNumber, Keyword, PartDescription } = formData;

    if (!PartNumber || !Keyword || !PartDescription) {
      Swal.fire({
        title: "Incomplete Data",
        text: "PartNumber, Keyword, and PartDescription are required.",
        icon: "warning",
        timer: 1500,
        showConfirmButton: false,
      });
      return;
    }

    // Convert types before sending
    const payload = {
      ...formData,
      Orderability: Boolean(formData.Orderability),
      CSR_Flag: Boolean(formData.CSR_Flag),
      ROHS_Flag: Boolean(formData.ROHS_Flag),
      Returnable_Flag: Boolean(formData.Returnable_Flag),
      HardRoll_Flag: Boolean(formData.HardRoll_Flag),
      DangerousGoods_Flag: Boolean(formData.DangerousGoods_Flag),
      LithiumBattery_Flag: Boolean(formData.LithiumBattery_Flag),
      Oversize_Flag: Boolean(formData.Oversize_Flag),
      Heavy_Flag: Boolean(formData.Heavy_Flag),
      Price: Number(formData.Price),
      FreightPrice: Number(formData.FreightPrice),
      Shipping_Fee: Number(formData.Shipping_Fee),
      Tax: Number(formData.Tax),
      Total: Number(formData.Total),
    };

    try {
      const res = await ApiCustomer.post(`/api/service-log/parts-catalog`, payload);
      Swal.fire({
        title: "Success!",
        text: "Part successfully added.",
        icon: "success",
        timer: 1200,
        showConfirmButton: false,
      }).then(() => window.location.reload());
    } catch (err) {
      Swal.fire({
        title: "Error!",
        text: err.response?.data?.message || "Failed to add part.",
        icon: "error",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="ml-2 rounded-sm h-11">Part Add</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Part</DialogTitle>
          <DialogDescription>Fill in all part details below:</DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Label>Part Number *</Label>
          <Input type="text" id="PartNumber" value={formData.PartNumber} onChange={handleChange} />

          <Label>Keyword *</Label>
          <Input type="text" id="Keyword" value={formData.Keyword} onChange={handleChange} />

          <Label>Part Description *</Label>
          <Input type="text" id="PartDescription" value={formData.PartDescription} onChange={handleChange} />

          <Label>Restriction Reason</Label>
          <Input type="text" id="RestrictionReason" value={formData.RestrictionReason} onChange={handleChange} />

          <Label>Price</Label>
          <Input type="number" id="Price" value={formData.Price} onChange={handleChange} />

          <Label>Freight Price</Label>
          <Input type="number" id="FreightPrice" value={formData.FreightPrice} onChange={handleChange} />

          <Label>Shipping Fee</Label>
          <Input type="number" id="Shipping_Fee" value={formData.Shipping_Fee} onChange={handleChange} />

          <Label>Tax</Label>
          <Input type="number" id="Tax" value={formData.Tax} onChange={handleChange} />

          <Label>Total</Label>
          <Input type="number" id="Total" value={formData.Total} onChange={handleChange} />

          {/* Checkbox flags */}
          {[
            "Orderability", "CSR_Flag", "ROHS_Flag", "Returnable_Flag", "HardRoll_Flag",
            "DangerousGoods_Flag", "LithiumBattery_Flag", "Oversize_Flag", "Heavy_Flag"
          ].map((flag) => (
            <div key={flag}>
              <label className="flex items-center space-x-2">
                <input type="checkbox" id={flag} checked={formData[flag]} onChange={handleChange} />
                <span>{flag.replace(/_/g, " ")}</span>
              </label>
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button onClick={handleSubmit}>Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export function PartEdit({ PartNumber, onUpdate }) {
  const [formData, setFormData] = useState({});
  const [isOpen, setIsOpen] = useState(false);

  const defaultFormData = {
    PartNumber: "",
    Keyword: "",
    PartDescription: "",
    Orderability: false,
    RestrictionReason: "",
    CSR_Flag: false,
    ROHS_Flag: false,
    Returnable_Flag: false,
    HardRoll_Flag: false,
    DangerousGoods_Flag: false,
    LithiumBattery_Flag: false,
    Oversize_Flag: false,
    Heavy_Flag: false,
    Price: "",
    FreightPrice: "",
    Tax: "",
    Total: "",
    Shipping_Fee: "",
  };

  const fetchPart = async () => {
    try {
      const res = await ApiCustomer.get(`/api/service-log/parts-catalog/${PartNumber}`);
      setFormData(res.data.data || defaultFormData);
    } catch (e) {
      console.error("Fetch failed", e);
    }
  };

  const handleChange = (field) => (e) => {
    const val = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  const handleUpdate = async () => {
    const {
      PartNumber, Keyword, PartDescription,
      Price, FreightPrice, Tax, Shipping_Fee,
      ...restFlags
    } = formData;
  
    if (!PartNumber || !Keyword || !PartDescription) {
      return Swal.fire({
        icon: "warning",
        title: "Incomplete Data",
        text: "Lengkapi semua field wajib.",
        timer: 1200,
        timerProgressBar: true,
        showConfirmButton: false
      });
    }
  
    const updatedData = {
      PartNumber,
      Keyword,
      PartDescription,
      Price: parseFloat(Price) || 0,
      FreightPrice: parseFloat(FreightPrice) || 0,
      Tax: parseFloat(Tax) || 0,
      Shipping_Fee: parseFloat(Shipping_Fee) || 0,
      Total:
        (parseFloat(Price) || 0) +
        (parseFloat(FreightPrice) || 0) +
        (parseFloat(Tax) || 0),
      ...restFlags,
    };
  
    try {
      Swal.fire({
        title: "Menyimpan data...",
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => Swal.showLoading()
      });
  
      await ApiCustomer.patch(`/api/service-log/parts-catalog/${PartNumber}`, updatedData);
  
      Swal.close(); // Tutup loading setelah selesai
  
      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Data berhasil diperbarui.",
        timer: 1500,
        timerProgressBar: true,
        showConfirmButton: false,
        allowEscapeKey: false
      }).then(() => {
        onUpdate();
        setIsOpen(false);
      });
  
    } catch (e) {
      console.error(e);
      Swal.close(); // Tutup loading jika gagal
      Swal.fire({
        icon: "error",
        title: "Gagal!",
        text: "Perbaruan data gagal!",
        timer: 1500,
        timerProgressBar: true,
        showConfirmButton: false,
        allowEscapeKey: false
      });
    }
  };
  

  useEffect(() => {
    if (PartNumber && isOpen) fetchPart();
    else if (!isOpen) setFormData(defaultFormData);
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={() => setIsOpen(true)}>
          <Pencil />
        </Button>
      </DialogTrigger>
      <DialogContent className="h-[500px] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Part</DialogTitle>
          <DialogDescription>Update data part. (*) wajib diisi.</DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          {[
            { id: "PartNumber", label: "Part Number", type: "text", readonly: true },
            { id: "Keyword", label: "Keyword", type: "text", required: true },
            { id: "PartDescription", label: "Description", type: "textarea", required: true },
            { id: "RestrictionReason", label: "Restriction Reason", type: "textarea" },
            { id: "Orderability", label: "Orderable", type: "checkbox" },
            { id: "CSR_Flag", label: "CSR", type: "checkbox" },
            { id: "ROHS_Flag", label: "ROHS", type: "checkbox" },
            { id: "Returnable_Flag", label: "Returnable", type: "checkbox" },
            { id: "HardRoll_Flag", label: "Hard Roll", type: "checkbox" },
            { id: "DangerousGoods_Flag", label: "Dangerous Goods", type: "checkbox" },
            { id: "LithiumBattery_Flag", label: "Lithium Battery", type: "checkbox" },
            { id: "Oversize_Flag", label: "Oversize", type: "checkbox" },
            { id: "Heavy_Flag", label: "Heavy", type: "checkbox" },
            { id: "Price", label: "Price", type: "number" },
            { id: "FreightPrice", label: "Freight Price", type: "number" },
            { id: "Tax", label: "Tax", type: "number" },
            { id: "Shipping_Fee", label: "Shipping Fee", type: "number" },
          ].map(({ id, label, type, required, readonly }) => (
            <div key={id}>
              <Label htmlFor={id}>
                {label} {required && <span className="text-red-500">*</span>}
              </Label>
              {type === "textarea" ? (
                <Textarea id={id} value={formData[id] || ""} onChange={handleChange(id)} />
              ) : type === "checkbox" ? (
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id={id} checked={!!formData[id]} onChange={handleChange(id)} />
                  <label htmlFor={id}>{label}</label>
                </div>
              ) : (
                <Input type={type} id={id} value={formData[id] || ""} onChange={handleChange(id)} readOnly={readonly} />
              )}
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button onClick={handleUpdate}>Simpan</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export function PartDelete ({ PartNumber, isModalOpen, setIsModalOpen, onUpdate }) {
  const handleDelete = async () => {
    const result = await Swal.fire({
      title: 'Apakah Anda yakin?',
      text: "Part ini akan dihapus dan perubahan tidak bisa dibatalkan.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal',
    });
  
    if (result.isConfirmed) {
      try {
        const response = await ApiCustomer.delete(`/api/service-log/parts-catalog/${PartNumber}`);
        
        console.log("Server Response:", response.data);
        if (response.status === 409 || response.data.success === false) {
          // 🚨 Restriction triggered - Show alert message
          Swal.fire({
            icon: 'warning',
            title: 'Tidak Bisa Dihapus!',
            text: response.data.message || "Part ini memiliki keterkaitan dan tidak dapat dihapus.",
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false,
          });
          return;
        }
  
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Part berhasil dihapus.',
          timer: 1500,
          timerProgressBar: true,
          showConfirmButton: false,
        }).then(() => {
         window.location.reload(); // Memuat ulang halaman
          if (onUpdate) {
            onUpdate();
          }
        });
      } catch (error) {
        if (error.response && error.response.status === 409) {
          // 🚨 Handle 409 Conflict error from backend
          Swal.fire({
            icon: 'warning',
            title: 'Tidak Bisa Dihapus!',
            text: error.response.data.message || "Part ini memiliki keterkaitan dan tidak dapat dihapus.",
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false,
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Gagal Menghapus!',
            text: 'Terjadi kesalahan saat menghapus Part. Silakan coba lagi.',
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false,
          });
        }
      }
    }
  };
  
  return (
    <Button variant="outline" className="text-red-500 hover:text-red-700" onClick={handleDelete}>
      <Trash />
    </Button>
  );
};

export function ResourceAdd () {
  const [formDataResource, setFormDataResource] = useState({
   ResourceId: '',
   Name: '',	
   })
   
   // Make Handler ProductType
   const handlerInputResource = (e) => {
     const { id, value } = e.target
     setFormDataResource(prevState => ({
       ...prevState,
       [id]:value
     }));
   };

   // Handler Submit
   const handlerResource = async () => {
     const { 
       ResourceId, Name
     } = formDataResource;
   
     if (!ResourceId || !Name ) {
       Swal.fire({
         title: "Incomplete Data",
         text: "Please fill in all fields before submitting.",
         icon: "warning",
         timer: 1500,
         timerProgressBar: true,
         showConfirmButton: false,
         allowEscapeKey: false,
       });
       return;
     }  
   
     try {
       const response = await ApiCustomer.post("/api/resources", formDataResource);
       console.log("Success:", response.data);
   
       Swal.fire({
         icon: 'success',
         title: 'Berhasil!',
         text: 'Resource berhasil disimpan.',
         timer: 1200,
         timerProgressBar: true,
         showConfirmButton: false,
         allowEscapeKey: false,
       }).then(() => {
         window.location.reload();
       });

     } catch (err) {
       console.error("Error saving Resource", err);
   
       Swal.fire({
         title: "Error!",
         text: "Failed to save Resource. Please try again.",
         icon: "error",
         timer: 1200,
         timerProgressBar: true,
         showConfirmButton: false,
         allowEscapeKey: false,
       });
     }
   };
 return (
   <Dialog>
     <DialogTrigger asChild>
       <Button variant="outline" className="ml-2 rounded-sm h-11"> Resource Add</Button>
     </DialogTrigger>
     <DialogContent className="h-[300px] overflow-y-auto">
       <DialogHeader>
         <DialogTitle>Add Resource Information</DialogTitle>
         <DialogDescription>
           Add the Resource Fields marked with * are required.
         </DialogDescription>
       </DialogHeader>
       <div className="space-y-2">

       <Label>Resource ID</Label>
       <Input type="text" id="ResourceId" className="p-2" value={formDataResource.ResourceId} onChange={handlerInputResource} />

       <Label>Name</Label>
       <Input type="text" id="Name" className="p-2" value={formDataResource.Name} onChange={handlerInputResource} />
       </div>
       <DialogFooter>
         <Button onClick={handlerResource}>Add</Button>
       </DialogFooter>
     </DialogContent>
   </Dialog>
 )
};

export function ResourceEdit({ ResourceId, onUpdate }) {
  const [formData, setFormData] = useState({});
  const [isOpen, setIsOpen] = useState(false);

  const defaultFormData = {
    ResourceId: "",
    Name: ""
  };

  const fetchResource = async () => {
    try {
      const res = await ApiCustomer.get(`/api/resources/${ResourceId}`);
      setFormData(res.data.data || defaultFormData);
    } catch (e) {
      console.error("Fetch failed", e);
    }
  };

  const handleChange = (field) => (e) => {
    const val = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  const handleUpdate = async () => {
    const { Name } = formData;

    if (!Name) {
      return Swal.fire({
        icon: "warning",
        text: "Lengkapi semua field wajib.",
        timer: 1200,
        showConfirmButton: false,
        allowEscapeKey: false,
      });
    }

    const updatedData = { Name };

    try {
      await ApiCustomer.patch(`/api/resources/${ResourceId}`, updatedData);
      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Data diperbarui.",
        timer: 1500,
        showConfirmButton: false,
        allowEscapeKey: false,
      }).then(() => {
        onUpdate();
        setIsOpen(false);
      });
    } catch (e) {
      console.error(e);
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Perbaruan gagal!",
        timer: 1500,
        showConfirmButton: false,
        allowEscapeKey: false,
      });
    }
  };

  useEffect(() => {
    if (ResourceId && isOpen) fetchResource();
    else if (!isOpen) setFormData(defaultFormData);
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={() => setIsOpen(true)}>
          <Pencil />
        </Button>
      </DialogTrigger>
      <DialogContent className="h-[300px] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Resource</DialogTitle>
          <DialogDescription>Update data Resource. (*) wajib diisi.</DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          {[{ id: "ResourceId", label: "Resource Id", type: "text", required: true, readonly: true },
            { id: "Name", label: "Name", type: "text", required: true }].map(({ id, label, type, required, readonly }) => (
            <div key={id}>
              <Label htmlFor={id}>
                {label} {required && <span className="text-red-500">*</span>}
              </Label>
              <Input
                type={type}
                id={id}
                value={formData[id] || ""}
                onChange={handleChange(id)}
                readOnly={readonly}
              />
            </div>
          ))}
        </div>

        <DialogFooter className="mt-4">
          <Button onClick={handleUpdate}>Simpan</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function ResourceDelete({ ResourceId, isModalOpen, setIsModalOpen, onUpdate }) {
  const handleDelete = async () => {
    const result = await Swal.fire({
      title: 'Apakah Anda yakin?',
      text: "Resource ini akan dihapus dan perubahan tidak bisa dibatalkan.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal',
    });
  
    if (result.isConfirmed) {
      try {
        const response = await ApiCustomer.delete(`/api/resources/${ResourceId}`);
  
        if (response.status === 409 || response.data.success === false) {
          // 🚨 Restriction triggered - Show alert message
          Swal.fire({
            icon: 'warning',
            title: 'Tidak Bisa Dihapus!',
            text: response.data.message || "Resource ini memiliki keterkaitan dan tidak dapat dihapus.",
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false,
          });
          return;
        }
  
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Resource berhasil dihapus.',
          timer: 1500,
          timerProgressBar: true,
          showConfirmButton: false,
        }).then(() => {
          window.location.reload(); // Memuat ulang halaman
          if (onUpdate) {
            onUpdate();
          }
        });
      } catch (error) {
        if (error.response && error.response.status === 409) {
          // 🚨 Handle 409 Conflict error from backend
          Swal.fire({
            icon: 'warning',
            title: 'Tidak Bisa Dihapus!',
            text: error.response.data.message || "Resource ini tidak bisa dihapus karena memiliki relasi.",
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false,
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Gagal Menghapus!',
            text: 'Terjadi kesalahan saat menghapus Resource. Silakan coba lagi.',
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false,
          });
        }
      }
    }
  };
  
  return (
    <Button variant="outline" className="text-red-500 hover:text-red-700" onClick={handleDelete}>
      <Trash />
    </Button>
  );
}


//? Service Case Tab List


// export function BtnModalsServiceCatalog(){
//   const [workOpen, setWorkOpen] = useState(false);

//   const SC = [
//     {
//       ServiceOfferID : "DEPOT2",
//       SeriviceDescription : "DEPOT REPAIR - 2DAY",
//       CostumerTAT:"002",
//       Price:"0.00",
//       Tax:"0.00",
//       Total:"00.00"
//     },
//     {
//       ServiceOfferID : "DEPOT1",
//       SeriviceDescription : "DEPOT REPAIR",
//       CostumerTAT:"001",
//       Price:"0.00",
//       Tax:"0.00",
//       Total:"00.00"
//     },
//     {
//       ServiceOfferID : "APBPRP",
//       SeriviceDescription : "SRS/CREW 1WDW DEF RETURN",
//       CostumerTAT:"001",
//       Price:"0.00",
//       Tax:"0.00",
//       Total:"00.00"
//     },
//     {
//       ServiceOfferID : "APBPRP",
//       SeriviceDescription : "SRS/CREW 1WDW DEF RETURN",
//       CostumerTAT:"003",
//       Price:"0.00",
//       Tax:"0.00",
//       Total:"00.00"
//     },
//   ]

//   return (
//     <>
//     <Dialog open={workOpen}>
//       <DialogContent>
//         <DialogHeader>
//           <DialogDescription>Click Here to Show Service Catalog Error / Warnings</DialogDescription>
//         </DialogHeader>
//         <DialogTitle>Service Catalog</DialogTitle>
//         <div className="flex">
//           <DialogTitle>Select From List of Service Options</DialogTitle>
//           <div className="">
//             <p>Product Number</p>
//             <p>Product Name</p>
//             <p>Serial Number</p>
//             <p>Warranty Status</p>
//             <p>Currency</p>
//           </div>
//         </div>
//         <Table>
//           <TableCaption>Warrenty Services</TableCaption>
//           <TableHeader>
//             <TableRow>
//               <TableHead>Select</TableHead>
//               <TableHead>Service OfferID</TableHead>
//               <TableHead>Service Description</TableHead>
//               <TableHead>Costumer TAT/ Response TIme</TableHead>
//               <TableHead>Price</TableHead>
//               <TableHead>Tax</TableHead>
//               <TableHead>Total</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//               {SC.map((service) => {
//             <TableRow>
//               <TableCell><Checkbox></Checkbox></TableCell>
//               <TableCell>{service.ServiceOfferID}</TableCell>
//               <TableCell>{service.SeriviceDescription}</TableCell>
//               <TableCell>{service.CostumerTAT}</TableCell>
//               <TableCell>{service.Price}</TableCell>
//               <TableCell>{service.Tax}</TableCell>
//               <TableCell>{service.Total}</TableCell>
//             </TableRow>
//               })}
//           </TableBody>
//         </Table>
//         <DialogFooter>
//               <button>Cancel</button>
//               <button>Next</button>
//         </DialogFooter>
//       </DialogContent>
//       <DialogContent>
//         <DialogHeader>
//           <DialogDescription>Click Here to Show Service Catalog Error / Warnings</DialogDescription>
//         </DialogHeader>
//         <DialogTitle>Service Catalog</DialogTitle>
//         <div className="flex">
//           <DialogTitle>Select From List of Service Options</DialogTitle>
//           <div className="">
//             <p>Product Number</p>
//             <p>Product Name</p>
//             <p>Serial Number</p>
//             <p>Warranty Status</p>
//             <p>Currency</p>
//           </div>
//         </div>
//         <Table>
//           <TableCaption>Warrenty Services</TableCaption>
//           <TableHeader>
//             <TableRow>
//               <TableHead>Select</TableHead>
//               <TableHead>Service OfferID</TableHead>
//               <TableHead>Service Description</TableHead>
//               <TableHead>Costumer TAT/ Response TIme</TableHead>
//               <TableHead>Price</TableHead>
//               <TableHead>Tax</TableHead>
//               <TableHead>Total</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//               {SC.map((service) => {
//             <TableRow>
//               <TableCell><Checkbox></Checkbox></TableCell>
//               <TableCell>{service.ServiceOfferID}</TableCell>
//               <TableCell>{service.SeriviceDescription}</TableCell>
//               <TableCell>{service.CostumerTAT}</TableCell>
//               <TableCell>{service.Price}</TableCell>
//               <TableCell>{service.Tax}</TableCell>
//               <TableCell>{service.Total}</TableCell>
//             </TableRow>
//               })}
//           </TableBody>
//         </Table>
//         <DialogFooter>
//           <button>Cancel</button>
//           <button>Next</button>
//         </DialogFooter>
//       </DialogContent>
//       <DialogContent>
//         <DialogHeader>
//           <DialogDescription>Click Here to Show Service Catalog Error / Warnings</DialogDescription>
//         </DialogHeader>
//         <DialogTitle>Service Catalog</DialogTitle>
//         <div className="flex">
//           <DialogTitle>Select From List of Service Options</DialogTitle>
//           <div className="">
//             <p>Product Number</p>
//             <p>Product Name</p>
//             <p>Serial Number</p>
//             <p>Warranty Status</p>
//             <p>Currency</p>
//           </div>
//         </div>
//         <Table>
//           <TableCaption>Warrenty Services</TableCaption>
//           <TableHeader>
//             <TableRow>
//               <TableHead>Select</TableHead>
//               <TableHead>Service OfferID</TableHead>
//               <TableHead>Service Description</TableHead>
//               <TableHead>Costumer TAT/ Response TIme</TableHead>
//               <TableHead>Price</TableHead>
//               <TableHead>Tax</TableHead>
//               <TableHead>Total</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//               {SC.map((service) => {
//             <TableRow>
//               <TableCell><Checkbox></Checkbox></TableCell>
//               <TableCell>{service.ServiceOfferID}</TableCell>
//               <TableCell>{service.SeriviceDescription}</TableCell>
//               <TableCell>{service.CostumerTAT}</TableCell>
//               <TableCell>{service.Price}</TableCell>
//               <TableCell>{service.Tax}</TableCell>
//               <TableCell>{service.Total}</TableCell>
//             </TableRow>
//               })}
//           </TableBody>
//         </Table>
//         <DialogFooter>
//           <button>Cancel</button>
//           <button>Cancel</button>
//           <button>AddPart</button> // open another dialogs modals
//           <button>Create Order</button> //submit
//         </DialogFooter>
//       </DialogContent>
      
//   </Dialog>
//     </>
//   )
// }

export function BtnModalsServiceCatalog({ 
  open, 
  setOpen, 
  caseDetails,
  serviceCatalogType
}) {
  useEffect(() => {
    // Resetting modal state when serviceCatalogType changes
    setCurrentStep(1);
    setStep(0);
    setSelectedWarrantyServices([]);
    setSelectedPartCatalog([]);
    setSubTotalConfirmServices(0);
    setTotalTaxConfirmServices(0);
    setTotalConfirmServices(0);
    setPartNumberSearch("");
    setKeywordSearch("");
    setDescriptionSearch("");

  }, [serviceCatalogType]);
  
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false)
  const [loadingCO, setLoadingCO] = useState(false)
  const [error, setError] = useState(false)
  const [currentStep, setCurrentStep] = useState(1);
  const [assetForWorkOrderCreation, setAssetForWorkOrderCreation] = useState([]);
  const [modalPart, setModalPart] = useState(false);
  const navigate = useNavigate();
  //product information
  const fetchDataAssets = async () => {
    try {
      const response = await ApiCustomer.get(`/api/asset-information/${caseDetails.AssetID}`)
      // console.log("Response fetch Asset Modal Work Order :",response)
      return response.data.data
    }catch(e){
      console.error("error fetching Asset: ", e)
    }
  }
  //waranty
  //warranty state
  const [warrantyOffer, setWarrantyOffer] = useState([])
  //fetching data function
  const fetchDataServiceOffer = async () => {
    setLoading(true);
    setError(null);
    try{
      const response = await ApiCustomer.get(`/api/service-log/warranty-services`)
      console.log("Warranty Service Response:", response.data);
      return response.data.data;
    }catch(e){
      setError("Failed to load Warranty Service")
      console.error("error fetching Service Offer: ", e)
    }finally{
      setLoading(false)
    }
  }
  useEffect(() => {
    fetchDataServiceOffer().then((data) => {
      console.log("Data received for warrantyOffer:", data);
      if (data) setWarrantyOffer(data);
    });
    fetchDataAssets().then((data) => {
      if (data) setAssetForWorkOrderCreation(data);
    });
    fetchDataPartCatalog();
  }, [])
  // fetchDataServiceOffer().then((data) => {
  //   if (data) setWarrantyOffer(data);
  // });

  const [selected, setSelected] = useState("DepotRepair"); 

  //handles Warranty Service
  const [selectedWarrantyServices, setSelectedWarrantyServices] = useState([]);
  const handlerWarrantyServices = (service, checked) => {
    if (checked) {
      setSelectedWarrantyServices((prev) => [...prev, service])
    }else{
      setSelectedWarrantyServices((prev) => 
        prev.filter((item) => item.Service_offerID !==service.Service_offerID)
      )
    }
  }

  useEffect(() => {
    console.log("Selected Services:", selectedWarrantyServices);
  }, [selectedWarrantyServices]);
  


  //part
  //part state
  const [partCatalog, setPartCatalog] = useState([])
  //fetch data part catalog
  const fetchDataPartCatalog = async () => {
    try{
      const response = await ApiCustomer.get(`/api/service-log/parts-catalog`)
      console.log("output of respone part-catelog: ",response.data)
      console.log("response.data.data: ", response.data.data); 
      setPartCatalog(response.data.data)
      return response.data.data
    }catch(e){

    }
  }

  //search part handler
  const [partNumberSearch, setPartNumberSearch] = useState("");
  const [keywordSearch, setKeywordSearch] = useState("");
  const [descriptionSearch, setDescriptionSearch] = useState("");




  //handler part
  const [selectedPartCatalog, setSelectedPartCatalog] = useState([])
  const handlerPartCatalog = (part, checked) => {
    if(checked){
      setSelectedPartCatalog((prev) => [...prev, part])
    }else{
      setSelectedPartCatalog((prev) => 
        prev.filter((item) => item.PartNumber !== part.PartNumber)
      )
    }
  }
  
  useEffect(() => {
    console.log("Selected Parts:", selectedPartCatalog);
    console.log("Selected Warranty:", selectedWarrantyServices);
    
    handlerPriceConfirmServices();
  }, [selectedPartCatalog]);
  

  
  //hanlder confirm
  //handler qty price parts
  const handleQtyChangePartsCatalog = (partNumber, qty) => {
    setSelectedPartCatalog((prev) =>
      prev.map((item) => {
        if (item.PartNumber === partNumber) {
          const parsedQty = parseInt(qty) || 0;
          const price = parseFloat(item.Price) || 0;
          return {
            ...item,
            qty: parsedQty,
            Total: (parsedQty * price).toFixed(2)
          };
        }
        return item;
      })
    );
  };

  //handle add part in confirm services
  const [tempSelectedParts, setTempSelectedParts] = useState([]);
  

  //handler Total Subtotal Confirm Services
  const [subTotalConfirmServices, setSubTotalConfirmServices] = useState(0)
  const [TotalTaxConfirmServices, setTotalTaxConfirmServices] = useState(0)
  const [totalConfirmServices, setTotalConfirmServices] = useState(0)
  const handlerPriceConfirmServices = () =>{
    let serviceTotal = selectedWarrantyServices.reduce((acc, service) => {
      return acc + (parseFloat(service.Price) || 0);
    }, 0);
  
    let partsTotal = selectedPartCatalog.reduce((acc, part) => {
      return acc + (parseFloat(part.Total) || 0);
    }, 0);
  
    const subTotal = serviceTotal + partsTotal;
    console.log("SubTotal Confirm Services : ",subTotal)
    setSubTotalConfirmServices(subTotal.toFixed(2));

  }

  //createorder
  const createOrder = async () => {
    try {
      setLoadingCO(true);
      const data = {
        user: getUserFromToken()
      }      
      Swal.fire({
        title: "Saving...",
        text: "Please wait while we update the Case.",
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
      const res = await ApiCustomer.post("/api/service-log/create-order", {
        AssetID: assetForWorkOrderCreation.AssetID,
        CaseID: caseDetails.CaseID,
        selectedWarrantyServices,
        selectedPartCatalog,
        IncidentType: selected,
        OwnerID: data.user.id,
      });
      
      await Swal.fire({
        title: "Success!",
        text: "Order added successfully!",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
        allowEscapeKey: false,
      });
      
      setOpen(false);
      const WOID = res.data.WOID
      const MOID = res.data.MOID
      switch (serviceCatalogType) {
        case "CSR":
          window.open(`/material-order/${MOID}`, '_blank');
          // navigate(`/material-order/${MOID}`, '_blank');
          break;

        case "workorder":
          window.open(`/work/${WOID}`, '_blank');
          // navigate(`/work/${WOID}`, '_blank');
          break;

        default:
          break;
        }
    } catch (err) {
      console.error("❌ Order Creation Failed:", err);
      Swal.fire({
        title: "Error!",
        text: "Failed to create order",
        icon: "error",
        timer: 1500,
        showConfirmButton: false,
        allowEscapeKey: false,
      });
    } finally {
      setLoadingCO(false);
    }
  };
  

  function renderStepContent() {
    switch (currentStep) {
      case 1:
        return (
          <DialogContent className="sm:max-w-[fit] sm:max-h-[100vh] flex flex-col justify-center gap-0 p-0 bg-white [&>button]:hidden" >
            <DialogHeader>
              <div className="flex items-end justify-end ">
                <Button className={'bg-transparent '}><ExternalLink color="black"></ExternalLink></Button>
                <DialogClose asChild>
                <Button type="button" variant="secondary" className={'hover:bg-gray-200 active:bg-gray-700'}>
                  <XIcon/>
                </Button>
                </DialogClose>
              </div>
              <DialogDescription className={'bg-red-200 p-3 font-bold '}>Click Here to Show Service Catalog Error / Warnings</DialogDescription>
              <DialogTitle className={'text-blue-600 text-2xl'}>Service Catalog</DialogTitle>
            </DialogHeader>
            <div className="flex justify-between gap-4 p-2 my-2">
              <DialogTitle>Step 1: Select From List of Service Options</DialogTitle>
              <div className="grid grid-cols-2 p-2 bg-gray-300 gap-x-10">
                
                <p>Product Number</p><p>: {assetForWorkOrderCreation?.ProductNumber || "-"}</p>
                <p>Product Name</p><p>: {assetForWorkOrderCreation?.product_information?.ProductName || "-"}</p>
                <p>Serial Number</p><p>: {assetForWorkOrderCreation?.SerialNumber || "-"}</p>
                <p>Warranty Status</p><p>: </p>
                <p>Currency</p><p>: </p>
              </div>
            </div>
  
            {/* Table */}
            <Table>
              <TableCaption className={'caption-top bg-blue-500 p-2 text-2xl text-left text-black'}>Warranty Services</TableCaption>
              <TableHeader>
                <TableRow className={'bg-gray-300'}>
                  <TableHead className={'font-black text-black'}>Select</TableHead>
                  <TableHead className={'font-black text-black'}>Service OfferID</TableHead>
                  <TableHead className={'font-black text-black'}>Service Description</TableHead>
                  <TableHead className={'font-black text-black'}>Customer TAT</TableHead>
                  <TableHead className={'font-black text-black'}>Price</TableHead>
                  <TableHead className={'font-black text-black'}>Tax</TableHead>
                  <TableHead className={'font-black text-black'}>Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {warrantyOffer.map((service, index) => {
                  const isChecked = selectedWarrantyServices.some((item) => item.Service_offerID === service.Service_offerID)
                  return (
                    <TableRow key={index}>
                      <TableCell>
                        <Checkbox 
                          checked={isChecked}
                          onCheckedChange={(checked) => handlerWarrantyServices(service, checked)}
                        />
                      </TableCell>
                      <TableCell>{service.Service_offerID}</TableCell>
                      <TableCell>{service.Service_description}</TableCell>
                      <TableCell>{service.CTat_RTime}</TableCell>
                      <TableCell>{service.Price}</TableCell>
                      <TableCell>{service.Tax}</TableCell>
                      <TableCell>{service.Total}</TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
  
            <DialogFooter className={'p-4'}>
              <Button variant={'search'} className="" onClick={() => setOpen(false)}>Cancel</Button>
              <Button variant={'search'} onClick={() => setCurrentStep(2)} disabled={selectedWarrantyServices.length === 0} className={selectedWarrantyServices.length === 0 ? "opacity-50 cursor-not-allowed" : ""}>Next</Button>
            </DialogFooter>
          </DialogContent>
        );
  
      case 2:
        const filteredPartCatalog = partCatalog.filter(part => {
          return (
            part.PartNumber?.toLowerCase().includes(partNumberSearch.toLowerCase()) &&
            part.Keyword?.toLowerCase().includes(keywordSearch.toLowerCase()) &&
            part.PartDescription?.toLowerCase().includes(descriptionSearch.toLowerCase())
          );
        });
        return (
          <DialogContent className="sm:max-w-[fit] sm:max-h-[fit] flex flex-col  gap-0 p-0 bg-white [&>button]:hidden ">
            <DialogHeader className={'gap-0'}>
              <div className="flex items-end justify-end">
                <Button className={'bg-transparent '}><ExternalLink color="black"></ExternalLink></Button>
                <DialogClose asChild>
                  <Button type="button" variant="secondary" className={'hover:bg-gray-200 active:bg-gray-700'}>
                  <XIcon/>
                  </Button>
                </DialogClose>
              </div>
              <DialogTitle className={'text-blue-600 text-2xl'}>Service Catalog</DialogTitle>
              <DialogDescription>Select parts required for the repair.</DialogDescription>
            </DialogHeader>
            <div className="flex items-start justify-between p-2">
              <div className="grid flex-1 grid-cols-2 p-2 bg-gray-300 gap-x-2">
                <p>Service OfferID</p><p>: {selectedWarrantyServices[0].Service_offerID}</p>
                <p>Service Description</p><p>: {selectedWarrantyServices[0].Service_description}</p>
              </div>
              <div className="flex items-center self-center justify-center flex-1 gap-2 space-x-2 ">
                <Label htmlFor="orderability">Orderability</Label>
                <Switch id="orderability" />
              </div>
              <div className="grid flex-1 grid-cols-2 p-2 bg-gray-300 gap-x-2">
                <p>Product Number</p><p>: {assetForWorkOrderCreation?.ProductNumber || "-"}</p>
                <p>Product Name</p><p>: {assetForWorkOrderCreation?.product_information?.ProductName || "-"}</p>
                <p>Serial Number</p><p>: {assetForWorkOrderCreation?.SerialNumber || "-"}</p>
                <p>Warranty Status</p><p>: </p>
                <p>Currency</p><p>: </p>
              </div>
            </div>
            {/* Your Custom Layout and Table for Step 2 */}

            <Tabs
            defaultValue="parts"
            className={'h-[50vh] '}
            >
              <TabsList className={'py-5 px-0 bg-white'}>
                <TabsTrigger variant={'fullsize'} value="parts" className={'cursor-pointer '}>Parts</TabsTrigger>
                <TabsTrigger variant={'fullsize'} value="snr" className={'cursor-pointer  text-blue-500'}>SNR</TabsTrigger>
              </TabsList>
              <TabsContent value="parts"
                className={'overflow-y-auto'}
              > 
                <Table>
                  <TableHeader>
                    <TableRow className={'bg-gray-300'}>
                      <TableHead className={'font-black text-black'}>Select</TableHead>
                      <TableHead className={'font-black text-black p-2'}>
                        Parts #
                        <span className="flex items-center">
                          <Input
                            className={'bg-white'}
                            value={partNumberSearch}
                            onChange={(e) => setPartNumberSearch(e.target.value)}
                          />
                          <XIcon className="cursor-pointer" onClick={() => setPartNumberSearch("")} />
                        </span>
                      </TableHead>
                      <TableHead className={'font-black text-black'}>
                        Keyword
                        <span className="flex items-center">
                          <Input
                            className={'bg-white'}
                            value={keywordSearch}
                            onChange={(e) => setKeywordSearch(e.target.value)}
                          />
                          <XIcon className="cursor-pointer" onClick={() => setKeywordSearch("")} />
                        </span>
                      </TableHead>
                      <TableHead className={'font-black text-black'}>
                        Part Description
                        <span className="flex items-center">
                          <Input
                            className={'bg-white'}
                            value={descriptionSearch}
                            onChange={(e) => setDescriptionSearch(e.target.value)}
                          />
                          <XIcon className="cursor-pointer" onClick={() => setDescriptionSearch("")} />
                        </span>
                      </TableHead>
                      <TableHead className={'font-black text-black'}>Orderability</TableHead>
                      <TableHead className={'font-black text-black whitespace-break-spaces'}>Restriction Reason</TableHead>
                      <TableHead className={'font-black text-black'}>CRS</TableHead>
                      <TableHead className={'font-black text-black'}>ROHS</TableHead>
                      <TableHead className={'font-black text-black'}>Retrunable</TableHead>
                      <TableHead className={'font-black text-black whitespace-break-spaces'}>Hard roll</TableHead>
                      <TableHead className={'font-black text-black whitespace-break-spaces'}>Dangerous Goods</TableHead>
                      <TableHead className={'font-black text-black whitespace-break-spaces'}>Lithium Battery</TableHead>
                      <TableHead className={'font-black text-black'}>Oversize</TableHead>
                      <TableHead className={'font-black text-black'}>Heavy</TableHead>
                      <TableHead className={'font-black text-black'}>Price</TableHead>
                      <TableHead className={'font-black text-black whitespace-break-spaces'}>Friegh Price</TableHead>
                      <TableHead className={'font-black text-black'}>Tax</TableHead>
                      <TableHead className={'font-black text-black'}>Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPartCatalog.map((part, index) => {
                      const isChecked = selectedPartCatalog.some((item) => item.PartNumber === part.PartNumber)
                      return (
                        <TableRow key={index}>
                          <TableCell>
                            <Checkbox
                              checked={isChecked}
                              onCheckedChange={(checked) => handlerPartCatalog(part, checked)}
                            />
                          </TableCell>
                          <TableCell>{part.PartNumber}</TableCell>
                          <TableCell>{part.Keyword}</TableCell>
                          <TableCell>{part.PartDescription}</TableCell>
                          <TableCell>{part.Orderability ? 'Yes' : 'No'}</TableCell>
                          <TableCell>{part.ResistrictionReason}</TableCell>
                          <TableCell>{part.Csr ? 'Y' : 'N'}</TableCell>
                          <TableCell>{part.Rohs}</TableCell>
                          <TableCell>{part.Returnable_Flag ? 'true' : 'false'}</TableCell>
                          <TableCell>{part.Hardrolls}</TableCell>
                          <TableCell>{part.Dangerousgoods ? 'true' : 'false'}</TableCell>
                          <TableCell>{part.Lithiumbattry ? 'true' : 'false'}</TableCell>
                          <TableCell>{part.Oversize ? 'true' : 'false'}</TableCell>
                          <TableCell>{part.Heavy ? 'true' : 'false'}</TableCell>
                          <TableCell>{part.Price}</TableCell>
                          <TableCell>{part.Freightprice}</TableCell>
                          <TableCell>{part.Tax}</TableCell>
                          <TableCell>{part.Total}</TableCell>
                        </TableRow>
                      )
                    })}
                    <TableRow>
                      <TableCell colSpan={'100%'}>
                        <Pagination className={'flex justify-start'}>
                          <PaginationContent>
                            <PaginationItem>
                              <PaginationPrevious href="#" />
                            </PaginationItem>
                            <PaginationItem>
                              <PaginationLink href="#">1</PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                              <PaginationLink href="#" isActive>
                                2
                              </PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                              <PaginationLink href="#">3</PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                              <PaginationEllipsis />
                            </PaginationItem>
                            <PaginationItem>
                              <PaginationNext href="#" />
                            </PaginationItem>
                          </PaginationContent>
                        </Pagination>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TabsContent>
              <TabsContent value="snr">
                <p>tes</p>
              </TabsContent>
            </Tabs>
  
            <DialogFooter className={'p-4'}>
              <Button variant={'search'} className=""  onClick={() => setCurrentStep(1)}>Previous</Button>
              <Button variant={'search'} className=""  onClick={() => setCurrentStep(3)}>Next</Button>
            </DialogFooter>
          </DialogContent>
        );
  
      case 3:
        
        return (
          <DialogContent className="sm:max-w-[fit] sm:max-h-[full] p-0 bg-white [&>button]:hidden ">
            <DialogHeader>
              <div className="flex items-end justify-end">
                <Button className={'bg-transparent '}><ExternalLink color="black"></ExternalLink></Button>
                <DialogClose asChild>
                  <Button type="button" variant="secondary" className={'hover:bg-gray-200 active:bg-gray-700'}>
                  <XIcon/>
                  </Button>
                </DialogClose>
              </div>
              <DialogTitle className={'text-blue-600 text-2xl indent-5'}>Service Catalog</DialogTitle>
              <DialogDescription>SELECT PARTS REQUIRED FOR THE REPAIR.</DialogDescription>
            </DialogHeader>
            <div className="flex justify-end gap-4 p-2 my-2">
              <div className="grid grid-cols-2 p-2 bg-gray-300 gap-x-10">
                <p>Product Number</p><p>: {assetForWorkOrderCreation?.ProductNumber || "-"}</p>
                <p>Product Name</p><p>: {assetForWorkOrderCreation?.product_information?.ProductName || "-"}</p>
                <p>Serial Number</p><p>: {assetForWorkOrderCreation?.SerialNumber || "-"}</p>
                <p>Warranty Status</p><p>: </p>
                <p>Currency</p><p>: </p>
              </div>
            </div>
            <div className="overflow-auto max-h-[30dvh]">
              <Table>
                <TableHeader>
                  <TableRow className={'bg-blue-400'}>
                    <TableHead className={'font-bold text-black'}>Service OfferID</TableHead>
                    <TableHead className={'font-bold text-black'}>Description</TableHead>
                    <TableHead className={'font-bold text-black'}>Unit Price</TableHead>
                    <TableHead className={'font-bold text-black'}>Shipping Fee</TableHead>
                    <TableHead className={'font-bold text-black'}>Qty</TableHead>
                    <TableHead className={'font-bold text-black'}>Tax</TableHead>
                    <TableHead className={'font-bold text-black'}>Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedWarrantyServices.map((service, index) => {
                    return (
                      <TableRow key={index}>
                        <TableCell>{service.Service_offerID}</TableCell>
                        <TableCell>{service.Service_description}</TableCell>
                        <TableCell>{service.CTat_RTime}</TableCell>
                        <TableCell>{service.Shipping_Fee}</TableCell>
                        {/* <TableCell>{service.Price}</TableCell> */}
                        <TableCell>1</TableCell>
                        <TableCell>{service.Tax}</TableCell>
                        <TableCell>{service.Price}</TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
                <TableHeader>
                  <TableRow className={'bg-blue-400'}>
                    <TableHead className={'font-bold text-black'}>Part #</TableHead>
                    <TableHead className={'font-bold text-black'}>Description</TableHead>
                    <TableHead className={'font-bold text-black'}>Unit Price</TableHead>
                    <TableHead className={'font-bold text-black'}>Shipping Fee</TableHead>
                    <TableHead className={'font-bold text-black'}>Qty</TableHead>
                    <TableHead className={'font-bold text-black'}>Tax</TableHead>
                    <TableHead className={'font-bold text-black'}>Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedPartCatalog.map((part, index) => {
                    const isChecked = selectedPartCatalog.some((item) => item.PartNumber === part.PartNumber)
                    return (
                      <TableRow key={index}>
                        <TableCell>
                          <Checkbox
                            checked={isChecked}
                            onCheckedChange={(checked) => handlerPartCatalog(part, checked)}
                          />
                        </TableCell>
                        <TableCell>{part.PartNumber}</TableCell>
                        <TableCell>{part.PartDescription}</TableCell>
                        <TableCell>{part.Shipping_Fee}</TableCell>
                        <TableCell>
                        <Input
                          placeholder="QTY"
                          type="number"
                          value={part.qty || ''}
                          onChange={(e) => handleQtyChangePartsCatalog(part.PartNumber, e.target.value)}
                          className="w-16"
                        />
                        </TableCell>
                        <TableCell>{part.Tax}</TableCell>
                        <TableCell>{part.Total}</TableCell>
                      </TableRow>
                    )
                  })}
                  <TableRow>
                    <TableCell colSpan={4}></TableCell>
                    <TableCell colSpan={2}>Sub Total</TableCell>
                    <TableCell>{subTotalConfirmServices}</TableCell>
                  </TableRow>
                  <TableRow className={'bg-blue-400'}>
                    <TableCell colSpan={4}></TableCell>
                    <TableCell>Total</TableCell>
                    <TableCell>--</TableCell>
                    <TableCell>--</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
            
  
            <DialogFooter className={' sm:justify-start p-2 items-center gap-10'}>
              <Button variant={'search'} className="" onClick={() => setCurrentStep(2)}>Previous</Button>
              <Button variant={'search'} className="" onClick={() => setOpen(false)}>Cancel</Button>
              <Button variant={'search'} className="" onClick={() => setModalPart(true)}>Add Part</Button>
              <Button variant={'search'} className="" onClick={createOrder} disabled={loadingCO}>Create Order</Button>
              
              <Label htmlFor="incident" className={'font-bold '}>Incident Type</Label>
              <Select onChange={setSelected} defaultValue="DepotRepair">
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="CE Assist-APJ-Computing">CE Assist-APJ-Computing</SelectItem>
                    <SelectItem value="CE Assist-APJ-Printing">CE Assist-APJ-Printing</SelectItem>
                    <SelectItem value="Cust Sat-Issue-APJ-Computing">Cust Sat Issue-APJ-Computing</SelectItem>
                    <SelectItem value="Cust Sat-Issue-APJ-Printing">Cust Sat Issue-APJ-Printing</SelectItem>
                    <SelectItem value="IMACD-APJ-Computing">IMACD-APJ-Computing</SelectItem>
                    <SelectItem value="IMACD-APJ-Printing">IMACD-APJ-Printing</SelectItem>
                    <SelectItem value="Installation Only-APJ-Computing">Installation Only-APJ-Computing</SelectItem>
                    <SelectItem value="Installation Only-APJ-Printing">Installation Only-APJ-Printing</SelectItem>
                    <SelectItem value="PC Problem-APJ-Computing">PC Problem-APJ-Computing</SelectItem>
                    <SelectItem value="Print Problem-APJ-Printing">Print Problem-APJ-Printing</SelectItem>
                    <SelectItem value="Print Quality-APJ-Printing">Print Quality-APJ-Printing</SelectItem>
                    <SelectItem value="Prev Maint-APJ-Computing">Prev Maint-APJ-Computing</SelectItem>
                    <SelectItem value="Prev Maint-APJ-Printing">Prev Maint-APJ-Printing</SelectItem>
                    <SelectItem value="DepotRepair">Depot Repair</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              
            </DialogFooter>
          </DialogContent>
        );
  
      default:
        return null;
    }
  }
  
  return (
    <>
    <Dialog open={open} onOpenChange={setOpen} >
      {renderStepContent()}
    <BtnModalsPartAdd 
      open2={modalPart} 
      setOpen2={setModalPart}
      partCatalog={partCatalog}
      selectedPartCatalog={selectedPartCatalog}
      setSelectedPartCatalog={setSelectedPartCatalog}
    />
    </Dialog>
    {/* <Button onClick={() => setWorkOpen(true)}>Open Work Order</Button> */}
  </>
  );
}

export function ServiceCatalogPartAdd({ onAddSuccess, onClose, isOpen, setIsOpen  }) {
  const [formData, setFormData] = useState({
    PartNumber: "",
    Keyword: "",
    PartDescription: "",
    Orderability: "",
    RestrictionReason: "",
    Price: "",
    FreightPrice: "",
    Shipping_Fee: "",
    qty_parts: "",
    Tax: "",
    Total: "",
    CSR_Flag: false,
    ROHS_Flag: false,
    Returnable_Flag: false,
    HardRoll_Flag: false,
    DangerousGoods_Flag: false,
    LithiumBattery_Flag: false,
    Oversize_Flag: false,
    Heavy_Flag: false,
  });

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    const requiredFields = [
      "PartNumber", "Keyword", "PartDescription", "Orderability",
      "Price", "qty_parts", "Tax", "Total"
    ];

    const missingFields = requiredFields.filter((field) => !formData[field]);
    if (missingFields.length > 0) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      const response = await ApiCustomer.post("/api/servicecatalog-parts", formData);
      alert("Service Catalog Part added successfully!");
      onAddSuccess && onAddSuccess();
      onClose && onClose();
    } catch (error) {
      console.error("Failed to add part:", error);
      alert("Failed to save service catalog part.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="ml-2 rounded-sm h-11">Add Part</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Service Catalog Part</DialogTitle>
          <DialogDescription>
            Fill in the fields to add a new part. * are required.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-2">
          <Label>Part Number*</Label>
          <Input id="PartNumber" value={formData.PartNumber} onChange={handleChange} />

          <Label>Keyword*</Label>
          <Input id="Keyword" value={formData.Keyword} onChange={handleChange} />

          <Label>Part Description*</Label>
          <Input id="PartDescription" value={formData.PartDescription} onChange={handleChange} />

          <Label>Orderability*</Label>
          <Input id="Orderability" value={formData.Orderability} onChange={handleChange} />

          <Label>Restriction Reason</Label>
          <Input id="RestrictionReason" value={formData.RestrictionReason} onChange={handleChange} />

          <Label>Price*</Label>
          <Input type="number" id="Price" value={formData.Price} onChange={handleChange} />

          <Label>Freight Price</Label>
          <Input type="number" id="FreightPrice" value={formData.FreightPrice} onChange={handleChange} />

          <Label>Shipping Fee</Label>
          <Input type="number" id="Shipping_Fee" value={formData.Shipping_Fee} onChange={handleChange} />

          <Label>Tax*</Label>
          <Input type="number" id="Tax" value={formData.Tax} onChange={handleChange} />

          <Label>Total*</Label>
          <Input type="number" id="Total" value={formData.Total} onChange={handleChange} />

          <div className="grid grid-cols-2 mt-4 gap-x-4 gap-y-2">
            <div><input type="checkbox" id="CSR_Flag" checked={formData.CSR_Flag} onChange={handleChange} /> <label htmlFor="CSR_Flag">CSR</label></div>
            <div><input type="checkbox" id="ROHS_Flag" checked={formData.ROHS_Flag} onChange={handleChange} /> <label htmlFor="ROHS_Flag">ROHS</label></div>
            <div><input type="checkbox" id="Returnable_Flag" checked={formData.Returnable_Flag} onChange={handleChange} /> <label htmlFor="Returnable_Flag">Returnable</label></div>
            <div><input type="checkbox" id="HardRoll_Flag" checked={formData.HardRoll_Flag} onChange={handleChange} /> <label htmlFor="HardRoll_Flag">Hard Roll</label></div>
            <div><input type="checkbox" id="DangerousGoods_Flag" checked={formData.DangerousGoods_Flag} onChange={handleChange} /> <label htmlFor="DangerousGoods_Flag">Dangerous Goods</label></div>
            <div><input type="checkbox" id="LithiumBattery_Flag" checked={formData.LithiumBattery_Flag} onChange={handleChange} /> <label htmlFor="LithiumBattery_Flag">Lithium Battery</label></div>
            <div><input type="checkbox" id="Oversize_Flag" checked={formData.Oversize_Flag} onChange={handleChange} /> <label htmlFor="Oversize_Flag">Oversize</label></div>
            <div><input type="checkbox" id="Heavy_Flag" checked={formData.Heavy_Flag} onChange={handleChange} /> <label htmlFor="Heavy_Flag">Heavy</label></div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>Add</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function ServiceCatalogPartEdit({ PartNumber, onUpdate }) {
  // console.log(PartNumber);
  const [isOpen, setIsOpen] = useState(false);
  const [partData, setPartData] = useState({
    PartNumber: "",
    Keyword: "",
    PartDescription: "",
    Orderability: "",
    RestrictionReason: "",
    Price: "",
    FreightPrice: "",
    Shipping_Fee: "",
    Tax: "",
    Total: "",
    CSR_Flag: false,
    ROHS_Flag: false,
    Returnable_Flag: false,
    HardRoll_Flag: false,
    DangerousGoods_Flag: false,
    LithiumBattery_Flag: false,
    Oversize_Flag: false,
    Heavy_Flag: false,
  });

  const fetchPart = async () => {
    try {
      const response = await ApiCustomer.get(`/api/servicecatalog-parts/${PartNumber}`);
      const data = response.data.data;
      console.log("Data Dari API", data);

      setPartData((prev) => ({
        ...prev,
        ...data,
      }));
    } catch (error) {
      console.error("Error fetching part data:", error);
    }
  };

  useEffect(() => {
    if (PartNumber && isOpen) {
      fetchPart();
      console.log("Sialan");
    }
  }, [PartNumber, isOpen]);

  const handleChange = (key, value) => {
    setPartData((prev) => ({ ...prev, [key]: value }));
  };

  const handleUpdate = async () => {
    try {
      await ApiCustomer.patch(`/api/servicecatalog-parts/${PartNumber}`, partData);
      onUpdate();
      setIsOpen(false);
    } catch (error) {
      console.error("Error updating part:", error);
    }
  };

  const flagFields = [
    "CSR_Flag",
    "ROHS_Flag",
    "Returnable_Flag",
    "HardRoll_Flag",
    "DangerousGoods_Flag",
    "LithiumBattery_Flag",
    "Oversize_Flag",
    "Heavy_Flag",
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={() => { setIsOpen(true); fetchPart();}}>
          <Pencil size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Service Catalog Part</DialogTitle>
          <DialogDescription>
            Update the part details and flags.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          {/* Input fields */}
          {Object.entries(partData).map(([key, value]) => {
            if (flagFields.includes(key)) return null; // Skip flags here
            return (
              <Input
                key={key}
                value={value || ""}
                placeholder={key}
                onChange={(e) => handleChange(key, e.target.value)}
              />
            );
          })}

          {/* Checkbox flags */}
          <div className="grid grid-cols-2 gap-2 pt-4">
            {flagFields.map((flag) => (
              <div key={flag} className="flex items-center space-x-2">
                <Checkbox
                  id={flag}
                  checked={!!partData[flag]}
                  onCheckedChange={(checked) => handleChange(flag, checked)}
                />
                <Label htmlFor={flag}>{flag.replace(/_/g, " ")}</Label>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleUpdate}>Update</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function ServiceCatalogPartDelete({ PartNumber, onUpdate }) {
  const handleDelete = async () => {
    try {
      await ApiCustomer.delete(`/api/servicecatalog-parts/${PartNumber}`);
      if (onUpdate) {
        onUpdate(); // untuk refresh data setelah delete
      }
    } catch (error) {
      console.error("Error deleting part:", error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="text-red-500 hover:text-red-700">
          <Trash size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Part</DialogTitle>
          <DialogDescription>
            Konfirmasi penghapusan part dari katalog.
          </DialogDescription>
        </DialogHeader>
        <h1>Anda yakin ingin menghapus part ini?</h1>
        <DialogFooter>
          <Button variant="destructive" onClick={handleDelete}>Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
export function BtnModalsPartAdd({
  open2, 
  setOpen2,
  partCatalog,
  selectedPartCatalog,
  setSelectedPartCatalog
}){
  const [tempSelectedParts, setTempSelectedParts] = useState([]);
  const handlerPartCatalog = (part, checked) => {
    if (checked) {
      setTempSelectedParts((prev) => [...prev, part]);
    } else {
      setTempSelectedParts((prev) =>
        prev.filter((item) => item.PartNumber !== part.PartNumber)
      );
    }
  };

  //search
  const [partNumberInput, setPartNumberInput] = useState("");
  const [partNumberSearch, setPartNumberSearch] = useState("");

  const filteredPartCatalog = partCatalog.filter(part => {
    return (
      part.PartNumber?.toLowerCase().includes(partNumberSearch.toLowerCase())
    );
  });
  
  return(
    <>
    <Dialog open={open2} onOpenChange={setOpen2}>
      <DialogContent className={' sm:min-w-[58vw] sm:min-h-[fit-content] flex flex-col justify-center'}>
        <DialogHeader className={''}>
          <DialogTitle className={'text-blue-600 text-2xl '}>Add Part</DialogTitle>
        </DialogHeader>
          <div className="flex items-center justify-between sm:max-w-full">
            <span className="flex items-center gap-2">
              <DialogDescription className={'whitespace-nowrap'}>Part Number</DialogDescription>
              <Input 
                className={'ring-1 min-w-[10em] ring-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500'}
                value={partNumberInput}
                onChange={(e) => setPartNumberInput(e.target.value)}
              />
              <Button 
                variant={'search'}
                onClick={(e) => setPartNumberSearch(partNumberInput)}
              >Search</Button>
            </span>
            <div className="bg-gray-300 flex gap-x-10 p-2 flex-1 max-w-[10em]">
                <p>Currency</p><p className="whitespace-nowrap">: </p>
            </div>
          </div>
          <div className="max-w-full overflow-x-auto">
            <Table className={''}>
              <TableHeader>
                <TableRow>
                  <TableHead className={'text-black font-bold'}>Select</TableHead>
                  <TableHead className={'text-black font-bold'}>Part #</TableHead>
                  <TableHead className={'text-black font-bold'}>Keyword</TableHead>
                  <TableHead className={'text-black font-bold'}>Part Description</TableHead>
                  <TableHead className={'font-black text-black'}>Orderability</TableHead>
                  <TableHead className={'font-black text-black whitespace-break-spaces'}>Restriction Reason</TableHead>
                  <TableHead className={'font-black text-black'}>CRS</TableHead>
                  <TableHead className={'font-black text-black'}>ROHS</TableHead>
                  <TableHead className={'font-black text-black'}>Retrunable</TableHead>
                  <TableHead className={'font-black text-black whitespace-break-spaces'}>Hard roll</TableHead>
                  <TableHead className={'font-black text-black whitespace-break-spaces'}>Dangerous Goods</TableHead>
                  <TableHead className={'font-black text-black whitespace-break-spaces'}>Lithium Battery</TableHead>
                  <TableHead className={'font-black text-black'}>Oversize</TableHead>
                  <TableHead className={'font-black text-black'}>Heavy</TableHead>
                  <TableHead className={'font-black text-black'}>Price</TableHead>
                  <TableHead className={'font-black text-black whitespace-break-spaces'}>Friegh Price</TableHead>
                  <TableHead className={'font-black text-black'}>Tax</TableHead>
                  <TableHead className={'font-black text-black'}>Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
              {
              filteredPartCatalog
              .filter(part => !selectedPartCatalog.some(selected => selected.PartNumber === part.PartNumber))
              .map((part, index) => {
                  const isChecked = tempSelectedParts.some((item) => item.PartNumber === part.PartNumber)
                  return (
                    <TableRow key={index}>
                      <TableCell className="flex">
                        <Checkbox 
                          checked={isChecked}
                          onCheckedChange={(checked) => handlerPartCatalog(part, checked)}
                        />
                      </TableCell>
                      <TableCell>{part.PartNumber}</TableCell>
                      <TableCell>{part.Keyword}</TableCell>
                      <TableCell>{part.PartDescription}</TableCell>
                      <TableCell>{part.Orderability ? 'Yes' : 'No'}</TableCell>
                      <TableCell>{part.ResistrictionReason}</TableCell>
                      <TableCell>{part.Csr ? 'Y' : 'N'}</TableCell>
                      <TableCell>{part.Rohs}</TableCell>
                      <TableCell>{part.Returnable_Flag ? 'true' : 'false'}</TableCell>
                      <TableCell>{part.Hardrolls}</TableCell>
                      <TableCell>{part.Dangerousgoods ? 'true' : 'false'}</TableCell>
                      <TableCell>{part.Lithiumbattry ? 'true' : 'false'}</TableCell>
                      <TableCell>{part.Oversize ? 'true' : 'false'}</TableCell>
                      <TableCell>{part.Heavy ? 'true' : 'false'}</TableCell>
                      <TableCell>{part.Price}</TableCell>
                      <TableCell>{part.Freightprice}</TableCell>
                      <TableCell>{part.Tax}</TableCell>
                      <TableCell>{part.Total}</TableCell>
                    </TableRow>
                  )
                })}
                <TableRow>
                    <TableCell colSpan={'100%'}>
                      <Pagination className={'flex justify-start'}>
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious href="#" />
                          </PaginationItem>
                          <PaginationItem>
                            <PaginationLink href="#">1</PaginationLink>
                          </PaginationItem>
                          <PaginationItem>
                            <PaginationLink href="#" isActive>
                              2
                            </PaginationLink>
                          </PaginationItem>
                          <PaginationItem>
                            <PaginationLink href="#">3</PaginationLink>
                          </PaginationItem>
                          <PaginationItem>
                            <PaginationEllipsis />
                          </PaginationItem>
                          <PaginationItem>
                            <PaginationNext href="#" />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    </TableCell>
                  </TableRow>
              </TableBody>
            </Table>
          </div>
          <DialogFooter className={'sm:justify-start'}>
            <Button 
              variant={'search'}
              onClick={() => {
                setSelectedPartCatalog((prev) => [
                  ...prev,
                  ...tempSelectedParts.filter(
                    (part) => !prev.some((p) => p.PartNumber === part.PartNumber)
                  ),
                ]);
                setTempSelectedParts([]); // ✅ clear after adding
                Swal.fire({
                  title: "Success!",
                  text: "Part(s) added successfully!",
                  icon: "success",
                  timer: 1500,
                  showConfirmButton: false,
                }).then(()=>{
                  setOpen2(false);
                });

              }}
            >Add Part</Button>
            <Button variant={'search'} onClick={() => { setTempSelectedParts([]); 
    setPartNumberInput("");
    setPartNumberSearch(""); }}>Clear</Button>
            <Button variant={'search'} onClick={() => setOpen2(false)}>Cancel</Button>
          </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  )
}

export function BtnModalsResourceAccountAdd({
  open,
  setOpen,
  resourceAccounts,
  selectedResourceAccounts,
  setSelectedResourceAccounts
}) {
  const [tempSelectedAccounts, setTempSelectedAccounts] = useState([]);
  const [nameInput, setNameInput] = useState("");
  const [nameSearch, setNameSearch] = useState("");

  const handleSelectAccount = (account, checked) => {
    if (checked) {
      setTempSelectedAccounts((prev) => [...prev, account]);
    } else {
      setTempSelectedAccounts((prev) =>
        prev.filter((item) => item.ResourceAccountId !== account.ResourceAccountId)
      );
    }
  };

  const filteredAccounts = resourceAccounts.filter(account =>
    account.Name.toLowerCase().includes(nameSearch.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:min-w-[50vw] sm:min-h-[fit-content] flex flex-col justify-center">
        <DialogHeader>
          <DialogTitle className="text-2xl text-blue-600">Add Resource Account</DialogTitle>
        </DialogHeader>

        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <DialogDescription className="whitespace-nowrap">Name</DialogDescription>
            <Input
              className="ring-1 min-w-[10em] ring-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
            />
            <Button variant="search" onClick={() => setNameSearch(nameInput)}>
              Search
            </Button>
          </span>
        </div>

        <div className="max-w-full mt-4 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Select</TableHead>
                <TableHead>Resource Account ID</TableHead>
                <TableHead>Name</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAccounts
                .filter(account => !selectedResourceAccounts.some(sel => sel.ResourceAccountId === account.ResourceAccountId))
                .map((account, index) => {
                  const isChecked = tempSelectedAccounts.some(item => item.ResourceAccountId === account.ResourceAccountId);
                  return (
                    <TableRow key={index}>
                      <TableCell>
                        <Checkbox
                          checked={isChecked}
                          onCheckedChange={(checked) => handleSelectAccount(account, checked)}
                        />
                      </TableCell>
                      <TableCell>{account.ResourceAccountId}</TableCell>
                      <TableCell>{account.Name}</TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </div>

        <DialogFooter className="mt-4 sm:justify-start">
          <Button
            variant="search"
            onClick={() => {
              setSelectedResourceAccounts((prev) => [
                ...prev,
                ...tempSelectedAccounts.filter(
                  (acc) => !prev.some((a) => a.ResourceAccountId === acc.ResourceAccountId)
                ),
              ]);
              setTempSelectedAccounts([]);
              Swal.fire({
                title: "Success!",
                text: "Resource Account(s) added successfully!",
                icon: "success",
                timer: 1500,
                showConfirmButton: false,
              }).then(() => {
                setOpen(false);
              });
            }}
          >
            Add Account
          </Button>
          <Button
            variant="search"
            onClick={() => {
              setTempSelectedAccounts([]);
              setNameInput("");
              setNameSearch("");
            }}
          >
            Clear
          </Button>
          <Button variant="search" onClick={() => setOpen(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// import { useState } from "react";
// import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import Swal from "sweetalert2";
// import { ApiCustomer } from "@/lib/axios";

export function ResourceAccountAdd() {
  const [formData, setFormData] = useState({
    ResourceAccountId: '',
    Name: '',
    ResourceId: '',
  });

  const [resources, setResources] = useState([]);

  useEffect(() => {
    // Fetch list of Resources untuk opsi select
    const fetchResources = async () => {
      try {
        const response = await ApiCustomer.get("/api/resources"); // pastikan endpoint ini sesuai
        setResources(response.data.data);
        // console.log("Hasil Respon",response.data.data);
      } catch (error) {
        console.error("Error fetching resources:", error);
      }
    };

    fetchResources();
  }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.ResourceAccountId || !formData.Name) {
      Swal.fire({
        title: "Incomplete Data",
        text: "ResourceAccountId and Name are required.",
        icon: "warning",
        timer: 1500,
        timerProgressBar: true,
        showConfirmButton: false,
      });
      return;
    }

    try {
      const response = await ApiCustomer.post("/api/resource-account", formData);
      console.log("Success:", response.data);
      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'ResourceAccount berhasil disimpan.',
        timer: 1200,
        timerProgressBar: true,
        showConfirmButton: false,
      }).then(() => {
        window.location.reload();
      });
    } catch (error) {
      console.error("Error saving ResourceAccount:", error);
      Swal.fire({
        title: "Error!",
        text: "Gagal menyimpan ResourceAccount. Silakan coba lagi.",
        icon: "error",
        timer: 1200,
        timerProgressBar: true,
        showConfirmButton: false,
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="ml-2 rounded-sm h-11">Add Resource Account</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add ResourceAccount</DialogTitle>
          <DialogDescription>Fields marked with * are required.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <Label>ResourceAccountId *</Label>
          <Input id="ResourceAccountId" value={formData.ResourceAccountId} onChange={handleInputChange} />

          <Label>Name *</Label>
          <Input id="Name" value={formData.Name} onChange={handleInputChange} />

          <Label>Resource (optional)</Label>
          <select
            id="ResourceId"
            value={formData.ResourceId || ""}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="">-- Select Resource --</option>
            {resources.map((resource) => (
              <option key={resource.ResourceId} value={resource.ResourceId}>
                {resource.Name || resource.ResourceId}
              </option>
            ))}
          </select>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>Add</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function ResourceAccountEdit({ ResourceAccountId, onUpdate, resources }) {
  const [resourceAccount, setResourceAccount] = useState(null);
  const [name, setName] = useState("");
  const [resourceId, setResourceId] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const fetchResourceAccount = async () => {
    if (!ResourceAccountId) return;
    try {
      const response = await ApiCustomer.get(`/api/resource-account/${ResourceAccountId}`);
      const data = response.data.data;
      setResourceAccount(data);
      setName(data?.Name || "");
      setResourceId(data?.ResourceId || "");
    } catch (error) {
      console.error("Error fetching ResourceAccount:", error);
    }
  };

  useEffect(() => {
    if (ResourceAccountId && isOpen) {
      fetchResourceAccount();
    }
  }, [ResourceAccountId, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setName("");
      setResourceId("");
    }
  }, [isOpen]);

  const handleUpdate = async () => {
    if (!name) {
      Swal.fire({
        title: "Incomplete Data",
        text: "Name is required.",
        icon: "warning",
        timer: 1200,
        timerProgressBar: true,
        showConfirmButton: false,
      });
      return;
    }

    try {
      await ApiCustomer.patch(`/api/resource-account/${ResourceAccountId}`, {
        Name: name,
        ResourceId: resourceId || null,
      });

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "ResourceAccount has been updated.",
        timer: 1200,
        timerProgressBar: true,
        showConfirmButton: false,
      }).then(() => {
        onUpdate(); // Refresh parent data
        setIsOpen(false);
      })



    } catch (error) {
      console.error("Error updating ResourceAccount:", error);
      Swal.fire({
        title: "Update Failed",
        text: "Could not update ResourceAccount. Please try again.",
        icon: "error",
        timer: 1200,
        timerProgressBar: true,
        showConfirmButton: false,
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={() => { setIsOpen(true); fetchResourceAccount(); }}>
          <Pencil />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit ResourceAccount</DialogTitle>
          <DialogDescription>
            Update the details of the ResourceAccount. Fields marked with * are required.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name*"
          />
          <select
            value={resourceId || ""}
            onChange={(e) => setResourceId(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="">-- Select Resource (optional) --</option>
            {resources.map((res) => (
              <option key={res.ResourceId} value={res.ResourceId}>
                {res.Name || res.ResourceId}
              </option>
            ))}
          </select>
        </div>
        <DialogFooter>
          <Button onClick={handleUpdate}>Update</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function ResourceAccountDelete({ ResourceAccountId, onUpdate }) {
 const handleDelete = async () => {
    const result = await Swal.fire({
      title: 'Apakah Anda yakin?',
      text: "Resource ini akan dihapus dan perubahan tidak bisa dibatalkan.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal',
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      const response = await ApiCustomer.delete(`/api/resource-account/${ResourceAccountId}`);

      if (response.status === 409 || response.data.success === false) {
        Swal.fire({
          icon: 'error',
          title: 'Gagal menghapus!',
          text: response.data.message || 'ResourceAccount tidak bisa dihapus karena ada relasi.',
        });
        return;
      }

      await Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'ResourceAccount berhasil dihapus.',
          timer: 1100,
          timerProgressBar: true,
          showConfirmButton: false,
        });

        // Call onUpdate AFTER Swal closes
        if (onUpdate) onUpdate();
    } catch (error) {
      if (error.response?.status === 409) {
        Swal.fire({
          icon: 'error',
          title: 'Tidak bisa menghapus!',
          text: 'ResourceAccount ini memiliki relasi yang masih aktif di tabel lain. Harap hapus data terkait terlebih dahulu.',
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Gagal!',
          text: error.response?.data?.message || 'Terjadi kesalahan saat menghapus ResourceAccount. Silakan coba lagi.',
        });
      }
    }
  };

  return (
    <Button
      variant="outline"
      className="text-red-500 hover:text-red-700"
      onClick={handleDelete}
    >
      <Trash />
    </Button>
  );
}

export function SubkTechnicianAdd() {
  const [formData, setFormData] = useState({
    SubkTechnicianId: '',
    Name: '',
    ResourceAccountId: '',
  });

  const [resourceAccounts, setResourceAccounts] = useState([])
  const fetchResourceAccounts = async () => {
    try {
      const res = await ApiCustomer.get("/api/resource-account?limit=1000"); // atau sesuaikan dengan pagination
      setResourceAccounts(res.data.data); // ambil array data
    } catch (error) {
      console.error("Failed to fetch resource accounts:", error);
    }
  };
  useEffect(() => {
    fetchResourceAccounts();
  }, []);


  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.SubkTechnicianId || !formData.Name) {
      Swal.fire({
        title: "Incomplete Data",
        text: "SubkTechnicianId and Name are required.",
        icon: "warning",
        timer: 1500,
        timerProgressBar: true,
        showConfirmButton: false,
      });
      return;
    }

    try {
      const response = await ApiCustomer.post("/api/subk-technician", {
        SubkTechnicianId: formData.SubkTechnicianId,
        Name: formData.Name,
        ResourceAccountId: formData.ResourceAccountId || null,
      });

      console.log("Success:", response.data);
      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'SubkTechnician berhasil disimpan.',
        timer: 1200,
        timerProgressBar: true,
        showConfirmButton: false,
      }).then(() => {
        window.location.reload();
      });
    } catch (error) {
      console.error("Error saving SubkTechnician:", error);
      Swal.fire({
        title: "Error!",
        text: "Gagal menyimpan SubkTechnician. Silakan coba lagi.",
        icon: "error",
        timer: 1200,
        timerProgressBar: true,
        showConfirmButton: false,
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="ml-2 rounded-sm h-11">Add Subk Technician</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add SubkTechnician</DialogTitle>
          <DialogDescription>Fields marked with * are required.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <Label>SubkTechnicianId *</Label>
          <Input id="SubkTechnicianId" value={formData.SubkTechnicianId} onChange={handleInputChange} />

          <Label>Name *</Label>
          <Input id="Name" value={formData.Name} onChange={handleInputChange} />

          <Label htmlFor="ResourceAccountId">Resource Account (optional)</Label>
          <select
            id="ResourceAccountId"
            value={formData.ResourceAccountId}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded"
          >
            <option value="">-- Select Resource Account --</option>
            {resourceAccounts.map((ra) => (
              <option key={ra.ResourceAccountId} value={ra.ResourceAccountId}>
                {ra.Name} ({ra.ResourceAccountId})
              </option>
            ))}
          </select>
          {/* <Label>ResourceAccountId (optional)</Label>
          <Input id="ResourceAccountId" value={formData.ResourceAccountId} onChange={handleInputChange} /> */}
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>Add</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function SubkTechnicianEdit({ SubkTechnicianId, onUpdate }) {
  const [subkTechnician, setSubkTechnician] = useState(null);
  const [name, setName] = useState("");
  const [resourceAccountId, setResourceAccountId] = useState("");
  const [resourceAccounts, setResourceAccounts] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const fetchSubkTechnician = async () => {
    if (!SubkTechnicianId) return;
    try {
      const response = await ApiCustomer.get(`/api/subk-technician/${SubkTechnicianId}`);
      const data = response.data.data;
      setSubkTechnician(data);
      setName(data?.Name || "");
      setResourceAccountId(data?.ResourceAccountId || "");
    } catch (error) {
      console.error("Error fetching SubkTechnician:", error);
    }
  };

  
  const fetchResourceAccounts = async () => {
    try {
      const res = await ApiCustomer.get("/api/resource-account?limit=1000");
      setResourceAccounts(res.data.data);
    } catch (error) {
      console.error("Failed to fetch resource accounts:", error);
    }
  };


  useEffect(() => {
    if (SubkTechnicianId && isOpen) {
      Swal.fire({
        title: "Auto close alert!",
        html: "I will close in milliseconds.",
        didOpen: () => {
          Swal.showLoading();
        }
      })
      fetchSubkTechnician();
      fetchResourceAccounts();
      Swal.close();
    }
  }, [SubkTechnicianId, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setName("");
      setResourceAccountId("");
    }
  }, [isOpen]);

  const handleUpdate = async () => {
    if (!name) {
      Swal.fire({
        title: "Incomplete Data",
        text: "Name is required.",
        icon: "warning",
        timer: 1200,
        timerProgressBar: true,
        showConfirmButton: false,
      });
      return;
    }

    try {
      await ApiCustomer.patch(`/api/subk-technician/${SubkTechnicianId}`, {
        Name: name,
        ResourceAccountId: resourceAccountId || null,
      });

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "SubkTechnician has been updated.",
        timer: 1200,
        timerProgressBar: true,
        showConfirmButton: false,
      });

      onUpdate(); // Refresh parent data
      setIsOpen(false);
    } catch (error) {
      console.error("Error updating SubkTechnician:", error);
      Swal.fire({
        title: "Update Failed",
        text: "Could not update SubkTechnician. Please try again.",
        icon: "error",
        timer: 1200,
        timerProgressBar: true,
        showConfirmButton: false,
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={() => { setIsOpen(true); fetchSubkTechnician(); }}>
          <Pencil />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit SubkTechnician</DialogTitle>
          <DialogDescription>
            Update the details of the SubkTechnician. Fields marked with * are required.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
        <Label>Name *</Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name*"
          />
           <Label htmlFor="ResourceAccountId">Resource Account (optional)</Label>
          <select
            id="ResourceAccountId"
            value={resourceAccountId}
            onChange={(e) => setResourceAccountId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded"
          >
            <option value="">-- Select Resource Account --</option>
            {resourceAccounts.map((ra) => (
              <option key={ra.ResourceAccountId} value={ra.ResourceAccountId}>
                {ra.Name} ({ra.ResourceAccountId})
              </option>
            ))}
          </select>
        </div>
        <DialogFooter>
          <Button onClick={handleUpdate}>Update</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function SubkTechnicianDelete({ SubkTechnicianId, onUpdate }) {
  const handleDelete = async () => {
    const result = await Swal.fire({
      title: 'Apakah Anda yakin?',
      text: "SubkTechnician ini akan dihapus dan perubahan tidak bisa dibatalkan.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal',
    });

    if (result.isConfirmed) {
      try {
        const response = await ApiCustomer.delete(`/api/subk-technician/${SubkTechnicianId}`);

        if (response.status === 409 || response.data.success === false) {
          Swal.fire({
            icon: 'warning',
            title: 'Tidak Bisa Dihapus!',
            text: response.data.message || "SubkTechnician ini memiliki keterkaitan dan tidak dapat dihapus.",
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false,
          });
          return;
        }

        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'SubkTechnician berhasil dihapus.',
          timer: 1500,
          timerProgressBar: true,
          showConfirmButton: false,
        }).then(() => {
          if (onUpdate) {
            onUpdate();
          } else {
            window.location.reload();
          }
        });
      } catch (error) {
        if (error.response?.status === 409) {
          Swal.fire({
            icon: 'warning',
            title: 'Tidak Bisa Dihapus!',
            text: error.response.data.message || "SubkTechnician ini tidak bisa dihapus karena memiliki relasi.",
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false,
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Gagal Menghapus!',
            text: 'Terjadi kesalahan saat menghapus SubkTechnician. Silakan coba lagi.',
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false,
          });
        }
      }
    }
  };

  return (
    <Button variant="outline" className="text-red-500 hover:text-red-700" onClick={handleDelete}>
      <Trash />
    </Button>
  );
}

export function SymptomCodeAdd({ onUpdate }) {
  const [formData, setFormData] = useState({
    SymptomCode: '',
    TopCategory: '',
    SubCategory: '',
    QualityCodes: '',
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.SymptomCode || !formData.TopCategory || !formData.SubCategory) {
      Swal.fire({
        title: "Incomplete Data",
        text: "SymptomCode, TopCategory, and SubCategory are required.",
        icon: "warning",
        timer: 1500,
        timerProgressBar: true,
        showConfirmButton: false,
      });
      return;
    }

    try {
      const response = await ApiCustomer.post("/api/symptom-codes", formData);

      console.log("Success:", response.data);
      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Symptom Code berhasil disimpan.',
        timer: 1200,
        timerProgressBar: true,
        showConfirmButton: false,
      }).then(() => {
        onUpdate?.();
      });
    } catch (error) {
      console.error("Error saving Symptom Code:", error);
      Swal.fire({
        title: "Error!",
        text: "Gagal menyimpan data. Silakan coba lagi.",
        icon: "error",
        timer: 1200,
        timerProgressBar: true,
        showConfirmButton: false,
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="mb-4 rounded-sm h-11">Add Symptom Code</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Symptom Code</DialogTitle>
          <DialogDescription>Fields marked with * are required.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <Label>SymptomCode *</Label>
          <Input id="SymptomCode" value={formData.SymptomCode} onChange={handleInputChange} />

          <Label>TopCategory *</Label>
          <Input id="TopCategory" value={formData.TopCategory} onChange={handleInputChange} />

          <Label>SubCategory *</Label>
          <Input id="SubCategory" value={formData.SubCategory} onChange={handleInputChange} />

          <Label>QualityCodes</Label>
          <Input id="QualityCodes" value={formData.QualityCodes} onChange={handleInputChange} />
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>Add</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function SymptomCodeEdit({ SymptomCodeID, onUpdate }) {
  const [isOpen, setIsOpen] = useState(false);
  const [symptomData, setSymptomData] = useState({
    SymptomCode: "",
    TopCategory: "",
    SubCategory: "",
    QualityCodes: "",
  });

  const fetchSymptomData = async () => {
    try {
      const response = await ApiCustomer.get(`/api/symptom-codes/${SymptomCodeID}`);
      const data = response.data.data;
      setSymptomData({
        SymptomCode: data?.SymptomCode || "",
        TopCategory: data?.TopCategory || "",
        SubCategory: data?.SubCategory || "",
        QualityCodes: data?.QualityCodes || "",
      });
    } catch (error) {
      console.error("Error fetching Symptom Code:", error);
    }
  };

  useEffect(() => {
    if (isOpen) fetchSymptomData();
  }, [isOpen]);

  const handleUpdate = async () => {
    const { SymptomCode, TopCategory, SubCategory } = symptomData;
    if (!SymptomCode || !TopCategory || !SubCategory) {
      Swal.fire({
        title: "Incomplete Data",
        text: "SymptomCode, TopCategory, and SubCategory are required.",
        icon: "warning",
        timer: 1200,
        showConfirmButton: false,
        timerProgressBar: true,
      });
      return;
    }

    try {
      await ApiCustomer.patch(`/api/symptom-codes/${SymptomCodeID}`, symptomData);
      Swal.fire({
        icon: "success",
        title: "Updated",
        text: "Symptom Code has been updated.",
        timer: 1200,
        showConfirmButton: false,
        timerProgressBar: true,
      }).then( () => {
        setIsOpen(false);
        onUpdate?.();
      })
    } catch (error) {
      console.error("Error updating Symptom Code:", error);
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: "Could not update Symptom Code.",
        timer: 1200,
        showConfirmButton: false,
        timerProgressBar: true,
      });
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setSymptomData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={() => setIsOpen(true)}>
          <Pencil />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Symptom Code</DialogTitle>
          <DialogDescription>Update the details of the symptom code. Fields marked with * are required.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <Input id="SymptomCode" value={symptomData.SymptomCode} onChange={handleChange} placeholder="SymptomCode *" />
          <Input id="TopCategory" value={symptomData.TopCategory} onChange={handleChange} placeholder="TopCategory *" />
          <Input id="SubCategory" value={symptomData.SubCategory} onChange={handleChange} placeholder="SubCategory *" />
          <Input id="QualityCodes" value={symptomData.QualityCodes} onChange={handleChange} placeholder="QualityCodes" />
        </div>
        <DialogFooter>
          <Button onClick={handleUpdate}>Update</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function SymptomCodeDelete({ SymptomCodeID, isModalOpen, setIsModalOpen, onUpdate }) {
  const handleDelete = async () => {
    const result = await Swal.fire({
      title: 'Apakah Anda yakin?',
      text: "Symptom Code ini akan dihapus dan tidak dapat dikembalikan.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal',
    });

    if (result.isConfirmed) {
      try {
        const response = await ApiCustomer.delete(`/api/symptom-codes/${SymptomCodeID}`);

        if (response.status === 409 || response.data.success === false) {
          Swal.fire({
            icon: 'warning',
            title: 'Tidak Bisa Dihapus!',
            text: response.data.message || "Symptom Code ini memiliki keterkaitan dan tidak dapat dihapus.",
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false,
          });
          return;
        }

        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Symptom Code berhasil dihapus.',
          timer: 1500,
          timerProgressBar: true,
          showConfirmButton: false,
        }).then(() => {
          if (onUpdate) {
            onUpdate();
          }
          setIsModalOpen(false);
        });
      } catch (error) {
        if (error.response?.status === 409) {
          Swal.fire({
            icon: 'warning',
            title: 'Tidak Bisa Dihapus!',
            text: error.response.data.message || "Symptom Code ini memiliki relasi dan tidak bisa dihapus.",
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false,
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Gagal Menghapus!',
            text: 'Terjadi kesalahan saat menghapus Symptom Code. Silakan coba lagi.',
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false,
          });
        }
      }
    }
  };

  return (
    <Button variant="outline" className="text-red-500 hover:text-red-700" onClick={handleDelete}>
      <Trash />
    </Button>
  );
}

export function BookingsAdd({ onUpdate }) {
  const [formData, setFormData] = useState({
    WOID: "",
    BookingStatus: "",
    ScheduleJeopardy: false,
    ScheduleJeopardyTime: "",
    DoNotDisturb: false,
    CeScheduleChange: false,
    TotalBillableDurationInMinutes: "",
    TotalInProgressDurationInMinutes: "",
    TotalBreakDurationInMinutes: "",
    CreatedBy: "",
  });

  const [workorders, setWorkorders] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [woRes, userRes] = await Promise.all([
          ApiCustomer.get("/api/work-order"),
          ApiCustomer.get("/api/user"),
        ]);
        setWorkorders(woRes.data.data || []);
        setUsers(userRes.data.data || []);
      } catch (error) {
        console.error("Failed to load dropdown data:", error);
      }
    };

    fetchDropdownData();
  }, []);

  const handleInputChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.WOID || !formData.CreatedBy) {
      Swal.fire({
        title: "Incomplete Data",
        text: "WOID and CreatedBy are required.",
        icon: "warning",
        timer: 1500,
        showConfirmButton: false,
        timerProgressBar: true,
      });
      return;
    }

    const dataToSend = {
      ...formData,
      ScheduleJeopardyTime: formData.ScheduleJeopardyTime ? new Date(formData.ScheduleJeopardyTime) : null,
      TotalBillableDurationInMinutes: formData.TotalBillableDurationInMinutes ? parseInt(formData.TotalBillableDurationInMinutes) : null,
      TotalInProgressDurationInMinutes: formData.TotalInProgressDurationInMinutes ? parseInt(formData.TotalInProgressDurationInMinutes) : null,
      TotalBreakDurationInMinutes: formData.TotalBreakDurationInMinutes ? parseInt(formData.TotalBreakDurationInMinutes) : null,
      CreatedBy: parseInt(formData.CreatedBy),
    };

    try {
      await ApiCustomer.post("/api/booking", dataToSend);
      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Booking berhasil disimpan.",
        timer: 1200,
        timerProgressBar: true,
        showConfirmButton: false,
      }).then(() => {
        onUpdate?.();
      });
    } catch (error) {
      console.error("Error saving Booking:", error);
      Swal.fire({
        title: "Error!",
        text: "Gagal menyimpan data. Silakan coba lagi.",
        icon: "error",
        timer: 1200,
        timerProgressBar: true,
        showConfirmButton: false,
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="mb-4 rounded-sm h-11">Add Booking</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Booking</DialogTitle>
          <DialogDescription>Fields marked with * are required.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <Label>WOID *</Label>
          <select
            id="WOID"
            value={formData.WOID}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          >
            <option value="">-- Select WOID --</option>
            {workorders.map((wo) => (
              <option key={wo.WOID} value={wo.WOID}>{wo.WOID}</option>
            ))}
          </select>

          <Label>Booking Status</Label>
          <Input id="BookingStatus" value={formData.BookingStatus} onChange={handleInputChange} />

          <div className="flex items-center space-x-2">
            <input type="checkbox" id="ScheduleJeopardy" checked={formData.ScheduleJeopardy} onChange={handleInputChange} />
            <Label htmlFor="ScheduleJeopardy">Schedule Jeopardy</Label>
          </div>

          <Label>Schedule Jeopardy Time</Label>
          <Input id="ScheduleJeopardyTime" type="datetime-local" value={formData.ScheduleJeopardyTime} onChange={handleInputChange} />

          <div className="flex items-center space-x-2">
            <input type="checkbox" id="DoNotDisturb" checked={formData.DoNotDisturb} onChange={handleInputChange} />
            <Label htmlFor="DoNotDisturb">Do Not Disturb</Label>
          </div>

          <div className="flex items-center space-x-2">
            <input type="checkbox" id="CeScheduleChange" checked={formData.CeScheduleChange} onChange={handleInputChange} />
            <Label htmlFor="CeScheduleChange">CE Schedule Change</Label>
          </div>

          <Label>Total Billable Duration (minutes)</Label>
          <Input id="TotalBillableDurationInMinutes" type="number" value={formData.TotalBillableDurationInMinutes} onChange={handleInputChange} />

          <Label>Total In Progress Duration (minutes)</Label>
          <Input id="TotalInProgressDurationInMinutes" type="number" value={formData.TotalInProgressDurationInMinutes} onChange={handleInputChange} />

          <Label>Total Break Duration (minutes)</Label>
          <Input id="TotalBreakDurationInMinutes" type="number" value={formData.TotalBreakDurationInMinutes} onChange={handleInputChange} />

          <Label>Created By *</Label>
          <select
            id="CreatedBy"
            value={formData.CreatedBy}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          >
            <option value="">-- Select User --</option>
            {users.map((user) => (
              <option key={user.IDUser} value={user.IDUser}>
                {user.Name || `User ${user.IDUser}`}
              </option>
            ))}
          </select>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>Add</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function BookingsEdit({ BookingId, onUpdate }) {
  const [isOpen, setIsOpen] = useState(false);
  const [bookingData, setBookingData] = useState({
    BookingStatus: "",
    ScheduleJeopardy: false,
    ScheduleJeopardyTime: "",
    DoNotDisturb: false,
    CeScheduleChange: false,
    TotalBillableDurationInMinutes: 0,
    TotalInProgressDurationInMinutes: 0,
    TotalBreakDurationInMinutes: 0,
  });

  const fetchBookingData = async () => {
    try {
      const res = await ApiCustomer.get(`/api/booking/${BookingId}`);
      const data = res.data.data;
      setBookingData({
        BookingStatus: data.BookingStatus || "",
        ScheduleJeopardy: data.ScheduleJeopardy || false,
        ScheduleJeopardyTime: data.ScheduleJeopardyTime?.slice(0, 16) || "",
        DoNotDisturb: data.DoNotDisturb || false,
        CeScheduleChange: data.CeScheduleChange || false,
        TotalBillableDurationInMinutes: data.TotalBillableDurationInMinutes || 0,
        TotalInProgressDurationInMinutes: data.TotalInProgressDurationInMinutes || 0,
        TotalBreakDurationInMinutes: data.TotalBreakDurationInMinutes || 0,
      });
    } catch (error) {
      console.error("Error fetching booking:", error);
    }
  };

  useEffect(() => {
    if (isOpen) fetchBookingData();
  }, [isOpen]);

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
  
    setBookingData((prev) => ({
      ...prev,
      [id]:
        type === "checkbox"
          ? checked
          : type === "number"
          ? parseInt(value) || 0
          : value,
    }));
  };

  const handleUpdate = async () => {
    try {
      await ApiCustomer.patch(`/api/booking/${BookingId}`, bookingData);
      Swal.fire({
        icon: "success",
        title: "Updated",
        text: "Booking has been updated.",
        timer: 1200,
        showConfirmButton: false,
        timerProgressBar: true,
      });
      setIsOpen(false);
      onUpdate?.();
    } catch (error) {
      console.error("Error updating booking:", error);
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: "Could not update Booking.",
        timer: 1500,
        showConfirmButton: false,
        timerProgressBar: true,
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={() => setIsOpen(true)}>
          <Pencil />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Edit Booking</DialogTitle>
          <DialogDescription>Update booking status and details below.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Input id="BookingStatus" value={bookingData.BookingStatus} onChange={handleChange} placeholder="Booking Status" />

          <div className="flex items-center space-x-2">
            <label htmlFor="ScheduleJeopardy">Schedule Jeopardy</label>
            <Checkbox
                id="ScheduleJeopardy"
                checked={bookingData.ScheduleJeopardy}
                onCheckedChange={(checked) =>
                  setBookingData((prev) => ({ ...prev, ScheduleJeopardy: checked }))
                }
              />
          </div>

          <Input
            id="ScheduleJeopardyTime"
            type="datetime-local"
            value={bookingData.ScheduleJeopardyTime}
            onChange={handleChange}
          />

          <div className="flex items-center space-x-2">
            <Checkbox id="DoNotDisturb" checked={bookingData.DoNotDisturb} onChange={handleChange} />
            <label htmlFor="DoNotDisturb">Do Not Disturb</label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="CeScheduleChange" checked={bookingData.CeScheduleChange} onChange={handleChange} />
            <label htmlFor="CeScheduleChange">CE Schedule Change</label>
          </div>

          <Input
            id="TotalBillableDurationInMinutes"
            type="number"
            value={bookingData.TotalBillableDurationInMinutes}
            onChange={handleChange}
            placeholder="Total Billable Duration (min)"
          />
          <Input
            id="TotalInProgressDurationInMinutes"
            type="number"
            value={bookingData.TotalInProgressDurationInMinutes}
            onChange={handleChange}
            placeholder="In-Progress Duration (min)"
          />
          <Input
            id="TotalBreakDurationInMinutes"
            type="number"
            value={bookingData.TotalBreakDurationInMinutes}
            onChange={handleChange}
            placeholder="Break Duration (min)"
          />
        </div>

        <DialogFooter className="pt-4">
          <Button onClick={handleUpdate}>Update</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// export function BookingsDelete({ BookingId, onUpdate }) {
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const handleDelete = async () => {
//     try {
//       const response = await ApiCustomer.delete(`/api/booking/${BookingId}`);

//       if (response.status === 409 || response.data.success === false) {
//         Swal.fire({
//           icon: "error",
//           title: "Cannot Delete",
//           text: response.data.message || "This booking cannot be deleted due to relational restrictions.",
//           timer: 1400,
//           showConfirmButton: false,
//           timerProgressBar: true,
//         });
//         return;
//       }

//       Swal.fire({
//         icon: "success",
//         title: "Deleted",
//         text: "Booking has been deleted successfully.",
//         timer: 1100,
//         showConfirmButton: false,
//         timerProgressBar: true,
//       });

//       setIsModalOpen(false);
//       onUpdate?.(); // Refresh list
//     } catch (error) {
//       Swal.fire({
//         icon: "error",
//         title: "Failed",
//         text: error?.response?.data?.message || "Failed to delete booking.",
//         timer: 1400,
//         showConfirmButton: false,
//         timerProgressBar: true,
//       });
//     }
//   };

//   return (
//     <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
//       <DialogTrigger asChild>
//         <Button variant="outline" className="text-red-500 hover:text-red-700" onClick={() => setIsModalOpen(true)}>
//           <Trash />
//         </Button>
//       </DialogTrigger>
//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>Delete Booking</DialogTitle>
//           <DialogDescription>Are you sure you want to delete this booking? This action cannot be undone.</DialogDescription>
//         </DialogHeader>
//         <p>This will permanently remove the booking record from the system.</p>
//         <DialogFooter>
//           <Button variant="destructive" onClick={handleDelete}>
//             Delete
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }

export function BookingsDelete({ BookingId, onUpdate }) {
  const handleDelete = async () => {
    const result = await Swal.fire({
      title: 'Apakah Anda yakin?',
      text: "Booking ini akan dihapus dan tidak dapat dikembalikan.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal',
    });

    if (result.isConfirmed) {
      try {
        const response = await ApiCustomer.delete(`/api/booking/${BookingId}`);

        if (response.status === 409 || response.data.success === false) {
          Swal.fire({
            icon: 'warning',
            title: 'Tidak Bisa Dihapus!',
            text: response.data.message || "Booking ini memiliki keterkaitan dan tidak dapat dihapus.",
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false,
          });
          return;
        }

        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Booking berhasil dihapus.',
          timer: 1500,
          timerProgressBar: true,
          showConfirmButton: false,
        }).then(() => {
          if (onUpdate) {
            onUpdate(); // untuk refresh list
          }
        });
      } catch (error) {
        if (error.response && error.response.status === 409) {
          Swal.fire({
            icon: 'warning',
            title: 'Tidak Bisa Dihapus!',
            text: error.response.data.message || "Booking ini tidak bisa dihapus karena memiliki relasi.",
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false,
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Gagal Menghapus!',
            text: 'Terjadi kesalahan saat menghapus Booking. Silakan coba lagi.',
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false,
          });
        }
      }
    }
  };

  return (
    <Button variant="outline" className="text-red-500 hover:text-red-700" onClick={handleDelete}>
      <Trash />
    </Button>
  );
}

export function BookingDetailsAdd({ onUpdate }) {
  const [formData, setFormData] = useState({
    BookingId: "",
    ResourceId: "",
    ResourceAccountId: "",
    SubkTechnicianId: "",
    Name: "",
    Status: "",
    StartTimeCustomerTime: "",
    EndTimeCustomerTime: "",
    EstimatedArrivalTimeCustomerTime: "",
    ActualArrivalTimeCustomerTime: "",
    StartTimeUserTime: "",
    EndTimeUserTime: "",
    DurationInMinutesUserTime: "",
    EstimatedArrivalTimeUserTime: "",
    ActualArrivalTimeUserTime: "",
    ChangedBy: "",
  });

  const [bookings, setBookings] = useState([]);
  const [resources, setResources] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [technicians, setTechnicians] = useState([]);

  

  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const [bookingRes, resourceRes, accountRes, techRes] = await Promise.all([
          ApiCustomer.get("/api/booking"),
          ApiCustomer.get("/api/resources"),
          ApiCustomer.get("/api/resource-account"),
          ApiCustomer.get("/api/subk-technician"),
        ]);

        setBookings(bookingRes.data.data || []);
        // console.log(getUserFromToken())
        setResources(resourceRes.data.data || []);
        setAccounts(accountRes.data.data || []);
        setTechnicians(techRes.data.data || []);
      } catch (error) {
        console.error("Dropdown fetch failed:", error);
      }
    };
    fetchDropdowns();
  }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const toFullISOString = (value) => {
    if (!value) return null;
    // Tambah ":00" jika hanya sampai menit
    return value.length === 16 ? value + ":00" : value;
  };
  
  const handleSubmit = async () => {
    const userSubmit = getUserFromToken();
    try {
      const payload = {
        ...formData,
        BookingId: parseInt(formData.BookingId),
        ResourceId: formData.ResourceId || null,
        ResourceAccountId: formData.ResourceAccountId || null,
        SubkTechnicianId: formData.SubkTechnicianId || null,
        DurationInMinutesUserTime: formData.DurationInMinutesUserTime ? parseInt(formData.DurationInMinutesUserTime) : null,
        ChangedBy: userSubmit.id,
        StartTimeCustomerTime: toFullISOString(formData.StartTimeCustomerTime),
        EndTimeCustomerTime: toFullISOString(formData.EndTimeCustomerTime),
        EstimatedArrivalTimeCustomerTime: toFullISOString(formData.EstimatedArrivalTimeCustomerTime),
        ActualArrivalTimeCustomerTime: toFullISOString(formData.ActualArrivalTimeCustomerTime),
        StartTimeUserTime: toFullISOString(formData.StartTimeUserTime),
        EndTimeUserTime: toFullISOString(formData.EndTimeUserTime),
        EstimatedArrivalTimeUserTime: toFullISOString(formData.EstimatedArrivalTimeUserTime),
        ActualArrivalTimeUserTime: toFullISOString(formData.ActualArrivalTimeUserTime),
      };
  
      await ApiCustomer.post("/api/bookingDetails", payload);
      Swal.fire({
         icon: "success", 
         title: "Success", 
         text: "Booking detail saved", 
         timer: 1200, 
         showConfirmButton: false });
       onUpdate?.();
    } catch (error) {
      console.error("ERROR in BookingDetails POST:", error);
      Swal.fire({ 
        icon: "error", 
        title: "Failed", 
        text: "Failed to save data", 
        timer: 1500, 
        showConfirmButton: false });
    }
  };
  

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="mb-4 rounded-sm h-11">Add Booking Detail</Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Add Booking Detail</DialogTitle>
          <DialogDescription>Lengkapi data berikut sesuai kebutuhan.</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Booking Info */}
          <div>
            <Label>Booking *</Label>
            <select id="BookingId" value={formData.BookingId} onChange={handleInputChange} className="w-full p-2 border rounded">
              <option value="">-- Select Booking --</option>
              {bookings.map((b) => <option key={b.BookingId} value={b.BookingId}>{b.BookingId} - {b.bookingDetails?.[0]?.ResourceId}</option>)}
            </select>
            {/* <Label htmlFor="BookingID">Booking ID</Label>
            <select
              id="BookingID"
              value={resourceAccountId}
              onChange={(e) => setResourceAccountId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            >
              <option value="">-- Select Resource Account --</option>
              {resourceAccounts.map((ra) => (
                <option key={ra.ResourceAccountId} value={ra.ResourceAccountId}>
                  {ra.Name} ({ra.ResourceAccountId})
                </option>
              ))}
            </select> */}
          </div>

          <div>
            <Label>Resource</Label>
            <select id="ResourceId" value={formData.ResourceId} onChange={handleInputChange} className="w-full p-2 border rounded">
              <option value="">-- Select Resource --</option>
              {resources.map((r) => <option key={r.ResourceId} value={r.ResourceId}>{r.Name || r.ResourceId}</option>)}
            </select>
          </div>

          <div>
            <Label>Resource Account</Label>
            <select id="ResourceAccountId" value={formData.ResourceAccountId} onChange={handleInputChange} className="w-full p-2 border rounded">
              <option value="">-- Select Account --</option>
              {accounts.map((a) => <option key={a.ResourceAccountId} value={a.ResourceAccountId}>{a.Name || a.ResourceAccountId}</option>)}
            </select>
          </div>

          <div>
            <Label>Subk Technician</Label>
            <select id="SubkTechnicianId" value={formData.SubkTechnicianId} onChange={handleInputChange} className="w-full p-2 border rounded">
              <option value="">-- Select Technician --</option>
              {technicians.map((t) => <option key={t.SubkTechnicianId} value={t.SubkTechnicianId}>{t.Name || t.SubkTechnicianId}</option>)}
            </select>
          </div>

          <div>
            <Label>Name</Label>
            <Input id="Name" value={formData.Name} onChange={handleInputChange} />
          </div>

          <div>
            <Label>Status</Label>
            <Input id="Status" value={formData.Status} onChange={handleInputChange} />
          </div>

          {/* Customer Time */}
          <div className="pt-2 border-t md:col-span-2">
            <p className="mb-1 font-semibold">Customer Time</p>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div><Label>Start Time</Label><Input type="datetime-local" id="StartTimeCustomerTime" value={formData.StartTimeCustomerTime} onChange={handleInputChange} /></div>
              <div><Label>End Time</Label><Input type="datetime-local" id="EndTimeCustomerTime" value={formData.EndTimeCustomerTime} onChange={handleInputChange} /></div>
              <div><Label>Estimated Arrival</Label><Input type="datetime-local" id="EstimatedArrivalTimeCustomerTime" value={formData.EstimatedArrivalTimeCustomerTime} onChange={handleInputChange} /></div>
              <div><Label>Actual Arrival</Label><Input type="datetime-local" id="ActualArrivalTimeCustomerTime" value={formData.ActualArrivalTimeCustomerTime} onChange={handleInputChange} /></div>
            </div>
          </div>

          {/* User Time */}
          <div className="pt-2 border-t md:col-span-2">
            <p className="mb-1 font-semibold">User Time</p>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div><Label>Start Time</Label><Input type="datetime-local" id="StartTimeUserTime" value={formData.StartTimeUserTime} onChange={handleInputChange} /></div>
              <div><Label>End Time</Label><Input type="datetime-local" id="EndTimeUserTime" value={formData.EndTimeUserTime} onChange={handleInputChange} /></div>
              <div><Label>Estimated Arrival</Label><Input type="datetime-local" id="EstimatedArrivalTimeUserTime" value={formData.EstimatedArrivalTimeUserTime} onChange={handleInputChange} /></div>
              <div><Label>Actual Arrival</Label><Input type="datetime-local" id="ActualArrivalTimeUserTime" value={formData.ActualArrivalTimeUserTime} onChange={handleInputChange} /></div>
              <div><Label>Duration (minutes)</Label><Input type="number" id="DurationInMinutesUserTime" value={formData.DurationInMinutesUserTime} onChange={handleInputChange} /></div>
            </div>
          </div>

          {/* <div>
            <Label>Changed By *</Label>
            <Input id="ChangedBy" type="number" value={formData.ChangedBy} onChange={handleInputChange} />
          </div> */}
        </div>

        <DialogFooter className="mt-4">
          <Button onClick={handleSubmit}>Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function BookingDetailsEdit({ BookingDetailId, onUpdate }) {
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({
    BookingId: 0,
    ResourceId: "",
    ResourceAccountId: "",
    SubkTechnicianId: "",
    Name: "",
    Status: "",

    // Customer Time
    StartTimeCustomerTime: "",
    EndTimeCustomerTime: "",
    EstimatedArrivalTimeCustomerTime: "",
    ActualArrivalTimeCustomerTime: "",

    // User Time
    StartTimeUserTime: "",
    EndTimeUserTime: "",
    DurationInMinutesUserTime: 0,
    EstimatedArrivalTimeUserTime: "",
    ActualArrivalTimeUserTime: "",
  });

  const fetchDetail = async () => {
    try {
      const res = await ApiCustomer.get(`/api/bookingDetails/${BookingDetailId}`);
      const data = res.data.data;

      setForm({
        BookingId: data.BookingId || 0,
        ResourceId: data.ResourceId || "",
        ResourceAccountId: data.ResourceAccountId || "",
        SubkTechnicianId: data.SubkTechnicianId || "",
        Name: data.Name || "",
        Status: data.Status || "",

        StartTimeCustomerTime: data.StartTimeCustomerTime?.slice(0, 16) || "",
        EndTimeCustomerTime: data.EndTimeCustomerTime?.slice(0, 16) || "",
        EstimatedArrivalTimeCustomerTime: data.EstimatedArrivalTimeCustomerTime?.slice(0, 16) || "",
        ActualArrivalTimeCustomerTime: data.ActualArrivalTimeCustomerTime?.slice(0, 16) || "",

        StartTimeUserTime: data.StartTimeUserTime?.slice(0, 16) || "",
        EndTimeUserTime: data.EndTimeUserTime?.slice(0, 16) || "",
        EstimatedArrivalTimeUserTime: data.EstimatedArrivalTimeUserTime?.slice(0, 16) || "",
        ActualArrivalTimeUserTime: data.ActualArrivalTimeUserTime?.slice(0, 16) || "",
        DurationInMinutesUserTime: data.DurationInMinutesUserTime || 0,
      });
    } catch (error) {
      console.error("Error fetching booking detail:", error);
    }
  };

  useEffect(() => {
    if (isOpen && BookingDetailId) fetchDetail();
  }, [isOpen]);

  const handleChange = (e) => {
    const { id, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [id]: type === "number" ? parseInt(value) || 0 : value,
    }));
  };

  const [bookings, setBookings] = useState([]);
  const [resources, setResources] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [technicians, setTechnicians] = useState([]);

  

  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const [bookingRes, resourceRes, accountRes, techRes] = await Promise.all([
          ApiCustomer.get("/api/booking"),
          ApiCustomer.get("/api/resources"),
          ApiCustomer.get("/api/resource-account"),
          ApiCustomer.get("/api/subk-technician"),
        ]);

        setBookings(bookingRes.data.data || []);
        // console.log(getUserFromToken())
        setResources(resourceRes.data.data || []);
        setAccounts(accountRes.data.data || []);
        setTechnicians(techRes.data.data || []);
      } catch (error) {
        console.error("Dropdown fetch failed:", error);
      }
    };
    fetchDropdowns();
  }, []);

  const toFullISOString = (value) => {
    if (!value) return null;
    // Tambah ":00" jika hanya sampai menit
    return value.length === 16 ? value + ":00" : value;
  };

  const handleSubmit = async () => {
    const userSubmit = getUserFromToken();
    try {
      const payload = {
        // ...formData,
        BookingId: parseInt(form.BookingId),
        ResourceId: form.ResourceId || null,
        ResourceAccountId: form.ResourceAccountId || null,
        SubkTechnicianId: form.SubkTechnicianId || null,
        DurationInMinutesUserTime: form.DurationInMinutesUserTime ? parseInt(form.DurationInMinutesUserTime) : null,
        ChangedBy: userSubmit.id,
        StartTimeCustomerTime: toFullISOString(form.StartTimeCustomerTime),
        EndTimeCustomerTime: toFullISOString(form.EndTimeCustomerTime),
        EstimatedArrivalTimeCustomerTime: toFullISOString(form.EstimatedArrivalTimeCustomerTime),
        ActualArrivalTimeCustomerTime: toFullISOString(form.ActualArrivalTimeCustomerTime),
        StartTimeUserTime: toFullISOString(form.StartTimeUserTime),
        EndTimeUserTime: toFullISOString(form.EndTimeUserTime),
        EstimatedArrivalTimeUserTime: toFullISOString(form.EstimatedArrivalTimeUserTime),
        ActualArrivalTimeUserTime: toFullISOString(form.ActualArrivalTimeUserTime),
      };
  
      await ApiCustomer.patch(`/api/bookingDetails/${BookingDetailId}`, payload);
      Swal.fire({
        icon: "success",
        title: "Updated",
        text: "Booking detail has been updated.",
        timer: 1200,
        showConfirmButton: false,
        timerProgressBar: true,
      });
      setIsOpen(false);
      onUpdate?.();
    } catch (error) {
      console.error("Error updating booking detail:", error);
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: "Could not update booking detail.",
        timer: 1500,
        showConfirmButton: false,
        timerProgressBar: true,
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={() => setIsOpen(true)}>
          <Pencil />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Booking Detail</DialogTitle>
          <DialogDescription>Update all necessary fields below.</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto">
          <div>
            <label htmlFor="BookingId">Booking ID</label>
            <select id="BookingId" value={form.BookingId} onChange={handleChange} className="w-full p-2 border rounded">
              <option value="">-- Select Booking --</option>
              {bookings.map((b) => <option key={b.BookingId} value={b.BookingId}>{b.BookingId} - {b.bookingDetails?.[0]?.ResourceId}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="ResourceId">Resource ID</label>
            <select id="ResourceId" value={form.ResourceId} onChange={handleChange} className="w-full p-2 border rounded">
              <option value="">-- Select Resource --</option>
              {resources.map((r) => <option key={r.ResourceId} value={r.ResourceId}>{r.Name || r.ResourceId}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="ResourceAccountId">Resource Account ID</label>
             <select id="ResourceAccountId" value={form.ResourceAccountId} onChange={handleChange} className="w-full p-2 border rounded">
              <option value="">-- Select Account --</option>
              {accounts.map((a) => <option key={a.ResourceAccountId} value={a.ResourceAccountId}>{a.Name || a.ResourceAccountId}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="SubkTechnicianId">Subk Technician ID</label>
            <select id="SubkTechnicianId" value={form.SubkTechnicianId} onChange={handleChange} className="w-full p-2 border rounded">
              <option value="">-- Select Technician --</option>
              {technicians.map((t) => <option key={t.SubkTechnicianId} value={t.SubkTechnicianId}>{t.Name || t.SubkTechnicianId}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="Name">Name</label>
            <Input id="Name" value={form.Name} onChange={handleChange} />
          </div>
          <div>
            <label htmlFor="Status">Status</label>
            <Input id="Status" value={form.Status} onChange={handleChange} />
          </div>
        </div>

        {/* Customer Time Section */}
        <div className="mt-6">
          <h3 className="mb-2 text-lg font-semibold">Customer Time</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="StartTimeCustomerTime">Start Time</label>
              <Input id="StartTimeCustomerTime" type="datetime-local" value={form.StartTimeCustomerTime} onChange={handleChange} />
            </div>
            <div>
              <label htmlFor="EndTimeCustomerTime">End Time</label>
              <Input id="EndTimeCustomerTime" type="datetime-local" value={form.EndTimeCustomerTime} onChange={handleChange} />
            </div>
            <div>
              <label htmlFor="EstimatedArrivalTimeCustomerTime">Estimated Arrival Time</label>
              <Input id="EstimatedArrivalTimeCustomerTime" type="datetime-local" value={form.EstimatedArrivalTimeCustomerTime} onChange={handleChange} />
            </div>
            <div>
              <label htmlFor="ActualArrivalTimeCustomerTime">Actual Arrival Time</label>
              <Input id="ActualArrivalTimeCustomerTime" type="datetime-local" value={form.ActualArrivalTimeCustomerTime} onChange={handleChange} />
            </div>
          </div>
        </div>

        {/* User Time Section */}
        <div className="mt-6">
          <h3 className="mb-2 text-lg font-semibold">User Time</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="StartTimeUserTime">Start Time</label>
              <Input id="StartTimeUserTime" type="datetime-local" value={form.StartTimeUserTime} onChange={handleChange} />
            </div>
            <div>
              <label htmlFor="EndTimeUserTime">End Time</label>
              <Input id="EndTimeUserTime" type="datetime-local" value={form.EndTimeUserTime} onChange={handleChange} />
            </div>
            <div>
              <label htmlFor="EstimatedArrivalTimeUserTime">Estimated Arrival Time</label>
              <Input id="EstimatedArrivalTimeUserTime" type="datetime-local" value={form.EstimatedArrivalTimeUserTime} onChange={handleChange} />
            </div>
            <div>
              <label htmlFor="ActualArrivalTimeUserTime">Actual Arrival Time</label>
              <Input id="ActualArrivalTimeUserTime" type="datetime-local" value={form.ActualArrivalTimeUserTime} onChange={handleChange} />
            </div>
            <div>
              <label htmlFor="DurationInMinutesUserTime">Duration (min)</label>
              <Input id="DurationInMinutesUserTime" type="number" value={form.DurationInMinutesUserTime} onChange={handleChange} />
            </div>
          </div>
        </div>

        {/* <div className="grid grid-cols-2 gap-4 mt-6">
          <div>
            <label htmlFor="ChangedBy">Changed By (User ID)</label>
            <Input id="ChangedBy" type="number" value={form.ChangedBy} onChange={handleChange} />
          </div>
        </div> */}

        <DialogFooter className="pt-4">
          <Button onClick={handleSubmit}>Update</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function BookingDetailsDelete({ BookingDetailId, onUpdate }) {
  const handleDelete = async () => {
    const result = await Swal.fire({
      title: 'Apakah Anda yakin?',
      text: "Booking detail ini akan dihapus dan tindakan ini tidak bisa dibatalkan.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal',
    });

    if (result.isConfirmed) {
      try {
        const response = await ApiCustomer.delete(`/api/bookingDetails/${BookingDetailId}`);

        if (response.status === 409 || response.data.success === false) {
          Swal.fire({
            icon: 'warning',
            title: 'Tidak Bisa Dihapus!',
            text: response.data.message || "Booking detail ini memiliki relasi dan tidak bisa dihapus.",
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false,
          });
          return;
        }

        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Booking detail berhasil dihapus.',
          timer: 1500,
          timerProgressBar: true,
          showConfirmButton: false,
        }).then(() => {
          if (onUpdate) onUpdate(); // Refresh list or trigger update
        });

      } catch (error) {
        if (error.response && error.response.status === 409) {
          Swal.fire({
            icon: 'warning',
            title: 'Tidak Bisa Dihapus!',
            text: error.response.data.message || "Booking detail ini tidak bisa dihapus karena memiliki relasi.",
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false,
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Gagal Menghapus!',
            text: 'Terjadi kesalahan saat menghapus Booking detail. Silakan coba lagi.',
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false,
          });
        }
      }
    }
  };

  return (
    <Button variant="outline" className="text-red-500 hover:text-red-700" onClick={handleDelete}>
      <Trash />
    </Button>
  );
}

export function RepairClassCodeAdd() {
  const [formData, setFormData] = useState({
    Code: "",
    Description: "",
    Definition: "",
    PaymentEligibility: "",
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.Code || !formData.Description || !formData.PaymentEligibility) {
      Swal.fire({
        icon: "warning",
        title: "Incomplete Data",
        text: "Code, Description, and PaymentEligibility are required.",
        timer: 1500,
        showConfirmButton: false,
      });
      return;
    }

    try {
      await ApiCustomer.post("/api/repairClassCode", formData);
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Repair Class Code saved",
        timer: 1200,
        showConfirmButton: false,
      }).then(() => {
        window.location.reload();
      });
    } catch (error) {
      console.error("Failed to save repairClassCode:", error);
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "Failed to save data",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="mb-4 rounded-sm h-11">Add Repair Class Code</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Repair Class Code</DialogTitle>
          <DialogDescription>Fields marked with * are required.</DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <Label>Code *</Label>
          <Input id="Code" value={formData.Code} onChange={handleInputChange} maxLength={3} />

          <Label>Description *</Label>
          <Input id="Description" value={formData.Description} onChange={handleInputChange} maxLength={100} />

          <Label>Definition</Label>
          <Input id="Definition" value={formData.Definition} onChange={handleInputChange} maxLength={255} />

          <Label>Payment Eligibility *</Label>
          <select
            id="PaymentEligibility"
            value={formData.PaymentEligibility}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          >
            <option value="">-- Select Eligibility --</option>
            <option value="Eligible">Eligible</option>
            <option value="Not_Eligible">Not Eligible</option>
          </select>
        </div>

        <DialogFooter className="mt-4">
          <Button onClick={handleSubmit}>Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function RepairClassCodeEdit({ Code }) {
  const [description, setDescription] = useState("");
  const [definition, setDefinition] = useState("");
  const [paymentEligibility, setPaymentEligibility] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const fetchData = async () => {
    try {
      const response = await ApiCustomer.get(`/api/repairClassCode/${Code}`);
      const data = response.data.data;
      setDescription(data.Description || "");
      setDefinition(data.Definition || "");
      setPaymentEligibility(data.PaymentEligibility || "");
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  const handleUpdate = async () => {
    if (!description || !definition || !paymentEligibility) {
      Swal.fire({
        icon: "warning",
        title: "Incomplete Data",
        text: "All fields are required.",
        timer: 1500,
        timerProgressBar: true,
        showConfirmButton: false,
      });
      return;
    }

    try {
      await ApiCustomer.patch(`/api/repairClassCode/${Code}`, {
        Description: description,
        Definition: definition,
        PaymentEligibility: paymentEligibility,
      });

      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: "Repair Class Code has been updated.",
        timer: 1200,
        timerProgressBar: true,
        showConfirmButton: false,
      }).then(() => {
        window.location.reload();
      });
    } catch (error) {
      console.error("Update error:", error);
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: "Failed to update Repair Class Code. Please try again.",
        timer: 1500,
        timerProgressBar: true,
        showConfirmButton: false,
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={() => setIsOpen(true)}>
          <Pencil size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Repair Class Code</DialogTitle>
          <DialogDescription>
            Update the repair class code data. All fields are required.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
          />
          <Input
            value={definition}
            onChange={(e) => setDefinition(e.target.value)}
            placeholder="Definition"
          />
          <select
            value={paymentEligibility}
            onChange={(e) => setPaymentEligibility(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="">-- Select Payment Eligibility --</option>
            <option value="Eligible">Eligible</option>
            <option value="Not_Eligible">Not Eligible</option>
          </select>
        </div>

        <DialogFooter>
          <Button onClick={handleUpdate}>Update</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function RepairClassCodeDelete({ Code, isModalOpen, setIsModalOpen, onUpdate }) {
  const handleDelete = async () => {
    const result = await Swal.fire({
      title: 'Apakah Anda yakin?',
      text: "Kode klasifikasi perbaikan ini akan dihapus dan perubahan tidak bisa dibatalkan.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal',
    });

    if (result.isConfirmed) {
      try {
        const response = await ApiCustomer.delete(`/api/repairClassCode/${Code}`);

        if (response.status === 409 || response.data.success === false) {
          Swal.fire({
            icon: 'warning',
            title: 'Tidak Bisa Dihapus!',
            text: response.data.message || "Data ini memiliki relasi dan tidak dapat dihapus.",
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false,
          });
          return;
        }

        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Data klasifikasi berhasil dihapus.',
          timer: 1500,
          timerProgressBar: true,
          showConfirmButton: false,
        }).then(() => {
          window.location.reload(); // Memuat ulang halaman
          if (onUpdate) {
            onUpdate();
          }
        });
      } catch (error) {
        if (error.response && error.response.status === 409) {
          Swal.fire({
            icon: 'warning',
            title: 'Tidak Bisa Dihapus!',
            text: error.response.data.message || "Data ini tidak bisa dihapus karena memiliki keterkaitan.",
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false,
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Gagal Menghapus!',
            text: 'Terjadi kesalahan saat menghapus data. Silakan coba lagi.',
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false,
          });
        }
      }
    }
  };

  return (
    <Button variant="outline" className="text-red-500 hover:text-red-700" onClick={handleDelete}>
      <Trash />
    </Button>
  );
}

export function ServiceCatalogAdd() {
  const [formData, setFormData] = useState({
    AssetID: '',
    Service_offerID: '',
    PartNumber: '',
    WarrantyStatus: '',
    Currency: '',
    Price: '',
    Tax: '',
    Total: ''
  });

  const [assets, setAssets] = useState([]);
  const [warranties, setWarranties] = useState([]);
  const [parts, setParts] = useState([]);

  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const [assetRes, warrantyRes, partRes] = await Promise.all([
          ApiCustomer.get("/api/asset-information"),
          ApiCustomer.get("/api/warranty-services"),
          ApiCustomer.get("/api/servicecatalog-parts")
        ]);
        setAssets(assetRes.data.data);
        setWarranties(warrantyRes.data.data);
        setParts(partRes.data.data);
      } catch (error) {
        console.error("Failed to fetch dropdown data", error);
      }
    };

    fetchDropdowns();
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (field) => (value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {[]
    const { AssetID, Service_offerID } = formData;

    if (!AssetID || !Service_offerID) {
      Swal.fire({
        title: "Incomplete Data",
        text: "Please fill in all required fields before submitting.",
        icon: "warning",
        timer: 1500,
        showConfirmButton: false,
      });
      return;
    }

    try {
      const payload = {
        ...formData,
        AssetID: parseInt(formData.AssetID),
        Price: formData.Price ? parseFloat(formData.Price) : null,
        Tax: formData.Tax ? parseFloat(formData.Tax) : null,
        Total: formData.Total ? parseFloat(formData.Total) : null
      };

      await ApiCustomer.post("/api/service-log", payload);

      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Service Catalog berhasil disimpan.',
        timer: 1200,
        showConfirmButton: false,
      }).then(() => {
        window.location.reload();
      });

    } catch (err) {
      console.error("Error saving Service Catalog", err);
      Swal.fire({
        title: "Error!",
        text: "Failed to save Service Catalog. Please try again.",
        icon: "error",
        timer: 1200,
        showConfirmButton: false,
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="ml-2 rounded-sm h-11">Add Service Catalog</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Service Catalog</DialogTitle>
          <DialogDescription>Fields marked with * are required.</DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <Label>Asset *</Label>
          <Select onValueChange={handleSelectChange("AssetID")}>
            <SelectTrigger>
              <SelectValue placeholder="Select Asset ID" />
            </SelectTrigger>
            <SelectContent>
              {assets.map((asset) => (
                <SelectItem key={asset.AssetID} value={String(asset.AssetID)}>
                  {asset.AssetID} - {asset.Name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Label>Service Offer *</Label>
          <Select onValueChange={handleSelectChange("Service_offerID")}>
            <SelectTrigger>
              <SelectValue placeholder="Select Service Offer ID" />
            </SelectTrigger>
            <SelectContent>
              {warranties.map((w) => (
                <SelectItem key={w.Service_offerID} value={w.Service_offerID}>
                  {w.Service_offerID} - {w.Description}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Label>Part Number</Label>
          <Select onValueChange={handleSelectChange("PartNumber")}>
            <SelectTrigger>
              <SelectValue placeholder="Select Part Number" />
            </SelectTrigger>
            <SelectContent>
              {parts.map((p) => (
                <SelectItem key={p.PartNumber} value={p.PartNumber}>
                  {p.PartNumber}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Label>Warranty Status</Label>
          <Input id="WarrantyStatus" value={formData.WarrantyStatus} onChange={handleChange} />

          <Label>Currency</Label>
          <Input id="Currency" value={formData.Currency} onChange={handleChange} />

          <Label>Price</Label>
          <Input id="Price" type="number" step="0.01" value={formData.Price} onChange={handleChange} />

          <Label>Tax</Label>
          <Input id="Tax" type="number" step="0.01" value={formData.Tax} onChange={handleChange} />

          <Label>Total</Label>
          <Input id="Total" type="number" step="0.01" value={formData.Total} onChange={handleChange} />
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>Add</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function ServiceCatalogEdit({ ServiceCatalogID, onUpdate }) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    AssetID: '',
    Service_offerID: '',
    PartNumber: '',
    WarrantyStatus: '',
    Currency: '',
    Price: '',
    Tax: '',
    Total: ''
  });

  const [assets, setAssets] = useState([]);
  const [warranties, setWarranties] = useState([]);
  const [parts, setParts] = useState([]);

  useEffect(() => {
    if (!open) return;

    const fetchAll = async () => {
      try {
        const [assetRes, warrantyRes, partRes, scRes] = await Promise.all([
          ApiCustomer.get("/api/asset-information"),
          ApiCustomer.get("/api/warranty-services"),
          ApiCustomer.get("/api/servicecatalog-parts"),
          ApiCustomer.get(`/api/service-log/${ServiceCatalogID}`),
        ]);

        setAssets(assetRes.data.data);
        setWarranties(warrantyRes.data.data);
        setParts(partRes.data.data);

        const data = scRes.data.data;
        setFormData({
          AssetID: data.AssetID?.toString() || '',
          Service_offerID: data.Service_offerID || '',
          PartNumber: data.PartNumber || '',
          WarrantyStatus: data.WarrantyStatus || '',
          Currency: data.Currency || '',
          Price: data.Price || '',
          Tax: data.Tax || '',
          Total: data.Total || ''
        });
      } catch (error) {
        console.error("Failed to fetch edit data", error);
      }
    };

    fetchAll();
  }, [open, ServiceCatalogID]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (field) => (value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        ...formData,
        AssetID: parseInt(formData.AssetID),
        Price: formData.Price ? parseFloat(formData.Price) : null,
        Tax: formData.Tax ? parseFloat(formData.Tax) : null,
        Total: formData.Total ? parseFloat(formData.Total) : null
      };

      await ApiCustomer.patch(`/api/service-log/${ServiceCatalogID}`, payload);

      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: "Service Catalog berhasil diperbarui.",
        timer: 1200,
        showConfirmButton: false,
      });

      setOpen(false);
      if (onUpdate) onUpdate();
    } catch (err) {
      console.error("Error updating Service Catalog", err);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Gagal memperbarui Service Catalog.",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Pencil className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Service Catalog</DialogTitle>
          <DialogDescription>Update the selected service catalog entry.</DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Label>Asset *</Label>
          <Select value={formData.AssetID} onValueChange={handleSelectChange("AssetID")}>
            <SelectTrigger>
              <SelectValue placeholder="Select Asset ID" />
            </SelectTrigger>
            <SelectContent>
              {assets.map((asset) => (
                <SelectItem key={asset.AssetID} value={String(asset.AssetID)}>
                  {asset.AssetID} - {asset.Name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Label>Service Offer *</Label>
          <Select value={formData.Service_offerID} onValueChange={handleSelectChange("Service_offerID")}>
            <SelectTrigger>
              <SelectValue placeholder="Select Service Offer ID" />
            </SelectTrigger>
            <SelectContent>
              {warranties.map((w) => (
                <SelectItem key={w.Service_offerID} value={w.Service_offerID}>
                  {w.Service_offerID} - {w.Description}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Label>Part Number</Label>
          <Select value={formData.PartNumber} onValueChange={handleSelectChange("PartNumber")}>
            <SelectTrigger>
              <SelectValue placeholder="Select Part Number" />
            </SelectTrigger>
            <SelectContent>
              {parts.map((p) => (
                <SelectItem key={p.PartNumber} value={p.PartNumber}>
                  {p.PartNumber}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Label>Warranty Status</Label>
          <Input id="WarrantyStatus" value={formData.WarrantyStatus} onChange={handleChange} />

          <Label>Currency</Label>
          <Input id="Currency" value={formData.Currency} onChange={handleChange} />

          <Label>Price</Label>
          <Input id="Price" type="number" step="0.01" value={formData.Price} onChange={handleChange} />

          <Label>Tax</Label>
          <Input id="Tax" type="number" step="0.01" value={formData.Tax} onChange={handleChange} />

          <Label>Total</Label>
          <Input id="Total" type="number" step="0.01" value={formData.Total} onChange={handleChange} />
        </div>

        <DialogFooter>
          <Button onClick={handleSubmit}>Update</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function ServiceCatalogDelete({ ServiceCatalogID, onUpdate }) {
  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Data Service Catalog ini akan dihapus dan perubahan tidak bisa dibatalkan.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        const response = await ApiCustomer.delete(`/api/service-log/${ServiceCatalogID}`);

        if (response.status === 409 || response.data.success === false) {
          Swal.fire({
            icon: "warning",
            title: "Tidak Bisa Dihapus!",
            text:
              response.data.message ||
              "Service Catalog ini memiliki keterkaitan data lain dan tidak dapat dihapus.",
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false,
          });
          return;
        }

        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "Service Catalog berhasil dihapus.",
          timer: 1500,
          timerProgressBar: true,
          showConfirmButton: false,
        }).then(() => {
          if (onUpdate) {
            onUpdate(); // Refresh data
          }
        });
      } catch (error) {
        if (error.response?.status === 409) {
          Swal.fire({
            icon: "warning",
            title: "Tidak Bisa Dihapus!",
            text:
              error.response.data.message ||
              "Service Catalog ini tidak bisa dihapus karena memiliki relasi.",
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false,
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Gagal Menghapus!",
            text: "Terjadi kesalahan saat menghapus data. Silakan coba lagi.",
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false,
          });
        }
      }
    }
  };

  return (
    <Button
      variant="outline"
      className="text-red-500 hover:text-red-700"
      onClick={handleDelete}
    >
      <Trash />
    </Button>
  );
}



export function OTCAdd({ onUpdate }) {
  const [formData, setFormData] = useState({
    OTCCode: "",
    Description: ""
  });

  const handleInputChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.OTCCode || !formData.Description) {
      Swal.fire({
        title: "Incomplete Data",
        text: "All fields are required.",
        icon: "warning",
        timer: 1500,
        showConfirmButton: false,
        timerProgressBar: true,
      });
      return
    }

    try {
      console.log("Form Data : ",formData)
      await ApiCustomer.post("/api/otc-code", formData);
      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "OTC Code berhasil disimpan.",
        timer: 1200,
        timerProgressBar: true,
        showConfirmButton: false,
      }).then(() => {
        window.location.reload();
      })
    } catch (error) {
      console.error("Error saving OTC Code:", error);
      Swal.fire({
        title: "Error!",
        text: "Gagal menyimpan data. Silakan coba lagi.",
        icon: "error",
        timer: 1200,
        timerProgressBar: true,
        showConfirmButton: false,
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="mb-4 ml-2 rounded-sm h-11">Add OTC Code</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add OTC Code</DialogTitle>
          <DialogDescription>Fields marked with * are required.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <Label>OTC Code</Label>
          <Input id="OTCCode" value={formData.OTCCode} onChange={handleInputChange} />

          <Label>Description</Label>
          <Input id="Description" value={formData.Description} onChange={handleInputChange} />

        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>Add</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function OTCEdit({ OTCCode, onUpdate }) {
  const [formData, setFormData] = useState({
    OTCCode: "",
    Description: "",
  });
  const [open, setOpen] = useState(false);

  const fetchOTCCode = async () => {
    try {
      const res = await ApiCustomer.get(`/api/otc-code/${OTCCode}`);
      if (res.data.success) {
        setFormData({
          OTCCode: res.data.data.OTCCode,
          Description: res.data.data.Description,
        });
      } else {
        throw new Error("Failed to load data");
      }
    } catch (error) {
      console.error("Error fetching OTC Code:", error);
      Swal.fire("Error", "Gagal memuat data OTC Code.", "error");
    }
  };

  useEffect(() => {
    if (open) fetchOTCCode();
  }, [open]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.Description) {
      Swal.fire({
        icon: "warning",
        title: "Incomplete Data",
        text: "Description is required.",
        timer: 1500,
        showConfirmButton: false,
        timerProgressBar: true,
      });
      return;
    }

    try {
      await ApiCustomer.patch(`/api/otc-code/${OTCCode}`, formData);
      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "OTC Code berhasil diperbarui.",
        timer: 1200,
        timerProgressBar: true,
        showConfirmButton: false,
      }).then(() => {
        onUpdate?.();
        setOpen(false);
      });
    } catch (error) {
      console.error("Error updating OTC Code:", error);
      Swal.fire({
        title: "Error!",
        text: "Gagal memperbarui data. Silakan coba lagi.",
        icon: "error",
        timer: 1200,
        timerProgressBar: true,
        showConfirmButton: false,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={() => setOpen(true)}>
        <Pencil/>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit OTC Code</DialogTitle>
          <DialogDescription>Update the description for this OTC Code.</DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <Label>OTC Code</Label>
          <Input id="OTCCode" value={formData.OTCCode} disabled />

          <Label>Description</Label>
          <Input id="Description" value={formData.Description} onChange={handleInputChange} />
        </div>

        <DialogFooter>
          <Button onClick={handleSubmit}>Update</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// export function OTCDelete({ OTCCode, onUpdate }) {
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const handleDelete = async () => {
//     try {
//       const response = await ApiCustomer.delete(`/api/otc-code/${OTCCode}`);

//       if (response.status === 409 || response.data.success === false) {
//         Swal.fire({
//           icon: "error",
//           title: "Cannot Delete",
//           text: response.data.message || "This OTCCode cannot be deleted due to relational restrictions.",
//           timer: 1400,
//           showConfirmButton: false,
//           timerProgressBar: true,
//         });
//         return;
//       }

//       Swal.fire({
//         icon: "success",
//         title: "Deleted",
//         text: "OTCCode has been deleted successfully.",
//         timer: 1100,
//         showConfirmButton: false,
//         timerProgressBar: true,
//       });

//       setIsModalOpen(false);
//       onUpdate?.(); // Refresh list
//     } catch (error) {
//       Swal.fire({
//         icon: "error",
//         title: "Failed",
//         text: error?.response?.data?.message || "Failed to delete OTCCode.",
//         timer: 1400,
//         showConfirmButton: false,
//         timerProgressBar: true,
//       });
//     }
//   };

//   return (
//     <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
//       <DialogTrigger asChild>
//         <Button variant="outline" className="text-red-500 hover:text-red-700" onClick={() => setIsModalOpen(true)}>
//           <Trash />
//         </Button>
//       </DialogTrigger>
//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>Delete OTCCode</DialogTitle>
//           <DialogDescription>Are you sure you want to delete this OTCCode? This action cannot be undone.</DialogDescription>
//         </DialogHeader>
//         <p>This will permanently remove the OTCCode record from the system.</p>
//         <DialogFooter>
//           <Button variant="destructive" onClick={handleDelete}>
//             Delete
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }

export function OTCDelete({ OTCCode, isModalOpen, setIsModalOpen, onUpdate }) {
  const handleDelete = async () => {
    const result = await Swal.fire({
      title: 'Apakah Anda yakin?',
      text: "OTCCode ini akan dihapus dan tidak dapat dikembalikan.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal',
    });

    if (result.isConfirmed) {
      try {
        const response = await ApiCustomer.delete(`/api/otc-code/${OTCCode}`);

        if (response.status === 409 || response.data?.success === false) {
          Swal.fire({
            icon: 'warning',
            title: 'Tidak Bisa Dihapus!',
            text: response.data?.message || "OTCCode ini memiliki keterkaitan dan tidak dapat dihapus.",
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false,
          });
          return;
        }

        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'OTCCode berhasil dihapus.',
          timer: 1500,
          timerProgressBar: true,
          showConfirmButton: false,
        }).then(() => {
          setIsModalOpen(false);
          if (onUpdate) {
            onUpdate();
          }
          window.location.reload();
        });
      } catch (error) {
        if (error.response?.status === 409) {
          Swal.fire({
            icon: 'warning',
            title: 'Tidak Bisa Dihapus!',
            text: error.response.data?.message || "OTCCode tidak dapat dihapus karena memiliki relasi.",
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false,
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Gagal Menghapus!',
            text: 'Terjadi kesalahan saat menghapus OTCCode. Silakan coba lagi.',
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false,
          });
        }
      }
    }
  };

  return (
    <Button variant="outline" className="text-red-500 hover:text-red-700" onClick={handleDelete}>
      <Trash />
    </Button>
  );
}

export function CrsAdd() {
  const [formData, setFormData] = useState({
    caseResolutionCode: "",
    autoClose: "",
    caseReadyForClosure: "",
    readyForCloseDays: "",
    readyForClosureDate: "",
    pendingCustomerAction: "",
    customerRequestedCloseDate: "",
  });

  const handleInputChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    // Validasi input
    if (!formData.caseResolutionCode || !formData.autoClose || !formData.caseReadyForClosure) {
      Swal.fire({
        title: "Incomplete Data",
        text: "All fields are required.",
        icon: "warning",
        timer: 1500,
        showConfirmButton: false,
        timerProgressBar: true,
      });
      return;
    }

    try {
      console.log("Form Data : ", formData);

      // Mengirim data ke API menggunakan POST untuk membuat data baru
      await ApiCustomer.post("/api/caseResolution", formData);

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Case Resolution berhasil disimpan.",
        timer: 1200,
        timerProgressBar: true,
        showConfirmButton: false,
      }).then(() => {
        window.location.reload(); // Refresh setelah berhasil
      });
    } catch (error) {
      console.error("Error saving Case Resolution:", error);
      Swal.fire({
        title: "Error!",
        text: "Gagal menyimpan data. Silakan coba lagi.",
        icon: "error",
        timer: 1200,
        timerProgressBar: true,
        showConfirmButton: false,
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="mb-4 ml-2 rounded-sm h-11">Add Case Resolution</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Case Resolution</DialogTitle>
          <DialogDescription>Fields marked with * are required.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <Label>Case Resolution Code</Label>
          <Input id="caseResolutionCode" value={formData.caseResolutionCode} onChange={handleInputChange} />

          <Label>Auto Close</Label>
          <SelectYN
          id="autoClose"
          value={formData.autoClose}
          onValueChange={(value) => handleInputChange({ target: { id: "autoClose", value } })}
        />

          <Label>Case Ready For Closure</Label>
          <SelectYN
            id="caseReadyForClosure"
            value={formData.caseReadyForClosure}
            onValueChange={(value) => handleInputChange({ target: { id: "caseReadyForClosure", value } })}
          />

          <Label>Ready For Close Days</Label>
          <Input id="readyForCloseDays" type="number" value={formData.readyForCloseDays} onChange={handleInputChange} />


          <Label>Ready For Closure Date</Label>
          <Input id="readyForClosureDate" type="datetime-local" value={formData.readyForClosureDate} onChange={handleInputChange} />

          <Label>Pending Customer Action</Label>
          <Input id="pendingCustomerAction" type="datetime-local" value={formData.pendingCustomerAction} onChange={handleInputChange} />

          <Label>Customer Requested Close Date</Label>
          <Input id="customerRequestedCloseDate" type="datetime-local" value={formData.customerRequestedCloseDate} onChange={handleInputChange} />
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>Add</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function FailureAdd () {
  const [formDataFailure, setFormDataFailure] = useState({
   Name: '',	
   Description: '',
   })
   
   // Make Handler ProductType
   const handlerInputFailure = (e) => {
     const { id, value } = e.target
     setFormDataFailure(prevState => ({
       ...prevState,
       [id]:value
     }));
   };

   // Handler Submit
   const handlerFailure = async () => {
     const { 
       FailureId, Name, Description
     } = formDataFailure;
   
     if ( !Name ) {
       Swal.fire({
         title: "Incomplete Data",
         text: "Please fill in all fields before submitting.",
         icon: "warning",
         timer: 1500,
         timerProgressBar: true,
         showConfirmButton: false,
         allowEscapeKey: false,
       });
       return;
     }  
   
     try {
       const response = await ApiCustomer.post("/api/failure", formDataFailure);
       console.log("Success:", response.data);
   
       Swal.fire({
         icon: 'success',
         title: 'Berhasil!',
         text: 'Failure berhasil disimpan.',
         timer: 1200,
         timerProgressBar: true,
         showConfirmButton: false,
         allowEscapeKey: false,
       }).then(() => {
         window.location.reload();
       });

     } catch (err) {
       console.error("Error saving Failure", err);
   
       Swal.fire({
         title: "Error!",
         text: "Failed to save Failure. Please try again.",
         icon: "error",
         timer: 1200,
         timerProgressBar: true,
         showConfirmButton: false,
         allowEscapeKey: false,
       });
     }
   };
 return (
   <Dialog>
     <DialogTrigger asChild>
       <Button variant="outline" className="ml-2 rounded-sm h-11"> Failure Add</Button>
     </DialogTrigger>
     <DialogContent className="h-[300px] overflow-y-auto">
       <DialogHeader>
         <DialogTitle>Add Failure Information</DialogTitle>
         <DialogDescription>
           Add the Failure Fields marked with * are required.
         </DialogDescription>
       </DialogHeader>
       <div className="space-y-2">
       <Label>Name</Label>
       <Input type="text" id="Name" className="p-2" value={formDataFailure.Name} onChange={handlerInputFailure} />

       <Label>Description</Label>
       <Input type="text" id="Description" className="p-2" value={formDataFailure.Description} onChange={handlerInputFailure} />
       </div>
       <DialogFooter>
         <Button onClick={handlerFailure}>Add</Button>
       </DialogFooter>
     </DialogContent>
   </Dialog>
 )
};

export function FailureEdit({ FailureId, onUpdate }) {
  const [formData, setFormData] = useState({});
  const [isOpen, setIsOpen] = useState(false);

  const defaultFormData = {
    FailureId: "",
    Name: "",
    Description: ""
  };

  const fetchFailure = async () => {
    try {
      const res = await ApiCustomer.get(`/api/failure/${FailureId}`);
      setFormData(res.data.data || defaultFormData);
    } catch (e) {
      console.error("Fetch failed", e);
    }
  };

  const handleChange = (field) => (e) => {
    const val = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  const handleUpdate = async () => {
    const { Name, Description } = formData;

    if (!Name) {
      return Swal.fire({
        icon: "warning",
        text: "Lengkapi semua field wajib.",
        timer: 1200,
        showConfirmButton: false,
        allowEscapeKey: false,
      });
    }

    const updatedData = { Name, Description };

    try {
      await ApiCustomer.patch(`/api/failure/${FailureId}`, updatedData);
      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Data diperbarui.",
        timer: 1500,
        showConfirmButton: false,
        allowEscapeKey: false,
      }).then(() => {
        onUpdate();
        setIsOpen(false);
      });
    } catch (e) {
      console.error(e);
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Perbaruan gagal!",
        timer: 1500,
        showConfirmButton: false,
        allowEscapeKey: false,
      });
    }
  };

  useEffect(() => {
    if (FailureId && isOpen) fetchFailure();
    else if (!isOpen) setFormData(defaultFormData);
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={() => setIsOpen(true)}>
          <Pencil />
        </Button>
      </DialogTrigger>
      <DialogContent className="h-[300px] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Failure</DialogTitle>
          <DialogDescription>Update data Failure. (*) wajib diisi.</DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          {[{ id: "FailureId", label: "Failure Id", type: "text", required: true, readonly: true },
            { id: "Name", label: "Name", type: "text", required: true },
            { id: "Description", label: "Description", type: "text" }].map(({ id, label, type, required, readonly }) => (
            <div key={id}>
              <Label htmlFor={id}>
                {label} {required && <span className="text-red-500">*</span>}
              </Label>
              <Input
                type={type}
                id={id}
                value={formData[id] || ""}
                onChange={handleChange(id)}
                readOnly={readonly}
              />
            </div>
          ))}
        </div>

        <DialogFooter className="mt-4">
          <Button onClick={handleUpdate}>Simpan</Button>
 </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


export function FailureDelete({ FailureId, isModalOpen, setIsModalOpen, onUpdate }) {
  const handleDelete = async () => {
    const result = await Swal.fire({
      title: 'Apakah Anda yakin?',
      text: "Failure ini akan dihapus dan perubahan tidak bisa dibatalkan.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal',
    });

  
    if (result.isConfirmed) {
      try {
        const response = await ApiCustomer.delete(`/api/failure/${FailureId}`);
  
        if (response.status === 409 || response.data.success === false) {
          // 🚨 Restriction triggered - Show alert message
          Swal.fire({
            icon: 'warning',
            title: 'Tidak Bisa Dihapus!',
            text: response.data.message || "Failure ini memiliki keterkaitan dan tidak dapat dihapus.",
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false,
          });
          return;
        }
  
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Failure berhasil dihapus.',
          timer: 1500,
          timerProgressBar: true,
          showConfirmButton: false,
        }).then(() => {
          window.location.reload(); // Memuat ulang halaman
          if (onUpdate) {
            onUpdate();
          }
        });
      } catch (error) {
        if (error.response && error.response.status === 409) {
          // 🚨 Handle 409 Conflict error from backend
          Swal.fire({
            icon: 'warning',
            title: 'Tidak Bisa Dihapus!',
            text: error.response.data.message || "Failure ini tidak bisa dihapus karena memiliki relasi.",
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false,
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Gagal Menghapus!',
            text: 'Terjadi kesalahan saat menghapus Failure. Silakan coba lagi.',
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false,
          });
        }
      }
    }
  };
  return (
    <Button variant="outline" className="text-red-500 hover:text-red-700" onClick={handleDelete}>
      <Trash />
    </Button>
  );
}

export function CrsEdit({ id_csr, onUpdate }) {
  const [formData, setFormData] = useState({
    caseResolutionCode: "",
    autoClose: "",
    caseReadyForClosure: "",
    readyForCloseDays: "",
    readyForClosureDate: "",
    pendingCustomerAction: "",
    customerRequestedCloseDate: "",
  });

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open || !id_csr) return;

    
    const fetchData = async () => {
      try {
        const response = await ApiCustomer.get(`/api/caseResolution/${id_csr}`);
        const data = response.data.data;

              const formatDateForInput = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        const offset = date.getTimezoneOffset();
        const localDate = new Date(date.getTime() - offset * 60 * 1000);
        return localDate.toISOString().slice(0, 16); // ambil 'YYYY-MM-DDTHH:MM'
      };

            setFormData({
        caseResolutionCode: data.caseResolutionCode,
        autoClose: data.autoClose,
        caseReadyForClosure: data.caseReadyForClosure,
        readyForCloseDays: data.readyForCloseDays,
        readyForClosureDate: formatDateForInput(data.readyForClosureDate),
        pendingCustomerAction: formatDateForInput(data.pendingCustomerAction),
        customerRequestedCloseDate: formatDateForInput(data.customerRequestedCloseDate),
      });
      } catch (error) {
        console.error("Error fetching Case Resolution:", error);
        Swal.fire({
           icon: 'error',
           title: 'Gagal Mengambil data',
           allowEscapekey: false,
           showConfirmButton: false,
           allowOutsideClick: false
        }).then(() => {
          window.location.reload;
        })
      }
    };

    fetchData();
  }, [id_csr, open]);

  const handleInputChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.caseResolutionCode || !formData.autoClose || !formData.caseReadyForClosure) {
      Swal.fire("Incomplete", "Semua field wajib diisi", "warning");
      return;
    }

    try {
      await ApiCustomer.patch(`/api/caseResolution/${id_csr}`, formData);
      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Case Resoluution berhasil diperbarui.",
        timer: 1200,
        timerProgressBar: true,
        showConfirmButton: false,
        allowEscapeKey: false
      }).then(() => {
          onUpdate?.();
        setOpen(false);
      });
    } catch (error) {
      console.error("Error updating:", error);
      Swal.fire("Error", "Gagal memperbarui data", "error");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={() => setOpen(true)}>
          <Pencil />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Case Resolution</DialogTitle>
          <DialogDescription>Update the fields below.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <Label>Case Resolution Code</Label>
          <Input id="caseResolutionCode" value={formData.caseResolutionCode} onChange={handleInputChange} />

          <Label>Auto Close</Label>
          <SelectYN
            id="autoClose"
            value={formData.autoClose}
            onValueChange={(value) => handleInputChange({ target: { id: "autoClose", value } })}
          />

          <Label>Case Ready For Closure</Label>
          <SelectYN
            id="caseReadyForClosure"
            value={formData.caseReadyForClosure}
            onValueChange={(value) => handleInputChange({ target: { id: "caseReadyForClosure", value } })}
          />

          <Label>Ready For Close Days</Label>
          <Input id="readyForCloseDays" type="number" value={formData.readyForCloseDays} onChange={handleInputChange} />

          <Label>Ready For Closure Date</Label>
          <Input id="readyForClosureDate" type="datetime-local" value={formData.readyForClosureDate} onChange={handleInputChange} />

          <Label>Pending Customer Action</Label>
          <Input id="pendingCustomerAction" type="datetime-local" value={formData.pendingCustomerAction} onChange={handleInputChange} />

          <Label>Customer Requested Close Date</Label>
          <Input id="customerRequestedCloseDate" type="datetime-local" value={formData.customerRequestedCloseDate} onChange={handleInputChange} />
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>Update</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function CrsDelete({ id_csr, onDelete }) {
  const handleDelete = async () => {
    const result = await Swal.fire({
      title: 'Apakah Anda yakin?',
      text: "Case Resolution ini akan dihapus dan tidak dapat dikembalikan.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal',
    });

    if (result.isConfirmed) {
      try {
        const response = await ApiCustomer.delete(`/api/caseResolution/${id_csr}`);

        if (response.status === 409 || response.data?.success === false) {
          Swal.fire({
            icon: 'warning',
            title: 'Tidak Bisa Dihapus!',
            text: response.data?.message || "Data memiliki keterkaitan dan tidak dapat dihapus.",
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false,
          });
          return;
        }

        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Case Resolution berhasil dihapus.',
          timer: 1500,
          timerProgressBar: true,
          showConfirmButton: false,
        }).then(() => {
          window.location.reload();
          if (onDelete) {
            onDelete();
          }
        });
      } catch (error) {
        if (error.response?.status === 409) {
          Swal.fire({
            icon: 'warning',
            title: 'Tidak Bisa Dihapus!',
            text: error.response.data?.message || "Data memiliki relasi dan tidak dapat dihapus.",
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false,
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Gagal Menghapus!',
            text: 'Terjadi kesalahan saat menghapus data. Silakan coba lagi.',
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false,
          });
        }
      }
    }
  };
    return (
      <Button variant="outline" className="text-red-500 hover:text-red-700" onClick={handleDelete}>
        <Trash />
      </Button>
    );
  }