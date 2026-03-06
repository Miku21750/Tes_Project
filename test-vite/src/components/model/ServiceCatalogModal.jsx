
import React, { useState, useEffect, useMemo } from "react";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch"
import { Plus,PhoneCall, Copy, ExternalLink, XIcon, ArchiveIcon, User } from "lucide-react";
import { Checkbox } from "../ui/checkbox";
import { SearchCommandBlock, SelectBar3, SelectBarContact4, SelectYN } from "../sc-select";
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
  
  import CaseField from "../CaseField";

 import { SnInput } from "../sn-input";
import { Textarea } from "../ui/textarea";
import { Pencil, Trash } from "lucide-react";
//import API
import ApiCustomer from "@/api";

import Swal from "sweetalert2";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
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
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import ServiceRequestPDF from "../service-request-form";
import { pdf } from '@react-pdf/renderer';

import { cn } from "@/lib/utils";

import { useAuth } from "@/context/auth-context";
import { ServiceCatalogWarrantyTable } from "../table-data/ServiceCatalogWarranty";
import { CreateNewPartModal } from "./CreateNewPartModal";
import { useServerPageTable } from "../table-data/config/data-use-table";
import { PartCatalogPaginated } from "../table-data/PartCatalogTable";

// ── Shared filter params ──────────────────────────────────────────────────────

function partFiltersToParams(filters) {
  const p = {};
  for (const f of filters) {
    if (f.id === "PartNumber")      p.partNumber = f.value;
    if (f.id === "Keyword")         p.keyword    = f.value;
    if (f.id === "PartDescription") p.partDesc   = f.value;
  }
  return p;
}

function partSortToParams(s) {
  return {
    sortBy:  s[0]?.id   ?? "PartNumber",
    sortDir: s[0]?.desc ? "desc" : "asc",
  };
}

