import React, { useState, useEffect } from "react";
import ApiCustomer from "@/api";
import { ContactEdit, ContactDelete } from "@/components/sc-modal";
import { CompanyEdit, CompanyDelete } from "@/components/sc-modal";
import { ProductAdd, ProductEdit, ProductDelete } from "@/components/sc-modal";
import { BtnModalAsset, AssetEdit, AssetDelete } from "@/components/sc-modal";
import {
  ProductTypeAdd,
  ProductTypeEdit,
  ProductTypeDelete,
} from "@/components/sc-modal";
import {
  WarrantyServiceAdd,
  WarrantyServiceEdit,
  WarrantyServiceDelete,
} from "@/components/sc-modal";
import { MaterialOrderEdit, MaterialOrderDelete } from "@/components/sc-modal";
import { WorkOrderDelete, WorkOrderEdit } from "@/components/sc-modal";
import { UserAdd, UserEdit, UserDelete } from "@/components/sc-modal";
import { PartAdd,PartEdit, PartDelete } from "@/components/sc-modal";
import { ResourceAdd, ResourceEdit, ResourceDelete } from "@/components/sc-modal";
import { ResourceAccountAdd, ResourceAccountEdit, ResourceAccountDelete } from "@/components/sc-modal";
import { SubkTechnicianAdd, SubkTechnicianEdit, SubkTechnicianDelete } from "@/components/sc-modal";
import { SymptomCodeAdd, SymptomCodeEdit, SymptomCodeDelete } from "@/components/sc-modal";
import { BookingsAdd, BookingsEdit, BookingsDelete } from "@/components/sc-modal";
import { BookingDetailsAdd, BookingDetailsEdit, BookingDetailsDelete } from "@/components/sc-modal";
import { RepairClassCodeAdd, RepairClassCodeEdit, RepairClassCodeDelete } from "@/components/sc-modal";
import { ServiceCatalogAdd, ServiceCatalogEdit, ServiceCatalogDelete } from "@/components/sc-modal";
import { OTCAdd, OTCEdit, OTCDelete} from "@/components/sc-modal";
import { CrsAdd, CrsEdit, CrsDelete } from "@/components/sc-modal";
import { FailureAdd, 
  FailureEdit, 
  FailureDelete } from "@/components/sc-modal";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "./components/ui/button";
import { cn } from "./lib/utils";

import { ExportExcel } from "./components/Export-Excel";

