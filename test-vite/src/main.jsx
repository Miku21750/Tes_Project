import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Routes, Route } from "react-router";
import App from './App';
import Landing from './landing';
import Lorem from './Lorem';
import Search_case from './search_case';
import { Case } from './Case';
import { Work } from './work';
import { MaterialOrder, MoDetail } from './material_order';
import 
{ Company_table,
  Assets_table,
  Contact_table,
  Case_table,
  Product_table,
  ProductType_table,
  WarrantyService_table,
  Mo_table,
  Wo_table,
  SubkTechnician_table,
  SymptomCodeTable,
  BookingsTable,
  BookingDetailsTable,
  Resource_table,
  RepairClassCodeTable,
  ServiceCatalogTable,
  OTCCodeTable,
  CrsTable,
  FailureTable
 } from './master_table';
import { Bookings } from './bookings';
import { User_table } from './master_table';
import { Part_table } from './master_table';
import { Labor } from './labor';
// import { ModalContextProvider } from './components/modal-context';
import { ResourceAccountTable } from './master_table';

import { GateKeepingRouting } from './components/GateKeepingRouting';
import { Buffer } from 'buffer';
window.Buffer = Buffer;
createRoot(document.getElementById('root')).render(
  <StrictMode> 
    <BrowserRouter>
      {/* <ModalContextProvider> */}
        <Routes>
          {/* <Route path='/' element={<App />}> */}
          <Route path='/' element={<GateKeepingRouting />}>
            <Route index element={<Landing />} />
            <Route path='/search_case' element={<Search_case />} />
            <Route path='/case/:caseId' element={<Case />} />
            <Route path='/work/:woid' element={<Work />}/>
            <Route path='/material-order/:moid' element={<MaterialOrder />}/>
            <Route path="/mo_detail/:lineItemID" element={<MoDetail />} />
            <Route path='/bookings' element={<Bookings />} />]
            <Route path='/bookings/:bookingid' element={<Bookings />} />]
            <Route path='/labor' element={<Labor />} />

            {/* <Route path='/master' element> */}
            <Route path='/master/Company_table' element={<Company_table />} />
            <Route path='/master/Assets_table' element={<Assets_table />} />
            <Route path='/master/Contact_table' element={<Contact_table />} />
            <Route path='/master/Case_table' element={<Case_table />} />
            <Route path='/master/Product_table' element={<Product_table/>}/>
            <Route path='/master/ProductType_table' element={<ProductType_table/>}/>
            {/* <Route path='/master/ServiceCatalogPartsTable' element={<ServiceCatalogPartsTable/>}/> */}
            {/* <Route path='/master/GlobalTradeCheckTable' element={<GlobalTradeCheckTable/>}/> */}
            <Route path='/master/WarrantyService_table' element={<WarrantyService_table/>}/>
            <Route path='/master/Mo_table' element={<Mo_table/>}/>
            <Route path='/master/Wo_table' element={<Wo_table/>}/>
            {/* <Route path='master/Resource' element={<ResourceTable/>}/> */}
            <Route path='master/ResourceAccount' element={<ResourceAccountTable/>}/>
            <Route path='master/SubkTechnician' element={<SubkTechnician_table/>}/>
            <Route path='master/symptom_codes' element={<SymptomCodeTable/>}/>
            <Route path='master/Bookings' element={<BookingsTable/>}/>
            <Route path='master/BookingDetails' element={<BookingDetailsTable/>}/>
            <Route path='/master/User_table' element={<User_table/>}/>
            <Route path='/master/Part_table' element={<Part_table/>}/>
            <Route path='/master/Resource_table' element={<Resource_table/>} />
            <Route path='/master/repairClassCode' element={<RepairClassCodeTable/>} />
            <Route path='/master/ServiceCatalog' element={<ServiceCatalogTable/>} />
            <Route path='/master/OTC_Code' element={<OTCCodeTable/>}/>
            <Route path='/master/CrsTable' element={<CrsTable/>}/>
            <Route path='/master/Failure' element={<FailureTable/>}/>
            {/* </Route> */}
          </Route>
            {/* </Route> */}
          <Route path="/lorem" element={<Lorem />}/>
        </Routes>
      {/* </ModalContextProvider> */}
  </BrowserRouter>
  </StrictMode>, 
)
