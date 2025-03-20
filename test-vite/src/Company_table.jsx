import React, { useState, useEffect } from "react";
// import { BMCCompany } from "./components/sc-modal";
import ApiCustomer from "./api";

import { BtnModalContact, BtnModalAsset, BtnModal } from "@/components/sc-modal"
import { Button } from "./components/ui/button";

export const Company_table = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Jumlah data per halaman
  const [siteAccounts, setSiteAccounts] = useState([]); //set state for SiteAccount

  // const companies = [
  //   {
  //     SiteAccountID: 101,
  //     Company: "TechCorp",
  //     Email: "contact@techcorp.com",
  //     PrimaryPhone: "+1-800-555-1234",
  //     AddressLine1: "123 Tech Street",
  //     AddressLine2: "Suite 500",
  //     City: "New York",
  //     StateProvince: "NY",
  //     Country: "USA",
  //     ZipPostalCode: "10001",
  //   }
  // ];

  //fetch data from API
  const fetchDataSiteAccounts = async () => {
    try {
      const response = await ApiCustomer.get("/api/site_account");
      if (response.data.success) {
        setSiteAccounts(response.data.data); // ✅ Store in state
      }
    } catch (error) {
      console.error("Error fetching site accounts:", error);
    }
  };

  // Load data when component mounts
  useEffect(() => {
    fetchDataSiteAccounts();
  }, []);

  // Filter data berdasarkan pencarian
  const filteredCompanies = siteAccounts.filter(
    (company) =>
      company.Company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.Email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.City?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.Country?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Hitung total halaman
  const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage);

  // Ambil data sesuai halaman saat ini
  const currentData = filteredCompanies.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Company Table</h2>

      {/* Input Pencarian */}
      <input
        type="text"
        placeholder="Search companies..."
        className="mb-4 p-2 border border-gray-300 rounded w-1/3"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setCurrentPage(1); // Reset ke halaman pertama saat mencari
        }}
      />

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Site Account ID</th>
              <th className="border p-2">Company</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Primary Phone</th>
              <th className="border p-2">Address Line 1</th>
              <th className="border p-2">Address Line 2</th>
              <th className="border p-2">City</th>
              <th className="border p-2">State/Province</th>
              <th className="border p-2">Country</th>
              <th className="border p-2">Zip/Postal Code</th>
            </tr>
          </thead>
          <tbody>
            {currentData.length > 0 ? (currentData.map((company) => (
              <tr key={company.SiteAccountID} className="hover:bg-gray-100">
                <td className="border p-2 text-center">{company.SiteAccountID}</td>
                <td className="border p-2">{company.Company}</td>
                <td className="border p-2">{company.Email}</td>
                <td className="border p-2">{company.PrimaryPhone}</td>
                <td className="border p-2">{company.AddressLine1}</td>
                <td className="border p-2">{company.AddressLine2}</td>
                <td className="border p-2">{company.City}</td>
                <td className="border p-2">{company.StateProvince}</td>
                <td className="border p-2">{company.Country}</td>
                <td className="border p-2">{company.ZipPostalCode}</td>
              </tr>
            ))
          ) : (
            <tr>
                <td colSpan="10" className="text-center p-4">
                  No site accounts found.
                </td>
              </tr>
          )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}      
      <div className="flex justify-center items-center mt-4 space-x-2">
        <button 
          className="p-2 bg-gray-300 rounded disabled:opacity-50" 
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button 
          className="p-2 bg-gray-300 rounded disabled:opacity-50" 
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};
