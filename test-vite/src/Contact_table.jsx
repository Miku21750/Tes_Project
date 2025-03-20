import React, { useState, useEffect } from "react";
import ApiCustomer from "./api";
import { AppleIcon } from "lucide-react";

import { Button } from "./components/ui/button";
import { BtnModalAsset, BtnModalContact,BtnModal } from "./components/sc-modal";

export const Contact_table = () => {
    const [searchTerm, setSearchTerm] = useState("");
  
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5; // Jumlah data per halaman
    const [contacts, setContacts] = useState([]); //set state contact

    //fetch data from API
    const fetchDataContacts = async () => {
      try {
        const response = await ApiCustomer.get("/api/contact-information");
        if(response.data.success) {
          setContacts(response.data.data)
        }
      } catch (err) {
        console.error("Error fetching Contact:", err);
      }
    }

    // Load data when component mounts
      useEffect(() => {
        fetchDataContacts();
      }, []);
  const filteredContacts = contacts.filter(contact =>
    Object.values(contact).some(value => 
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  
  // Hitung total halaman
  const totalPages = Math.ceil(filteredContacts.length / itemsPerPage);

  // Ambil data sesuai halaman saat ini
  const currentData = filteredContacts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  //modal edit
  const openEditModal = (contact) => {
    setFormDataContact(contact);
  };
  

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Contact Table</h2>
      <input
        type="text"
        placeholder="Search..."
        className="mb-4 p-2 border rounded w-1/3"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 shadow-lg">
          <thead>
            <tr className="bg-gray-200 text-gray-700 uppercase text-sm">
              <th className="border p-2">Contact ID</th>
              <th className="border p-2">Site Account ID</th>
              <th className="border p-2">Salutation</th>
              <th className="border p-2">First Name</th>
              <th className="border p-2">Last Name</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Preferred Language</th>
              <th className="border p-2">Phone</th>
              <th className="border p-2">Mobile</th>
              <th className="border p-2">Work Phone</th>
              <th className="border p-2">Work Extension</th>
              <th className="border p-2">Other Phone</th>
              <th className="border p-2">Other Extension</th>
              <th className="border p-2">Fax</th>
              <th className="border p-2">Address Line 1</th>
              <th className="border p-2">Address Line 2</th>
              <th className="border p-2">City</th>
              <th className="border p-2">State/Province</th>
              <th className="border p-2">Country</th>
              <th className="border p-2">Zip/Postal Code</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentData.length > 0 ? (currentData.map((contact) => (
              <tr key={contact.ContactID} className="hover:bg-gray-100 text-center">
                <td className="border p-2">{contact.ContactID}</td>
                <td className="border p-2">{contact.SiteAccountID}</td>
                <td className="border p-2">{contact.Salutation}</td>
                <td className="border p-2">{contact.FirstName}</td>
                <td className="border p-2">{contact.LastName}</td>
                <td className="border p-2">{contact.Email}</td>
                <td className="border p-2">{contact.PreferredLanguage}</td>
                <td className="border p-2">{contact.Phone}</td>
                <td className="border p-2">{contact.Mobile}</td>
                <td className="border p-2">{contact.WorkPhone}</td>
                <td className="border p-2">{contact.WorkExtension}</td>
                <td className="border p-2">{contact.OtherPhone}</td>
                <td className="border p-2">{contact.OtherExtension}</td>
                <td className="border p-2">{contact.Fax}</td>
                <td className="border p-2">{contact.AddressLine1}</td>
                <td className="border p-2">{contact.AddressLine2}</td>
                <td className="border p-2">{contact.City}</td>
                <td className="border p-2">{contact.StateProvince}</td>
                <td className="border p-2">{contact.Country}</td>
                <td className="border p-2">{contact.ZipPostalCode}</td>
                {/* Edit */}
                <td className="border p-2">
                  <Button variant="secondary" className="bg-white w-30 drop-shadow-md border-1 cursor-pointer text-xl" onClick={openEditModal}>Save</Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
                <td colSpan="10" className="text-center p-4">
                  No Contacts found.
                </td>
              </tr>
          )}
          </tbody>
        </table>
        {/* {filteredContacts.length === 0 && (
          <p className="text-center mt-4 text-gray-500">No contacts found.</p>
        )} */}
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