import { Select, SelectItem, SelectTrigger, SelectContent, SelectGroup, SelectValue } from "./components/ui/select";
export const Contact_table = () => {
  const [contacts, setContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const itemsPerPage = 10;

  // Fungsi untuk mengambil data dari API
  const fetchContacts = async () => {
    // Menampilkan indikator loading menggunakan SweetAlert2
    Swal.fire({
      title: "Memuat Data Kontak...",
      text: "Mohon tunggu sebentar...",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading(); // Menampilkan indikator loading
      },
    });

    setLoading(true);
    setError(null);

    try {
      const response = await ApiCustomer.get(
        `/api/contact-information?page=${currentPage}&limit=${itemsPerPage}&search=${searchTerm}`
      );
      setContacts(response.data.data); // Menyimpan data kontak ke state
      setTotalPages(response.data.totalPages);
    } catch (err) {
      console.error("Error fetching contact data:", err);
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
      Swal.close();
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [currentPage, searchTerm]);

  return (
    <div className="p-4">
      <h2 className="mb-4 text-xl font-bold">Contact Table</h2>

      {/* Input Pencarian */}
      <input
        type="text"
        placeholder="Search contacts..."
        className="w-1/3 p-2 mb-4 border border-gray-300 rounded"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setCurrentPage(1); // Reset ke halaman pertama saat mencari
        }}
      />

      {/* Tampilkan error jika terjadi kesalahan */}
      {error && <p className="text-red-500">{error}</p>}

      <div className="overflow-x-scroll ">
        <table className="border border-gray-300 shadow-lg">
          <thead>
            <tr className="text-sm text-gray-700 uppercase bg-gray-200">
              <th className="p-2 border">No</th>
              <th className="p-2 border">Contact ID</th>
              <th className="p-2 border">Company</th>
              <th className="p-2 border">Salutation</th>
              <th className="p-2 border">First Name</th>
              <th className="p-2 border">Last Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Preferred Language</th>
              <th className="p-2 border">Phone</th>
              <th className="p-2 border">Mobile</th>
              <th className="p-2 border">Work Phone</th>
              <th className="p-2 border">Work Extension</th>
              <th className="p-2 border">Other Phone</th>
              <th className="p-2 border">Other Extension</th>
              <th className="p-2 border">Fax</th>
              <th className="p-2 border">Address Line 1</th>
              <th className="p-2 border">Address Line 2</th>
              <th className="p-2 border">City</th>
              <th className="p-2 border">State/Province</th>
              <th className="p-2 border">Country</th>
              <th className="p-2 border">Zip/Postal Code</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {contacts.length > 0 ? (
              contacts.map((contact, index) => (
                <tr
                  key={contact.ContactID}
                  className="text-center hover:bg-gray-100"
                >
                  <td className="p-2 text-center border">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td className="p-2 border">{contact.ContactID}</td>
                  <td className="p-2 border">{contact.Company}</td>
                  <td className="p-2 border">{contact.Salutation}</td>
                  <td className="p-2 border">{contact.FirstName}</td>
                  <td className="p-2 border">{contact.LastName}</td>
                  <td className="p-2 border">{contact.Email}</td>
                  <td className="p-2 border">{contact.PreferredLanguage}</td>
                  <td className="p-2 border">{contact.Phone}</td>
                  <td className="p-2 border">{contact.Mobile}</td>
                  <td className="p-2 border">{contact.WorkPhone}</td>
                  <td className="p-2 border">{contact.WorkExtension}</td>
                  <td className="p-2 border">{contact.OtherPhone}</td>
                  <td className="p-2 border">{contact.OtherExtension}</td>
                  <td className="p-2 border">{contact.Fax}</td>
                  <td className="p-2 border">{contact.AddressLine1}</td>
                  <td className="p-2 border">{contact.AddressLine2}</td>
                  <td className="p-2 border">{contact.City}</td>
                  <td className="p-2 border">{contact.StateProvince}</td>
                  <td className="p-2 border">{contact.Country}</td>
                  <td className="p-2 border">{contact.ZipPostalCode}</td>
                  <td className="flex p-2 space-x-2 border">
                    <ContactEdit
                      contactID={contact.ContactID}
                      onUpdate={fetchContacts}
                    />
                    <ContactDelete contactID={contact.ContactID} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="p-4 text-center">
                  No data found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center mt-4 space-x-2">
          <button
            className="p-2 bg-gray-300 rounded disabled:opacity-50"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="p-2 bg-gray-300 rounded disabled:opacity-50"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export const Company_table = () => {
  const [companies, setCompanies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const itemsPerPage = 10;

  //set modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fungsi untuk mengambil data dari API
  const fetchCompanies = async () => {
    Swal.fire({
      title: "Memuat Data Company...",
      text: "Mohon tunggu sebentar",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    setError(null);

    try {
      const response = await ApiCustomer.get(
        `/api/site_account?page=${currentPage}&limit=${itemsPerPage}&search=${searchTerm}`
      );
      setCompanies(response.data.data);
      setTotalPages(response.data.totalPages);

      Swal.close();
    } catch (err) {
      console.error("Error fetching company data:", err);
      setError("Failed to fetch data");

      Swal.close(); // Tetap tutup loading walaupun error
      Swal.fire({
        title: "Error!",
        text: "Gagal mengambil data perusahaan.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, [currentPage, searchTerm]);

  return (
    <div className="p-4">
      <h2 className="mb-4 text-xl font-bold">Company Table</h2>

      {/* Input Pencarian */}
      <input
        type="text"
        placeholder="Search companies..."
        className="w-1/3 p-2 mb-4 border border-gray-300 rounded"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setCurrentPage(1); // Reset ke halaman pertama saat mencari
        }}
      />

      {/* Tampilkan error jika terjadi kesalahan */}
      {error && <p className="text-red-500">{error}</p>}

      {/* Tabel Data */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">No</th>
              <th className="p-2 border">Company</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Primary Phone</th>
              <th className="p-2 border">Whatsapp Number</th>
              <th className="p-2 border">City</th>
              <th className="p-2 border">Country</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {companies.length > 0 ? (
              companies.map((company, index) => (
                <tr key={company.SiteAccountID} className="hover:bg-gray-100">
                  <td className="p-2 text-center border">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td className="p-2 border">{company.Company}</td>
                  <td className="p-2 border">{company.Email}</td>
                  <td className="p-2 border">{company.PrimaryPhone}</td>
                  <td className="p-2 border">{company.WhatsappNo}</td>
                  <td className="p-2 border">{company.City}</td>
                  <td className="p-2 border">{company.Country}</td>
                  <td className="flex p-2 space-x-2 border">
                    <CompanyEdit
                      siteAccountId={company.SiteAccountID}
                      onUpdate={fetchCompanies}
                    />
                    <CompanyDelete
                      siteAccountId={company.SiteAccountID}
                      isModalOpen={isModalOpen}
                      setIsModalOpen={setIsModalOpen}
                      onUpdate={fetchCompanies}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="p-4 text-center">
                  No data found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center mt-4 space-x-2">
          <button
            className="p-2 bg-gray-300 rounded disabled:opacity-50"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="p-2 bg-gray-300 rounded disabled:opacity-50"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export const Case_table = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Jumlah data per halaman
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [caseData, setCaseData] = useState([]);
  const [openClose, setOpenClose] = useState('Open')
  const state = ['Open','Close','InActive']
  console.log("casestate",openClose);
  const fetchCaseDataTable = async () => {
    const baseurl = `/api/case-information`;
    const url =
      openClose === 'All'
      ? baseurl
      : `/api/case-information?CaseStatus=${openClose}`;
    Swal.fire({
      title: "Memuat Data Case....",
      text: "Mohon Tunggu Sebentar",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    setError(null);
    

    try {
      const response = await ApiCustomer.get(url);

      if (response.data.success) {
        setCaseData(response.data.data);
      } else {
        setError("Failed to fetch case data");
      }

      Swal.close(); // <-- Tambahkan Swal.close() setelah berhasil
    } catch (err) {
      console.error("Error fetching case data:", err);
      setError("Error fetching data");

      Swal.close(); // Tetap tutup loading jika error

      Swal.fire({
        title: "Error!",
        text: "Gagal mengambil data case.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  // 🔹 Load data when component mounts
  useEffect(() => {
    fetchCaseDataTable();
  }, [openClose]);

  // Filter data berdasarkan pencarian
  const filteredCaseTable = caseData.filter((item) =>
    Object.values(item).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Hitung total halaman
  const totalPages = Math.ceil(filteredCaseTable.length / itemsPerPage);

  // Ambil data sesuai halaman saat ini
  const currentData = filteredCaseTable.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  //navigate
  const navigate = useNavigate();



  return (
    <div className="flex flex-col gap-2 p-4">
      {/* <button
        onClick={handleDownload}
        className="px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700"
      >
        Download Excel
      </button> */}
      <ExportExcel caseData={caseData}/>
      <h2 className="mb-4 text-xl font-bold">ID Daily Aging Cases Javag FY</h2>
      <input
        type="text"
        placeholder="Search..."
        className="w-1/3 p-2 mb-4 border rounded"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="flex items-center gap-3">
        <Label htmlFor='status' className={''}>Toggle Status Of Case :</Label>
        <Select  defaultValue='Open' value={openClose} onValueChange={setOpenClose}>
          <SelectTrigger id='status'>
            <SelectValue>{openClose}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value='Open'>Open Case Status</SelectItem>
              <SelectItem value='Close'>Close Case Status</SelectItem>
              <SelectItem value='InActive'>InActive Case Status</SelectItem>
              <SelectItem value='All'>ALL Case Status</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      {/* 🔹 Loading & Error Messages */}
      {loading && <p>Loading cases...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 shadow-lg">
          <thead>
            <tr className="text-sm text-gray-700 uppercase bg-gray-200">
              <th className="p-2 border">Case ID</th>
              <th className="p-2 border">Created On</th>
              <th className="p-2 border">Case Subject</th>
              <th className="p-2 border">Customer Account</th>
              <th className="p-2 border">Primary</th>
              <th className="p-2 border">HW</th>
              <th className="p-2 border">Serial Number</th>
              <th className="p-2 border">Product Number</th>
              <th className="p-2 border">Product Name</th>
              <th className="p-2 border">Created Name</th>
              <th className="p-2 border">Owner</th>
              <th className="p-2 border">WorkGroup</th>
              <th className="p-2 border">Case Status</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((caseItem) => (
              <tr
                key={caseItem.CaseID}
                className="text-center hover:bg-gray-100"
              >
                <td
                  className="p-2 text-blue-500 border cursor-pointer hover:underline"
                  onClick={() => navigate(`/case/${caseItem.CaseID}`)}
                >
                  {caseItem.CaseID}
                </td>
                <td className="p-2 border">{caseItem.CreatedOn}</td>
                <td className="p-2 border">{caseItem.CaseSubject}</td>
                <td className="p-2 border">{caseItem.CustomerAccount}</td>
                <td className="p-2 border">{caseItem.Primary}</td>
                <td className="p-2 border">{caseItem.HW}</td>
                <td className="p-2 border">{caseItem.SerialNumber}</td>
                <td className="p-2 border">{caseItem.ProductNumber}</td>
                <td className="p-2 border">{caseItem.ProductName}</td>
                <td className="p-2 border">{caseItem.CreatedName}</td>
                <td className="p-2 border">{caseItem.Owner}</td>
                <td className="p-2 border">{caseItem.WorkGroup}</td>
                <td className={cn("bg-emerald-300",caseItem.CaseStatus === "Close" ? "bg-red-300" : caseItem.CaseStatus === "InActive" ? "bg-sky-300" : "" )}>{caseItem.CaseStatus}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredCaseTable.length === 0 && (
          <p className="mt-4 text-center text-gray-500">No cases found.</p>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center mt-4 space-x-2">
        <button
          className="p-2 bg-gray-300 rounded disabled:opacity-50"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="p-2 bg-gray-300 rounded disabled:opacity-50"
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export const Assets_table = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const itemsPerPage = 10;
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    fetchAssets();
  }, [currentPage, searchTerm]);

  const fetchAssets = async () => {
    setLoading(true);
    setError(null);

    Swal.fire({
      title: "Memuat Data Asset...",
      text: "Mohon tunggu sebentar",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const response = await ApiCustomer.get(
        `/api/asset-information?page=${currentPage}&limit=${itemsPerPage}&search=${searchTerm}`
      );
      setAssets(response.data.data);
      setTotalPages(response.data.totalPages);

      Swal.close(); // Tutup loading kalau berhasil
    } catch (err) {
      console.error("Error fetching asset data:", err);
      setError("Failed to fetch data");

      Swal.close(); // Tetap tutup loading walau error

      Swal.fire({
        title: "Error!",
        text: "Gagal mengambil data asset.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="mb-4 text-xl font-bold">Asset Information Table</h2>
      <div className="space-x-2">
        {/* <BtnModalAsset /> */}
        {/* Input Pencarian */}
        <input
          type="text"
          placeholder="Search asset... "
          className="w-1/3 p-2 mb-4 border border-gray-300 rounded"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // Reset ke halaman pertama saat mencari
          }}
        />
      </div>

      {/* Tampilkan error jika terjadi kesalahan */}
      {error && <p className="text-red-500">{error}</p>}

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">No</th>
              <th className="p-2 border">Asset ID</th>
              <th className="p-2 border">Serial Number</th>
              <th className="p-2 border">Product Name</th>
              <th className="p-2 border">Product Number</th>
              <th className="p-2 border">Product Line</th>
              <th className="p-2 border">Site Account ID</th>
              <th className="p-2 border">Contact ID</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {assets.length > 0 ? (
              assets.map((asset, index) => (
                <tr key={asset.AssetID} className="hover:bg-gray-100">
                  <td className="p-2 text-center border">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td className="p-2 border">{asset.AssetID}</td>
                  <td className="p-2 border">{asset.SerialNumber}</td>
                  <td className="p-2 border">
                    {asset.product_information?.ProductName}
                  </td>
                  <td className="p-2 border">{asset.ProductNumber}</td>
                  <td className="p-2 border">
                    {asset.product_information?.ProductLine}
                  </td>
                  <td className="p-2 border">{asset.SiteAccountID}</td>
                  <td className="p-2 border">{asset.ContactID}</td>
                  <td className="flex p-2 space-x-2 border">
                    <AssetEdit assetId={asset.AssetID} onUpdate={fetchAssets} />
                    <AssetDelete assetId={asset.AssetID} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="p-4 text-center">
                  No data found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center mt-4 space-x-2">
          <button
            className="p-2 bg-gray-300 rounded disabled:opacity-50"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="p-2 bg-gray-300 rounded disabled:opacity-50"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export const Product_table = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const itemsPerPage = 10;

  //set modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fungsi untuk mengambil data dari API
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);

    Swal.fire({
      title: "Memuat Data Produk...",
      text: "Mohon tunggu sebentar",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const response = await ApiCustomer.get(
        `/api/product-information?page=${currentPage}&limit=${itemsPerPage}&search=${searchTerm}`
      );
      setProducts(response.data.data);
      setTotalPages(response.data.totalPages);

      Swal.close(); // Tutup loading Swal setelah sukses
    } catch (err) {
      console.error("Error fetching product data:", err);
      setError("Failed to fetch data");

      Swal.close(); // Tutup Swal kalau error juga

      Swal.fire({
        title: "Error!",
        text: "Gagal mengambil data produk.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [currentPage, searchTerm]);

  return (
    <div className="p-4">
      <h2 className="mb-4 text-xl font-bold">Product Table</h2>

      {/* Input Pencarian */}
      <input
        type="text"
        placeholder="Search product..."
        className="w-1/3 p-2 mb-4 border border-gray-300 rounded"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setCurrentPage(1); // Reset ke halaman pertama saat mencari
        }}
      />

      {/* Tampilkan error jika terjadi kesalahan */}
      {error && <p className="text-red-500">{error}</p>}

      <ProductAdd></ProductAdd>
      {/* Tabel Data */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">No</th>
              <th className="p-2 border">Product Number</th>
              <th className="p-2 border">Product Line</th>
              <th className="p-2 border">Product Name</th>
              <th className="p-2 border">Product Type</th>
              <th className="p-2 border">Product Group</th>
              <th className="p-2 border">Product Tower</th>
              <th className="p-2 border">Vendor</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((product, index) => (
                <tr key={product.ProductNumber} className="hover:bg-gray-100">
                  <td className="p-2 text-center border">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td className="p-2 border">{product.ProductNumber}</td>
                  <td className="p-2 border">{product.ProductLine}</td>
                  <td className="p-2 border">{product.ProductName}</td>
                  <td className="p-2 border">
                    {product.product_type?.ProductType}
                  </td>
                  <td className="p-2 border">
                    {product.product_type?.ProductGroup}
                  </td>
                  <td className="p-2 border">
                    {product.product_type?.ProductTower}
                  </td>
                  <td className="p-2 border">-</td>
                  <td className="flex p-2 space-x-2 border">
                    <ProductEdit
                      ProductNumber={product.ProductNumber}
                      onUpdate={fetchProducts}
                    />
                    <ProductDelete
                      ProductNumber={product.ProductNumber}
                      isModalOpen={isModalOpen}
                      setIsModalOpen={setIsModalOpen}
                      onUpdate={fetchProducts}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="p-4 text-center">
                  No data found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center mt-4 space-x-2">
          <button
            className="p-2 bg-gray-300 rounded disabled:opacity-50"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="p-2 bg-gray-300 rounded disabled:opacity-50"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export const ProductType_table = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Jumlah data per halaman
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [ProductTypeData, setProductTypeData] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchProductTypeDataTable = async () => {
    setLoading(true);
    setError(null);

    Swal.fire({
      title: "Memuat Data Tipe Produk...",
      text: "Mohon tunggu sebentar",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const response = await ApiCustomer.get("/api/product-type");
      if (response.data.success) {
        setProductTypeData(response.data.data);
        Swal.close(); // Tutup Swal saat sukses
      } else {
        setError("Failed to fetch ProductType data");
        Swal.close();
        Swal.fire({
          title: "Error!",
          text: "Gagal mengambil data tipe produk.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } catch (err) {
      console.error("Error fetching ProductType data:", err);
      setError("Error fetching data");

      Swal.close(); // Tutup Swal saat error
      Swal.fire({
        title: "Error!",
        text: "Gagal mengambil data tipe produk.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Load data when component mounts
  useEffect(() => {
    fetchProductTypeDataTable();
  }, []);

  // Filter data berdasarkan pencarian
  const filteredProductTypeTable = ProductTypeData.filter((item) =>
    Object.values(item).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Hitung total halaman
  const totalPages = Math.ceil(filteredProductTypeTable.length / itemsPerPage);

  // Ambil data sesuai halaman saat ini
  const currentData = filteredProductTypeTable.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  //navigate
  const navigate = useNavigate();

  return (
    <div className="p-4">
      <h2 className="mb-4 text-xl font-bold">ProductType Table</h2>
      <input
        type="text"
        placeholder="Search..."
        className="w-1/3 p-2 mb-4 border rounded"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <ProductTypeAdd> </ProductTypeAdd>

      {error && <p className="text-red-500">{error}</p>}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 shadow-lg">
          <thead>
            <tr className="text-sm text-gray-700 uppercase bg-gray-200">
              <th className="p-2 border">ProductType ID</th>
              <th className="p-2 border">Product Tower</th>
              <th className="p-2 border">Product Group</th>
              <th className="p-2 border">Product Type</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((ProductTypeItem) => (
              <tr
                key={ProductTypeItem.ProductTypeID}
                className="text-center hover:bg-gray-100"
              >
                <td
                  className="p-2 text-blue-500 border cursor-pointer hover:underline"
                  onClick={() =>
                    navigate(`/case/${ProductTypeItem.ProductTypeID}`)
                  }
                >
                  {ProductTypeItem.ProductTypeID}
                </td>
                <td className="p-2 border">{ProductTypeItem.ProductTower}</td>
                <td className="p-2 border">{ProductTypeItem.ProductGroup}</td>
                <td className="p-2 border">{ProductTypeItem.ProductType}</td>
                <td className="flex p-2 space-x-2 border">
                  <ProductTypeEdit
                    ProductTypeID={ProductTypeItem.ProductTypeID}
                    onUpdate={fetchProductTypeDataTable}
                  />
                  <ProductTypeDelete
                    ProductTypeID={ProductTypeItem.ProductTypeID}
                    isModalOpen={isModalOpen}
                    setIsModalOpen={setIsModalOpen}
                    onUpdate={fetchProductTypeDataTable}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredProductTypeTable.length === 0 && (
          <p className="mt-4 text-center text-gray-500">No data found.</p>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center mt-4 space-x-2">
        <button
          className="p-2 bg-gray-300 rounded disabled:opacity-50"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="p-2 bg-gray-300 rounded disabled:opacity-50"
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export const WarrantyService_table = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Jumlah data per halaman
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [WarrantyServiceData, setWarrantyServiceData] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchWarrantyServiceDataTable = async () => {
    setLoading(true);
    setError(null);

    Swal.fire({
      title: "Memuat Data Warranty Service...",
      text: "Mohon tunggu sebentar",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const response = await ApiCustomer.get("/api/warranty-services");
      if (response.data.success) {
        setWarrantyServiceData(response.data.data);
        Swal.close(); // Tutup Swal kalau sukses
      } else {
        setError("Failed to fetch Warranty Service data");
        Swal.close();
        Swal.fire({
          title: "Error!",
          text: "Gagal mengambil data Warranty Service.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } catch (err) {
      console.error("Error fetching Warranty Service data:", err);
      setError("Error fetching data");

      Swal.close(); // Tutup Swal kalau error
      Swal.fire({
        title: "Error!",
        text: "Gagal mengambil data Warranty Service.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Load data when component mounts
  useEffect(() => {
    fetchWarrantyServiceDataTable();
  }, []);

  // Filter data berdasarkan pencarian
  const filteredWarrantyServiceTable = WarrantyServiceData.filter((item) =>
    Object.values(item).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Hitung total halaman
  const totalPages = Math.ceil(
    filteredWarrantyServiceTable.length / itemsPerPage
  );

  // Ambil data sesuai halaman saat ini
  const currentData = filteredWarrantyServiceTable.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  //navigate
  const navigate = useNavigate();

  return (
    <div className="p-4">
      <h2 className="mb-4 text-xl font-bold">Warranty Service Table</h2>
      <input
        type="text"
        placeholder="Search..."
        className="w-1/3 p-2 mb-4 border rounded"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <WarrantyServiceAdd></WarrantyServiceAdd>

      {/* 🔹 Loading & Error Messages */}
      {error && <p className="text-red-500">{error}</p>}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 shadow-lg">
          <thead>
            <tr className="text-sm text-gray-700 uppercase bg-gray-200">
              <th className="p-2 border">Service offerID</th>
              <th className="p-2 border">Service description</th>
              <th className="p-2 border">Csutomer Tat</th>
              <th className="p-2 border">Price</th>
              <th className="p-2 border">Shipping Fee</th>
              <th className="p-2 border">Quantity</th>
              <th className="p-2 border">Tax</th>
              <th className="p-2 border">Total</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((WarrantyServiceItem) => (
              <tr
                key={WarrantyServiceItem.Service_offerID}
                className="text-center hover:bg-gray-100"
              >
                <td
                  className="p-2 text-blue-500 border cursor-pointer hover:underline"
                  onClick={() =>
                    navigate(`/case/${WarrantyServiceItem.Service_offerID}`)
                  }
                >
                  {WarrantyServiceItem.Service_offerID}
                </td>
                <td className="p-2 border">
                  {WarrantyServiceItem.Service_description}
                </td>
                <td className="p-2 border">{WarrantyServiceItem.CTat_RTime}</td>
                <td className="p-2 border">{WarrantyServiceItem.Price}</td>
                <td className="p-2 border">
                  {WarrantyServiceItem.Shipping_Fee}
                </td>
                <td className="p-2 border">{WarrantyServiceItem.qty_ws}</td>
                <td className="p-2 border">{WarrantyServiceItem.Tax}</td>
                <td className="p-2 border">{WarrantyServiceItem.Total}</td>
                <td className="flex p-2 space-x-2 border">
                  <WarrantyServiceEdit
                    Service_offerID={WarrantyServiceItem.Service_offerID}
                    onUpdate={fetchWarrantyServiceDataTable}
                  ></WarrantyServiceEdit>
                  <WarrantyServiceDelete
                    Service_offerID={WarrantyServiceItem.Service_offerID}
                    isModalOpen={isModalOpen}
                    setIsModalOpen={setIsModalOpen}
                    onUpdate={fetchWarrantyServiceDataTable}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredWarrantyServiceTable.length === 0 && (
          <p className="mt-4 text-center text-gray-500">No data found.</p>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center mt-4 space-x-2">
        <button
          className="p-2 bg-gray-300 rounded disabled:opacity-50"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="p-2 bg-gray-300 rounded disabled:opacity-50"
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export const Mo_table = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Jumlah data per halaman
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [MaterialOrderData, setMaterialOrderData] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchMaterialOrderDataTable = async () => {
    setLoading(true);
    setError(null);

    Swal.fire({
      title: "Memuat Data Material Order...",
      text: "Mohon tunggu sebentar",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const response = await ApiCustomer.get("/api/mo-detaill");
      if (response.data.success) {
        setMaterialOrderData(response.data.data);
        Swal.close(); // Tutup loading kalau sukses
      } else {
        setError("Failed to fetch Material Order data");
        Swal.close();
        Swal.fire({
          title: "Error!",
          text: "Gagal mengambil data Material Order.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } catch (err) {
      console.error("Error fetching Material Order data:", err);
      setError("Error fetching data");

      Swal.close();
      Swal.fire({
        title: "Error!",
        text: "Gagal mengambil data Material Order.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Load data when component mounts
  useEffect(() => {
    fetchMaterialOrderDataTable();
  }, []);

  // Filter data berdasarkan pencarian
  const filteredMaterialOrderTable = MaterialOrderData.filter((item) =>
    Object.values(item).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Hitung total halaman
  const totalPages = Math.ceil(
    filteredMaterialOrderTable.length / itemsPerPage
  );

  // Ambil data sesuai halaman saat ini
  const currentData = filteredMaterialOrderTable.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  //navigate
  const navigate = useNavigate();

  return (
    <div className="p-4">
      <h2 className="mb-4 text-xl font-bold">Material Order Table</h2>
      <input
        type="text"
        placeholder="Search..."
        className="w-1/3 p-2 mb-4 border rounded"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {error && <p className="text-red-500">{error}</p>}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 shadow-lg">
          <thead>
            <tr className="text-sm text-gray-700 uppercase bg-gray-200">
              <th className="p-2 border">MO ID</th>
              <th className="p-2 border">WOID</th>
              <th className="p-2 border">Order Number</th>
              <th className="p-2 border">Order Status</th>
              <th className="p-2 border">Order Type</th>
              <th className="p-2 border">Created On</th>
              <th className="p-2 border">Sales Order Number</th>
              <th className="p-2 border">RMANumber</th>
              <th className="p-2 border">Ready For Closure Date</th>
              <th className="p-2 border">Owner</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((MaterialOrderItem) => (
              <tr
                key={MaterialOrderItem.MOID}
                className="text-center hover:bg-gray-100"
              >
                <td
                  className="p-2 text-blue-500 border cursor-pointer hover:underline"
                  onClick={() =>
                    navigate(`/material-order/${MaterialOrderItem.MOID}`)
                  }
                >
                  {MaterialOrderItem.MOID}
                </td>
                <td
                  className="p-2 text-blue-500 border cursor-pointer hover:underline"
                  onClick={() => navigate(`/work/${MaterialOrderItem.WOID}`)}
                >
                  {MaterialOrderItem.WOID}
                </td>
                <td className="p-2 border">{MaterialOrderItem.OrderNumber}</td>
                <td className="p-2 border">{MaterialOrderItem.OrderStatus}</td>
                <td className="p-2 border">{MaterialOrderItem.OrderType}</td>
                <td className="p-2 border">{MaterialOrderItem.CreatedOn}</td>
                <td className="p-2 border">
                  {MaterialOrderItem.SalesOrderNumber}
                </td>
                <td className="p-2 border">{MaterialOrderItem.RMANumber}</td>
                <td className="p-2 border">
                  {MaterialOrderItem.ReadyForClosureDate}
                </td>
                <td className="p-2 border">{MaterialOrderItem.Owner}</td>
                <td className="flex p-2 space-x-2 border">
                  {/* <WarrantyServiceEdit Service_offerID={WarrantyServiceItem.Service_offerID} onUpdate={fetchWarrantyServiceDataTable}></WarrantyServiceEdit>
                   */}

                  <MaterialOrderEdit
                    MOID={MaterialOrderItem.MOID}
                    onUpdate={fetchMaterialOrderDataTable}
                  />

                  <MaterialOrderDelete
                    MOID={MaterialOrderItem.MOID}
                    isModalOpen={isModalOpen}
                    setIsModalOpen={setIsModalOpen}
                    onUpdate={fetchMaterialOrderDataTable}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredMaterialOrderTable.length === 0 && (
          <p className="mt-4 text-center text-gray-500">No data found.</p>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center mt-4 space-x-2">
        <button
          className="p-2 bg-gray-300 rounded disabled:opacity-50"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="p-2 bg-gray-300 rounded disabled:opacity-50"
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export const Wo_table = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Jumlah data per halaman
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [WorkOrderData, setWorkOrderData] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchWorkOrderDataTable = async () => {
    setLoading(true);
    setError(null);

    Swal.fire({
      title: "Memuat Data Work Order...",
      text: "Mohon tunggu sebentar",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const response = await ApiCustomer.get("/api/work-order");
      if (response.data.success) {
        setWorkOrderData(response.data.data);
        Swal.close();
      } else {
        setError("Failed to fetch Work Order data");
        Swal.close();
        Swal.fire({
          title: "Error!",
          text: "Gagal mengambil data Work Order.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } catch (err) {
      console.error("Error fetching Work Order data:", err);
      setError("Error fetching data");
      Swal.close();
      Swal.fire({
        title: "Error!",
        text: "Gagal mengambil data Work Order.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Load data when component mounts
  useEffect(() => {
    fetchWorkOrderDataTable();
  }, []);

  // Filter data berdasarkan pencarian
  const filteredWorkOrderTable = WorkOrderData.filter((item) =>
    Object.values(item).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Hitung total halaman
  const totalPages = Math.ceil(filteredWorkOrderTable.length / itemsPerPage);

  // Ambil data sesuai halaman saat ini
  const currentData = filteredWorkOrderTable.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  //navigate
  const navigate = useNavigate();

  return (
    <div className="p-4">
      <h2 className="mb-4 text-xl font-bold">Work Order Table</h2>
      <input
        type="text"
        placeholder="Search..."
        className="w-1/3 p-2 mb-4 border rounded"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {error && <p className="text-red-500">{error}</p>}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 shadow-lg">
          <thead>
            <tr className="text-sm text-gray-700 uppercase bg-gray-200">
              <th className="p-2 border">WOID</th>
              <th className="p-2 border">Case ID</th>
              <th className="p-2 border">Work Order Type</th>
              <th className="p-2 border">Priority</th>
              <th className="p-2 border">System Status</th>
              <th className="p-2 border">Sub Status</th>
              <th className="p-2 border">Preferred Day</th>
              <th className="p-2 border">Preferred Time</th>
              <th className="p-2 border">Shipment Country</th>
              <th className="p-2 border">Shipment State</th>
              <th className="p-2 border">Created On</th>
              <th className="p-2 border">Owner</th>
              <th className="p-2 border">SLAJeopardy</th>
              <th className="p-2 border">DueDate Customer</th>
              <th className="p-2 border">Coverage Window</th>
              <th className="p-2 border">Response</th>
              <th className="p-2 border">OTCCode</th>
              <th className="p-2 border">Requested DateTime Customer</th>
              <th className="p-2 border">Guaranteed FixTime Customer</th>
              <th className="p-2 border">Early Start DateTime Customer</th>
              <th className="p-2 border">Latest Start DateTime Customer</th>
              <th className="p-2 border">SLAReschedule</th>
              <th className="p-2 border">Active Schedule Date</th>
              <th className="p-2 border">SLA Error Description</th>
              <th className="p-2 border">Case Priority Index</th>
              <th className="p-2 border">Partner Status</th>
              <th className="p-2 border">WorkOrder Description</th>
              <th className="p-2 border">PartnerNotes</th>
              <th className="p-2 border">Incoming Channel</th>
              <th className="p-2 border">material order</th>
              <th className="p-2 border">Case Information</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((WorkOrderItem) => (
              <tr
                key={WorkOrderItem.WOID}
                className="text-center hover:bg-gray-100"
              >
                <td
                  className="p-2 text-blue-500 border cursor-pointer hover:underline"
                  onClick={() => navigate(`/work/${WorkOrderItem.WOID}`)}
                >
                  {WorkOrderItem.WOID}
                </td>
                <td
                  className="p-2 text-blue-500 border cursor-pointer hover:underline"
                  onClick={() => navigate(`/case/${WorkOrderItem.CaseID}`)}
                >
                  {WorkOrderItem.CaseID}
                </td>
                <td className="p-2 border">{WorkOrderItem.WorkOrderType}</td>
                <td className="p-2 border">{WorkOrderItem.Priority}</td>
                <td className="p-2 border">{WorkOrderItem.SystemStatus}</td>
                <td className="p-2 border">{WorkOrderItem.SubStatus}</td>
                <td className="p-2 border">{WorkOrderItem.PreferredDay}</td>
                <td className="p-2 border">{WorkOrderItem.PreferredTime}</td>
                <td className="p-2 border">{WorkOrderItem.ShipmentCountry}</td>
                <td className="p-2 border">{WorkOrderItem.ShipmentState}</td>
                <td className="p-2 border">{WorkOrderItem.CreatedOn}</td>
                <td className="p-2 border">{WorkOrderItem.Owner}</td>
                <td className="p-2 border">{WorkOrderItem.SLAJeopardy}</td>
                <td className="p-2 border">{WorkOrderItem.DueDateCustomer}</td>
                <td className="p-2 border">{WorkOrderItem.CoverageWindow}</td>
                <td className="p-2 border">{WorkOrderItem.Response}</td>
                <td className="p-2 border">{WorkOrderItem.OTCCode}</td>
                <td className="p-2 border">
                  {WorkOrderItem.RequestedDateTimeCustomer}
                </td>
                <td className="p-2 border">
                  {WorkOrderItem.GuaranteedFixTimeCustomer}
                </td>
                <td className="p-2 border">
                  {WorkOrderItem.EarlyStartDateTimeCustomer}
                </td>
                <td className="p-2 border">
                  {WorkOrderItem.LatestStartDateTimeCustomer}
                </td>
                <td className="p-2 border">{WorkOrderItem.SLAReschedule}</td>
                <td className="p-2 border">
                  {WorkOrderItem.ActiveScheduleDate}
                </td>
                <td className="p-2 border">
                  {WorkOrderItem.SLAErrorDescription}
                </td>
                <td className="p-2 border">
                  {WorkOrderItem.CasePriorityIndex}
                </td>
                <td className="p-2 border">{WorkOrderItem.PartnerStatus}</td>
                <td className="p-2 border">
                  {WorkOrderItem.WorkOrderDescription}
                </td>
                <td className="p-2 border">{WorkOrderItem.PartnerNotes}</td>
                <td className="p-2 border">{WorkOrderItem.IncomingChannel}</td>
                <td className="p-2 border">{WorkOrderItem.MaterialOrder}</td>
                <td className="p-2 border">{WorkOrderItem.CaseInformation}</td>
                <td className="flex p-2 space-x-2 border">
                  <WorkOrderEdit
                    WOID={WorkOrderItem.WOID}
                    onUpdate={fetchWorkOrderDataTable}
                  />
                  <WorkOrderDelete
                    MOID={WorkOrderItem.MOID}
                    isModalOpen={isModalOpen}
                    setIsModalOpen={setIsModalOpen}
                    onUpdate={fetchWorkOrderDataTable}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredWorkOrderTable.length === 0 && (
          <p className="mt-4 text-center text-gray-500">No data found.</p>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center mt-4 space-x-2">
        <button
          className="p-2 bg-gray-300 rounded disabled:opacity-50"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="p-2 bg-gray-300 rounded disabled:opacity-50"
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export const User_table = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Jumlah data per halaman
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [UserData, setUserData] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchUserDataTable = async () => {
    setLoading(true);
    setError(null);

    Swal.fire({
      title: "Memuat Data User...",
      text: "Mohon tunggu sebentar",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const response = await ApiCustomer.get("/api/user");
      if (response.data.success) {
        setUserData(response.data.data);
        Swal.close();
      } else {
        setError("Failed to fetch Userr data");
        Swal.close();
        Swal.fire({
          title: "Error!",
          text: "Gagal mengambil data User.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } catch (err) {
      console.error("Error fetching User data:", err);
      setError("Error fetching data");
      Swal.close();
      Swal.fire({
        title: "Error!",
        text: "Gagal mengambil data User.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Load data when component mounts
  useEffect(() => {
    fetchUserDataTable();
  }, []);

  // Filter data berdasarkan pencarian
  const filteredUserTable = UserData.filter((item) =>
    Object.values(item).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Hitung total halaman
  const totalPages = Math.ceil(filteredUserTable.length / itemsPerPage);

  // Ambil data sesuai halaman saat ini
  const currentData = filteredUserTable.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  //navigate
  const navigate = useNavigate();

  return (
    <div className="p-4">
      <h2 className="mb-4 text-xl font-bold">User Table</h2>
      <input
        type="text"
        placeholder="Search..."
        className="w-1/3 p-2 mb-4 border rounded"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <UserAdd></UserAdd>

      {error && <p className="text-red-500">{error}</p>}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 shadow-lg">
          <thead>
            <tr className="text-sm text-gray-700 uppercase bg-gray-200">
              <th className="p-2 border">ID User</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Username</th>
              <th className="p-2 border">Password</th>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Role</th>
              <th className="p-2 border">Profil Photo</th>
              <th className="p-2 border">CreatedAt</th>
              <th className="p-2 border">UpdateAt</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((UserItem) => (
              <tr
                key={UserItem.IDUser}
                className="text-center hover:bg-gray-100"
              >
                <td className="p-2 text-blue-500 border cursor-pointer hover:underline">
                  {UserItem.IDUser}
                </td>
                <td className="p-2 border">{UserItem.Email}</td>
                <td className="p-2 border">{UserItem.Username}</td>
                <td className="p-2 border">{UserItem.Password}</td>
                <td className="p-2 border">{UserItem.Name}</td>
                <td className="p-2 border">{UserItem.Role}</td>
                <td className="p-2 border">{UserItem.ProfilPhoto}</td>
                <td className="p-2 border">{UserItem.CreatedAt}</td>
                <td className="p-2 border">{UserItem.UpdatedAt}</td>
                <td className="flex p-2 space-x-2 border">
                  <UserEdit
                    IDUser={UserItem.IDUser}
                    onUpdate={fetchUserDataTable}
                  ></UserEdit>
                  <UserDelete
                    IDUser={UserItem.IDUser}
                    isModalOpen={isModalOpen}
                    setIsModalOpen={setIsModalOpen}
                    onUpdate={fetchUserDataTable}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredUserTable.length === 0 && (
          <p className="mt-4 text-center text-gray-500">No data found.</p>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center mt-4 space-x-2">
        <button
          className="p-2 bg-gray-300 rounded disabled:opacity-50"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="p-2 bg-gray-300 rounded disabled:opacity-50"
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export const Part_table = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Jumlah data per halaman
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [PartData, setPartData] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchPartDataTable = async () => {
    setLoading(true);
    setError(null);

    Swal.fire({
      title: "Memuat Data Part...",
      text: "Mohon tunggu sebentar",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const response = await ApiCustomer.get("/api/service-log/parts-catalog");
      if (response.data.success) {
        setPartData(response.data.data);
        Swal.close();
      } else {
        setError("Failed to fetch Part data");
        Swal.close();
        Swal.fire({
          title: "Error!",
          text: "Gagal mengambil data Part.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } catch (err) {
      console.error("Error fetching Part data:", err);
      setError("Error fetching data");
      Swal.close();
      Swal.fire({
        title: "Error!",
        text: "Gagal mengambil data Part.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Load data when component mounts
  useEffect(() => {
    fetchPartDataTable();
  }, []);

  // Filter data berdasarkan pencarian
  const filteredPartTable = PartData.filter((item) =>
    Object.values(item).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Hitung total halaman
  const totalPages = Math.ceil(filteredPartTable.length / itemsPerPage);

  // Ambil data sesuai halaman saat ini
  const currentData = filteredPartTable.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  //navigate
  const navigate = useNavigate();

  return (
    <div className="p-4">
      <h2 className="mb-4 text-xl font-bold">Part Table</h2>
      <input
        type="text"
        placeholder="Search..."
        className="w-1/3 p-2 mb-4 border rounded"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <PartAdd/>
      {error && <p className="text-red-500">{error}</p>}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 shadow-lg">
          <thead>
            <tr className="text-sm text-gray-700 uppercase bg-gray-200">
              <th className="p-2 border">PartNumber</th>
              <th className="p-2 border"> Keyword </th>
              <th className="p-2 border">PartDescription </th>
              <th className="p-2 border">Orderability</th>
              <th className="p-2 border">RestrictionReason</th>
              <th className="p-2 border">CSR_Flag</th>
              <th className="p-2 border"> ROHS Flag </th>
              <th className="p-2 border">Returnable Flag</th>
              <th className="p-2 border">HardRoll Flag</th>
              <th className="p-2 border">DangerousGoods Flag</th>
              <th className="p-2 border">LithiumBattery Flag</th>
              <th className="p-2 border">Oversize Flag </th>
              <th className="p-2 border">Heavy Flag </th>
              <th className="p-2 border">Price </th>
              <th className="p-2 border">FreightPrice </th>
              <th className="p-2 border">Tax</th>
              <th className="p-2 border">Total</th>
              <th className="p-2 border">Shipping_Fee</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((PartItem) => (
              <tr
                key={PartItem.PartNumber}
                className="text-center hover:bg-gray-100"
              >
                <td className="p-2 text-blue-500 border cursor-pointer hover:underline">
                  {PartItem.PartNumber}
                </td>
                <td className="p-2 border">{PartItem.Keyword}</td>
                <td className="p-2 border">{PartItem.PartDescription}</td>
                <td className="p-2 border">
  <span className={`px-2 py-1 rounded-full text-white text-sm ${PartItem.Orderability ? "bg-green-500" : "bg-red-500"}`}>
    {PartItem.Orderability ? "Yes" : "No"}
  </span>
</td>
                <td className="p-2 border">{PartItem.RestrictionReason}</td>
                 <td className="p-2 border">
  <span className={`px-2 py-1 rounded-full text-white text-sm ${PartItem.CSR_Flag ? "bg-green-500" : "bg-red-500"}`}>
    {PartItem.CSR_Flag ? "Yes" : "No"}
  </span>
</td>
                <td className="p-2 border">
  <span className={`px-2 py-1 rounded-full text-white text-sm ${PartItem.ROHS_Flag ? "bg-green-500" : "bg-red-500"}`}>
    {PartItem.ROHS_Flag ? "Yes" : "No"}
  </span>
</td>
<td className="p-2 border">
  <span className={`px-2 py-1 rounded-full text-white text-sm ${PartItem.Returnable_Flag ? "bg-green-500" : "bg-red-500"}`}>
    {PartItem.Returnable_Flag ? "Yes" : "No"}
  </span>
</td>
<td className="p-2 border">
  <span className={`px-2 py-1 rounded-full text-white text-sm ${PartItem.HardRoll_Flag ? "bg-green-500" : "bg-red-500"}`}>
    {PartItem.HardRoll_Flag ? "Yes" : "No"}
  </span>
</td>
<td className="p-2 border">
  <span className={`px-2 py-1 rounded-full text-white text-sm ${PartItem.DangerousGoods_Flag ? "bg-green-500" : "bg-red-500"}`}>
    {PartItem.DangerousGoods_Flag ? "Yes" : "No"}
  </span>
</td>
<td className="p-2 border">
  <span className={`px-2 py-1 rounded-full text-white text-sm ${PartItem.LithiumBattery_Flag ? "bg-green-500" : "bg-red-500"}`}>
    {PartItem.LithiumBattery_Flag ? "Yes" : "No"}
  </span>
</td>
<td className="p-2 border">
  <span className={`px-2 py-1 rounded-full text-white text-sm ${PartItem.Oversize_Flag ? "bg-green-500" : "bg-red-500"}`}>
    {PartItem.Oversize_Flag ? "Yes" : "No"}
  </span>
</td>
<td className="p-2 border">
  <span className={`px-2 py-1 rounded-full text-white text-sm ${PartItem.Heavy_Flag ? "bg-green-500" : "bg-red-500"}`}>
    {PartItem.Heavy_Flag ? "Yes" : "No"}
  </span>
</td>
 <td className="p-2 border">{PartItem.Price}</td>
                <td className="p-2 border">{PartItem.FreightPrice}</td>
                <td className="p-2 border">{PartItem.Tax}</td>
                <td className="p-2 border">{PartItem.Total}</td>
                <td className="p-2 border">{PartItem.Shipping_Fee}</td>
                <td className="flex p-2 space-x-2 border">
                <PartEdit PartNumber={PartItem.PartNumber} onUpdate={fetchPartDataTable}></PartEdit>
                <PartDelete
                  PartNumber={PartItem.PartNumber}
                  isModalOpen={isModalOpen}
                  setIsModalOpen={setIsModalOpen}
                  onUpdate={fetchPartDataTable}
                />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredPartTable.length === 0 && (
          <p className="mt-4 text-center text-gray-500">No data found.</p>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center mt-4 space-x-2">
        <button
          className="p-2 bg-gray-300 rounded disabled:opacity-50"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="p-2 bg-gray-300 rounded disabled:opacity-50"
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export const Resource_table = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [ResourceData, setResourceData] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchResourceDataTable = async () => {
    setLoading(true);
    setError(null);

    Swal.fire({
      title: "Memuat Data Resource...",
      text: "Mohon tunggu sebentar",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const response = await ApiCustomer.get("/api/resources");
      if (response.data.success) {
        setResourceData(response.data.data);
        Swal.close();
      } else {
        setError("Failed to fetch Resource data");
        Swal.close();
        Swal.fire({
          title: "Error!",
          text: "Gagal mengambil data Resource.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } catch (err) {
      console.error("Error fetching Resource data:", err);
      setError("Error fetching data");
      Swal.close();
      Swal.fire({
        title: "Error!",
        text: "Gagal mengambil data Resource.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Load data when component mounts
  useEffect(() => {
    fetchResourceDataTable();
  }, []);

  // Filter data berdasarkan pencarian
  const filteredResourceTable = ResourceData.filter((item) =>
    Object.values(item).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Hitung total halaman
  const totalPages = Math.ceil(filteredResourceTable.length / itemsPerPage);

  // Ambil data sesuai halaman saat ini
  const currentData = filteredResourceTable.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  //navigate
  const navigate = useNavigate();

  return (
    <div className="p-4">
      <h2 className="mb-4 text-xl font-bold">Resource Table</h2>
      <input
        type="text"
        placeholder="Search..."
        className="w-1/3 p-2 mb-4 border rounded"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <ResourceAdd/>  
      {error && <p className="text-red-500">{error}</p>}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 shadow-lg">
          <thead>
            <tr className="text-sm text-gray-700 uppercase bg-gray-200">
              <th className="p-2 border">Resource ID</th>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((ResourceItem) => (
              <tr
                key={ResourceItem.ResourceId}
                className="text-center hover:bg-gray-100"
              >
                <td className="p-2 text-blue-500 border cursor-pointer hover:underline">
                  {ResourceItem.ResourceId}
                </td>
                <td className="p-2 border">{ResourceItem.Name}</td>
                <td className="flex p-2 space-x-2 border">
                <ResourceEdit ResourceId={ResourceItem.ResourceId} onUpdate={fetchResourceDataTable}></ResourceEdit>
                <ResourceDelete
                  ResourceId={ResourceItem.ResourceId}
                  isModalOpen={isModalOpen}
                  setIsModalOpen={setIsModalOpen}
                  onUpdate={fetchResourceDataTable}                
                />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredResourceTable.length === 0 && (
          <p className="mt-4 text-center text-gray-500">No data found.</p>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center mt-4 space-x-2">
        <button
          className="p-2 bg-gray-300 rounded disabled:opacity-50"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="p-2 bg-gray-300 rounded disabled:opacity-50"
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export const ResourceAccountTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [resourceAccounts, setResourceAccounts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [resources, setResources] = useState([]);

const fetchResources = async () => {
  try {
    const response = await ApiCustomer.get("/api/resources"); // Adjust API endpoint if different
    if (response.data.success) {
      setResources(response.data.data);
    }
  } catch (err) {
    console.error("Error fetching resources:", err);
  }
};
  const fetchResourceAccounts = async () => {
    setLoading(true);
    setError(null);
    Swal.fire({
      title: "Memuat Data Resource Account...",
      text: "Mohon tunggu sebentar...",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading(); // Menampilkan indikator loading
      },
    });  

    
    try {
      const response = await ApiCustomer.get("/api/resource-account");
      if (response.data.success) {
        setResourceAccounts(response.data.data);
      } else {
        setError("Failed to fetch resource accounts");
      }
    } catch (err) {
      console.error("Error fetching resource accounts:", err);
      setError("Error fetching data");
    } finally {
      setLoading(false);
      Swal.close();
    }
  };

  useEffect(() => {
    fetchResources();
    fetchResourceAccounts();
  }, []);

  const filteredAccounts = resourceAccounts.filter((item) =>
    Object.values(item).some((value) =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredAccounts.length / itemsPerPage);
  const currentData = filteredAccounts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const navigate = useNavigate();

  return (
    <div className="p-4">
      <h2 className="mb-4 text-xl font-bold">Resource Accounts</h2>
      <input
        type="text"
        placeholder="Search..."
        className="w-1/3 p-2 mb-4 border rounded"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <ResourceAccountAdd onAdd={fetchResourceAccounts} />

      {loading && <p>Loading accounts...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 shadow-lg">
          <thead>
            <tr className="text-sm text-gray-700 uppercase bg-gray-200">
              <th className="p-2 border">Resource Account ID</th>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Resource ID</th>
              {/* <th className="p-2 border">SUbk Technicians</th>
              <th className="p-2 border">Booking Details</th> */}
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((account) => (
              <tr key={account.ResourceAccountId} className="text-center hover:bg-gray-100">
                <td
                  className="p-2 text-blue-500 border cursor-pointer hover:underline"
                  onClick={() => navigate(`/resource-account/${account.ResourceAccountId}`)}
                >
                  {account.ResourceAccountId}
                </td>
                <td className="p-2 border">{account.Name}</td>
                <td className="p-2 border">{account.ResourceId || "-"}</td>
                <td className="flex justify-center p-2 space-x-2 border">
                  <ResourceAccountEdit
                    ResourceAccountId={account.ResourceAccountId}
                    resources={resources}
                    onUpdate={fetchResourceAccounts}
                  />
                  <ResourceAccountDelete
                    ResourceAccountId={account.ResourceAccountId}
                    isModalOpen={isModalOpen}
                    setIsModalOpen={setIsModalOpen}
                    onUpdate={fetchResourceAccounts}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredAccounts.length === 0 && (
          <p className="mt-4 text-center text-gray-500">No accounts found.</p>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center mt-4 space-x-2">
        <button
          className="p-2 bg-gray-300 rounded disabled:opacity-50"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button
          className="p-2 bg-gray-300 rounded disabled:opacity-50"
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export const SubkTechnician_table = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [subkTechnicianData, setSubkTechnicianData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchSubkTechnicianData = async () => {
    Swal.fire({
      title: "Memuat Data Subk Technician...",
      text: "Mohon tunggu sebentar...",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading(); // Menampilkan indikator loading
      },
    });
    setLoading(true);
    setError(null);
    try {
      const response = await ApiCustomer.get("/api/subk-technician");
      if (response.data.success) {
        setSubkTechnicianData(response.data.data);
      } else {
        setError("Failed to fetch SubkTechnician data");
      }
    } catch (err) {
      console.error("Error fetching SubkTechnician data:", err);
      setError("Error fetching data");
    } finally {
      setLoading(false);
      Swal.close();
    }
  };

  useEffect(() => {
    fetchSubkTechnicianData();
  }, []);

  const filteredData = subkTechnicianData.filter((item) =>
    Object.values(item).some((value) =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const navigate = useNavigate();

  return (
    <div className="p-4">
      <h2 className="mb-4 text-xl font-bold">Subk Technician Table</h2>
      <input
        type="text"
        placeholder="Search..."
        className="w-1/3 p-2 mb-4 border rounded"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <SubkTechnicianAdd onUpdate={fetchSubkTechnicianData} />

      {loading && <p>Loading data...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 shadow-lg">
          <thead>
            <tr className="text-sm text-gray-700 uppercase bg-gray-200">
              <th className="p-2 border">Subk Technician ID</th>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Resource Account ID</th>
              {/* <th className="p-2 border">Booking Details</th> */}
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((item) => (
              <tr key={item.SubkTechnicianId} className="text-center hover:bg-gray-100">
                <td className="p-2 text-blue-500 border cursor-pointer hover:underline" onClick={() => navigate(`/subk-technician/${item.SubkTechnicianId}`)}>
                  {item.SubkTechnicianId}
                </td>
                <td className="p-2 border">{item.Name}</td>
                <td className="p-2 border">{item.resourceAccount?.Name || "N/A"}</td>
                <td className="flex justify-center p-2 space-x-2 border">
                  <SubkTechnicianEdit SubkTechnicianId={item.SubkTechnicianId} onUpdate={fetchSubkTechnicianData} />
                  <SubkTechnicianDelete
                    SubkTechnicianId={item.SubkTechnicianId}
                    isModalOpen={isModalOpen}
                    setIsModalOpen={setIsModalOpen}
                    onUpdate={fetchSubkTechnicianData}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredData.length === 0 && (
          <p className="mt-4 text-center text-gray-500">No entries found.</p>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center mt-4 space-x-2">
        <button
          className="p-2 bg-gray-300 rounded disabled:opacity-50"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button
          className="p-2 bg-gray-300 rounded disabled:opacity-50"
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export const SymptomCodeTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [symptomCodeData, setSymptomCodeData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchSymptomCodeData = async () => {
    Swal.fire({
      title: "Memuat Data Symptom Codes...",
      text: "Mohon tunggu sebentar...",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading(); // Menampilkan indikator loading
      },
    });
    setLoading(true);
    setError(null);
    try {
      const response = await ApiCustomer.get("/api/symptom-codes");
      if (response.data.success) {
        setSymptomCodeData(response.data.data);
      } else {
        setError("Failed to fetch SymptomCode data");
      }
    } catch (err) {
      console.error("Error fetching SymptomCode data:", err);
      setError("Error fetching data");
    } finally {
      setLoading(false);
      Swal.close();
    }
  };

  useEffect(() => {
    fetchSymptomCodeData();
  }, []);

  const filteredData = symptomCodeData.filter((item) =>
    Object.values(item).some((value) =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const navigate = useNavigate();

  return (
    <div className="p-4">
      <h2 className="mb-4 text-xl font-bold">Symptom Code Table</h2>
      <input
        type="text"
        placeholder="Search..."
        className="w-1/3 p-2 mb-4 border rounded"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <SymptomCodeAdd onUpdate={fetchSymptomCodeData} />

      {loading && <p>Loading data...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 shadow-lg">
          <thead>
            <tr className="text-sm text-gray-700 uppercase bg-gray-200">
              <th className="p-2 border">Symptom Code ID</th>
              <th className="p-2 border">Symptom Code</th>
              <th className="p-2 border">Top Category</th>
              <th className="p-2 border">Sub Category</th>
              <th className="p-2 border">Quality Codes</th>
              <th className="p-2 border">Created On</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((item) => (
              <tr key={item.SymptomCodeID} className="text-center hover:bg-gray-100">
                <td className="p-2 text-blue-500 border cursor-pointer hover:underline" onClick={() => navigate(`/symptom-code/${item.SymptomCodeID}`)}>
                  {item.SymptomCodeID}
                </td>
                <td className="p-2 border">{item.SymptomCode}</td>
                <td className="p-2 border">{item.TopCategory}</td>
                <td className="p-2 border">{item.SubCategory}</td>
                <td className="p-2 border">{item.QualityCodes || "N/A"}</td>
                <td className="p-2 border">
                  {new Date(item.CreatedOn).toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </td>
                <td className="flex justify-center p-2 space-x-2 border">
                  <SymptomCodeEdit SymptomCodeID={item.SymptomCodeID} onUpdate={fetchSymptomCodeData} />
                  <SymptomCodeDelete
                    SymptomCodeID={item.SymptomCodeID}
                    isModalOpen={isModalOpen}
                    setIsModalOpen={setIsModalOpen}
                    onUpdate={fetchSymptomCodeData}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredData.length === 0 && (
          <p className="mt-4 text-center text-gray-500">No entries found.</p>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center mt-4 space-x-2">
        <button
          className="p-2 bg-gray-300 rounded disabled:opacity-50"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button
          className="p-2 bg-gray-300 rounded disabled:opacity-50"
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export const BookingsTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [bookingData, setBookingData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchBookingData = async () => {
    Swal.fire({
      title: "Memuat Data Bookings...",
      text: "Mohon tunggu sebentar...",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading(); // Menampilkan indikator loading
      },
    });
    setLoading(true);
    setError(null);
    try {
      const response = await ApiCustomer.get("/api/booking");
      if (response.data.success) {
        setBookingData(response.data.data);
      } else {
        setError("Failed to fetch booking data");
      }
    } catch (err) {
      console.error("Error fetching booking data:", err);
      setError("Error fetching data");
    } finally {
      setLoading(false);
      Swal.close();
    }
  };

  useEffect(() => {
    fetchBookingData();
  }, []);

  const filteredData = bookingData.filter((item) =>
    Object.values(item).some((value) =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const navigate = useNavigate();

  return (
    <div className="p-4">
      <h2 className="mb-4 text-xl font-bold">Bookings Table</h2>
      <input
        type="text"
        placeholder="Search..."
        className="w-1/3 p-2 mb-4 border rounded"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <BookingsAdd onUpdate={fetchBookingData} />

      {loading && <p>Loading data...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 shadow-lg">
          <thead>
            <tr className="text-sm text-gray-700 uppercase bg-gray-200">
              <th className="p-2 border">Booking ID</th>
              <th className="p-2 border">WOID</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Schedule Jeopardy</th>
              <th className="p-2 border">Jeopardy Time</th>
              <th className="p-2 border">Do Not Disturb</th>
              <th className="p-2 border">CE Schedule Change</th>
              <th className="p-2 border">Durations (min)</th>
              <th className="p-2 border">Created By</th>
              <th className="p-2 border">Created At</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((item) => (
              <tr key={item.BookingId} className="text-center hover:bg-gray-100">
                <td
                  className="p-2 text-blue-500 border cursor-pointer hover:underline"
                  onClick={() => navigate(`/bookings/${item.BookingId}`)}
                >
                  {item.BookingId}
                </td>
                <td className="p-2 border">{item.WOID}</td>
                <td className="p-2 border">{item.BookingStatus || "-"}</td>
                <td className="p-2 border">{item.ScheduleJeopardy ? "Yes" : "No"}</td>
                <td className="p-2 border">
                  {item.ScheduleJeopardyTime
                    ? new Date(item.ScheduleJeopardyTime).toLocaleString("id-ID")
                    : "-"}
                </td>
                <td className="p-2 border">{item.DoNotDisturb ? "Yes" : "No"}</td>
                <td className="p-2 border">{item.CeScheduleChange ? "Yes" : "No"}</td>
                <td className="p-2 border">
                  Total Billable: {item.TotalBillableDurationInMinutes || 0} <br/> 
                  Total In Progress: {item.TotalInProgressDurationInMinutes || 0}  <br/>
                  Total Break: {item.TotalBreakDurationInMinutes || 0}
                </td>
                <td className="p-2 border">{item.CreatedBy}</td>
                <td className="p-2 border">
                  {new Date(item.CreatedAt).toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </td>
                <td className="flex justify-center p-2 space-x-2 border">
                  <BookingsEdit BookingId={item.BookingId} onUpdate={fetchBookingData} />
                  <BookingsDelete
                    BookingId={item.BookingId}
                    isModalOpen={isModalOpen}
                    setIsModalOpen={setIsModalOpen}
                    onUpdate={fetchBookingData}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredData.length === 0 && (
          <p className="mt-4 text-center text-gray-500">No entries found.</p>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center mt-4 space-x-2">
        <button
          className="p-2 bg-gray-300 rounded disabled:opacity-50"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="p-2 bg-gray-300 rounded disabled:opacity-50"
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export const BookingDetailsTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [bookingDetailsData, setBookingDetailsData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const fetchBookingDetails = async () => {
    Swal.fire({
      title: "Memuat Data Booking Details...",
      text: "Mohon tunggu sebentar...",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading(); // Menampilkan indikator loading
      },
    });
    setLoading(true);
    setError(null);
    try {
      const response = await ApiCustomer.get("/api/bookingDetails");
      if (response.data.success) {
        setBookingDetailsData(response.data.data);
      } else {
        setError("Failed to fetch booking details data");
      }
    } catch (err) {
      console.error("Error fetching booking details data:", err);
      setError("Error fetching data");
    } finally {
      setLoading(false);
      Swal.close();
    }
  };

  useEffect(() => {
    fetchBookingDetails();
  }, []);

  const filteredData = bookingDetailsData.filter((item) =>
    Object.values(item).some((value) =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-4">
      <h2 className="mb-4 text-xl font-bold">Booking Details Table</h2>
      <input
        type="text"
        placeholder="Search..."
        className="w-1/3 p-2 mb-4 border rounded"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <BookingDetailsAdd onUpdate={fetchBookingDetails} />

      {loading && <p>Loading data...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 shadow-lg">
          <thead>
            <tr className="text-sm text-center text-gray-700 uppercase bg-gray-200">
              <th className="p-2 border">Booking Detail ID</th>
              <th className="p-2 border">Booking ID</th>
              <th className="p-2 border">Resource ID</th>
              <th className="p-2 border">Resource Account ID</th>
              <th className="p-2 border">Subk Technician ID</th>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Customer Time</th>
              <th className="p-2 border">User Time</th>
              <th className="p-2 border">Changed By</th>
              <th className="p-2 border">Changed At</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((item) => (
              <tr key={item.BookingDetailId} className="text-sm text-center hover:bg-gray-100">
                <td className="p-2 text-blue-500 border cursor-pointer hover:underline"
                  onClick={() => navigate(`/bookings/${item.BookingDetailId}`)}
                >
                  {item.BookingDetailId}
                </td>
                <td className="p-2 border">{item.BookingId}</td>
                <td className="p-2 border">{item.ResourceId}</td>
                <td className="p-2 border">{item.ResorceAccountId}</td>
                <td className="p-2 border">{item.SubkTechnicianId}</td>
                <td className="p-2 border">{item.Name}</td>
                <td className="p-2 border">{item.Status}</td>

                <td className="p-2 text-left border">
                  <div>Start: {item.StartTimeCustomerTime ? new Date(item.StartTimeCustomerTime).toLocaleString() : "-"}</div>
                  <div>End: {item.EndTimeCustomerTime ? new Date(item.EndTimeCustomerTime).toLocaleString() : "-"}</div>
                  <div>Est. Arrival: {item.EstimatedArrivalTimeCustomerTime ? new Date(item.EstimatedArrivalTimeCustomerTime).toLocaleString() : "-"}</div>
                  <div>Actual Arrival: {item.ActualArrivalTimeCustomerTime ? new Date(item.ActualArrivalTimeCustomerTime).toLocaleString() : "-"}</div>
                </td>

                <td className="p-2 text-left border">
                  <div>Start: {item.StartTimeUserTime ? new Date(item.StartTimeUserTime).toLocaleString() : "-"}</div>
                  <div>End: {item.EndTimeUserTime ? new Date(item.EndTimeUserTime).toLocaleString() : "-"}</div>
                  <div>Duration: {item.DurationInMinutesUserTime || 0} min</div>
                  <div>Est. Arrival: {item.EstimatedArrivalTimeUserTime ? new Date(item.EstimatedArrivalTimeUserTime).toLocaleString() : "-"}</div>
                  <div>Actual Arrival: {item.ActualArrivalTimeUserTime ? new Date(item.ActualArrivalTimeUserTime).toLocaleString() : "-"}</div>
                </td>

                <td className="p-2 border">{item.ChangedBy}</td>
                <td className="p-2 border">
                  {new Date(item.ChangedAt).toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </td>
                <td className="flex justify-center gap-2 p-2 border">
                  <BookingDetailsEdit
                    BookingDetailId={item.BookingDetailId}
                    onUpdate={fetchBookingDetails}
                  />
                  <BookingDetailsDelete
                    BookingDetailId={item.BookingDetailId}
                    isModalOpen={isModalOpen}
                    setIsModalOpen={setIsModalOpen}
                    onUpdate={fetchBookingDetails}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredData.length === 0 && (
          <p className="mt-4 text-center text-gray-500">No entries found.</p>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center mt-4 space-x-2">
        <button
          className="p-2 bg-gray-300 rounded disabled:opacity-50"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="p-2 bg-gray-300 rounded disabled:opacity-50"
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export const RepairClassCodeTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const fetchData = async () => {
    Swal.fire({
      title: "Memuat Data Repair Class Code...",
      text: "Mohon tunggu sebentar...",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    setLoading(true);
    setError(null);
    try {
      const response = await ApiCustomer.get("/api/repairClassCode");
      if (response.data.success) {
        setData(response.data.data);
      } else {
        setError("Failed to fetch repair class code data");
      }
    } catch (err) {
      console.error("Error fetching repair class code data:", err);
      setError("Error fetching data");
    } finally {
      setLoading(false);
      Swal.close();
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredData = data.filter((item) =>
    Object.values(item).some((value) =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-4">
      <h2 className="mb-4 text-xl font-bold">Repair Class Code Table</h2>

      <input
        type="text"
        placeholder="Search..."
        className="w-1/3 p-2 mb-4 border rounded"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <RepairClassCodeAdd onUpdate={fetchData} />

      {loading && <p>Loading data...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 shadow-lg">
          <thead>
            <tr className="text-sm text-center text-gray-700 uppercase bg-gray-200">
              <th className="p-2 border">Code</th>
              <th className="p-2 border">Description</th>
              <th className="p-2 border">Definition</th>
              <th className="p-2 border">Payment Eligibility</th>
              <th className="p-2 border">Created On</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((item) => (
              <tr key={item.Code} className="text-sm text-center hover:bg-gray-100">
                <td
                  className="p-2 text-blue-500 border cursor-pointer hover:underline"
                  onClick={() => navigate(`/repair-class-code/${item.Code}`)}
                >
                  {item.Code}
                </td>
                <td className="p-2 border">{item.Description}</td>
                <td className="p-2 border">{item.Definition}</td>
                <td className="p-2 border">{item.PaymentEligibility}</td>
                <td className="p-2 border">
                  {item.CreatedOn
                    ? new Date(item.CreatedOn).toLocaleDateString("id-ID", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    : "-"}
                </td>
                <td className="flex justify-center gap-2 p-2 border">
                  <RepairClassCodeEdit Code={item.Code} onUpdate={fetchData} />
                  <RepairClassCodeDelete
                    Code={item.Code}
                    isModalOpen={isModalOpen}
                    setIsModalOpen={setIsModalOpen}
                    onUpdate={fetchData}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredData.length === 0 && (
          <p className="mt-4 text-center text-gray-500">No entries found.</p>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center mt-4 space-x-2">
        <button
          className="p-2 bg-gray-300 rounded disabled:opacity-50"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="p-2 bg-gray-300 rounded disabled:opacity-50"
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export const ServiceCatalogTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [serviceCatalogData, setServiceCatalogData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const fetchServiceCatalog = async () => {
    Swal.fire({
      title: "Memuat Data Service Catalog...",
      text: "Mohon tunggu sebentar...",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    setLoading(true);
    setError(null);
    try {
      const response = await ApiCustomer.get("/api/service-log");
      if (response.data.success) {
        setServiceCatalogData(response.data.data);
      } else {
        setError("Failed to fetch service catalog data");
      }
    } catch (err) {
      console.error("Error fetching service catalog data:", err);
      setError("Error fetching data");
    } finally {
      setLoading(false);
      Swal.close();
    }
  };

  useEffect(() => {
    fetchServiceCatalog();
  }, []);

  const filteredData = serviceCatalogData.filter((item) =>
    Object.values(item).some((value) =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-4">
      <h2 className="mb-4 text-xl font-bold">Service Catalog Table</h2>
      <input
        type="text"
        placeholder="Search..."
        className="w-1/3 p-2 mb-4 border rounded"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Add Component (Optional) */}
      <ServiceCatalogAdd onUpdate={fetchServiceCatalog} />

      {loading && <p>Loading data...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 shadow-lg">
          <thead>
            <tr className="text-sm text-center text-gray-700 uppercase bg-gray-200">
              <th className="p-2 border">Service Catalog ID</th>
              <th className="p-2 border">Asset ID</th>
              <th className="p-2 border">Service Offer ID</th>
              <th className="p-2 border">Part Number</th>
              <th className="p-2 border">Warranty Status</th>
              <th className="p-2 border">Currency</th>
              <th className="p-2 border">Price</th>
              <th className="p-2 border">Tax</th>
              <th className="p-2 border">Total</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((item) => (
              <tr key={item.ServiceCatalogID} className="text-sm text-center hover:bg-gray-100">
                <td className="p-2 text-blue-500 border cursor-pointer hover:underline"
                    onClick={() => navigate(`/service-log/${item.ServiceCatalogID}`)}
                >
                  {item.ServiceCatalogID}
                </td>
                <td className="p-2 border">{item.AssetID}</td>
                <td className="p-2 border">{item.Service_offerID}</td>
                <td className="p-2 border">{item.PartNumber || "-"}</td>
                <td className="p-2 border">{item.WarrantyStatus || "-"}</td>
                <td className="p-2 border">{item.Currency || "-"}</td>
                <td className="p-2 border">{item.Price ? parseFloat(item.Price).toFixed(2) : "-"}</td>
                <td className="p-2 border">{item.Tax ? parseFloat(item.Tax).toFixed(2) : "-"}</td>
                <td className="p-2 border">{item.Total ? parseFloat(item.Total).toFixed(2) : "-"}</td>
                <td className="flex justify-center gap-2 p-2 border">
                  {/* Optional Edit/Delete Components */}
                  <ServiceCatalogEdit ServiceCatalogID={item.ServiceCatalogID} onUpdate={fetchServiceCatalog} />
                  <ServiceCatalogDelete ServiceCatalogID={item.ServiceCatalogID} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} onUpdate={fetchServiceCatalog} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredData.length === 0 && (
          <p className="mt-4 text-center text-gray-500">No entries found.</p>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center mt-4 space-x-2">
        <button
          className="p-2 bg-gray-300 rounded disabled:opacity-50"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="p-2 bg-gray-300 rounded disabled:opacity-50"
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export const OTCCodeTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [otcCodeData, setOTCCodeData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchOTCCode = async () => {
    Swal.fire({
      title: "Memuat Data OTC Code...",
      text: "Mohon tunggu sebentar...",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    setLoading(true);
    setError(null);
    try {
      const response = await ApiCustomer.get("/api/otc-code");
      if (response.data.success) {
        setOTCCodeData(response.data.data);
      } else {
        setError("Failed to fetch OTC Code data");
      }
    } catch (err) {
      console.error("Error fetching OTC Code Table:", err);
      setError("Error fetching data");
    } finally {
      setLoading(false);
      Swal.close();
    }
  };

  useEffect(() => {
    fetchOTCCode();
  }, []);

  const filteredData = otcCodeData.filter((item) =>
    Object.values(item).some((value) =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const navigate = useNavigate();

  return (
    <div className="p-4">
      <h2 className="mb-4 text-xl font-bold">OTC Codes Table</h2>
      <input
        type="text"
        placeholder="Search..."
        className="w-1/3 p-2 mb-4 border rounded"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <OTCAdd onUpdate={fetchOTCCode} />

      {loading && <p>Loading data...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 shadow-lg">
          <thead>
            <tr className="text-sm text-gray-700 uppercase bg-gray-200">
              <th className="p-2 border">OTC Code</th>
              <th className="p-2 border">Description</th>
              <th className="p-2 border">Created At</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((item) => (
              <tr key={item.OTCCode} className="text-center hover:bg-gray-100">
                <td
                  className="p-2 text-blue-500 border cursor-pointer hover:underline"
                  // onClick={() => navigate(`/bookings/${item.BookingId}`)}
                >
                  {item.OTCCode}
                </td>
                <td className="p-2 border">{item.Description}</td>
                <td className="p-2 border">
                  {new Date(item.CreatedOn).toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </td>
                <td className="flex justify-center p-2 space-x-2 border">
                  <OTCEdit OTCCode={item.OTCCode} onUpdate={fetchOTCCode} />
                  <OTCDelete
                    OTCCode={item.OTCCode}
                    isModalOpen={isModalOpen}
                    setIsModalOpen={setIsModalOpen}
                    onUpdate={fetchOTCCode}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredData.length === 0 && (
          <p className="mt-4 text-center text-gray-500">No entries found.</p>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center mt-4 space-x-2">
        <button
          className="p-2 bg-gray-300 rounded disabled:opacity-50"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="p-2 bg-gray-300 rounded disabled:opacity-50"
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export const CrsTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [CrsData, setCrsData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchCrs = async () => {
    Swal.fire({
      title: "Memuat Data CRS",
      text: "Mohon tunggu sebentar...",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading(); // Menampilkan indikator loading
      },
    });
    setLoading(true);
    setError(null);
    try {
      const response = await ApiCustomer.get("/api/caseResolution");
      if (response.data.success) {
        setCrsData(response.data.data);
      } else {
        setError("Failed to fetch crs data");
      }
    } catch (err) {
      console.error("Error fetching crs data:", err);
      setError("Error fetching data");
    } finally {
      setLoading(false);
      Swal.close();
    }
  };


  useEffect(() => {
    fetchCrs();
  }, []);

  const filteredData = CrsData.filter((item) =>
    Object.values(item).some((value) =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const navigate = useNavigate();

  return (
    <div className="p-4">
      <h2 className="mb-4 text-xl font-bold">Case Resolution Table</h2>
      <input
        type="text"
        placeholder="Search..."
        className="w-1/3 p-2 mb-4 border rounded"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

    <CrsAdd/>

      {loading && <p>Loading data...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 shadow-lg">
          <thead>
            <tr className="text-sm text-gray-700 uppercase bg-gray-200">
              <th className="p-2 border">ID Csr</th>
              <th className="p-2 border">Case Resolution Code</th>
              <th className="p-2 border">Auto Close</th>
              <th className="p-2 border">Case Ready For Closure</th>
              <th className="p-2 border">Ready For Close Days</th>
              <th className="p-2 border">Ready For Closure Date</th>
              <th className="p-2 border">Pending Customer Action</th>
              <th className="p-2 border">Customer Requested CloseDate</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((item) => (
              <tr key={item.id_csr} className="text-center hover:bg-gray-100">
                <td
                  className="p-2 text-blue-500 border cursor-pointer hover:underline"
                  onClick={() => navigate(`/case-resolution/${item.id_csr}`)}
                > 
                  {item.id_csr}
                </td> 
                <td
                  className="p-2 text-blue-500 border cursor-pointer hover:underline"
                  // onClick={() => navigate(`/bookings/${item.BookingId}`)}
                >
                  {item.caseResolutionCode}
                </td>
                <td
                  className="p-2 text-blue-500 border cursor-pointer hover:underline"
                  // onClick={() => navigate(`/bookings/${item.BookingId}`)}
                >
                  {item.autoClose}
                </td>
                <td className="p-2 border">{item.caseReadyForClosure}</td>
                <td className="p-2 border">
                  {new Date(item.readyForCloseDays).toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </td>
                 <td className="p-2 border">
                  {new Date(item.readyForClosureDate).toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </td>
                 <td className="p-2 border">
                  {new Date(item.pendingCustomerAction).toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </td>
                <td className="p-2 border">
                  {new Date(item.customerRequestedCloseDate).toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </td>
                <td className="flex justify-center p-2 space-x-2 border">
                  <CrsEdit id_csr={item.id_csr} onUpdate={fetchCrs} />
                  <CrsDelete
                    id_csr={item.id_csr}
                    isModalOpen={isModalOpen}
                    setIsModalOpen={setIsModalOpen}
                    onUpdate={fetchCrs}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredData.length === 0 && (
          <p className="mt-4 text-center text-gray-500">No entries found.</p>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center mt-4 space-x-2">
        <button
          className="p-2 bg-gray-300 rounded disabled:opacity-50"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="p-2 bg-gray-300 rounded disabled:opacity-50"
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export const FailureTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [FailureData, setFailureData] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchFailureDataTable = async () => {
    setLoading(true);
    setError(null);

    Swal.fire({
      title: "Memuat Data Failure...",
      text: "Mohon tunggu sebentar",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const response = await ApiCustomer.get("/api/failure");
      if (response.data.success) {
        setFailureData(response.data.data);
        Swal.close();
      } else {
        setError("Failed to fetch Failure data");
        Swal.close();
        Swal.fire({
          title: "Error!",
          text: "Gagal mengambil data Failure.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } catch (err) {
      console.error("Error fetching Failure data:", err);
      setError("Error fetching data");
      Swal.close();
      Swal.fire({
        title: "Error!",
        text: "Gagal mengambil data Failure.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Load data when component mounts
  useEffect(() => {
    fetchFailureDataTable();
  }, []);

  // Filter data berdasarkan pencarian
  const filteredFailureTable = FailureData.filter((item) =>
    Object.values(item).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Hitung total halaman
  const totalPages = Math.ceil(filteredFailureTable.length / itemsPerPage);

  // Ambil data sesuai halaman saat ini
  const currentData = filteredFailureTable.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  //navigate
  const navigate = useNavigate();

  return (
    <div className="p-4">
      <h2 className="mb-4 text-xl font-bold">Failure Table</h2>
      <input
        type="text"
        placeholder="Search..."
        className="w-1/3 p-2 mb-4 border rounded"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <FailureAdd/>  
      {error && <p className="text-red-500">{error}</p>}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 shadow-lg">
          <thead>
            <tr className="text-sm text-gray-700 uppercase bg-gray-200">
              <th className="p-2 border">Failure ID</th>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Description</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((FailureItem) => (
              <tr
                key={FailureItem.FailureId}
                className="text-center hover:bg-gray-100"
              >
                <td className="p-2 text-blue-500 border cursor-pointer hover:underline">
                  {FailureItem.FailureId}
                </td>
                <td className="p-2 border">{FailureItem.Name}</td>
                <td className="p-2 border">{FailureItem.Description}</td>
                <td className="flex p-2 space-x-2 border">
                <FailureEdit FailureId={FailureItem.FailureId} onUpdate={fetchFailureDataTable}></FailureEdit>
                <FailureDelete
                  FailureId={FailureItem.FailureId}
                  isModalOpen={isModalOpen}
                  setIsModalOpen={setIsModalOpen}
                  onUpdate={fetchFailureDataTable}                
                />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredFailureTable.length === 0 && (
          <p className="mt-4 text-center text-gray-500">No data found.</p>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center mt-4 space-x-2">
        <button
          className="p-2 bg-gray-300 rounded disabled:opacity-50"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="p-2 bg-gray-300 rounded disabled:opacity-50"
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};