export function ServiceCatalogModel({ 
  open, 
  setOpen, 
  caseDetails,
  serviceCatalogType,
  WOID = undefined
}) {
  const {user} = useAuth();
  useEffect(() => {
    // Resetting modal state when serviceCatalogType changes
    setCurrentStep(1);
    setStep(0);
    setSelectedWarrantyServices(null);
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
  const [error, setError] = useState(false)
  const [currentStep, setCurrentStep] = useState(1);
  // If creating MO from WO, start directly at parts step
  useEffect(() => {
    if ((WOID || serviceCatalogType === 'wo-add-mo') && open) {
      setCurrentStep(2);
    }
  }, [WOID, serviceCatalogType, open]);
  const [assetForWorkOrderCreation, setAssetForWorkOrderCreation] = useState([]);
  const [modalPart, setModalPart] = useState(false);
  const [roleAssign, setRoleAssign] = useState([]);
  const [assignApo, setAssignApo] = useState(null);

  
  //product information
  const fetchDataAssets = async () => {
    try {
      const assetId = caseDetails?.AssetID;
      if (!assetId) return null;
      const response = await ApiCustomer.get(`/api/asset-information/${caseDetails.AssetID}`)
   
      return response.data.data
    }catch(e){
      toast.error("error fetching Asset: ", e)
    }
  }

  const fetchUserAssign = async (role) => {
    try {
      const res = await ApiCustomer.get(`/api/user?role=${role}`);
      setRoleAssign(res.data.data);
    } catch (err) {
      toast.error("Error fetching role: ", err);
    }
  };


  //waranty
  //warranty state
  const [warrantyOffer, setWarrantyOffer] = useState([])
  //fetching data function
  const fetchDataServiceOffer = async () => {
    setLoading(true);
    setError(null);
    try{
      const response = await ApiCustomer.get(`/api/service-log/warranty-services`)
      
      return response.data.data;
    }catch(e){
      setError("Failed to load Warranty Service")
      toast.error("error fetching Service Offer: ", e)
    }finally{
      setLoading(false)
    }
  }
  
  useEffect(() => {
    fetchDataServiceOffer().then((data) => {
      if (data) setWarrantyOffer(data);
    });
    fetchDataAssets().then((data) => {
      if (data) setAssetForWorkOrderCreation(data);
    });
    fetchDataPartCatalog();
    fetchUserAssign("");
  }, [caseDetails])
  
  useEffect(() => {
    const fetchWarrantyFromWO = async () => {
      if (!WOID) return;

      try {
        const res = await ApiCustomer.get(`/api/work-order/${WOID}`);
        
        const woData = res.data.data;

        if (woData?.serviceCatalog?.warranty_services) {
          setWoWarrantyService(woData.serviceCatalog.warranty_services);
        }
      } catch (err) {
        toast.error("Error fetching WO Warranty:", err);
      }
    };

    fetchWarrantyFromWO();
  }, [WOID]);


  const [selected, setSelected] = useState("DepotRepair"); 
  
  const [selectedWarrantyServices, setSelectedWarrantyServices] = useState(null);
  const [woWarrantyService, setWoWarrantyService] = useState(null);

    const handlerWarrantyService = (service) => {
      setSelectedWarrantyServices(service);
    };

  useEffect(() => {
  }, [selectedWarrantyServices]);
  
  //part state
  const [partCatalog, setPartCatalog] = useState([])
  const [loadingPart, setLoadingPart] = useState(false)
  //fetch data part catalog
  const fetchDataPartCatalog = async () => {
    setLoadingPart(true);
    try{
      const response = await ApiCustomer.get(`/api/service-log/parts-catalog`)
      setPartCatalog(response.data.data)
      setLoadingPart(false);
      return response.data.data
    }catch(e){
      toast.error("Err :",e)
    } finally {
      setLoadingPart(false)
    }
  }

  const handlePartAdded = async (createdPart) => {
    // 1) refresh catalog from backend (optional but recommended)
    await fetchDataPartCatalog();

    // 2) auto-select the newly created part in selectedPartCatalog
    if (createdPart?.PartNumber) {
      setSelectedPartCatalog((prev) => {
        const alreadyExists = prev.some(
          (p) => p.PartNumber === createdPart.PartNumber
        );
        if (alreadyExists) return prev;

        const price = parseFloat(createdPart.Price) || 0;

        return [
          ...prev,
          {
            ...createdPart,
            qty: 1,
            Total: price.toFixed ? price.toFixed(2) : price,
          },
        ];
      });
    }
  };


  //search part handler
  const [partNumberSearch, setPartNumberSearch] = useState("");
  const [keywordSearch, setKeywordSearch] = useState("");
  const [descriptionSearch, setDescriptionSearch] = useState("");

  const hook = useServerPageTable({
    url:             "/api/service-log/parts-catalog",
    pageSize:        20,
    defaultSorting:  [{ id: "PartNumber", desc: false }],
    filtersToParams: (f) => ({ mode: "paginated", ...partFiltersToParams(f) }),
    sortToParams:    partSortToParams,
  });
  //handler part
  const [selectedPartCatalog, setSelectedPartCatalog] = useState([])
  const handlerPartCatalog = (part, checked) => {
    if(checked){
      setSelectedPartCatalog((prev) => [
        ...prev,
        {
          ...part,
          qty: 1,
          Total: part.Price,
        }
      ])
    }else{
      setSelectedPartCatalog((prev) => 
        prev.filter((item) => item.PartNumber !== part.PartNumber)
      )
    }
  }
  useEffect(() => {
    handlerPriceConfirmServices();
  }, [selectedPartCatalog]);
  
  const warrantyCondition =
    assetForWorkOrderCreation?.AssetInformation?.WarrantyOTCCode?.WarrantyCondition;

  const isOutWarranty =
    assetForWorkOrderCreation?.Warranty_Status === "01T";
    
  const filteredWarrantyOffers = warrantyOffer.filter(
    (service) =>
      isOutWarranty
        ? service.WarrantyCondition === "OutWarranty"
        : service.WarrantyCondition === "InWarranty"
  );
  const filteredUserAssign = roleAssign.filter(
    (user) => isOutWarranty ? user.Role === "cm" : user.Role === "apo"
  )
  
  //hanlder confirm
  //handler qty price parts
  const handleQtyChangePartsCatalog = (partNumber, qty) => {
    setSelectedPartCatalog((prev) =>
      prev.map((item) => {
        if (item.PartNumber === partNumber) {
          const parsedQty = parseInt(qty) || 1;
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

  const handleRemovedPartNumberChange = (partNumber, value) => {
    setSelectedPartCatalog((prev) =>
      prev.map((item) => (
        item.PartNumber === partNumber ? { ...item, RemovedPartNumber: value } : item
      ))
    );
  };

  const handleUEFICodeChange = (partNumber, value) => {
    setSelectedPartCatalog((prev) =>
      prev.map((p) =>
        p.PartNumber === partNumber ? { ...p, UEFICode: value, UEFI_NO: "" } : p
      )
    );
  };

  const handleUEFINoChange = (partNumber, value) => {
    setSelectedPartCatalog((prev) =>
      prev.map((p) =>
        p.PartNumber === partNumber ? { ...p, UEFI_NO: value } : p
      )
    );
  };

  const showUEFINumberHeader = selectedPartCatalog.some(p => p.UEFICode === "FID");

  //handle add part in confirm services
  const [tempSelectedParts, setTempSelectedParts] = useState([]);
  

  //handler Total Subtotal Confirm Services
  const [subTotalConfirmServices, setSubTotalConfirmServices] = useState(0)
  const [TotalTaxConfirmServices, setTotalTaxConfirmServices] = useState(0)
  const [totalConfirmServices, setTotalConfirmServices] = useState(0)
  const effectiveWarrantyService = selectedWarrantyServices ?? woWarrantyService;
  const handlerPriceConfirmServices = () =>{
    let serviceTotal = selectedWarrantyServices ? (parseFloat(selectedWarrantyServices.Price) || 0) : 0;

  
    let partsTotal = selectedPartCatalog.reduce((acc, part) => {
      return acc + (parseFloat(part.Total) || 0);
    }, 0);
  
    if(assetForWorkOrderCreation?.WarrantyOTCCode?.WarrantyCondition === "OutWarranty"){
      const subTotal = serviceTotal + partsTotal;
      setSubTotalConfirmServices(subTotal.toFixed(2));
    }else{
      setSubTotalConfirmServices(0);
    }

  }
  
  //createorder
  const createOrder = async () => {
    const hasPart = selectedPartCatalog.length > 0;
    if (hasPart && !assignApo) {
       toast.warning("APO IS NOT ASSIGN YET", {
        description: "PLEASE CHOOSE THE APO PATNER BEFORE CREATING ORDER",
        position: 'top-center'
      })
      return
    } else {
      // cek apakah ada part yang belum diisi UEFI Code
      const partWithoutUEFICode = selectedPartCatalog.find(
        (p) => !p.UEFICode || p.UEFICode.trim() === ""
      );

      const partWithoutCT = selectedPartCatalog.find(
        (p) => !p.RemovedPartNumber || p.RemovedPartNumber.trim() === ""
      );

      if(partWithoutCT) {
        toast.warning(`CT BAD belum diisi untuk part ${partWithoutCT.PartNumber}`, {
          description: "PLEASE FILL TE CT BAD BEFORE CREATING ORDER",
          position: 'top-center'
        });
        return;
      }
      if (partWithoutUEFICode) {
        toast.warning(`UEFI Code belum diisi untuk part ${partWithoutUEFICode.PartNumber}`, {
          description: "PLEASE CHOOSE THE UEFI CODE BEFORE CREATING ORDER",
          position: 'top-center'
        });
        return;
      }
      
      try {
        Swal.fire({
          title: "Creating Order...",
          allowOutsideClick: false,
          allowEscapeKey: false,
          didOpen: () => Swal.showLoading()
        });
        const data = {
          user: getUserFromToken()
        }

        // If WOID present or special mode, create only MO for existing WO
        const isCreateMOOnly = !!WOID || serviceCatalogType === 'wo-add-mo';
        const res = isCreateMOOnly
          ? await (async () => {
              const createdMOIDs = [];
              for (const part of selectedPartCatalog) {
                const r = await ApiCustomer.post("/api/material-order", {
                  WOID: WOID,
                  selectedPartCatalog: [{ ...part, qty: part.qty || 1 }],
                  OwnerID: data.user.id,
                  assignApo: assignApo,
                });
                if (r?.data?.MOID) createdMOIDs.push(r.data.MOID);
              }
              return { data: { many: true, MOIDs: createdMOIDs } };
            })()
          : await ApiCustomer.post("/api/service-log/create-order", {
            /**
             * ASK : IF ORDER IS OUT WARRANTY, ARE THE WO / MO CREATED AUTOMATE TOO, BUT CLOSED IF CANCELLED, OR NEED APPROVE FIRST BY CM?
             */
              AssetID: assetForWorkOrderCreation.AssetID,
              CaseID: caseDetails.CaseID,
              selectedWarrantyServices,
              selectedPartCatalog,
              IncidentType: selected,
              OwnerID: data.user.id,
              assignApo: assignApo,
            });
        Swal.close(); 
        // Close loading after success
        await Swal.fire({
          title: "Success!",
          text:  "Order added successfully!",
          icon:  "success",
          timer: 1500,
          showConfirmButton: false,
          allowEscapeKey: false,
        }).then(()=>{
          setOpen(false);
          const WOIDRes = res.data.WOID
          const MOID = res.data.MOID
          if (isCreateMOOnly) {
            if (res.data?.many && Array.isArray(res.data.MOIDs) && res.data.MOIDs.length) {
              // could open the last MO, keep silent here per prior behavior
            } else if (MOID) {
              window.open(`/app/material-order/${MOID}`, '_blank');
            }
          } else {
            // handle multi-MO creation from create-order
            const manyCreate = res.data?.many && Array.isArray(res.data.MOIDs) && res.data.MOIDs.length;
            switch (serviceCatalogType) {
              case "CSR":
                if (manyCreate) {
                  // Open the last created MO or keep on WO page as desired
                } else if (MOID) {
                  window.open(`/app/material-order/${MOID}`, '_blank');
                }
                break;
              case "serviceorder":
                window.open(`/app/work/${WOIDRes}`, '_blank');  
                break;
              default:
                break;
            }
          }
        });
      } catch (err) {
        toast.error("Order Creation Failed:", err);
        Swal.fire({
          title: "Error!",
          text: "Failed to create order",
          icon: "error",
          timer: 1500,
          showConfirmButton: false,
          allowEscapeKey: false,
        });
      }
    };
  }  
  
  function renderStepContent() {
    const [currentPage, setCurrentPage] = useState(1);
    const PAGE_SIZE = 5;
    const filteredPartCatalog = partCatalog.filter(part => {
      return (
        part.PartNumber?.toLowerCase().includes(partNumberSearch.toLowerCase()) &&
        part.Keyword?.toLowerCase().includes(keywordSearch.toLowerCase()) &&
        part.PartDescription?.toLowerCase().includes(descriptionSearch.toLowerCase())
      );
    });
  const MAX_PAGES_SHOWN = 3;

    const totalPages = Math.ceil(filteredPartCatalog.length / PAGE_SIZE);
    
  const getPaginationPages = () => {
    if (totalPages <= MAX_PAGES_SHOWN) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (currentPage <= 2) {
      return [1, 2, 3];
    }
    if (currentPage >= totalPages - 1) {
      return [totalPages - 2, totalPages - 1, totalPages];
    }
    return [currentPage - 1, currentPage, currentPage + 1];
  };
  const paginationPages = getPaginationPages();
    const currentPageData = useMemo(() => {
      const start = (currentPage - 1) * PAGE_SIZE;
      return filteredPartCatalog.slice(start, start + PAGE_SIZE);
    }, [filteredPartCatalog, currentPage]);

    const handlePageChange = (page) => {
      if (page >= 1 && page <= totalPages) {
        setCurrentPage(page);
      }
    };

    // Skip warranty step when creating MO from WO
    const effectiveStep = ((WOID || serviceCatalogType === 'wo-add-mo') && currentStep === 1) ? 2 : currentStep;
    switch (effectiveStep) {
      case 1:
        return (
          <DialogContent  className="
            w-full max-w-full sm:max-w-md md:max-w-lg lg:max-w-7xl
            max-h-[90vh] 
            flex flex-col justify-center
            gap-0 p-0 bg-white
            [&>button]:hidden
            dark:bg-black
          " >
            <DialogHeader>
              <div className="flex items-end justify-end ">
                {/* <Button className={'bg-transparent '}><ExternalLink color="black"></ExternalLink></Button> */}
                <DialogClose asChild>
                <Button type="button" variant="outline" className={'hover:bg-gray-200 active:bg-gray-700 border-none'}>
                  <XIcon/>
                </Button>
                </DialogClose>
              </div>
              {/* <DialogDescription className={'bg-red-200 p-3 font-bold '}>Click Here to Show Service Catalog Error / Warnings</DialogDescription> */}
              <DialogTitle className={'text-blue-600 text-2xl  mx-auto'}>Service Catalog</DialogTitle>
              <DialogDescription className={" mx-auto"}>Select From List of Service Options</DialogDescription>
            </DialogHeader>
          <div className="grid overflow-y-auto">
            <div className="flex justify-between  ">
              {/* <DialogTitle>Step 1: Select From List of Service Options</DialogTitle> */}
              <div className="grid grid-cols-2 p-2  gap-2  ">
                <CaseField label="Product Number" lock>
                  <Input
                  value={assetForWorkOrderCreation?.ProductNumber || "-"}    
                  readOnly              
                  />
                </CaseField>
                <CaseField label="Product Name" lock>
                  <Input
                  value={assetForWorkOrderCreation?.product_information?.ProductName || "-"}     
                  readOnly             
                  />
                </CaseField>
                <CaseField label="Serial Number" lock>
                  <Input
                  value={assetForWorkOrderCreation?.SerialNumber || "-"}
                  readOnly             
                  />
                </CaseField>
                <CaseField label="Warranty Status" lock>
                  <Input
                    value={`${assetForWorkOrderCreation?.Warranty_Status ?? ""} - ${assetForWorkOrderCreation?.WarrantyOTCCode?.Description ?? ""}`}
                  />
                </CaseField>
              </div>
            </div>
            <ServiceCatalogWarrantyTable selectedWarrantyServices={selectedWarrantyServices} setSelectedWarrantyServices={setSelectedWarrantyServices} data={filteredWarrantyOffers}/>
          </div>
            <DialogFooter className={'p-2'}>
             <Button  className="" onClick={() => setOpen(false)}>Cancel</Button>
             <Button 
              onClick={() => setCurrentStep(2)} 
              disabled={!selectedWarrantyServices}
              className={!selectedWarrantyServices ? "opacity-50 cursor-not-allowed" : ""}
             >
              Next
             </Button>
             </DialogFooter>
            </DialogContent>
        );
  
      case 2:  
        return (
          <DialogContent
            className=" w-full max-w-full sm:max-w-md md:max-w-lg lg:max-w-7xl
    flex flex-col justify-center
    gap-0 p-0 bg-white
    [&>button]:hidden"
          >
            <DialogHeader>
              <div className="flex items-end justify-end">
                <DialogClose asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className={
                      "hover:bg-gray-200 active:bg-gray-700  border-none"
                    }
                  >
                    <XIcon />
                  </Button>
                </DialogClose>
              </div>
              <div className={"flex items-center flex-col"}>
                <DialogTitle className={"text-blue-600 text-2xl"}>
                  Service Catalog
                </DialogTitle>
                <DialogDescription>
                  Select parts required for the repair.
                </DialogDescription>
              </div>
            </DialogHeader>
            <div className=" flex justify-between">
              {/* Kolom kiri  */}

              <div className="grid grid-cols-4 p-2  gap-2">
                <CaseField label="Service OfferID" lock>
                  <Input
                  value={effectiveWarrantyService?.Service_offerID ?? '-'}    
                  readOnly              
                  />
                </CaseField>
                <CaseField label="Description" lock>
                  <Input
                  value={effectiveWarrantyService.Service_description}     
                  readOnly             
                  />
                </CaseField>
                <CaseField label="Unit Price" lock>
                  <Input
                  value={effectiveWarrantyService.CTat_RTime}
                  readOnly             
                  />
                </CaseField>
                {/* <CaseField label="Shipping Fee" lock> */}
                {/*   <Input */}
                {/*     value={effectiveWarrantyService.Shipping_Fee} */}
                {/*   /> */}
                {/* </CaseField> */}
                {/* <CaseField label="Qty" lock> */}
                {/*   <Input */}
                {/*     value={1} */}
                {/*   /> */}
                {/* </CaseField> */}
                <CaseField label="Price" lock>
                  <Input
                    value={assetForWorkOrderCreation?.WarrantyOTCCode?.WarrantyCondition === "OutWarranty" ? effectiveWarrantyService.Price : 0}
                  />
                </CaseField>
              </div>
              {/* Kolom kanan  */}
              {/* <div className=" bg-gray-200 grid grid-cols-2 gap-x-2 gap-y-1 p-2">
                <p>Product Number</p>
                <p>: {assetForWorkOrderCreation?.ProductNumber || "-"}</p>
                <p>Product Name</p>
                <p>
                  :{" "}
                  {assetForWorkOrderCreation?.product_information
                    ?.ProductName || "-"}
                </p>
                <p>Serial Number</p>
                <p>: {assetForWorkOrderCreation?.SerialNumber || "-"}</p>
                <p>Warranty Status</p>
                <p>
                  : {assetForWorkOrderCreation?.Warranty_Status} -{" "}
                  {assetForWorkOrderCreation?.WarrantyOTCCode?.Description}
                </p>
                <p>Currency</p>
                <p>:</p>
              </div> */}
            </div>


                 <PartCatalogPaginated setSelectedPartCatalog={setSelectedPartCatalog} selectedPartCatalog={selectedPartCatalog} hook={hook} />
            <DialogFooter className={"p-2"}>
              <Button className="" onClick={() => setCurrentStep(1)}>
                Previous
              </Button>
              <Button className="" onClick={() => setCurrentStep(3)}>
                Next
              </Button>
            </DialogFooter>
          </DialogContent>
        );
  
      case 3:
        return (
          <DialogContent className="w-full max-w-full sm:max-w-md md:max-w-lg lg:max-w-7xl
            max-h-[90vh] overflow-y-auto
            flex flex-col justify-center
            gap-0 p-0 bg-white
            [&>button]:hidden ">
            <DialogHeader>
              <div className="flex items-end justify-end">
                {/* <Button className={'bg-transparent '}><ExternalLink color="black"></ExternalLink></Button> */}
                <DialogClose asChild>
                  <Button type="button" variant="outline" className={'hover:bg-gray-200 active:bg-gray-700 border-none'}>
                  <XIcon/>
                  </Button>
                </DialogClose>
              </div>
              <div className="space-y-2 p-0 mx-auto text-center">
              <DialogTitle className={'text-blue-600 text-2xl'}>Service Catalog</DialogTitle>
              <DialogDescription>Confirmation For Selected Warranty Type And Parts.</DialogDescription>
              </div>

            </DialogHeader>
          <div className="overflow-x-auto">
            <div className="flex flex-col lg:flex-row justify-evenly gap-0 p-0 my-2">
              <div className="grid grid-cols-2 p-2  gap-2">
                <CaseField label="Product Number" lock>
                  <Input
                  value={assetForWorkOrderCreation?.ProductNumber || "-"}    
                  readOnly              
                  />
                </CaseField>
                <CaseField label="Product Name" lock>
                  <Input
                  value={assetForWorkOrderCreation?.product_information?.ProductName || "-"}     
                  readOnly             
                  />
                </CaseField>
                <CaseField label="Serial Number" lock>
                  <Input
                  value={assetForWorkOrderCreation?.SerialNumber || "-"}
                  readOnly             
                  />
                </CaseField>
                <CaseField label="Warranty Status" lock>
                  <Input
                    value={`${assetForWorkOrderCreation?.Warranty_Status ?? ""} - ${assetForWorkOrderCreation?.WarrantyOTCCode?.Description ?? ""}`}
                  />
                </CaseField>
              </div>
              <div className="grid grid-cols-2 p-2  gap-2">
                <CaseField label="Service OfferID" lock>
                  <Input
                  value={effectiveWarrantyService?.Service_offerID ?? '-'}    
                  readOnly              
                  />
                </CaseField>
                <CaseField label="Description" lock>
                  <Input
                  value={effectiveWarrantyService.Service_description}     
                  readOnly             
                  />
                </CaseField>
                <CaseField label="Unit Price" lock>
                  <Input
                  value={effectiveWarrantyService.CTat_RTime}
                  readOnly             
                  />
                </CaseField>
                <CaseField label="Shipping Fee" lock>
                  <Input
                    value={effectiveWarrantyService.Shipping_Fee}
                  />
                </CaseField>
                {/* <CaseField label="Qty" lock> */}
                {/*   <Input */}
                {/*     value={1} */}
                {/*   /> */}
                {/* </CaseField> */}
                <CaseField label="Price" lock>
                  <Input
                    value={assetForWorkOrderCreation?.WarrantyOTCCode?.WarrantyCondition === "OutWarranty" ? effectiveWarrantyService.Price : 0}
                  />
                </CaseField>
              </div>
            </div>
            <div className="overflow-auto max-h-[30dvh]">
              <Table>
                <TableHeader>
                  <TableRow className={'bg-blue-400'}>
                    <TableHead className={'font-bold text-black'}>Select</TableHead>
                    <TableHead className={'font-bold text-black'}>Part #</TableHead>
                    <TableHead className={'font-bold text-black'}>Description</TableHead>
                    <TableHead className={'font-bold text-black'}>Unit Price</TableHead>
                    {/* <TableHead className={'font-bold text-black'}>Shipping Fee</TableHead> */}
                    <TableHead className={'font-bold text-black'}>Qty</TableHead>
                    <TableHead className={'font-bold text-black'}>CT KEY RETURN</TableHead>
                    <TableHead className={'font-bold text-black'}>UEFI CODE</TableHead>
                    {showUEFINumberHeader  && (
                      <TableHead className={'font-bold text-black'}>UEFI Number</TableHead>
                    )}
                    <TableHead  colSpan={2} className={'font-bold text-black'}>Price</TableHead>
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
                        <TableCell>{part.qty} </TableCell>
                        <TableCell>
                          <Input
                            placeholder="Enter Return CT Key"
                            className="bg-white"
                            value={part.RemovedPartNumber || ''}
                            onChange={(e) => handleRemovedPartNumberChange(part.PartNumber, e.target.value)}
                          />
                        </TableCell>
                        <TableCell>
                          <Select
                            value={part.UEFICode || ""}
                            onValueChange={(val) => handleUEFICodeChange(part.PartNumber, val)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue placeholder="Select code" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="DHU">DHU</SelectItem>
                              <SelectItem value="FID">FID</SelectItem>
                              <SelectItem value="MPS">MPS</SelectItem>
                              <SelectItem value="PND">PND</SelectItem>
                              <SelectItem value="PPR">PPR</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                          {part.UEFICode === "FID" ? (
                            <TableCell>
                              <Input
                                placeholder="Enter UEFI No"
                                value={part.UEFI_NO || ""}
                                onChange={(e) =>
                                  handleUEFINoChange(part.PartNumber, e.target.value)
                                }
                                className="w-32"
                              />
                            </TableCell>
                          ): (
                            null
                          )}
                        <TableCell>{assetForWorkOrderCreation?.WarrantyOTCCode?.WarrantyCondition === "OutWarranty" ? part.Total : 0}</TableCell>
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
                    <TableCell colSpan={3}>Total</TableCell>
                    <TableCell>--</TableCell>
                    <TableCell>--</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              
            </div>
          </div>
  
            <DialogFooter className={'inline-flex  p-2  '}>

              <div className="inline-flex items-center gap-2">
                 <Label htmlFor="incident" className={'font-bold whitespace-nowrap'}>Incident Type :</Label>
                 <Select value={selected} onValueChange={setSelected} defaultValue="DepotRepair">
                   <SelectTrigger className="w-fit">
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
              </div>

              {selectedPartCatalog.length > 0 && (
              <div className={"flex gap-2"}>
                <Label htmlFor="Assign_APO" className={'font-bold whitespace-nowrap'}>SELECT {isOutWarranty ? "CM" : "APO"} : </Label>
                <SearchCommandBlock
                  value={assignApo}
                  onChange={(selectedID) =>{
                    if(!selectedID) {
                      setAssignApo(null);
                      return;
                    }
                    const selectedUser = filteredUserAssign.find(
                      (user) => user.IDUser === selectedID
                    );
                    if (selectedUser) {
                      setAssignApo(selectedUser.IDUser);
                    }
                  }}
                  placeholder="--Select--"
                  options={filteredUserAssign.map((user) =>({
                    label: user.Name,
                    value: user.IDUser,
                  }))}
                  renderLabel={(opt) => opt.label}
                  getValue={(opt) => opt.value}
                  className={'border-2 ring-1 ring-gray-200 bg-slate-100'}
                />
              </div>
              )}
              <Button variant={"destructive"}  className="" onClick={() => setOpen(false)}>Cancel</Button>
              <Button  className="" onClick={() => setCurrentStep(2)}>Previous</Button>
              <Button  className="" onClick={() => setModalPart(true)}>Add Part</Button>
              <Button  className="" onClick={createOrder}>Create Order</Button>
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
    <CreateNewPartModal 
      open2={modalPart} 
      setOpen2={setModalPart}
      partCatalog={partCatalog}
      selectedPartCatalog={selectedPartCatalog}
      setSelectedPartCatalog={setSelectedPartCatalog}

      onPartAdded={handlePartAdded}
      
    />
    </Dialog>
  </>
  );
}
