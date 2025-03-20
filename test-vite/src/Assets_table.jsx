import React, { useEffect, useState } from "react";
import ApiCustomer from "./api";


export const Assets_table = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;

  // const assetsinfo = [
  //   { AssetID: 201, SerialNumber: "SN-123456", ProductName: "Laptop Pro X", ProductNumber: "LPX-001", ProductLine: "Electronics", SiteAccountID: 101 },
  //   { AssetID: 202, SerialNumber: "SN-789012", ProductName: "Server Ultra", ProductNumber: "SVU-500", ProductLine: "Enterprise Hardware", SiteAccountID: 102 },
  //   { AssetID: 203, SerialNumber: "SN-345678", ProductName: "Smartphone Elite", ProductNumber: "SPE-200", ProductLine: "Mobile Devices", SiteAccountID: 103 },
  //   { AssetID: 204, SerialNumber: "SN-901234", ProductName: "Industrial Printer", ProductNumber: "IPR-800", ProductLine: "Printing Solutions", SiteAccountID: 104 },
  //   { AssetID: 205, SerialNumber: "SN-567890", ProductName: "Wireless Router", ProductNumber: "WR-300", ProductLine: "Networking", SiteAccountID: 105 },
  // ];
  const [assetsInfo, setAssetsInfo] = useState([]);

  //fetch data from API
  const fetchDataAssets = async () => {
    try {
      const response = await ApiCustomer.get("/api/asset-information");
      if (response.data.success) {
        setAssetsInfo(response.data.data); // ✅ Store in state
      }
    } catch (error) {
      console.error("Error fetching site accounts:", error);
    }
  }

  //loadData
  useEffect(() => {
    fetchDataAssets();
  })


  const filteredAssets = assetsInfo.filter(asset =>
    Object.values(asset).some(value => 
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredAssets.length / itemsPerPage);
  const displayedAssets = filteredAssets.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Asset Information Table</h2>
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
            <tr className="bg-gray-200 text-gray-700 uppercase">
              <th className="border p-2">Asset ID</th>
              <th className="border p-2">Serial Number</th>
              <th className="border p-2">Product Name</th>
              <th className="border p-2">Product Number</th>
              <th className="border p-2">Product Line</th>
              <th className="border p-2">Site Account ID</th>
            </tr>
          </thead>
          <tbody>
            {displayedAssets.length > 0 ? (displayedAssets.map((asset) => (
              <tr key={asset.AssetID} className="hover:bg-gray-100 text-center">
                <td className="border p-2">{asset.AssetID}</td>
                <td className="border p-2">{asset.SerialNumber}</td>
                <td className="border p-2">{asset.ProductName}</td>
                <td className="border p-2">{asset.ProductNumber}</td>
                <td className="border p-2">{asset.ProductLine}</td>
                <td className="border p-2">{asset.SiteAccountID}</td>
              </tr>
            ))
          ) : (
            <tr>
                <td colSpan="10" className="text-center p-4">
                  No Assets found.
                </td>
              </tr>
          )}
          </tbody>
        </table>
      </div>
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