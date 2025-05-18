import React, { use, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SelectBarRelated } from "./sc-select";
import { Car, Lock, Plus, RotateCw } from "lucide-react";
import { CalendarDays } from "lucide-react";
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
import Swal from "sweetalert2";
import { TabsServiceWO } from "./service-case";
import { KeyRound } from "lucide-react";
import { useParams } from "react-router";

import ApiCustomer from "@/api";

import { CaseField, QuickWOInput } from "./quick-wo-input";
import { NewBookableResourceBooking } from "./service-booking";
import { getUserFromToken } from "@/lib/utils/auth";

import { useNavigate } from "react-router";
import DatePicker from "./date-picker";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { SearchCommandBlock } from "./sc-select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";

export const ServiceWork = () => {
  const user = getUserFromToken();
  const { woid } = useParams();

  const [workOrders, setWorkOrders] = useState([]);
  const fetchWorkOrders = async () => {
    try {
      const res = await ApiCustomer.get(`/api/work-order/${woid}`);
      setWorkOrders(res.data.data); // adjust based on API response shape
      console.log("Fetch Work Order: ", res);
    } catch (err) {
      console.error("Failed to fetch work orders:", err);
    }
  };

  const [materialOrders, setMaterialOrders] = useState([]);
  const fetchMaterialOrders = async () => {
    try {
      const res = await ApiCustomer.get(`/api/material-order?WOID=${woid}`);
      console.log("Material Order in WO Detail : ", res);
      setMaterialOrders(res.data.data);
    } catch (err) {
      console.error("Failed to fetch Material orders:", err);
    }
  };

  const [caseInformation, setCaseInformation] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [ownerWorkOrder, setOwnerWorkOrder] = useState([]);

  const [dataFetchCustomerData, setDataFetchCustomerData] = useState({
    MainAccount: null,
    SiteAccount: null,
    Type: null,
  });

  const [SLA, setSLA] = useState({
    slaJeopardy: "",
    dueDateCustomer: "",
    coverageWindow: "",
    response: "",
    otcCode: "",
    requestedDateTimeCustomer: "",
    guaranteedFixTimeCustomer: "",
    earlyStartDateTimeCustomer: "",
    latestStartDateTimeCustomer: "",
    slaReschedule: "",
    activeScheduleDate: "",
    slaErrorDescription: "",
    casePriorityIndex: "",
  });

  const [WOGeneral, setWOGeneral] = useState({
    IncomingChannel: "",
    WorkOrderNumber: "",
    WorkOrderType: "",
    Priority: "",
    SystemStatus: "",
    SubStatus: "",
    BookableResourceBooking: "",
    ServiceOfferID: "",
    ServiceDescription: "",
    PatnerCaseID: "",
    PatnerStatus: "",
    RecommendedResource:"",
    ShipmentCountry: '',
    ShipmentState: ""
  })
  const handleSLAChange = (field) => (value) => {
    console.log("Changed:", field, value); 
    setSLA((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleWOGeneral = (field) => (value) =>{
    console.log("Changed:", field, value); 
    setWOGeneral((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  useEffect(() => {
    const fetchAllData = async () => {
      Swal.fire({
        title: "Please wait...",
        text: "Loading Work Order Details...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      try {
        const resWO = await ApiCustomer.get(`/api/work-order/${woid}`);
        const workOrderData = resWO.data.data;
        setWorkOrders(workOrderData);

        const resMO = await ApiCustomer.get(`/api/material-order?WOID=${woid}`);
        setMaterialOrders(resMO.data.data);

        if (workOrderData?.CaseID) {
          const resCI = await ApiCustomer.get(
            `/api/case-information/${workOrderData.CaseID}`
          );
          setCaseInformation(resCI.data.data);

          const resBooking = await ApiCustomer.get(
            `/api/bookings?WOID=${woid}`
          );
          // console.log("Res Booking : ",resBooking.data.data)

          const resOwner = await ApiCustomer.get(
            `/api/user/${workOrderData.OwnerID}`
          );

          // console.log("Case Detail : ", caseDetails);
          const resMainAccount = resCI.data.data.contact_information;
          setDataFetchCustomerData({
            MainAccount: resMainAccount,
          });
          if (caseInformation.SiteAccountID !== null) {
            const resSiteAccount = resCI.data.data.site_account;
            setDataFetchCustomerData((prev) => ({
              ...prev,
              SiteAccount: resSiteAccount,
              Type: "SiteAccount",
            }));
          } else {
            setDataFetchCustomerData((prev) => ({
              ...prev,
              type: "Individual", // fallback if no site account
            }));
          }

          // const res = await ApiCustomer.get(`/api/`)

          setOwnerWorkOrder(resOwner.data.data);
          setBookings(resBooking.data.data);

          setSLA((prev) => ({
            ...prev,
            requestedDateTimeCustomer:
              resWO.data.data.RequestedDateTimeCustomer || "",
            slaJeopardy: resWO.data.data.SLAJeopardy || "",
            dueDateCustomer: resWO.data.data.DueDateCustomer || "",
            coverageWindow: resWO.data.data.CoverageWindow || "",
            response: resWO.data.data.Response || "",
            otcCode: resWO.data.data.OTCCode || "",
            guaranteedFixTimeCustomer:
              resWO.data.data.GuaranteedFixTimeCustomer || "",
            earlyStartDateTimeCustomer:
              resWO.data.data.EarlyStartDateTimeCustomer || "",
            latestStartDateTimeCustomer:
              resWO.data.data.LatestStartDateTimeCustomer || "",
            slaReschedule: resWO.data.data.SLAReschedule || "",
            activeScheduleDate: resWO.data.data.ActiveScheduleDate || "",
            slaErrorDescription: resWO.data.data.SLAErrorDescription || "",
            casePriorityIndex: resWO.data.data.CasePriorityIndex ?? "", // use ?? to allow 0
          }));
          setWOGeneral((prev) => ({
            ...prev,
            IncomingChannel: "",
            WorkOrderNumber: woid,
            WorkOrderType: workOrderData.WorkOrderType,
            Priority: workOrderData.Priority,
            SystemStatus: workOrderData.SystemStatus,
            SubStatus: workOrderData.SubStatus,
            BookableResourceBooking: resBooking.data.data.BookingDetails?.ResourceId,
            ServiceOfferID: resCI.data.data.servicecatalog?.warranty_services?.Service_offerID,
            ServiceDescription: resCI.data.data.servicecatalog?.warranty_services?.Service_description,
            PatnerCaseID: "",
            PatnerStatus: "",
            RecommendedResource:"",
            ShipmentCountry: workOrderData.ShipmentCountry,
            ShipmentState: workOrderData.ShipmentState
          }))

          console.log("Res WO : ", resWO.data.data);
          console.log("Res MO : ", resMO.data.data);
          console.log("Res CI : ", resCI.data.data);
          console.log("Res Booking : ", resBooking.data.data);
          console.log("Res Owner : ", resOwner.data.data);
          console.log("Res Main Account : ", resMainAccount);
          console.log("res wo general : ",WOGeneral)
        }
        if(resWO.data.data.RequestedDateTimeCustomer == null){
          Swal.fire({
            icon: "warning",
            title: "Warning",
            text: "The Work Order does not have Response Time Value, nor a Repair Time Value and therefore the system cannot perform the SLA Calculation\nPlease Create Booking First.",
          });
        }else{

          Swal.close();
        }
      } catch (err) {
        console.error("Fetch error:", err);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong while loading data!",
        });
      }
    };

    if (woid) fetchAllData();
   }, [woid]);

  useEffect(() => {
    console.log("Data Fetch Customer Data in WO : ", dataFetchCustomerData);
  }, [dataFetchCustomerData]);

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleString();
  };

  // const fetchBookings = async () => {
  //   try {
  //     const response = await ApiCustomer.get('/api/bookings')
  //     setBookings(response.data.data)
  //   } catch (error) {
  //     console.error("Fetch error:", err);
  //       Swal.fire({
  //         icon: 'error',
  //         title: 'Oops...',
  //         text: 'Something went wrong while loading data!',
  //       });
  //   }
  // }

  // useEffect(() => {
  // }, [workOrders])

  const [selected, setSelected] = useState("work_order");

  // const location = useLocation();
  // const { ownerUserData, dataFetchCustomerData } = location.state || {};

  const navigate = useNavigate();

  const [requestedDateTimeCustomer, setrequestedDateTimeCustomer] =
    useState(null);
  const [guaranteedFixTimeCustomer, setGuaranteedFixTimeCustomer] =
    useState(null);
  const [dueDate, setDuedate] = useState(null);
  // const [dueDateCustomer, setDueDateCustomer] = useState(null);
 const [first, setFirst] = useState(null);

  const [followUpRequired, setFollowUpRequired] = useState(false);
  const [followUpCompleted, setFollowUpCompleted] = useState(false);

  const [finishedOnDateCustomer, setFinishedOnDateCustomer] = useState(null);
  const [finishedOnDate, setFinishedOnDate] = useState(null);

  const [meterReadAvailable, setMeterReadAvailable] = useState(false);
  return (
    <>
      {workOrders.SystemStatus === "CLOSED_POSTED" && (
        <div className="p-4 my-2 text-yellow-700 bg-yellow-100 border-l-4 border-yellow-500">
          This work order is <strong>read-only</strong> because it is{" "}
          <strong>Closed</strong>.
        </div>
      )}
      {workOrders?.WOID && caseInformation?.CaseID && (
        <TabsServiceWO 
          workOrders={workOrders} 
          SLA={SLA} 
          setSLA={setSLA} 
          WOGeneral={WOGeneral}
        />
      )}
      <Card className="p-0 mt-2 border-0 rounded-none">
        <Tabs defaultValue="Quick_WO_Input" className="">
          <CardHeader
            className={"flex flex-col gap-3 border-2 w-full p-2 sticky"}
          >
            <div className="flex justify-between">
              <CardTitle className="text-xl ">
                {woid}
                <span className="flex items-center text-sm">
                  Work Order .
                  <Select
                    onValueChange={setSelected}
                    defaultValue="work_order"
                    className="shadow-xl"
                  >
                    <SelectTrigger className="border-none shadow-none">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="work_order">work order</SelectItem>
                        <SelectItem value="??">??</SelectItem>
                        <SelectItem value="!!">!!</SelectItem>
                        <SelectItem value="**">**</SelectItem>
                        <SelectItem value="&&">&&</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </span>
              </CardTitle>
              <CardTitle className="flex">
                <div className="flex flex-col justify-center px-2 border-r-2 item-center">
                  <h1 className="text-blue-500">{ownerWorkOrder.Name}</h1>
                  <p className="text-sm font-light ">Owner</p>
                </div>
                <div className="flex flex-col justify-center px-2 border-r-2 item-center">
                  <h1 className="text-blue-500">---</h1>
                  <p className="text-sm font-light ">Queue</p>
                </div>
                <div className="flex flex-col justify-center px-2 border-r-2 item-center">
                  <h1 className="text-blue-500">
                    {dataFetchCustomerData.MainAccount?.Salutation}{" "}
                    {dataFetchCustomerData.MainAccount?.FirstName}{" "}
                    {dataFetchCustomerData.MainAccount?.LastName}
                  </h1>
                  <p className="text-sm font-light ">Contact</p>
                </div>
                <div className="flex flex-col justify-center px-2 border-r-2 item-center">
                  <Select onValueChange={setSelected} defaultValue="first">
                    <SelectTrigger className="p-0 text-blue-500 border-none shadow-none">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="p-0">
                      <SelectGroup className="p-0">
                        <SelectItem value="first" className="p-0">
                          {dataFetchCustomerData.SiteAccount?.Company}
                        </SelectItem>
                        <SelectItem value="??">??</SelectItem>
                        <SelectItem value="!!">!!</SelectItem>
                        <SelectItem value="**">**</SelectItem>
                        <SelectItem value="&&">&&</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <p className="text-sm font-light ">Site Account</p>
                </div>
              </CardTitle>
            </div>
            <TabsList className="bg-white ">
              <TabsTrigger
                variant="underline"
                value="wo_summary"
                className="cursor-pointer"
              >
                WO Summary
              </TabsTrigger>
              <TabsTrigger
                variant="underline"
                value="wo_details"
                className="cursor-pointer white"
              >
                WO Details
              </TabsTrigger>
              <TabsTrigger
                variant="underline"
                value="wo_bookings"
                className="cursor-pointer"
              >
                WO Bookings
              </TabsTrigger>
              <TabsTrigger
                variant="underline"
                value="wo_Notes_Timeline"
                className="cursor-pointer"
              >
                WO Notes/Timeline
              </TabsTrigger>
              <TabsTrigger
                variant="underline"
                value="wo_Closure_Details"
                className="cursor-pointer"
              >
                WO Closure Details
              </TabsTrigger>
              <TabsTrigger
                variant="underline"
                value="Quick_WO_Input"
                className="cursor-pointer"
              >
                Quick WO Input
              </TabsTrigger>
              <SelectBarRelated></SelectBarRelated>
            </TabsList>
          </CardHeader>

          <TabsContent value="wo_summary">
            <div className="flex gap-4">
              <Card className="rounded-md flex-1/3">
                <CardHeader>
                  <CardTitle className="text-lg ">General</CardTitle>
                  <hr />
                </CardHeader>
                <CardContent className="grid items-center grid-cols-4 gap-5 ">
                  <div className="grid items-center grid-cols-2 col-span-2 p-4 ring-1">
                    <CaseField label="Incoming Channel" icon>
                      <Input
                        variant={"invisible"}
                        className=""
                        value={"---"}
                        readOnly
                      />
                    </CaseField>
                  </div>
                  <CaseField label="Patner Case Id">
                    <Input
                      variant={"invisible"}
                      className=""
                      value={"---"}
                      readOnly
                    />
                  </CaseField>
                  <CaseField label="Work Order Number" icon>
                    <Input
                      variant={"invisible"}
                      className=""
                      value={WOGeneral.WorkOrderNumber || "---"}
                      readOnly
                    />
                  </CaseField>
                  <CaseField label="Patner Status" icon>
                    <Input
                      variant={"invisible"}
                      className=""
                      value={"---"}
                      readOnly
                    />
                  </CaseField>
                  <CaseField label="Work Order Type">
                    <Input
                      variant={"invisible"}
                      className=""
                      value={WOGeneral.WorkOrderType || "---"}
                      readOnly
                    />
                  </CaseField>
                  <div className="col-span-2 p-3 ring-1"></div>
                  <CaseField label="Priority" icon>
                    <Input
                      variant={"invisible"}
                      className=""
                      value={"---"}
                      readOnly
                    />
                  </CaseField>
                  <CaseField label="Recommended Resource">
                    <Input
                      variant={"invisible"}
                      className=""
                      value={"---"}
                      readOnly
                    />
                  </CaseField>
                  <CaseField label="System Status">
                    <Input
                      variant={"invisible"}
                      className=""
                      value={WOGeneral.SystemStatus || "---"}
                      readOnly
                    />
                  </CaseField>
                  <CaseField label="Shipment Country" icon>
                    <SearchCommandBlock
                      variant={"invisible"}
                      className=""
                      value={WOGeneral.ShipmentCountry || "---"}
                      placeholder="---"
                      onChange={handleWOGeneral("ShipmentCountry")}
                      options={["USA", "Canada", "Indonesia", "UK", "Germany", "France", "Japan", "China", "India", "Australia", "Brazil"] }
                    />
                  </CaseField>
                  <CaseField label="Sub-Status" icon={KeyRound}>
                    <Input
                      variant={"invisible"}
                      className=""
                      value={"---"}
                      readOnly
                    />
                  </CaseField>
                  <CaseField label="Shipment State" icon>
                    <Input
                      variant={"invisible"}
                      className=""
                      value={"---"}
                      readOnly
                    />
                  </CaseField>
                  <CaseField label="Bookable Resource Booking" icon>
                    <Input
                      variant={"invisible"}
                      className=""
                      value={WOGeneral.BookableResourceBooking || "---"}
                      readOnly
                    />
                  </CaseField>
                  <CaseField
                    label="Service Offer ID"
                    className={"col-start-1"}
                    icon
                  >
                    <Input
                      variant={"invisible"}
                      className=""
                      value={
                        caseInformation.servicecatalog?.Service_offerID || "---"
                      }
                      readOnly
                    />
                  </CaseField>
                  <CaseField
                    label="Service Description"
                    className={"col-start-1"}
                    icon
                  >
                    <Input
                      variant={"invisible"}
                      className=""
                      value={
                        caseInformation.servicecatalog?.warranty_services
                          ?.Service_description || "---"
                      }
                      readOnly
                    />
                  </CaseField>
                </CardContent>
              </Card>

              <div className="flex flex-col flex-1 gap-4">
                <Card className="rounded-sm ">
                  <CardContent className="grid items-center grid-cols-4">
                    <CaseField
                      label="Currently Worked By"
                      className={"col-span-3"}
                    >
                      {" "}
                      <Input
                        variant={"invisible"}
                        className=""
                        value={"---"}
                        readOnly
                      />
                    </CaseField>
                  </CardContent>
                </Card>

                <Card className="rounded-md ">
                  <CardHeader>
                    <CardTitle className="text-lg ">
                      Entitlement and Modifier
                    </CardTitle>
                    <hr />
                  </CardHeader>
                  <CardContent className="grid items-center grid-cols-2 gap-5">
                    <CaseField label="Entitlement" icon>
                      <Input
                        variant={"invisible"}
                        className=""
                        value={"---"}
                        readOnly
                      />
                    </CaseField>
                    <CaseField label="Offer" icon>
                      <Input
                        variant={"invisible"}
                        className=""
                        value={"---"}
                        readOnly
                      />
                    </CaseField>
                    <CaseField label="OTC Code" icon>
                      <Input
                        variant={"invisible"}
                        className=""
                        value={"---"}
                        readOnly
                      />
                    </CaseField>
                    <CaseField label="Authorizing Employee" icon>
                      <Input
                        variant={"invisible"}
                        className=""
                        value={"---"}
                        readOnly
                      />
                    </CaseField>
                    <CaseField label="Coverage Window Used" icon>
                      <Input
                        variant={"invisible"}
                        className=""
                        value={"---"}
                        readOnly
                      />
                    </CaseField>
                    <CaseField label="Coverage Window Value" icon>
                      <Input
                        variant={"invisible"}
                        className=""
                        value={"---"}
                        readOnly
                      />
                    </CaseField>
                    <CaseField label="Response Time Value" icon>
                      <Input
                        variant={"invisible"}
                        className=""
                        value={"---"}
                        readOnly
                      />
                    </CaseField>
                    <CaseField label="Repair Time Value" icon>
                      <Input
                        variant={"invisible"}
                        className=""
                        value={"---"}
                        readOnly
                      />
                    </CaseField>
                    <CaseField label="Case Priority Index" icon>
                      <Input
                        variant={"invisible"}
                        className=""
                        value={"---"}
                        readOnly
                      />
                    </CaseField>
                  </CardContent>
                </Card>
              </div>
            </div>

            <Card className="flex-col mt-5">
              <CardHeader>
                <CardTitle className="text-lg ">
                  Service Delivery Address
                </CardTitle>
                <hr />
              </CardHeader>
              <CardContent className="grid ">
                <div className="flex font-bold">
                  <Lock className="mr-2 size-5"></Lock>
                  <span>Service Delivery Address</span>
                  <span className="ml-39">...</span>
                </div>
              </CardContent>
            </Card>

            <Card className="flex-col mt-7 ">
              <CardHeader>
                <CardTitle className="text-lg ">
                  SLA in Customer Time Zone
                </CardTitle>
                <hr />
              </CardHeader>
              <CardContent className="grid grid-cols-8 gap-5 auto-rows-auto place-content-between">
                <CaseField label="SLA Jeopardy" className={""} icon span={2}>
                  {" "}
                  <Input className="" value={SLA.slaJeopardy} readOnly />{" "}
                </CaseField>
                <CaseField
                  label="Requested Date Time (Customer)"
                  className={""}
                  span={2}
                >
                  <DatePicker
                    value={
                      SLA.requestedDateTimeCustomer
                        ? new Date(SLA.requestedDateTimeCustomer)
                        : null
                    }
                    onChange={handleSLAChange("requestedDateTimeCustomer")}
                  />
                </CaseField>

                <CaseField label="SLA Reschedule" className={""} icon>
                  {" "}
                  <Input className="" value={SLA.slaReschedule} readOnly />{" "}
                </CaseField>
                <CaseField label="Due Date (Customer)" className={""} icon span={2}>
                  <DatePicker value={
                      SLA.dueDateCustomer
                        ? new Date(SLA.dueDateCustomer)
                        : null
                    }
                    onChange={handleSLAChange("dueDateCustomer")}/>
                </CaseField>
                <CaseField
                  label="Guaranteed Fix Time (Customer)"
                  className={""}
                  icon
                  span={2}
                >
                  <DatePicker value={
                      SLA.guaranteedFixTimeCustomer
                        ? new Date(SLA.guaranteedFixTimeCustomer)
                        : null
                    }
                    onChange={handleSLAChange("guaranteedFixTimeCustomer")}/>
                </CaseField>
                <CaseField label="Active Schedule Date" className={""} icon>
                  {" "}
                  <Input
                    className=""
                    value={SLA.activeScheduleDate}
                    readOnly
                  />{" "}
                </CaseField>
                <CaseField label="Coverage Window" className={""} span={2}>
                  {" "}
                  <Input
                    className=""
                    value={SLA.coverageWindow}
                    onChange={(e) => setCoverageWindow(e.target.value)}
                  />{" "}
                </CaseField>
                <CaseField
                  label="Early Start Date Time (Customer)"
                  className={""}
                  span={2}
                >
                  <DatePicker
                    value={
                      SLA.earlyStartDateTimeCustomer
                        ? new Date(SLA.earlyStartDateTimeCustomer)
                        : null
                    }
                    onChange={handleSLAChange("earlyStartDateTimeCustomer")}
                  ></DatePicker>
                </CaseField>
                <CaseField
                  label="SLA Error Description"
                  className={"row-span-2 items-start"}
                  childClass={"row-span-2"}
                  icon
                >
                  <textarea
                    value={SLA.slaErrorDescription}
                    className="border-0 ring-0 ring-gray-400 w-[100%] h-[100%] resize-none"
                  ></textarea>
                </CaseField>
                <CaseField label="Response" className={""} span={2}>
                  {" "}
                  <Input className="" value={SLA.response} readOnly />{" "}
                </CaseField>
                <CaseField
                  label="Latest Start Date Time (Customer)"
                  className={""}
                  span={2}
                >
                  <DatePicker value={
                      SLA.latestStartDateTimeCustomer
                        ? new Date(SLA.latestStartDateTimeCustomer)
                        : null
                    }
                    onChange={handleSLAChange("latestStartDateTimeCustomer")}/>
                </CaseField>
                <CaseField label="OTC Code" className={""}>
                  {" "}
                  <Input
                    className=""
                    value={SLA.otcCode}
                    onChange={(e) => setOtcCode(e.target.value)}
                  />{" "}
                </CaseField>
                <CaseField
                  label="Case Priority Index"
                  className={"col-start-7"}
                  icon
                >
                  {" "}
                  <Input
                    className=""
                    value={SLA.casePriorityIndex}
                    readOnly
                  />{" "}
                </CaseField>
              </CardContent>
            </Card>

            <Card className="flex-col mt-5">
              <CardHeader>
                <CardTitle className="text-lg ">
                  {" "}
                  Part Order Information
                </CardTitle>
                <hr />
              </CardHeader>
              <CardContent className="grid gap-5">
                <div className="flex font-bold">
                  <Lock className="mr-2 size-5"></Lock>
                  <span>EarliestDateAllPartsAvailable</span>
                  <span className="ml-30">...</span>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Name</TableHead>
                      <TableHead>Case ID</TableHead>
                      <TableHead>Created On</TableHead>
                      <TableHead>Order Status</TableHead>
                      <TableHead>Order Type</TableHead>
                      <TableHead>Owner</TableHead>
                      <TableHead>Work Order</TableHead>
                      <TableHead>Ready For Closure Date</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">
                        No data available
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>

                <div className="flex font-bold">
                  <Lock className="mr-2 size-5"></Lock>
                  <span>Low Inventory</span>
                  <span className="ml-57">...</span>
                </div>
              </CardContent>
            </Card>

            <Card className="flex-col mt-5">
              <CardHeader>
                <CardTitle className="text-lg ">
                  {" "}
                  Material Order Information
                </CardTitle>
                <hr />
              </CardHeader>
              <CardContent className="grid">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Order Number</TableHead>
                      <TableHead>Case ID</TableHead>
                      <TableHead>Created On</TableHead>
                      <TableHead>Order Status</TableHead>
                      <TableHead>Order Type</TableHead>
                      <TableHead>Ready For Closure</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {materialOrders.length > 0
                      ? materialOrders.map((material) => (
                          <TableRow key={material.MOID}>
                            <TableCell className="font-medium">
                              <Link to={`/material-order/${material.MOID}`}>
                                {material.MOID} on {material.WOID}
                              </Link>
                            </TableCell>
                            <TableCell>{material.workorder?.CaseID}</TableCell>
                            <TableCell>{material.CreatedOn}</TableCell>
                            <TableCell>{material.OrderStatus}</TableCell>
                            <TableCell>{material.OrderType}</TableCell>
                            <TableCell>
                              {material.ReadyForClosureDate}
                            </TableCell>
                          </TableRow>
                        ))
                      : null}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card className="flex-col mt-5">
              <CardHeader>
                <CardTitle className="text-lg "> Primary Incident</CardTitle>
                <hr />
              </CardHeader>

              <CardContent className="grid">
                <div className="flex font-bold">
                  <Lock className="mr-2 size-5"></Lock>
                  <span>Primary Incident</span>
                  <span className="ml-50">...</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="wo_details">
            <Card className="flex-col mt-7">
              <span className="ml-5 text-xl font-bold">WO Details</span>
              <CardContent className="grid">
                <div className="flex font-bold">
                  <Lock className="mr-2 size-5"></Lock>
                  <span>Customer Account</span>
                  <span className="ml-30">...</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="wo_bookings">
            <Card className="flex-col mt-5">
              <span className="ml-5 text-xl font-bold">WO Bookings</span>
              <CardContent className="grid grid-cols-3 gap-5">
                <CaseField label={"Requested Date Time (Customer)"} span={2}>
                  <DatePicker
                    variant="icon"
                    
                    value={SLA.requestedDateTimeCustomer ? new Date(SLA.requestedDateTimeCustomer) : null}
                    onChange={handleSLAChange("requestedDateTimeCustomer")}
                    // value={requestedDateTimeCustomer}
                    // onChange={setrequestedDateTimeCustomer}
                  ></DatePicker>
                </CaseField>
                <CaseField label={"Guaranteed Fix Time (Customer)"} span={2}>
                  <DatePicker
                    variant="icon"
                    value={guaranteedFixTimeCustomer}
                    onChange={setGuaranteedFixTimeCustomer}
                  ></DatePicker>
                </CaseField>
                <CaseField label={"Due Date  (Customer)"} span={2}>
                  <DatePicker
                    variant="icon"
                    value={dueDate}
                    onChange={setDuedate}
                  ></DatePicker>
                </CaseField>
              </CardContent>
            </Card>

            <Card className="flex-col mt-5">
              <span className="ml-5 text-xl font-bold">Booking </span>
              <CardContent className="grid">
                {/* <Button variant="link" className="w-50 ml-250 "> */}
                {/* <Link 
                  to="/bookings"
                  state={{ WOID: workOrders.WOID }}
                >
                    + New Bookable Resource
                  </Link> */}
                <NewBookableResourceBooking
                  CaseID={caseInformation?.CaseID}
                  WOID={workOrders.WOID}
                  CreatedBy={user.id}
                  RequestedDateTimeCustomer={SLA.requestedDateTimeCustomer ? new Date(SLA.requestedDateTimeCustomer) : null}
                />
                {/* </Button> */}
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Resource</TableHead>
                      <TableHead>Account</TableHead>
                      <TableHead>Booking</TableHead>
                      <TableHead>Reschedule</TableHead>
                      <TableHead>Reschedule Reason</TableHead>
                      <TableHead>Start Time</TableHead>
                      <TableHead>Estimated Arrival Time (ETA)</TableHead>
                      <TableHead>Actual Arrival Time</TableHead>
                      <TableHead>End Time</TableHead>
                      <TableHead>Created On</TableHead>
                      <TableHead>Created By</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {bookings.length > 0 ? (
                      bookings.map((booking, index) => (
                        <TableRow
                          key={booking.BookingId || index}
                          onClick={() =>
                            navigate(`/bookings/${booking.BookingId}`)
                          }
                        >
                          <TableCell>
                            {booking.bookingDetails?.[0].resource?.Name || "-"}
                          </TableCell>
                          <TableCell>
                            {booking.bookingDetails?.[0].resourceaccount
                              ?.Name || "-"}
                          </TableCell>
                          <TableCell>{booking.BookingStatus || "-"}</TableCell>
                          <TableCell>
                            {booking.CeScheduleChange ? "Yes" : "No"}
                          </TableCell>
                          <TableCell>
                            {booking.ScheduleJeopardy ? "Jeopardy" : "-"}
                          </TableCell>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                          <TableCell>{formatDate(booking.CreatedAt)}</TableCell>
                          {/* <TableCell>{formatDate(booking.StartTimeCustomerTime)}</TableCell>
                        <TableCell>{formatDate(booking.EstimatedArrivalTimeCustomerTime)}</TableCell>
                        <TableCell>{formatDate(booking.ActualArrivalTimeCustomerTime)}</TableCell>
                        <TableCell>{formatDate(booking.EndTimeCustomerTime)}</TableCell>
                        <TableCell>{formatDate(booking.CreatedAt)}</TableCell> */}
                          <TableCell>
                            {booking.createdByUser?.Name || "-"}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={11} className="text-center">
                          No data available
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card className="flex-col mt-5">
              <span className="ml-5 text-xl font-bold">Actions</span>
              <CardContent className="grid gap-4.5 grid-flow-col grid-rows-3">
                <div className="flex font-bold">
                  <span className="ml-7">Action Booking</span>
                  <span className="ml-49.5">...</span>
                </div>

                <div className="flex font-bold">
                  <span className="ml-7">Action Booking Status</span>
                  <span className="ml-37">...</span>
                </div>

                <div className="flex font-bold">
                  <Lock className="mr-2 size-5"></Lock>
                  <span>Action Date</span>
                  <span className="ml-56.5">...</span>
                </div>

                <div className="flex font-bold">
                  <span className="ml-7">Action Count</span>
                  <span className="ml-50">...</span>
                </div>

                <div className="flex font-bold">
                  <span className="ml-7">Finished By</span>
                  <span className="ml-53.5">...</span>
                </div>

                <div className="flex font-bold">
                  <Lock className="mr-2 size-5"></Lock>
                  <span>Finished on Date</span>
                  <span className="ml-43.5">...</span>
                </div>

                <div className="flex font-bold">
                  <span>Partner Contact</span>
                  <span className="ml-40">...</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="wo_Notes_Timeline">
            <Card className="flex-col mt-7">
              <span className="ml-5 text-xl font-bold">
                WO Notes / Timeline
              </span>
              <CardContent className="grid">
                <div className="flex font-bold">
                  <Lock className="mr-2 size-5"></Lock>
                  <span> WO Notes / Timeline</span>
                  <span className="ml-30">...</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="wo_Closure_Details" className={"p-4"}>
            <div className="flex gap-4">
              <div className="flex flex-col w-2/3 gap-4">
                <Card className="flex-col">
                  <CardHeader>
                    <CardTitle className="text-lg ">Resolution Notes</CardTitle>
                    <hr />
                  </CardHeader>
                  <CardContent className="grid items-center grid-cols-4 gap-5">
                    <CaseField label={"Resolution Notes/Diagnostics"} span={3}>
                      <textarea className="w-full h-20 p-2 border rounded-md resize-none"></textarea>
                    </CaseField>
                    {/* <div className="flex font-bold">
                      <Lock className="mr-2 size-5"></Lock>
                      <span>Resolution Notes/Diagnostics</span>
                      <span className="ml-30">...</span>
                    </div> */}
                  </CardContent>
                </Card>

                <Card className="flex-col">
                  <CardHeader>
                    <CardTitle className="text-lg ">Labor Types</CardTitle>
                    <hr />
                  </CardHeader>
                  <CardContent className="flex flex-col items-end justify-end p-0 ">
                    <div className="flex gap-2">
                      <Button variant={"ghost"}>
                        <span className="flex items-center gap-3">
                          <Plus className=" size-5" /> New Labor Types
                        </span>
                      </Button>
                      <Button variant={"ghost"}>
                        <span className="flex items-center gap-3">
                          <RotateCw className=" size-5" /> Refresh
                        </span>
                      </Button>
                    </div>
                    <Table>
                      <TableHeader className={" border-y-2"}>
                        <TableRow>
                          <TableHead className="w-[100px]">Service</TableHead>
                          <TableHead>Duration</TableHead>
                          <TableHead>Billable</TableHead>
                          <TableHead>Outside of Bussiness Hours</TableHead>
                          <TableHead>Total Amount</TableHead>
                          <TableHead>Line Order</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow className={"h-[10em]"}>
                          <TableCell
                            className="font-medium text-center"
                            colSpan={6}
                          >
                            No data available
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                  <CardFooter>
                    <Pagination>
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
                  </CardFooter>
                </Card>

                <Card className="flex-col">
                  <CardHeader>
                    <CardTitle className="text-lg ">
                      Miscellaneous Charges
                    </CardTitle>
                    <hr />
                  </CardHeader>
                  <CardContent className="flex flex-col items-end p-0">
                    <div className="flex gap-2">
                      <Button variant={"ghost"}>
                        <span className="flex items-center gap-3">
                          <Plus className=" size-5" /> New Miscellaneous Charges
                        </span>
                      </Button>
                      <Button variant={"ghost"}>
                        <span className="flex items-center gap-3">
                          <RotateCw className=" size-5" /> Refresh
                        </span>
                      </Button>
                    </div>
                    <Table>
                      <TableHeader>
                        <TableRow className={"border-y-2"}>
                          <TableHead className="w-[100px]">
                            Product ID
                          </TableHead>
                          <TableHead>Product</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead>Total Amount</TableHead>
                          <TableHead>Line Order</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow className={"h-[10em]"}>
                          <TableCell
                            className="font-medium text-center"
                            colSpan={6}
                          >
                            No data available
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                  <CardFooter>
                    <Pagination>
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
                  </CardFooter>
                </Card>

                <Card className="flex-col">
                  <CardHeader>
                    <CardTitle className="text-lg ">
                      Page Count Information
                    </CardTitle>
                    <hr />
                  </CardHeader>

                  <CardContent className="grid items-center grid-cols-3 gap-5">
                    <CaseField label={"Meter Read Available"} span={2}>
                      <Select
                        className=""
                        value={meterReadAvailable ? "yes" : "no"}
                        onValueChange={(value) =>
                          setMeterReadAvailable(value === "yes")
                        }
                      >
                        <SelectTrigger className={"w-full"}>
                          <SelectValue placeholder="---" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">Yes</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </CaseField>
                    <CaseField label={"Reason if Not Available"} span={2}>
                      <Input variant={"invisible"} placeholder={"---"}></Input>
                    </CaseField>
                    <CaseField label={"Reason if Not Available"} span={2}>
                      <Input variant={"invisible"} placeholder={"---"}></Input>
                    </CaseField>
                    {/* <div className="flex font-bold">
                      <Lock className="mr-2 size-5"></Lock>
                      <span>Meter Read Available</span>
                      <span className="ml-40">...</span>
                    </div>
                    <div className="flex font-bold">
                      <Lock className="mr-2 size-5"></Lock>
                      <span>Reason if Not Available</span>
                      <span className="ml-36.5">...</span>
                    </div>
                    <div className="flex font-bold">
                      <Lock className="mr-2 size-5"></Lock>
                      <span>Reason if Not Available</span>
                      <span className="ml-36">...</span>
                    </div> */}
                  </CardContent>
                </Card>

                <Card className="flex-col">
                  <CardHeader>
                    <CardTitle className="text-lg ">
                      DOA Letter (If DOA Case)
                    </CardTitle>
                    <hr />
                  </CardHeader>

                  <CardContent className="grid items-center grid-cols-3">
                    <CaseField label={"DOA Letter"} span={2}>
                      <Input variant={"invisible"} placeholder={"---"}></Input>
                    </CaseField>
                    {/* <div className="flex font-bold">
                      <Lock className="mr-2 size-5"></Lock>
                      <span>Product ID</span>
                      <span className="ml-50">...</span>
                    </div> */}
                  </CardContent>
                </Card>
              </div>
              {/* Right column 30% of the size */}
              <div className="flex flex-col w-1/3 gap-4">
                <Card className="flex-col">
                  <CardHeader>
                    <CardTitle className="text-lg ">Follow-Up</CardTitle>
                    <hr />
                  </CardHeader>
                  <CardContent className="grid items-center grid-cols-3 gap-5">
                    <CaseField label={"Follow Up Required"} span={2}>
                      <Select
                        className=""
                        value={followUpRequired ? "yes" : "no"}
                        onValueChange={(value) =>
                          setFollowUpRequired(value === "yes")
                        }
                      >
                        <SelectTrigger className={"w-full"}>
                          <SelectValue placeholder="---" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">Yes</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </CaseField>
                    <CaseField label={"Follow Up Reason Code"} span={2}>
                      <Input variant={"invisible"} placeholder={"---"}></Input>
                    </CaseField>
                    <CaseField label={"Follow Up Completed"} span={2}>
                      <Select
                        className=""
                        value={followUpCompleted ? "yes" : "no"}
                        onValueChange={(value) =>
                          setFollowUpCompleted(value === "yes")
                        }
                      >
                        <SelectTrigger className={"w-full"}>
                          <SelectValue placeholder="---" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">Yes</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </CaseField>
                    <CaseField label={"Follow Up Note"} span={2}>
                      <Input variant={"invisible"} placeholder={"---"}></Input>
                    </CaseField>
                    {/* <div className="flex font-bold">
                      <Lock className="mr-2 size-5"></Lock>
                      <span>Follow Up Required</span>
                      <span className="ml-43">...</span>
                    </div>
                    <div className="flex font-bold">
                      <Lock className="mr-2 size-5"></Lock>
                      <span>Follow Up Reason Code</span>
                      <span className="ml-36">...</span>
                    </div>
                    <div className="flex font-bold">
                      <Lock className="mr-2 size-5"></Lock>
                      <span>Follow Up Completed </span>
                      <span className="ml-39.5">...</span>
                    </div>
                    <div className="flex font-bold">
                      <Lock className="mr-2 size-5"></Lock>
                      <span>Follow Up Note</span>
                      <span className="ml-51">...</span>
                    </div> */}
                  </CardContent>
                </Card>
                <Card className="flex-col">
                  <CardHeader>
                    <CardTitle className="text-lg ">Closure Data</CardTitle>
                    <hr />
                  </CardHeader>
                  <CardContent className="grid items-center grid-cols-3 gap-5">
                    <CaseField label={"Finished By"} span={2}>
                      <Input variant={"invisible"} placeholder={"---"}></Input>
                    </CaseField>
                    <CaseField label={"Finished on Date (Customer)"} span={2}>
                      <DatePicker
                        value={finishedOnDateCustomer}
                        onChange={setFinishedOnDateCustomer}
                      ></DatePicker>
                    </CaseField>
                    <CaseField label={"Finished on Date"} span={2}>
                      <DatePicker
                        value={finishedOnDate}
                        onChange={setFinishedOnDate}
                      ></DatePicker>
                    </CaseField>
                    <CaseField label={"Patner Contact"} span={2}>
                      <Input variant={"invisible"} placeholder={"---"}></Input>
                    </CaseField>
                    <CaseField label={"Workorder Closed Date"} span={2} icon>
                      <Input variant={"invisible"} placeholder={"---"}></Input>
                    </CaseField>
                    <CaseField label={"Customer Resolution Date"} span={2} icon>
                      <Input variant={"invisible"} placeholder={"---"}></Input>
                    </CaseField>
                    {/* 
                    <div className="flex font-bold">
                      <Lock className="mr-2 size-5"></Lock>
                      <span>Finished By</span>
                      <span className="ml-62">...</span>
                    </div>
                    <div className="flex font-bold">
                      <Lock className="mr-2 size-5"></Lock>
                      <span>Finished on Date (Customer)</span>
                      <span className="ml-30">...</span>
                    </div>
                    <div className="flex font-bold">
                      <Lock className="mr-2 size-5"></Lock>
                      <span>Finished on Date </span>
                      <span className="ml-52">...</span>
                    </div>
                    <div className="flex font-bold">
                      <Lock className="mr-2 size-5"></Lock>
                      <span>Patner Contact</span>
                      <span className="ml-50">...</span>
                    </div>
                    <div className="flex font-bold">
                      <Lock className="mr-2 size-5"></Lock>
                      <span>Workorder Closed Date</span>
                      <span className="ml-34.5">...</span>
                    </div>
                    <div className="flex font-bold">
                      <Lock className="mr-2 size-5"></Lock>
                      <span>Customer Resolution Date</span>
                      <span className="ml-29.5">...</span>
                    </div> */}
                  </CardContent>
                </Card>
                <Card className="flex-col">
                  <CardHeader>
                    <CardTitle className="text-lg ">Closure Codes</CardTitle>
                    <hr />
                  </CardHeader>
                  <CardContent className="grid items-center grid-cols-3 gap-5">
                    <CaseField label={"Delay Codes"} span={2}>
                      <Command className="rounded-lg border shadow-md ]">
                        <CommandInput placeholder="Type a command or search..." />
                      </Command>
                    </CaseField>
                    <CaseField label={"Repair Class Codes"} span={2}>
                      <Command className="rounded-lg border shadow-md ]">
                        <CommandInput placeholder="Type a command or search..." />
                      </Command>
                    </CaseField>
                    <CaseField label={"Travel Zone"} span={2}>
                      <Input variant={"invisible"} value={"---"} />
                    </CaseField>
                    {/* <div className="flex font-bold">
                      <Lock className="mr-2 size-5"></Lock>
                      <span>Delay Codes</span>
                      <span className="ml-50">...</span>
                    </div>
                    <div className="flex font-bold">
                      <Lock className="mr-2 size-5"></Lock>
                      <span>Repair Class Codes</span>
                      <span className="ml-38">...</span>
                    </div>
                    <div className="flex font-bold">
                      <Lock className="mr-2 size-5"></Lock>
                      <span>Travel Zone </span>
                      <span className="ml-51">...</span>
                    </div> */}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {workOrders?.WOID && caseInformation?.CaseID && (
            <TabsContent value="Quick_WO_Input">
              <QuickWOInput
                WOID={woid}
                workOrderData={workOrders}
                caseInformation={caseInformation}
                SLA={SLA}
                setSLA={setSLA}
              />
            </TabsContent>
          )}
        </Tabs>
      </Card>
    </>
  );
};
