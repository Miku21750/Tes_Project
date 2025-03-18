import React, { useEffect, useState } from "react";
import ApiCustomer from "@/api";
import { BtnModalAsset, AssetEdit, AssetDelete } from "@/components/sc-modal"

export const Assets_table = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    try {
      const response = await ApiCustomer.get("/api/asset-information");
      setAssets(response.data.data);
    } catch (error) {
      console.error("Error fetching assets:", error);
    }
  };

  const filteredAssets = assets.filter((asset) =>
    Object.values(asset).some((value) =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredAssets.length / itemsPerPage);
  const displayedAssets = filteredAssets.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Asset Information Table</h2>
      <div className="space-x-2">
      <BtnModalAsset />
        <input
          type="text"
          placeholder="Search..."
          className="mb-4 p-2 border rounded w-1/3"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
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
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayedAssets.map((asset) => (
              <tr key={asset.AssetID} className="hover:bg-gray-100 text-center">
                <td className="border p-2">{asset.AssetID}</td>
                <td className="border p-2">{asset.SerialNumber}</td>
                <td className="border p-2">{asset.ProductName}</td>
                <td className="border p-2">{asset.ProductNumber}</td>
                <td className="border p-2">{asset.ProductLine}</td>
                <td className="border p-2">{asset.SiteAccountID}</td>
                <td className="border p-2 flex justify-center space-x-2">
                  <AssetEdit 
                  assetId={asset.AssetID} onUpdate={fetchAssets}/>
                  <AssetDelete assetId={asset.AssetID} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-4 space-x-2">
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
      )}
    </div>
  );
};
