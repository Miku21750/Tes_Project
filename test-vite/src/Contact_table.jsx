import React, { useState } from "react";

export const Contact_table = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 1; // Jumlah data per halaman
  const [contacts, setContacts] = useState([
    {
      ContactID: 1,
      SiteAccountID: 101,
      Salutation: "Mr.",
      FirstName: "John",
      LastName: "Doe",
      Email: "john.doe@example.com",
      PreferredLanguage: "English",
      Phone: "+123456789",
      Mobile: "+987654321",
      WorkPhone: "+1122334455",
      WorkExtension: "123",
      OtherPhone: "+5544332211",
      OtherExtension: "456",
      Fax: "+6677889900",
      AddressLine1: "123 Main St",
      AddressLine2: "Apt 4B",
      City: "New York",
      StateProvince: "NY",
      Country: "USA",
      ZipPostalCode: "10001",
    },
    {
      ContactID: 2,
      SiteAccountID: 102,
      Salutation: "Ms.",
      FirstName: "Jane",
      LastName: "Smith",
      Email: "jane.smith@example.com",
      PreferredLanguage: "French",
      Phone: "+2233445566",
      Mobile: "+7788990011",
      WorkPhone: "+6655443322",
      WorkExtension: "789",
      OtherPhone: "+9988776655",
      OtherExtension: "321",
      Fax: "+5566778899",
      AddressLine1: "456 Oak St",
      AddressLine2: "Suite 300",
      City: "Los Angeles",
      StateProvince: "CA",
      Country: "USA",
      ZipPostalCode: "90012",
    },
  ]);

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
            </tr>
          </thead>
          <tbody>
            {currentData.map((contact) => (
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
              </tr>
            ))}
          </tbody>
        </table>
        {filteredContacts.length === 0 && (
          <p className="text-center mt-4 text-gray-500">No contacts found.</p>
        )}
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
