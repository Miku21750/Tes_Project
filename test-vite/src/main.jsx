import { StrictMode, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./style/index.css";
import { BrowserRouter, Routes, Route } from "react-router";
import { Buffer } from "buffer";
import { DraftProvider } from "./components/DraftContext";
import { Loader2 } from "lucide-react";
import { ViewCase } from "./pages/ViewCase";
import { AuthProvider } from "./context/auth-context";



const Landing = lazy(() => import('./pages/landing'));
const Lorem = lazy(() => import('./pages/Lorem'));
const Search_case = lazy(() => import('./pages/Search_case'));
const SearchCase_Dev = lazy(() => import('./pages/SearchCase_V2'));
const SearchCaseProto2 = lazy(() => import('./pages/SearchCase_V3'));
const Case = lazy(() => import('./pages/Case').then(m => ({ default: m.Case })));
const Work = lazy(() => import('./pages/work').then(m => ({ default: m.Work })));
const MaterialOrder = lazy(() => import('./pages/material_order').then(m => ({ default: m.MaterialOrder })));
const MoDetail = lazy(() => import('./pages/material_order').then(m => ({ default: m.MoDetail })));
const FlowCase = lazy(() => import('./pages/FlowCase').then(m => ({ default: m.FlowCase })));
const ErfCase = lazy(() => import('./pages/ErfCase').then(m => ({default: m.ErfCase})));

const masterTables = {
  Company_table: lazy(() => import('./pages/master_table').then(m => ({ default: m.Company_table }))),
  Assets_table: lazy(() => import('./pages/master_table').then(m => ({ default: m.Assets_table }))),
  Contact_table: lazy(() => import('./pages/master_table').then(m => ({ default: m.Contact_table }))),
  Case_table: lazy(() => import('./pages/master_table').then(m => ({ default: m.Case_table }))),
  Product_table: lazy(() => import('./pages/master_table').then(m => ({ default: m.Product_table }))),
  ProductType_table: lazy(() => import('./pages/master_table').then(m => ({ default: m.ProductType_table }))),
  WarrantyService_table: lazy(() => import('./pages/master_table').then(m => ({ default: m.WarrantyService_table }))),
  Mo_table: lazy(() => import('./pages/master_table').then(m => ({ default: m.Mo_table }))),
  Wo_table: lazy(() => import('./pages/master_table').then(m => ({ default: m.Wo_table }))),
  ResourceAccountTable: lazy(() => import('./pages/master_table').then(m => ({ default: m.ResourceAccountTable }))),
  SubkTechnician_table: lazy(() => import('./pages/master_table').then(m => ({ default: m.SubkTechnician_table }))),
  SymptomCodeTable: lazy(() => import('./pages/master_table').then(m => ({ default: m.SymptomCodeTable }))),
  BookingsTable: lazy(() => import('./pages/master_table').then(m => ({ default: m.BookingsTable }))),
  BookingDetailsTable: lazy(() => import('./pages/master_table').then(m => ({ default: m.BookingDetailsTable }))),
  User_table: lazy(() => import('./pages/master_table').then(m => ({ default: m.User_table }))),
  Part_table: lazy(() => import('./pages/master_table').then(m => ({ default: m.Part_table }))),
  Resource_table: lazy(() => import('./pages/master_table').then(m => ({ default: m.Resource_table }))),
  RepairClassCodeTable: lazy(() => import('./pages/master_table').then(m => ({ default: m.RepairClassCodeTable }))),
  ServiceCatalogTable: lazy(() => import('./pages/master_table').then(m => ({ default: m.ServiceCatalogTable }))),
  OTCCodeTable: lazy(() => import('./pages/master_table').then(m => ({ default: m.OTCCodeTable }))),
  CrsTable: lazy(() => import('./pages/master_table').then(m => ({ default: m.CrsTable }))),
  FailureTable: lazy(() => import('./pages/master_table').then(m => ({ default: m.FailureTable }))),
  NmuTable: lazy(() => import('./pages/master_table').then(m => ({ default: m.NmuTable }))),
  NmuItemTable: lazy(() => import('./pages/master_table').then(m => ({ default: m.NmuItemTable }))),
  BookingStatusTable: lazy(() => import('./pages/master_table').then(m => ({ default: m.BookingStatusTable }))),
};

const {
  Company_table,
  Assets_table,
  Contact_table,
  Case_table,
  Product_table,
  ProductType_table,
  WarrantyService_table,
  Mo_table,
  Wo_table,
  ResourceAccountTable,
  SubkTechnician_table,
  SymptomCodeTable,
  BookingsTable,
  BookingDetailsTable,
  User_table,
  Part_table,
  Resource_table,
  RepairClassCodeTable,
  ServiceCatalogTable,
  OTCCodeTable,
  CrsTable,
  NmuTable,
  NmuItemTable,
  FailureTable,
  BookingStatusTable,
} = masterTables;



const Bookings = lazy(() => import('./bookings').then(m => ({ default: m.Bookings })));
const Labor = lazy(() => import('./labor'));
const SignatureWrite = lazy(() => import('@/components/SignaturePad'));
const Auditwindows = lazy(() => import('./components/audit-windows'));
const Home = lazy(() => import('./Home').then(m => ({ default: m.Home })));
const GateKeepingRouting = lazy(() =>
  import('./components/GateKeepingRouting').then(m => ({ default: m.GateKeepingRouting }))
);const MasterGateKeeping = lazy(() => import('./components/MasterGateKeeping').then(m => ({ default: m.MasterGateKeeping })));
const UserProfile = lazy(() => import('./components/user-profile').then(m => ({ default: m.UserProfile })));

const Forbidden = lazy(() => import('./pages/forbidden'));
const FrontDesk_Page = lazy(() => import('./layout/FrontDesk_Page'));
const NotFound = () => <div style={{ padding: 40, textAlign: 'center' }}><h2>404 - Page Not Found</h2></div>;
const Loading = () => <div style={{ padding: 40, textAlign: 'center', fontSize: 40 }}><h2>Loading...</h2><Loader2 className="h-20 w-50 animate-spin inline-block mr-2"/></div>;
window.Buffer = Buffer;
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
    <BrowserRouter>
      <DraftProvider>
        <Suspense fallback={<Loading/>}>
        <Routes>
          {/* <Route path='/' element={<App />}> */}
          <Route path="/app" element={<GateKeepingRouting />}>
            <Route index element={<Landing />} />
            <Route path="/app/profiles" element={<UserProfile />} />
            <Route path="/app/frontdesk" element={<FrontDesk_Page />} />
            <Route path="/app/forbidden" element={<Forbidden />} />
            <Route path="/app/search_case" element={<Search_case />} />
            <Route path="/app/search_case_dev" element={<SearchCase_Dev />} />
            <Route path="/app/searchcaseproto2" element={<SearchCaseProto2 />} />
            <Route path="/app/case/:caseId" element={<Case />} />
            <Route path="/app/work/:woid" element={<Work />} />
            <Route path="/app/material-order/:moid" element={<MaterialOrder />}/>
            <Route path="/app/mo_detail/:lineItemID" element={<MoDetail />} />
            <Route path="/app/bookings" element={<Bookings />} />
            <Route path="/app/bookings/:bookingid" element={<Bookings />} />
            <Route path="/app/labor" element={<Labor />} />
            <Route path="/app/flowcase" element={<FlowCase />} />
            <Route path="/app/ErfCase" element={<ErfCase />} />
            <Route path="/app/viewcase" element={<ViewCase />} />


            {/* <Route path='/app/master' element> */}

            <Route
              path="/app/master/Company_table"
              element={
                <MasterGateKeeping allow={["admin", "fd"]}>
                  <Company_table />
                </MasterGateKeeping>
              }
            />
            <Route
              path="/app/master/Assets_table"
              element={
                <MasterGateKeeping allow={["admin", "fd"]}>
                  <Assets_table />
                </MasterGateKeeping>
              }
            />
            <Route
              path="/app/master/Contact_table"
              element={
                <MasterGateKeeping allow={["admin", "fd"]}>
                  <Contact_table />
                </MasterGateKeeping>
              }
            />
            <Route
              path="/app/master/Case_table"
              element={
                <MasterGateKeeping allow={["admin"]}>
                  <Case_table />
                </MasterGateKeeping>
              }
            />
            <Route
              path="/app/master/Product_table"
              element={
                <MasterGateKeeping allow={["admin"]}>
                  <Product_table />
                </MasterGateKeeping>
              }
            />
            <Route
              path="/app/master/ProductType_table"
              element={
                <MasterGateKeeping allow={["admin"]}>
                  <ProductType_table />
                </MasterGateKeeping>
              }
            />
            {/* <Route path='/app/master/ServiceCatalogPartsTable' element={ <MasterGateKeeping allow={["admin"]} > <ServiceCatalogPartsTable/> </MasterGateKeeping> }/> */}
            {/* <Route path='/app/master/GlobalTradeCheckTable' element={ <MasterGateKeeping allow={["admin"]} > <GlobalTradeCheckTable/> </MasterGateKeeping> }/> */}
            <Route
              path="/app/master/WarrantyService_table"
              element={
                <MasterGateKeeping allow={["admin"]}>
                  <WarrantyService_table />
                </MasterGateKeeping>
              }
            />
            <Route
              path="/app/master/Mo_table"
              element={
                <MasterGateKeeping allow={["admin"]}>
                  <Mo_table />
                </MasterGateKeeping>
              }
            />
            <Route
              path="/app/master/Wo_table"
              element={
                <MasterGateKeeping allow={["admin"]}>
                  <Wo_table />
                </MasterGateKeeping>
              }
            />
            {/* <Route path='master/Resource' element={ <MasterGateKeeping allow={["admin"]} > <ResourceTable/> </MasterGateKeeping> }/> */}
            <Route
              path="/app/master/ResourceAccount"
              element={
                <MasterGateKeeping allow={["admin"]}>
                  <ResourceAccountTable />
                </MasterGateKeeping>
              }
            />
            <Route
              path="/app/master/SubkTechnician"
              element={
                <MasterGateKeeping allow={["admin"]}>
                  <SubkTechnician_table />
                </MasterGateKeeping>
              }
            />
            <Route
              path="/app/master/symptom_codes"
              element={
                <MasterGateKeeping allow={["admin"]}>
                  <SymptomCodeTable />
                </MasterGateKeeping>
              }
            />
            <Route
              path="/app/master/Bookings"
              element={
                <MasterGateKeeping allow={["admin"]}>
                  <BookingsTable />
                </MasterGateKeeping>
              }
            />
            <Route
              path="/app/master/BookingDetails"
              element={
                <MasterGateKeeping allow={["admin"]}>
                  <BookingDetailsTable />
                </MasterGateKeeping>
              }
            />
            <Route
              path="/app/master/BookingStatus"
              element={
                <MasterGateKeeping allow={["admin"]}>
                  <BookingStatusTable />
                </MasterGateKeeping>
              }
            />
            <Route
              path="/app/master/User_table"
              element={
                <MasterGateKeeping allow={["admin"]}>
                  <User_table />
                </MasterGateKeeping>
              }
            />
            <Route
              path="/app/master/Part_table"
              element={
                <MasterGateKeeping allow={["admin"]}>
                  <Part_table />
                </MasterGateKeeping>
              }
            />
            <Route
              path="/app/master/Resource_table"
              element={
                <MasterGateKeeping allow={["admin"]}>
                  <Resource_table />
                </MasterGateKeeping>
              }
            />
            <Route
              path="/app/master/repairClassCode"
              element={
                <MasterGateKeeping allow={["admin"]}>
                  <RepairClassCodeTable />
                </MasterGateKeeping>
              }
            />
            <Route
              path="/app/master/ServiceCatalog"
              element={
                <MasterGateKeeping allow={["admin"]}>
                  <ServiceCatalogTable />
                </MasterGateKeeping>
              }
            />
            <Route
              path="/app/master/OTC_Code"
              element={
                <MasterGateKeeping allow={["admin"]}>
                  <OTCCodeTable />
                </MasterGateKeeping>
              }
            />
            <Route
              path="/app/master/CrsTable"
              element={
                <MasterGateKeeping allow={["admin"]}>
                  <CrsTable />
                </MasterGateKeeping>
              }
            />
            <Route
              path="/app/master/NmuTable"
              element={
                <MasterGateKeeping allow={["admin"]}>
                  <NmuTable />
                </MasterGateKeeping>
              }
            />
            <Route
              path="/app/master/NmuItemTable"
              element={
                <MasterGateKeeping allow={["admin"]}>
                  <NmuItemTable />
                </MasterGateKeeping>
              }
            />
            <Route
              path="/app/master/Failure"
              element={
                <MasterGateKeeping allow={["admin"]}>
                  <FailureTable />
                </MasterGateKeeping>
              }
            />
            {/* </Route> */}
            <Route path="*" element={<NotFound />} />
          </Route>
          {/* </Route> */}
            <Route path="/" element={<Home />} />
            <Route path="/auditwindows" element={<Auditwindows />} />
            <Route path="/lorem" element={<Lorem />} />
            <Route path="/signature-pad" element={<SignatureWrite />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
        </Suspense>
      </DraftProvider>
    </BrowserRouter>
    </AuthProvider>
  </StrictMode>
);
